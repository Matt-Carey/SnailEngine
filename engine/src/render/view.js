import { PerspectiveCamera } from './../../3rdparty/three.js/build/three.module.js'

class View {
    #camera = null;

    #left = 0;
    #bottom = 0;
    #width = 1.0;
    #height = 1.0;

    constructor() {
        this.#camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.#camera.position.set(-5, 3, 10);
    }

    get camera() { return this.#camera; }

    get left() { return this.#left; }
    get bottom() { return this.#bottom; }
    get width() { return this.#width; }
    get height() { return this.#height; }

}

export { View };
