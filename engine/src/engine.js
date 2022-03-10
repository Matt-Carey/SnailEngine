import { Config } from './config.js';
import { World } from './world.js';
import { Renderer } from './render/renderer.js';
import { IS_BROWSER, IS_NODE } from './util/env.js'

class Engine {
	static async init() {
		return await Config.load().then(()=>{
			return new Engine();
		});
	}

	#time = 0;
	#world = null;
	#renderer = null;

	constructor() {
		this.#time = Date.now();
		this.#world = new World(this);
		
		if(IS_BROWSER) {
			const cfg = Config.get();
			const snailCanvas = document.getElementById(cfg.canvas.domElementId);
			this.#renderer = new Renderer(snailCanvas);
		}

		const engine = this;
		if(IS_BROWSER) {
			function main(tFrame) {
				engine.tick();
				engine.render();
				const requestId = window.requestAnimationFrame(main);
				engine.stop = function() {
					window.cancelAnimationFrame(requestId);
				}
			}
			main(0);
		}
		else if(IS_NODE) {
			const cfg = Config.get();
			const fps = 1000 / cfg.server.fps;
			const tickInterval = setInterval( function() { engine.tick(); }, fps);
			engine.stop = function() {
				clearInterval(tickInterval);
			}
		}
	}

	get world() {
		return this.#world;
	}

	tick() {
		let timeNow = Date.now();
		let dt = timeNow - this.#time;
		this.#time = timeNow;
		//console.log('Delta Time:' + dt + ', Time Now:' + this.#time);
		this.#world.tick(dt);
	}

	render() {
		const renderer = this.#renderer;
		const scene = this.#world.scene;
		if(renderer != null && scene != null) {
			renderer.renderScene(scene);
		}
	}
}

export { Engine };
