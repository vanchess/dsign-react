import { CADESCOM_CADES_BES, CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED, CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, CADESCOM_BASE64_TO_BINARY } from '../constants/cadespluginConstants.js'
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
                try {
                    let oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
                    yield oSigner.propset_Certificate(certificate);

                    let oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
                    yield oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
                    
                    yield oSignedData.propset_Content(dataToSign);

                    let sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_CADES_BES, true);

                    args[2](sSignedMessage);
                }
                catch (e)
                {
                    args[3]("Failed to create signature. Error: " + cadesplugin.getLastError(e));
                }
            }, certificate, dataToSign, resolve, reject);
        });
    }
    
    
    
    static FileSignCreate(certificate, blob) {
        return cadespluginService.FileSignCreateUseFileReader(certificate, blob).then(
            (event) => cadespluginService.readerOnload(event, certificate)
        )
    }
    
    static FileSignCreateUseFileReader(certificate, blob) {
        // Проверяем, работает ли File API
        if (window.FileReader) {
            // Браузер поддерживает File API.
        } else {
            return Promise.reject('The File APIs are not fully supported in this browser.');
        }
        
        let reader = new FileReader();
        
        if (typeof(reader.readAsDataURL)!="function") {
            return Promise.reject("Method readAsDataURL() is not supported in FileReader.");
        }
        
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