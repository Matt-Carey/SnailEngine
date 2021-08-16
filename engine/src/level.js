import { ObjectFactory } from './factory/objectFactory.js';

class Level {
	#world = null;
	#actors = [];

	constructor(world, config) {
		this.#world = world;
		this.#actors = [];
		for(const actorConfig of config.actors) {
			(async () => {
				await ObjectFactory.make(this, actorConfig.type, actorConfig.src, actorConfig.config).then(actor => {
					this.#actors.push(actor);
				});
			})();
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
