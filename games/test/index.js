import { Engine } from 'http://127.0.0.1:8000/src/engine.js';
import { Config } from 'http://127.0.0.1:8000/src/config.js';

;(function() {
	Engine.init().then(engine => {
		const cfg = Config.get();
		engine.world.load(cfg['world']['startup']);
	});
})();
