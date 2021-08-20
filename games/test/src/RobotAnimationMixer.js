import { AnimationMixer } from '../../../engine/src/component/3d/animationMixer.js';

class RobotAnimationMixer extends AnimationMixer {
    _onMixerReady() {
        super._onMixerReady();
        const actionToPlay = this._actions[this.action];
        if(actionToPlay != null) {
            actionToPlay.play();
        }
    }

    get action() {
        return 'Idle';
    }
}

class RunningRobotAnimationMixer extends RobotAnimationMixer {
    get action() {
        return 'Running';
    }
}

class DancingRobotAnimationMixer extends RobotAnimationMixer {
    get action() {
        return 'Dance';
    }
}

export { RobotAnimationMixer, RunningRobotAnimationMixer, DancingRobotAnimationMixer };
