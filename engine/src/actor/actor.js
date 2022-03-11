import { Vector } from '../math/vector.js';
import { IS_NODE } from '../util/env.js';
import { Component } from './../component/component.js';

class Actor extends Component {
	constructor(init) {
		super(init);
	}

	get replicates() {
		return true;
	}

	tick(dt) {
		if(IS_NODE)
		this.addOffset(new Vector(dt/1000, 0, 0));
	}
}

export { Actor };
