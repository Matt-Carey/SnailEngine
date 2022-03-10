import { IS_BROWSER, IS_NODE } from '../util/env.js';
import { GLTFLoader } from './../../3rdparty/three.js/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from './../../3rdparty/three.js/examples/jsm/utils/SkeletonUtils.js';

class GLTFFactory {
    static #loader = new GLTFLoader();

    static #srcMap = new Map();
	static #pendingMap = new Map();

    static async get(src) {
        if(IS_NODE) {
			// GLTF should not be loaded on server
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
			if(IS_BROWSER) {
				const fullPath = src;
				this.#loader.load(fullPath, (result) => {
					this.#pendingMap.delete(src);
					this.#srcMap.set(src, result);
					resolve(result);
				});
			}
			else {
				this.#loader.load(src, (result) => {
					this.#pendingMap.delete(src);
					this.#srcMap.set(src, result);
					resolve(result);
				});
			}
		});

		this.#pendingMap.set(src, pending);
		
		return await Promise.resolve(pending);
    }

	static async getModel(src) {
		if(IS_NODE) {
			// GLTF should not be loaded on server
			return null;
		}
		return await GLTFFactory.get(src).then(result => {
			const model = result.scene;
			model.traverse( child => {
				// For now, get rid of metalness, it makes lighting weird...
				if ( child.material ) child.material.metalness = 0;
			} );
			const clone = SkeletonUtils.clone(model);
			return clone;
		});
	}

	static async getAnims(src) {
		if(IS_NODE) {
			// GLTF should not be loaded on server
			return null;
		}
		return await GLTFFactory.get(src).then(result => {
			return result.animations;
		});
	}
}

export { GLTFFactory };
