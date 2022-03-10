import { ModuleFactory } from './moduleFactory.js';

class EntityFactory {
	static make(world, UUID, meta, json) {
		return ModuleFactory.get(meta.cdn, meta.src).then(result => {
			if(result != null) {
				const entityClass = result[meta.type];
				if(entityClass != null) {
					const entity = new entityClass({class: entityClass, world, UUID, meta});
					entity.fromJSON(json);
					entity.default = entity.toJSON();
					world.addEntity(entity);
					return entity;
				}
			}
			return null;
		});
	}
}

export { EntityFactory };
