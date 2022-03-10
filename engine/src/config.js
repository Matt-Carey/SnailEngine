import { JSONFactory } from './factory/jsonFactory.js';

class Config {
    static #cfg = null;

    // Is called once by Engine, then modules requiring Config can call Config.get();
    static async load() {
        return await JSONFactory.get('/config.json').then(json =>{
            Config.#cfg = json;
        });
    }

    static get() {
        return Config.#cfg;
    }
}

export { Config };
