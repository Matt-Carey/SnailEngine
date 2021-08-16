class Delegate {
    #nextId = 1;
    #callbacks = new Map();

    bind(f) {
        this.#callbacks.set(this.#nextId++, f);
    }

    unbind(handle) {
        this.#callbacks.delete(handle);
    }

    call(...args) {
        for(const callback of this.#callbacks) {
            callback(args);
        }
    }
}

export { Delegate };
