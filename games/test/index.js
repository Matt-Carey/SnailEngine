import { Engine } from 'http://localhost:8000/src/engine.js';
import { Config } from 'http://localhost:8000/src/config.js';

;(function() {
	const engine = new Engine();
	(async () => {
		const cfg = await Config.get();
		engine.world.load(cfg['world']['startup']);
	})();
})();
