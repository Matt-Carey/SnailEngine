import { Scene as ThreeScene, Color, Fog, AmbientLight } from './../../3rdparty/three.js/build/three.module.js'

class Scene extends ThreeScene {
    #light = null;

    constructor(config) {
        super();
        
        const backgroundConfig = config['background'];
        this.background = new Color(backgroundConfig.color);

        const fogConfig = config['fog'];
		this.fog = new Fog(fogConfig.color, fogConfig.near, fogConfig.far);

        const ambientConfig = config['ambient'];
        this.#light = new AmbientLight(ambientConfig.color, ambientConfig.intensity);
        this.add(this.#light);
    }
}

export { Scene };
