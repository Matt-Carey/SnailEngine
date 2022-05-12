import { EntityFactory } from './factory/entityFactory.js';
import { TemplateFactory } from './factory/templateFactory.js';
import { WORKING_DIR } from './util/env.js';
import { UUID } from './util/uuid.js';

class Level {
	#world = null;
	#entities = [];

	constructor(world, json) {
		this.#world = world;
		for(const templateJson of json.templates) {
			const templatePath = WORKING_DIR + templateJson.path;
			const templateOverrides = templateJson.overrides;
			TemplateFactory.make(this.#world, templatePath, templateOverrides).then(entities => {
				for(const entity of entities) {
					this.#entities.push(entity);
				}
			});
		}
		for(const entity of json.entities) {
			EntityFactory.make(this.#world, UUID.get(), entity.meta, entity.init, entity.json).then(entity => {
				this.#entities.push(entity);
			});
		}
		return this;
	}

	get world() {
		return this.#world;
	}

}

export { Level };
