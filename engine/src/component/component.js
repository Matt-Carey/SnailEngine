import { Entity } from './../entity.js';
import { Vector } from './../math/vector.js';
import { Schema } from './../../3rdparty/geckos.io/typed-array-buffer-schema.js';

class Component extends Entity {
	#pos = new Vector(0, 0, 0);
	#scale = new Vector(1, 1, 1);

	fromJSON(json) {
		super.fromJSON(json);
		
		this.#pos.x = json.pos_x ?? this.#pos.x;
		this.#pos.y = json.pos_y ?? this.#pos.y;
		this.#pos.z = json.pos_z ?? this.#pos.z;

		this.#scale.x = json.scale_x ?? this.#scale.x;
		this.#scale.y = json.scale_y ?? this.#scale.y;
		this.#scale.z = json.scale_z ?? this.#scale.z;
	}

	toJSON() {
		const json = super.toJSON();

		json.pos_x = this.#pos.x;
		json.pos_y = this.#pos.y;
		json.pos_z = this.#pos.z;

		json.scale_x = this.#scale.x;
		json.scale_y = this.#scale.y;
		json.scale_z = this.#scale.z;

		return json;
	}

	get replicates() {
		return true;
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
			
            scale_x : { schema: { type: Schema.int16, digits: 2 } },
            scale_y : { schema: { type: Schema.int16, digits: 2 } },
            scale_z : { schema: { type: Schema.int16, digits: 2 } }
        }
    }

	addOffset(vector) {
		this.#pos = Vector.add(this.#pos, vector);
	}

	get position() {
		const owner = this.owningEntity;
		return owner != null ? Vector.add(owner.position, this.#pos) : this.#pos;
	}

	get scale() {
		const owner = this.owningEntity;
		return owner != null ? Vector.multiply(owner.scale, this.#scale) : this.#scale;
	}

}

export { Component };
