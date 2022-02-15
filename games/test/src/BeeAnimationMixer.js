import { AnimationMixer } from 'http://localhost:8000/src/component/3d/animationMixer.js';

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
