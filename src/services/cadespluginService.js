import { CADESCOM_CADES_BES, CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED, CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, CADESCOM_BASE64_TO_BINARY, CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 } from '../constants/cadespluginConstants.js'
import { CertificateAdjuster } from '../_helpers';

export class cadespluginService {
    
    static findCertByName(certSubjectName) {
         return new Promise(function(resolve, reject){
            cadesplugin.async_spawn(function *(args) {
                try {
                    let oStore = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
                    yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE,
                        CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

                    let CertificatesObj = yield oStore.Certificates;
                    let oCertificates = yield CertificatesObj.Find(
                        CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);
                    let Count = yield oCertificates.Count;
                    if (Count == 0) {
                        throw("Certificate not found: " + args[0]);
                    }
                    let certificate = yield oCertificates.Item(1);
                    yield oStore.Close();
                    
                    args[2](sSignedMessage);
                }
                catch (e)
                {
                    args[2]("Failed to create signature. Error: " + cadesplugin.getLastError(e));
                }
            }, certSubjectName, resolve, reject);
        });
    }
    
    static SignCreate(certificate, dataToSign) {
        return new Promise(function(resolve, reject){
            cadesplugin.async_spawn(function *(args) {
                let certificate = args[0];
                let dataToSign = args[1];
                let resolve = args[2];
                let reject = args[3];
                try {
                    let oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
                    yield oSigner.propset_Certificate(certificate);

                    let oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                    yield oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
                    
                    yield oSignedData.propset_Content(dataToSign);

                    let sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_CADES_BES, true);

                    resolve(sSignedMessage);
                }
                catch (e)
                {
                    reject("Failed to create signature. Error: " + cadesplugin.getLastError(e));
                }
            }, certificate, dataToSign, resolve, reject);
        });
    }
    
    static CheckFileReader() {
        // Проверяем, работает ли File API
        if (window.FileReader) {
            // Браузер поддерживает File API.
        } else {
            return Promise.reject('The File APIs are not fully supported in this browser.');
        }

        let reader = new FileReader();
        
        if (typeof(reader.readAsDataURL) != "function") {
            return Promise.reject("Method readAsDataURL() is not supported in FileReader.");
        }
    }
    
    static async FileSignCreate(certificate, blob) {
        await cadespluginService.CheckFileReader();
        let e = await cadespluginService.FileSignCreateUseFileReader(certificate, blob);
        return cadespluginService.readerOnload(e, certificate);
    }

    /// Подписание файла с чтением по частям
    static async FileSignCreateReadingFileInChunks(certificate, file) {
        await cadespluginService.CheckFileReader();
        return new Promise(function(resolve, reject) {
            cadesplugin.async_spawn(function* (args) {
                let oCertificate = args[0];
                let oFile = args[1];
                let resolve = args[2];
                let reject = args[3];

                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                let chunkSize = 3 * 1024 * 1024; // 3MB
                let chunks = Math.ceil(oFile.size / chunkSize);
                let currentChunk = 0;

                let oHashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");
                yield oHashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256);
                yield oHashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);

                let frOnload = function (e) {
                    let header = ";base64,";
                    let sFileData = e.target.result;
                    let sBase64Data = sFileData.substr(sFileData.indexOf(header) + header.length);

                    oHashedData.Hash(sBase64Data);

                    // Increase the progress bar length.
                    // let percentLoaded = Math.round((currentChunk / chunks) * 100);
                    // if (percentLoaded <= 100) {
                    //     progress.style.width = percentLoaded + '%';
                    //    progress.textContent = percentLoaded + '%';
                    // }

                    currentChunk++;

                    if (currentChunk < chunks) {
                        loadNext();
                    }
                    else {
                        cadesplugin.async_spawn(function* (args) {
                            let oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
                            yield oSigner.propset_Certificate(oCertificate);
                            yield oSigner.propset_CheckCertificate(true);

                            let oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                            oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);

                            let sSignedMessage;
                            try {
                                sSignedMessage = yield oSignedData.SignHash(oHashedData, oSigner, CADESCOM_CADES_BES);
                                resolve(sSignedMessage);
                            } catch (err) {
                                reject("Ошибка создания подписи. Ошибка: " + cadesplugin.getLastError(err));
                                return;
                            }

                            // Проверим подпись
                            /*
                            let oSignedData2 = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                            try {
                                yield oSignedData2.VerifyHash(oHashedData, sSignedMessage, CADESCOM_CADES_BES);
                                alert("Signature verified");
                            } catch (err) {
                                alert("Failed to verify signature. Error: " + cadesplugin.getLastError(err));
                                return;
                            }
                            */
                        });
                    }
                };

                let frOnerror = function () {
                    reject("File load error.");
                };

                function loadNext() {
                    let fileReader = new FileReader();
                    fileReader.onload = frOnload;
                    fileReader.onerror = frOnerror;

                    let start = currentChunk * chunkSize,
                        end = ((start + chunkSize) >= oFile.size) ? oFile.size : start + chunkSize;

                    fileReader.readAsDataURL(blobSlice.call(oFile, start, end));
                };

                loadNext();
            }, certificate, file, resolve, reject);
        });
    }
    
    static async FileSignCreateUseFileReader(certificate, blob) {
        let reader = new FileReader();

        reader.readAsDataURL(blob);
        return new Promise(function(resolve, reject){
            reader.onload = (event) => resolve(event, certificate);
            reader.onerror = () => reject(reader.error);
        })
    }
    
    static readerOnload(event, certificate){
        let header = ";base64,";
        let sFileData = event.target.result;
        let sBase64Data = sFileData.substr(sFileData.indexOf(header) + header.length);
            
        return cadespluginService.SignCreate(certificate, sBase64Data);
    }
    
    
    static getAllCert() {
      return new Promise(function(resolve, reject){
        cadesplugin.async_spawn(function *(args) {
            let oStore;
            try {
                oStore = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
                if (!oStore) {
                    args[1]("Create store failed");
                    return;
                }

                yield oStore.Open();
            }
            catch (ex) {
                args[1]("Ошибка при подключению к хранилищу сертификатов: " + cadesplugin.getLastError(ex));
                return;
            }
            
            let certCnt;
            let certs;
            try {
                certs = yield oStore.Certificates;
                certCnt = yield certs.Count;
            }
            catch (ex) {
                args[1]("Ошибка при получении Certificates или Count: " + cadesplugin.getLastError(ex));
                return;
            }
            let result = {};
            result.data = [];
            result.meta = {};
            result.meta.total = certCnt;
            for (let i = 1; i <= certCnt; i++) {
                let cert;
                let validFromDate;
                let validToDate;
                let serialNumber;
                let certIssuerName;
                let certSubjectName;
                let thumbprint;
                try {
                    cert = yield certs.Item(i);
                }
                catch (ex) {
                    args[1]("Ошибка при перечислении сертификатов: " + cadesplugin.getLastError(ex));
                    return;
                }

                try {
                    validFromDate = new Date((yield cert.ValidFromDate));
                    validToDate   = new Date((yield cert.ValidToDate));
                    serialNumber    = yield cert.SerialNumber;
                    certIssuerName  = yield cert.IssuerName;
                    certSubjectName = yield cert.SubjectName;
                    thumbprint      = yield cert.Thumbprint;
                }
                catch (ex) {
                    args[1]("Ошибка при получении свойств (SubjectName,IssuerName,ValidFromDate,ValidToDate,SerialNumber,Thumbprint): " + cadesplugin.getLastError(ex));
                    return;
                }
                try {
                    let certAdjuster = new CertificateAdjuster();
                    
                    let item = {};
                    item.cert = cert;
                    item.cn = certAdjuster.GetCertCN(certSubjectName);
                    item.sn = certAdjuster.GetCertSN(certSubjectName);
                    item.g = certAdjuster.GetCertG(certSubjectName);
                    item.name = item.cn;
                    let sng = `${item.sn} ${item.g}`;
                    item.secondaryInfoString = ((item.cn != sng) ? sng.trim() : '');
                    item.validityString = `Действителен с ${certAdjuster.GetCertDate(validFromDate)}  по ${certAdjuster.GetCertDate(validToDate)}`;
                    item.subject = certSubjectName;
                    item.snils = certAdjuster.GetSnils(certSubjectName);
                    item.thumbprint = thumbprint;
                    item.serialNumber = serialNumber;
                    result.data.push(item);
                }
                catch (ex) {
                    args[1]("Ошибка при создании массива сертификатов");
                }

                //lst.options.add(oOpt);
            }

            yield oStore.Close();
            args[0](result);
        }, resolve, reject);
      });//cadesplugin.async_spawn
    }
}