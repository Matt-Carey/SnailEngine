import { deepEqual, deepCopy } from "../util/diff.js";

class Ghost {
    #pendingFrame = null;
    #frames = new Map();
    #acked = null;
    #current = null;

    constructor(state, acked, current) {
        this.#acked = acked;
        this.#current = current;
        
        for(let i = this.#acked; i <= this.#current; i++) {
            this.#frames.set(i, state);
        }
    }

    set pendingFrame(frame) {
        this.#pendingFrame = frame;
    }

    ack(frame) {
        for(let i = this.#acked; i < frame; i++) {
            this.#frames.delete(i);
        }
        this.#acked = frame;
    }

    writeNextFrame() {
        this.#current++;
        this.#frames.set(this.#current, this.#pendingFrame);
    }

    get dirtyState() {
        const pending = deepCopy(this.#pendingFrame);
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
    #channelId = null;
    #ghosts = new Map();
    #frame = null;
    #acked = 0;
    #current = 0;

    constructor(world, channelId) {
        this.#world = world;
        this.#channelId = channelId;
    }

    ack(frame) {
        for(const ghost of this.#ghosts.values()) {
            ghost.ack(frame);
        }
        this.#acked = frame;
    }

    update(ghostStateMap) {
        for(const [key, value] of ghostStateMap) {
            if(!this.#ghosts.has(key)) {
                this.#ghosts.set(key, new Ghost(value, this.#acked, this.#current));
            }
            this.#ghosts.get(key).pendingFrame = value;
        }

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
                };
            }
        }
        else {
            this.#frame = null;
        }
        return this.#frame;
    }
}

export { GhostManager };
