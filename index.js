import { Engine } from './engine/src/engine.js';
import { IS_BROWSER } from './engine/src/util/env.js'

;(function() {

	const engine = new Engine();

	if(IS_BROWSER) {
    	document.body.appendChild( engine.renderer.domElement );
	}

})();
