import { JSONFactory } from './factory/jsonFactory.js';
import { IS_BROWSER } from './util/env.js';

class Config {
    static #cfg = null;

    // Is called once by Engine, then modules requiring Config can call Config.get();
    static async load() {
        if(IS_BROWSER) {
            return await JSONFactory.get(document.URL.substring(0, document.URL.lastIndexOf('/')) + '/config.json').then(json =>{
                Config.#cfg = json;
            });
        }
        else {
            return await JSONFactory.get('/config.json').then(json =>{
                Config.#cfg = json;
            });
        }
    }

    static get() {
        return Config.#cfg;
    }
}

export { Config };
