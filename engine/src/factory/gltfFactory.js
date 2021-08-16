import { IS_NODE } from '../util/env.js';
import { GLTFLoader } from './../../3rdparty/three.js/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from './../../3rdparty/three.js/examples/jsm/utils/SkeletonUtils.js';

class GLTFFactory {
    static #loader = new GLTFLoader();

    static #srcMap = new Map();
	static #pendingMap = new Map();

    static get(src) {
        return (async () => {
            
            if(IS_NODE) {
				// Models should not be loaded on server
                return null;
            }

			const GLTF = this.#srcMap.get(src);
			if(GLTF != null) {
				return GLTF;
			}
			
			const pendingGLTF = this.#pendingMap.get(src);
			if(pendingGLTF != null) {
				pendingGLTF.then(result => {
					return this.#srcMap.get(src);
				});
				return pendingGLTF;
			}

            const pending = new Promise((resolve) => {
                this.#loader.load(src, (result) => {
					this.#pendingMap.delete(src);
					this.#srcMap.set(src, result);
					resolve(result);
				});
            });

			this.#pendingMap.set(src, pending);
			
			return await Promise.resolve(pending);
		})();
    }

	static getModel(src) {
		return (async () => {
            return await GLTFFactory.get(src).then(result => {
				const model = result.scene;
				const clone = SkeletonUtils.clone(model);
				return clone;
			});
		})();
	}

	static getAnims(src) {
		return (async () => {
            return await GLTFFactory.get(src).then(result => {
				return result.animations;
			});
		})();
	}
}

export { GLTFFactory };
