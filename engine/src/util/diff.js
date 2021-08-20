function diff(obj1, obj2) {
    var result = {};
    for(const key in obj1) {
        var obj = {};
        if((typeof obj2[key] == 'array' && typeof obj1[key] == 'array')
        || (typeof obj2[key] == 'object' && typeof obj1[key] == 'object')) {
            obj = diff(obj1[key], obj2[key]);
        } else if(obj1[key] != obj2[key]) {
            obj = obj2[key];
        }
        if(Object.keys(obj).length !== 0 || obj.constructor !== Object) {
            result[key] = obj;
        }
    }
    return result;
}

export { diff };
