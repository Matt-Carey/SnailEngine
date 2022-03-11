import { Component } from './../component.js';

class Player extends Component {
    constructor(init) {
        super(init);
    }

    get replicates() {
        return true;
    }
}

export { Player };
