import { ModuleFactory } from './moduleFactory.js';

class EntityFactory {
	static srcMap = new Map();
	static pendingMap = new Map();
	
	static make(owner, type, src, config) {
		return (async () => {
			return await ModuleFactory.get(src).then(result => {
				if(result != null) {
					const objClass = result[type];
					if(objClass != null) {

						return new objClass({owner, type, src, config});
					}
				}
				return nullptr;
			});
		})();
	}
}

export { EntityFactory };
