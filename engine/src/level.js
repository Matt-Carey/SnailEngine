import { EntityFactory } from './factory/EntityFactory.js';
import { diff } from './util/diff.js';

class Level {
	#world = null;
	#actors = [];

	constructor(world, json) {
		this.#world = world;
		this.#actors = [];
		for(const entityJson of json.entities) {
			EntityFactory.make(this, entityJson).then(actor => {
				this.#actors.push(actor);
			});
		}
		return this;
	}
	
	tick(dt) {
		for(const actor of this.#actors) {
			actor.tick(dt);
		}
	}

	get world() {
		return this.#world;
	}

}

export { Level };
