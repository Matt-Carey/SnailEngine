import { Scene as ThreeScene, Color, Fog as ThreeFog } from './../../3rdparty/three.js/build/three.module.js'

class Fog extends ThreeFog {
    fromJSON(json) {
        if(json.color != null) {
            this.color.r = json.color.r;
            this.color.g = json.color.g;
            this.color.b = json.color.b;
        }

        if(json.near != null) {
            this.near = json.near;
        }

        if(json.far != null) {
            this.far = json.far;
        }
    }

    toJSON() {
        const json = {};

        json.color = {};
        json.color.r = this.color.r;
        json.color.g = this.color.g;
        json.color.b = this.color.b;

        json.near = this.near;
        json.far = this.far;

        return json;
    }
}

class Scene extends ThreeScene {

    constructor() {
        super();

        this.background = new Color(1,1,1);
        this.fog = new Fog(new Color(1,1,1));
    }

    fromJSON(json) {
        if(json.background != null) {
            this.background.r = json.background.r;
            this.background.g = json.background.g;
            this.background.b = json.background.b;
        }

        if(json.fog != null) {
            this.fog.fromJSON(json.fog);
        }
    }

    toJSON() {
        const json = {};

        json.background = {};
        json.background.r = this.background.r;
        json.background.g = this.background.g;
        json.background.b = this.background.b;

        json.fog = this.fog.toJSON();

        return json;
    }
}

export { Scene };
