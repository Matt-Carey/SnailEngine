import { WebGLRenderer } from './../../3rdparty/three.js/build/three.module.js'
import { View } from './view.js';

class Renderer extends WebGLRenderer {
	#views = [];

    #windowWidth = 0;
    #windowHeight = 0;

    constructor() {
		super();
		this.#views.push(new View());
    }

    #updateWindowSize() {
        if (this.#windowWidth != window.innerWidth || this.#windowHeight != window.innerHeight) {

			this.#windowWidth = window.innerWidth;
			this.#windowHeight = window.innerHeight;

			this.setSize(this.#windowWidth, this.#windowHeight);
		}
    }

    renderScene(scene) {
        this.#updateWindowSize();

		for(const view of this.#views) {
			const camera = view.camera;

			const left = Math.floor(this.#windowWidth * view.left);
			const bottom = Math.floor(this.#windowHeight * view.bottom);
			const width = Math.floor(this.#windowWidth * view.width);
			const height = Math.floor(this.#windowHeight * view.height);

			this.setViewport(left, bottom, width, height);
			this.setScissor(left, bottom, width, height);
			this.setScissorTest(true);
			this.setClearColor();

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			this.render(scene, camera);
		}
    }
}

export { Renderer };
