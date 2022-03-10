import { Engine } from 'http://localhost:8000/src/engine.js';
import { Config } from 'http://localhost:8000/src/config.js';

;(function() {
	Engine.init().then(engine => {
		const cfg = Config.get();
		engine.world.load(cfg['world']['startup']);
	});
})();
