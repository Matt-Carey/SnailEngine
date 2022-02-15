import { AnimationMixer } from "http://localhost:8000/src/component/3d/animationMixer.js";

class BeeAnimationMixer extends AnimationMixer {
    _onMixerReady() {
        super._onMixerReady();
        const actionToPlay = this._actions[this.action];
        if(actionToPlay != null) {
            actionToPlay.play();
        }
    }

    get action() {
        return 'hover';
    }
}

export { BeeAnimationMixer };
