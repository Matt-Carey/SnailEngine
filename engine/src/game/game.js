import { TemplateFactory } from './../factory/templateFactory.js';
import { EntityFactory } from './../factory/entityFactory.js';
import { WORKING_DIR } from './../util/env.js';

class Game {
    #world = null;
    #state = null;

    constructor(world, json) {
        this.#world = world;
        const statePath = WORKING_DIR + json.state;
        TemplateFactory.get(statePath).then(template => {
            const keys = Object.keys(template);
            for(const key in template) {
                const entity = template[key];
                EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.json).then(entity => {
                    if(keys.indexOf(key) === 0) {
                        this.#state = entity;
                        this._onStateReady();
                    }
                });
            }
        });
    }

    onLogin(channel) {

    }

    onLogout(channel) {

    }

    get state() {
        return this.#state;
    }

}

export { Game };
