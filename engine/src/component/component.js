import { Entity } from './../entity.js';
import { EntityFactory } from './../factory/EntityFactory.js'
import { Vector } from '../math/vector.js';

const Defaults = {
	'children': [],
	'rPos': new Vector(0, 0, 0),
	'rScale': new Vector(1, 1, 1),
}

class Component extends Entity {
	#children = Defaults.children;
	#rPos = Defaults.rPos;
	#rScale = Defaults.rScale;

	constructor(init) {
		super(init);
		
		const childrenJson = init?.json?.children;
		if(childrenJson != null) {
			for(const childJson of childrenJson) {
				EntityFactory.make(this, childJson).then(component => {
					this.#children.push(component);
				});
			}
		}
		
		const rPos = init?.json?.rPos;
		if(rPos != null) {
			this.#rPos = new Vector(rPos.x, rPos.y, rPos.z);
		}

		const rScale = init?.json?.rScale;
		if(rScale != null) {
			this.#rScale = new Vector(rScale.x, rScale.y, rScale.z);
		}
	}

	toJSON() {
		const json = super.toJSON();
		if(this.#children != Defaults.children) {
			json.children = [];
			for(const child of this.#children) {
				json.children.push(child.toJSON());
			}
		}

		if(!Vector.equals(this.#rPos, Defaults.rPos)) {
			json.rPos = this.#rPos.toJSON();
		}

		if(!Vector.equals(this.#rScale, Defaults.rScale)) {
			json.rScale = this.#rScale.toJSON();
		}

		return json;
	}

	get world() {
		const owner = this.owner;
		return owner.world;
	}

	get actor() {
		const owner = this.owner;
		return owner.root == this ? owner : owner.actor;
	}

	get position() {
		const owner = this.owner;
		return Vector.add(owner.position, this.#rPos);
	}

	get scale() {
		const owner = this.owner;
		return Vector.multiply(owner.scale, this.#rScale);
	}
	
	tick(dt) {
		for(const child of this.#children) {
			child.tick(dt);
		}
	}
	
}

export { Component };
