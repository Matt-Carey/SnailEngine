class Delegate {
    #nextId = 1;
    #callbacks = new Map();

    bind(f) {
        const id = this.#nextId++;
        this.#callbacks.set(id, f);
        return id;
    }

    unbind(handle) {
        this.#callbacks.delete(handle);
    }

    call(...args) {
        for(const [id, callback] of this.#callbacks) {
            callback(...args);
        }
    }
}

export { Delegate };
