import { Model } from 'http://127.0.0.1:8000/src/component/3d/model/model.js'
import { IS_NODE } from 'http://127.0.0.1:8000/src/util/env.js';

class TestModel extends Model {
    constructor(init) {
        super(init);
    }

    tick(dt) {
        super.tick(dt);
        if(IS_NODE) {
            this.addRot(0.0, 0.1, 0.0);
        }
    }
}

export { TestModel };
