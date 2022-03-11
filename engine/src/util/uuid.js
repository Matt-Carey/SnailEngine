import { ShortUniqueId } from './../../3rdparty/short-unique-id/dist/short-unique-id.js';
import { Schema } from '../../3rdparty/geckos.io/typed-array-buffer-schema.js';

class UUID {
    static #generator = null;

    static {
        UUID.#generator = new ShortUniqueId.default();
    }

    static get() {
        return UUID.#generator();
    }
}

export { UUID };
