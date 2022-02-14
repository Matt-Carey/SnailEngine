import { IS_NODE } from '../util/env.js';
import { Config } from '../config.js';

class ModuleFactory {
	static #srcMap = new Map();
	static #pendingMap = new Map();

	static getNodeModules() {
		if(IS_NODE) {
			return ModuleFactory.get('Engine', '/src/util/nodemodules.js');
		}
		return null;
	}

    static get(cdn, src) {
        return (async () => {
			src = Config['cdn'][cdn] + src;

			const module = this.#srcMap.get(src);
			if(module != null) {
				return module;
			}
			
			const pendingModule = this.#pendingMap.get(src);
			if(pendingModule != null) {
				pendingModule.then(result => {
					return this.#srcMap.get(src);
				});
				return pendingModule;
			}
			
			const pendingImport = import(src).then(result => {
				this.#pendingMap.delete(src);
				this.#srcMap.set(src, result);
				return result;
			});

			this.#pendingMap.set(src, pendingImport);
			
			return await Promise.resolve(pendingImport);
		})();
    }
}

export { ModuleFactory };