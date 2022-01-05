export function CertificateAdjuster()
{
}
CertificateAdjuster.prototype.checkQuotes = function(str)
{
    let result = 0, i = 0;
    for(i;i<str.length;i++)if(str[i]==='"')
        result++;
    return !(result%2);
}

CertificateAdjuster.prototype.extract = function(from, what)
{
    let certName = "";

    let begin = from.indexOf(what);

    if(begin>=0)
    {
        begin += what.length;
        let end = from.indexOf(', ', begin);
        while(end > 0) {
            if (this.checkQuotes(from.substr(begin, end-begin)))
                break;
            end = from.indexOf(', ', end + 1);
        }
        certName = (end < 0) ? from.substr(begin) : from.substr(begin, end - begin);
    }

    return certName;
}

CertificateAdjuster.prototype.Print2Digit = function(digit)
{
    return (digit<10) ? "0"+digit : digit;
}

CertificateAdjuster.prototype.GetCertDate = function(paramDate)
{
    let certDate = new Date(paramDate);
    return this.Print2Digit(certDate.getUTCDate())+"."+this.Print2Digit(certDate.getUTCMonth()+1)+"."+certDate.getFullYear() + " " +
             this.Print2Digit(certDate.getUTCHours()) + ":" + this.Print2Digit(certDate.getUTCMinutes()) + ":" + this.Print2Digit(certDate.getUTCSeconds());
}

CertificateAdjuster.prototype.GetCertCN = function(certSubjectName)
{
    return this.extract(certSubjectName, 'CN=');
}

CertificateAdjuster.prototype.GetCertSN = function(certSubjectName)
{
    return this.extract(certSubjectName, 'SN=');
}

CertificateAdjuster.prototype.GetCertG = function(certSubjectName)
{
    return this.extract(certSubjectName, 'G=');
}

CertificateAdjuster.prototype.GetSnils = function(certSubjectName)
{
    let snils = this.extract(certSubjectName, 'СНИЛС=');
    if (snils === '') {
        snils = this.extract(certSubjectName, 'SNILS=');
    }
    return snils;
}

CertificateAdjuster.prototype.GetIssuer = function(certIssuerName)
{
    return this.extract(certIssuerName, 'CN=');
}

CertificateAdjuster.prototype.GetCertInfoString = function(certSubjectName, certIssuerName, certFromDate, certToDate)
{
    return "CN=" + this.GetCertCN(certSubjectName) + "; SN=" + this.extract(certSubjectName,'SN=') + "; Издатель: " + this.GetIssuer(certIssuerName) + "; Выдан: " + this.GetCertDate(certFromDate) + "; Действителен до: " + this.GetCertDate(certToDate);
}