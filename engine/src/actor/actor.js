import { Component } from './../component/component.js';
import { Vector } from './../math/vector.js';
import { IS_NODE } from '../util/env.js';

class Actor extends Component {

	constructor(init) {
		super(init);
	}

	get replicates() {
		return true;
	}

	tick(dt) {
		super.tick(dt);
		//if(IS_NODE) {
			this.addOffset(new Vector(dt / 1000, 0, 0));
			while(this.position.x > 5) {
				this.addOffset(new Vector(-10, 0, 0));
			}
		//}
	}
}

export { Actor };
