import { deepEqual } from "../util/diff.js";

class Ghost {
    #entity = null;
    #frames = new Map();
    #acked = null;
    #current = null;

    constructor(entity, acked, current) {
        this.#entity = entity;
        this.#acked = acked;
        this.#current = current;
        
        const state = entity.replicatedState;
        for(let i = this.#acked; i <= this.#current; i++) {
            this.#frames.set(i, state);
        }
    }

    ack(frame) {
        for(let i = this.#acked; i < frame; i++) {
            this.#frames.delete(i);
        }
        this.#acked = frame;
    }

    get pendingFrame() {
        return this.#entity.replicatedState;
    }

    writeNextFrame() {
        this.#current++;
        const state = this.pendingFrame;
        this.#frames.set(this.#current, state);
    }

    get dirtyState() {
        const pending = this.pendingFrame;
        const cleanKeys = Object.keys(pending);
        for (const frame of this.#frames.values()) {
            const dirtyKeys = [];
            for(const key of cleanKeys) {
                if(pending[key] != frame[key]) {
                    dirtyKeys.push(key);
                }
            }
            for(const key of dirtyKeys) {
                const index = cleanKeys.indexOf(key);
                if(index != -1) {
                    cleanKeys.splice(index, 1);
                }
            }
        }
        for(const key in pending) {
            const index = cleanKeys.indexOf(key);
            if(index != -1) {
                delete pending[key];
            }
        }
        return pending;
    }
}

class GhostManager {
    #world = null;
    #ghosts = new Map();
    #frame = null;
    #acked = 0;
    #current = 0;

    constructor(world) {
        this.#world = world;
        for(const entity of this.#world.entities) {
            this.#onEntityAdded(entity);
        }
        this.#world.onEntityAdded.bind((entity)=> {
            this.#onEntityAdded(entity);
        });
    }

    ack(frame) {
        for(const ghost of this.#ghosts.values()) {
            ghost.ack(frame);
        }
        this.#acked = frame;
    }

    #onEntityAdded(entity) {
        if(Object.keys(entity.class.replicatedProperties).length === 0) {
            return;
        }

        if(entity.replicates) {
            this.#ghosts.set(entity.UUID, new Ghost(entity, this.#acked, this.#current));
        }
    }

    get frame() {
        const deltaMap = new Map();
        for(const [id, ghost] of this.#ghosts) {
            const dirty = ghost.dirtyState;
            
            if((() => {
                for(const _ in dirty) return true;
                return false;
            })()) {
                deltaMap.set(id, dirty);
            }
        }
        if(deltaMap.size > 0) {
            const delta = Object.fromEntries(deltaMap);
            if(this.#frame == null || !deepEqual(this.#frame.delta, delta)) {    
                for(const ghost of this.#ghosts.values()) {
                    ghost.writeNextFrame();
                }
                this.#current++;
                this.#frame = {
                    frame: this.#current,
                    delta: Object.fromEntries(deltaMap)
                }
            }
        }
        else {
            this.#frame = null;
        }
        return this.#frame;
    }
}

export { GhostManager };
