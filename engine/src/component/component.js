import { Entity } from './../entity.js';
import { Vector } from './../math/vector.js';
import { Schema } from './../../3rdparty/geckos.io/typed-array-buffer-schema.js';

class Component extends Entity {
	#pos = new Vector(0, 0, 0);
	#rot = new Vector(0, 0, 0);
	#scale = new Vector(1, 1, 1);

	fromJSON(json) {
		super.fromJSON(json);
		
		this.#pos.x = json.pos_x ?? this.#pos.x;
		this.#pos.y = json.pos_y ?? this.#pos.y;
		this.#pos.z = json.pos_z ?? this.#pos.z;

		this.#rot.x = json.rot_x ?? this.#rot.x;
		this.#rot.y = json.rot_y ?? this.#rot.y;
		this.#rot.z = json.rot_z ?? this.#rot.z;

		this.#scale.x = json.scale_x ?? this.#scale.x;
		this.#scale.y = json.scale_y ?? this.#scale.y;
		this.#scale.z = json.scale_z ?? this.#scale.z;
	}

	toJSON() {
		const json = super.toJSON();

		json.pos_x = this.#pos.x;
		json.pos_y = this.#pos.y;
		json.pos_z = this.#pos.z;

		json.rot_x = this.#rot.x;
		json.rot_y = this.#rot.y;
		json.rot_z = this.#rot.z;

		json.scale_x = this.#scale.x;
		json.scale_y = this.#scale.y;
		json.scale_z = this.#scale.z;

		return json;
	}

	get replicates() {
		return false;
	}

	static get replicatedProperties() {
        return {
            pos_x : { 
				schema: { type: Schema.int16, digits: 2 },
				interp: 'linear'
			},
            pos_y : { 
				schema: { type: Schema.int16, digits: 2 },
				interp: 'linear'
			},
            pos_z : { 
				schema: { type: Schema.int16, digits: 2 },
				interp: 'linear'
			},
            rot_x : {interp: 'linear'},
            rot_y : {interp: 'linear'},
            rot_z : {interp: 'linear'},
            scale_x : {interp: 'linear'},
            scale_y : {interp: 'linear'},
            scale_z : {interp: 'linear'}
        }
    }

	addPos(x, y, z) {
		this.#pos = Vector.add(this.#pos, new Vector(x, y, z));
	}

	get position() {
		const owner = this.owningEntity;
		return owner != null ? Vector.add(owner.position, this.#pos) : this.#pos;
	}

	get relativePosition() {
		return this.#pos;
	}

	set relativePosition(pos) {
		this.#pos = pos;
	}

	addRot(x, y, z) {
		this.#rot = Vector.add(this.#rot, new Vector(x, y, z));
	}

	get rotation() {
		const owner = this.owningEntity;
		return owner != null ? Vector.add(owner.rotation, this.#rot) : this.#rot;
	}

	get relativeRotation() {
		return this.#rot;
	}

	set relativeRotation(rot) {
		this.#rot = rot;
	}

	addScale(x, y, z) {
		this.#scale = Vector.add(this.#scale, new Vector(x, y, z));
	}

	get scale() {
		const owner = this.owningEntity;
		return owner != null ? Vector.multiply(owner.scale, this.#scale) : this.#scale;
	}

	get relativeScale() {
		return this.#scale;
	}

	set relativeScale(scale) {
		this.#scale = scale;
	}

}

export { Component };
