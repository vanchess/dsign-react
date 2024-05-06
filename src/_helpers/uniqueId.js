let idCounter = 0;

export function uniqueId(prefix) {
    var id = ++idCounter;
    if(prefix) {
        return '' + prefix + id;
    }
    return id;
}