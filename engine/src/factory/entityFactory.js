import { ModuleFactory } from './moduleFactory.js';

class EntityFactory {
	static make(owner, json) {
		const meta = json.meta;
		const config = json.config;
		return ModuleFactory.get(meta.cdn, meta.src).then(result => {
			if(result != null) {
				const objClass = result[meta.type];
				if(objClass != null) {
					return new objClass({owner, meta, config});
				}
			}
			return null;
		});
	}
}

export { EntityFactory };
