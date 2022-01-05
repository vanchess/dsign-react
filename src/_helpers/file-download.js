export function fileDownload(fileBlob, filename = 'hello.txt') {
    let link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(fileBlob);
    link.click();
    URL.revokeObjectURL(link.href);
}

export function textFileDownload(text, filename = 'hello.txt') {
    let link = document.createElement('a');
    link.download = filename;
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    link.click();
    URL.revokeObjectURL(link.href);
}