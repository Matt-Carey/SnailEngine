import { Controller } from 'http://127.0.0.1:8000/src/component/player/controller.js';

class TestController extends Controller {
    constructor(init) {
        super(init);
    }

    static get replicatedProperties() {
        return {
            f2: '',
            f8: ''
        }
    }
}

export { TestController };
