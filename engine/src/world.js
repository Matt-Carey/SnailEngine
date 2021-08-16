import { Level } from './level.js';
import { Scene } from './render/scene.js';
import { JSONFactory } from './factory/jsonFactory.js';

class World {
    #engine = null;
    #scene = null;
    #levels = new Map();

	constructor(engine) {
        this.#engine = engine;

        (async () => {
            // TODO: Load world from config / arg
            const worldURL = '/games/test/world.json';
            await JSONFactory.get(worldURL).then(config => {
                const sceneConfig = config['scene'];
                this.#scene = new Scene(sceneConfig);

                const levelsConfig = config['levels'];
                for(const levelConfig of levelsConfig) {
                    (async () => {
                        await JSONFactory.get(levelConfig.path).then(config => {
                            this.#levels.set(levelConfig.name, new Level(this, config));
                        });
                    })();
                }
            });
        })();
	}

    get scene() {
        return this.#scene;
    }
	
	tick(dt) {
		for(const [name, level] of this.#levels) {
			level.tick(dt);
		}
	}

}

export { World };
