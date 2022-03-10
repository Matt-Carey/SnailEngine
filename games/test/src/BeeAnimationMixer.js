import { AnimationMixer } from 'http://127.0.0.1:8000/src/component/3d/model/animationMixer.js';

class BeeAnimationMixer extends AnimationMixer {
    _onMixerReady() {
        super._onMixerReady();
        const actionToPlay = this.actions['hover'];
        if(actionToPlay != null) {
            actionToPlay.play();
        }
    }
}

export { BeeAnimationMixer };
