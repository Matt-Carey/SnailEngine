import { Model } from 'http://127.0.0.1:8000/src/component/3d/model/model.js'
import { Vector } from 'http://127.0.0.1:8000/src/math/vector.js';
import { IS_NODE } from 'http://127.0.0.1:8000/src/util/env.js';

class TestModel extends Model {
    constructor(init) {
        super(init);
    }

    get replicates() {
        return true;
    }

    tick(dt) {
        super.tick(dt);
        if(IS_NODE) {
            this.addRot(0.0, 0.1, 0.0);
            this.addPos(0.25, 0.0, 0.0);
            while(this.position.x > 7.5) {
                this.addPos(-15.0, 0.0, 0.0);
            }
        }
    }
}

export { TestModel };
