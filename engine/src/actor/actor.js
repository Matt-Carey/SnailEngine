import { Component } from './../component/component.js';

class Actor extends Component {
	constructor(init) {
		super(init);
	}

	get replicates() {
		return true;
	}
}

export { Actor };
