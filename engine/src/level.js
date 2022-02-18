import { EntityFactory } from './factory/EntityFactory.js';
import { diff } from './util/diff.js';

class Level {
	#world = null;
	#entities = [];

	constructor(world, json) {
		this.#world = world;
		for(const entityJson of json.entities) {
			EntityFactory.make(this, entityJson).then(entity => {
				this.#entities.push(entity);
			});
		}
		return this;
	}

	toJSON() {
		const json = {
			'entities': []
		};
		for(const entity of this.#entities) {
			json.entities.push(entity.toJSON());
		}
		return json;
	}
	
	tick(dt) {
		for(const entity of this.#entities) {
			entity.tick(dt);
		}
	}

	get world() {
		return this.#world;
	}

}

export { Level };
