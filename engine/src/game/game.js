import { TemplateFactory } from './../factory/templateFactory.js';
import { WORKING_DIR } from './../util/env.js';

class Game {
    #world = null;
    #state = null;
    #controllerTemplate = null;
    #controllers = new Map();
    #playerTemplate = null;

    constructor(world, json) {
        this.#world = world;
        this.#controllerTemplate = json.controller;
        this.#playerTemplate = json.player;
        const statePath = WORKING_DIR + json.state;
        TemplateFactory.make(this.#world, statePath, null).then(entities => {
            this.#state = entities[0];
            this._onStateReady(entities[0]);
        });
    }

    onLogin(channel) {
        const controllerPath = WORKING_DIR + this.#controllerTemplate;
        TemplateFactory.make(this.#world, controllerPath, null).then(entities => {
            this.#controllers.set(channel, entities[0]);
            this._onControllerReady(entities[0]);
        });
    }

    onLogout(channel) {

    }

    _onStateReady(state) {

    }

    _onControllerReady(controller) {
        if(this._canPlayerStart(controller)) {
            const playerPath = WORKING_DIR + this.#playerTemplate;
            TemplateFactory.make(this.#world, playerPath, null).then(entities => {
                // Bind player to controller
            });
        }
    }

    _canPlayerStart(controller) {
        return controller.pawn == null;
    }


    get state() {
        return this.#state;
    }

}

export { Game };
