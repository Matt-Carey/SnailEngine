//https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String

export function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
