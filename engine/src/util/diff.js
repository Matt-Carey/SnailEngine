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

// https://stackoverflow.com/questions/25456013/javascript-deepequal-comparison
function deepEqual(obj1, obj2) {

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    if(Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for(let key in obj1)
    {
        if(!(key in obj2)) return false; //other object doesn't have this prop
        if(!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj)
{
    return (obj !== Object(obj));
}

function deepCopy(obj) {
    // basic type deep copy
    if (obj === null || obj === undefined || typeof obj !== 'object')  {
        return obj;
    }
    // array deep copy
    if (obj instanceof Array) {
        var cloneA = [];
        for (var i = 0; i < obj.length; ++i) {
            cloneA[i] = deepCopy(obj[i]);
        }              
        return cloneA;
    }
    // map deep copy
    if (obj instanceof Map) {
        var cloneM = new Map();
        for(const [k,v] of obj) {
            cloneM.set(k, deepCopy(v));
        }
        return cloneM;
    }           
    // object deep copy
    var cloneO = {};   
    for (var i in obj) {
        cloneO[i] = deepCopy(obj[i]);
    }                  
    return cloneO;
}

export { diff, deepEqual, deepCopy };
