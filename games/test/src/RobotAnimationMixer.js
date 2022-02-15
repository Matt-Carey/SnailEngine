import { AnimationMixer } from 'http://localhost:8000/src/component/3d/animationMixer.js';

class RobotAnimationMixer extends AnimationMixer {
    _onMixerReady() {
        super._onMixerReady();
        const actionToPlay = this.actions[this.defaultAction];
        if(actionToPlay != null) {
            actionToPlay.play();
        }
    }

    get defaultAction() {
        return 'Idle';
    }
}

class RunningRobotAnimationMixer extends RobotAnimationMixer {
    get defaultAction() {
        return 'Running';
    }
}

class DancingRobotAnimationMixer extends RobotAnimationMixer {
    get defaultAction() {
        return 'Dance';
    }
}

export { RobotAnimationMixer, RunningRobotAnimationMixer, DancingRobotAnimationMixer };
