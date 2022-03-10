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
		return false;
	}

	static #bufferSchema = null;
	static get bufferSchema() {
		if(Component.#bufferSchema == null) {
			const schemaStruct = Entity.bufferSchema.struct;

			schemaStruct.pos_x = { type: Schema.int16, digits: 2 };
			schemaStruct.pos_y = { type: Schema.int16, digits: 2 };
			schemaStruct.pos_z = { type: Schema.int16, digits: 2 };

			schemaStruct.scale_x = { type: Schema.int16, digits: 2 };
			schemaStruct.scale_y = { type: Schema.int16, digits: 2 };
			schemaStruct.scale_z = { type: Schema.int16, digits: 2 };

			Component.#bufferSchema = Schema.BufferSchema.schema('component', schemaStruct);
		}	
		return Component.#bufferSchema;
	}

	static #interpolationValues = null;
    static get interpolationValues() {
        if(Component.#interpolationValues == null) {
            Component.#interpolationValues = 'pos_x pos_y pos_z';
        }
        return Component.#interpolationValues;
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
