import { EntityFactory } from './factory/EntityFactory.js';
import { TemplateFactory } from './factory/templateFactory.js';
import { UUID } from './../3rdparty/uuid/dist/uuidv4.js';

class Level {
	#world = null;
	#entities = [];

	constructor(world, json) {
		this.#world = world;
		for(const templateJson of json.templates) {
			const templatePath = templateJson.path;
			const templateOverrides = templateJson.overrides;
			TemplateFactory.get(templatePath).then(template => {
				template = JSON.parse(JSON.stringify(template));
				for(const key in template.entities) {
					const entity = template.entities[key];
					EntityFactory.make(this.#world, entity.UUID, entity.meta, entity.json).then(entity => {
						const override = templateOverrides[key];
						if(override != null) {
							entity.fromJSON(override);
						}
						this.#entities.push(entity);
					});
				}
			});
		}
		for(const entity of json.entities) {
			EntityFactory.make(this.#world, UUID.get(), entity.meta, entity.json).then(entity => {
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
