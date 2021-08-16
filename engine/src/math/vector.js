class Vector {
	#x = 0;
	#y = 0;
	#z = 0;

	constructor(x,y,z) {
		this.#x = x;
		this.#y = y;
		this.#z = z;
	}
	
	get x() { return this.#x; }
	set x(x) { this.#x = x; }
	
	get y() { return this.#y; }
	set y(y) { this.#y = y; }
	
	get z() { return this.#z; }
	set z(z) { this.#z = z; }

	static add(A, B) {
		return new Vector(A.x + B.x, A.y + B.y, A.z + B.z);
	}
}

export { Vector };
