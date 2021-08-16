import { AnimationMixer } from '../../../engine/src/component/3d/animationMixer.js';

class RobotAnimationMixer extends AnimationMixer {
    _onMixerReady() {
        super._onMixerReady();
        this._actions[this.action].play();
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
