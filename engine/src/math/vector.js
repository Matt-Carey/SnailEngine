class Vector {
	#x = 0;
	#y = 0;
	#z = 0;

	constructor(x,y,z) {
		this.#x = x;
		this.#y = y;
		this.#z = z;
	}

	fromJSON(json) {
		this.#x = json.x;
		this.#y = json.y;
		this.#z = json.z;
	}

	toJSON() {
		return {
			x: this.#x,
			y: this.#y,
			z: this.#z,
		}
	}
	
	get x() { return this.#x; }
	set x(x) { this.#x = x; }
	
	get y() { return this.#y; }
	set y(y) { this.#y = y; }
	
	get z() { return this.#z; }
	set z(z) { this.#z = z; }

	static equals(A, B) {
		return A.x === B.x && A.y === B.y && A.z === B.z;
	}

	static add(A, B) {
		return new Vector(A.x + B.x, A.y + B.y, A.z + B.z);
	}

	static multiply(A, B) {
		return new Vector(A.x * B.x, A.y * B.y, A.z * B.z);
	}
}

export { Vector };
