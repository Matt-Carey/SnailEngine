import { ModuleFactory } from './moduleFactory.js';

class EntityFactory {
	static make(owner, json) {
		const meta = json.meta;
		return ModuleFactory.get(meta.cdn, meta.src).then(result => {
			if(result != null) {
				const objClass = result[meta.type];
				if(objClass != null) {
					return new objClass({owner, json});
				}
			}
			return null;
		});
	}
}

export { EntityFactory };
