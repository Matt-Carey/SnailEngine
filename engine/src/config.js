import { JSONFactory } from './factory/jsonFactory.js';

class Config {
    static #cfg = null;

    static get() {
        if(Config.#cfg == null) {
            Config.#cfg = JSONFactory.get('/config.json');
        }
        return Config.#cfg;
    }
}

export { Config };
