// https://github.com/uuidjs/uuid
// This code is heavily modified, though the License remains at uuid/LICENSE.md
// This is a modified .min.js hosted by https://unpkg.com/uuid@latest/dist/umd/uuidv4.min.js

function uuidv4() {
    "use strict";
    var t, e = new Uint8Array(16);

    // Node.js support - requires import('crypto') to be added to global.crypto.
    let webcrypto = null;
    if("undefined" != typeof global && global.crypto != null) {
        webcrypto = global.crypto.webcrypto;
    }

    function o() {
        if (
            !t &&
            !(t =
                ("undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) 
                || 
                ("undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))
                ||
                ("undefined" != typeof webcrypto && webcrypto.getRandomValues && webcrypto.getRandomValues.bind(webcrypto)) 
            )
        )
            throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
        return t(e);
    }
    var n = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    function r(t) {
        return "string" == typeof t && n.test(t);
    }
    for (var i = [], u = 0; u < 256; ++u) i.push((u + 256).toString(16).substr(1));
    return function (t, e, n) {
        var u = (t = t || {}).random || (t.rng || o)();
        if (((u[6] = (15 & u[6]) | 64), (u[8] = (63 & u[8]) | 128), e)) {
            n = n || 0;
            for (var f = 0; f < 16; ++f) e[n + f] = u[f];
            return e;
        }
        return (function (t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                o = (
                    i[t[e + 0]] +
                    i[t[e + 1]] +
                    i[t[e + 2]] +
                    i[t[e + 3]] +
                    "-" +
                    i[t[e + 4]] +
                    i[t[e + 5]] +
                    "-" +
                    i[t[e + 6]] +
                    i[t[e + 7]] +
                    "-" +
                    i[t[e + 8]] +
                    i[t[e + 9]] +
                    "-" +
                    i[t[e + 10]] +
                    i[t[e + 11]] +
                    i[t[e + 12]] +
                    i[t[e + 13]] +
                    i[t[e + 14]] +
                    i[t[e + 15]]
                ).toLowerCase();
            if (!r(o)) throw TypeError("Stringified UUID is invalid");
            return o;
        })(u);
    }
}

class UUID {
    static #uuidv4 = null;
    static get() {
        if(UUID.#uuidv4 == null) {
            UUID.#uuidv4 = uuidv4();
        }
        return UUID.#uuidv4();
    }
}

export { UUID };
