import { XMLFactory } from './xmlFactory.js';
import { EntityFactory } from './entityFactory.js';
import { UUID } from './../util/uuid.js';

class Template {
    #templateEntities = [];

    constructor(json) {
        json.entity = Array.isArray(json.entity) ? json.entity : [json.entity];
        for(const key in json.entity) {
            const entityJson = json.entity[key];
            const templateEntity = new TemplateEntity(entityJson);
            this.#templateEntities.push(templateEntity);
        }
    }

    toJSON() {
        const keyMap = new Map();
        const json = {};
        for(const templateEntity of this.#templateEntities) {
            const key = templateEntity.meta.type;
            if(!keyMap.has(key)) {
                keyMap.set(key, 0);
            }
            json[key + '_' + keyMap.get(key)] = {
                "UUID": templateEntity.UUID,
                "meta": templateEntity.meta,
                "init": templateEntity.init,
                "json": this.#process(templateEntity.json),
            };
            keyMap.set(key, keyMap.get(key) + 1);
        }
        return json;
    }

    #applyAttributes(json, attributes) {
        switch(attributes['type']) {
            case 'entity':
                json = this.#templateEntities[json].UUID;
                break;
        }
        return json;
    }

    #process(json) {
        var result = {};
        for(const key in json) {
            var obj = {};
            if(typeof json[key] == 'object' && typeof json[key]['@_'] == 'object') {
                const attributes = json[key]['@_'];
                delete json[key]['@_'];
                if(Object.keys(json[key]).length == 1 && json[key]['#text'] != null) {
                    json[key] = json[key]['#text'];
                }
                json[key] = this.#applyAttributes(json[key], attributes);
            }
            if((typeof json[key] == 'array') || (typeof json[key] == 'object')) {
                obj = this.#process(json[key]);
            } else {
                obj = json[key];
            }
            if(Object.keys(obj).length !== 0 || obj.constructor !== Object) {
                result[key] = obj;
            }
        }
        return result;
    }
}

class TemplateEntity {
    #UUID = null;
    #meta = null;
    #init = null;
    #json = null;

    constructor(json) {
        this.#UUID = UUID.get();
        this.#meta = json['@_'];
        delete json['@_'];
        this.#init = json['init'] ?? {};
        this.#json = json['json'] ?? {};
    }

    get meta() {
        return this.#meta;
    }

    get init() {
        return this.#init;
    }

    get json() {
        return this.#json;
    }

    get UUID() {
        return this.#UUID;
    }
}

class TemplateFactory {
    static #XMLoptions = {
        ignoreDeclaration: true,
        ignoreAttributes: false,
        attributesGroupName : "@_",
        attributeNamePrefix : "",
    };

    static async get(url) {
        const json = await XMLFactory.get(url, TemplateFactory.#XMLoptions);
        return JSON.parse(JSON.stringify(new Template(json.template)));
    }

    static async make(world, url, overrides) {
        const entityPromises = [];
        const template = await TemplateFactory.get(url);
        for(const key in template) {
            const entity = template[key];
            if(key in (overrides ?? [])) {
                for(const property in overrides[key]) {
                    entity.json[property] = overrides[key][property];
                }
            }
            const entityPromise = EntityFactory.make(world, entity.UUID, entity.meta, entity.init, entity.json);
            entityPromises.push(entityPromise);
        }
        return await Promise.all(entityPromises);
    }
}

export { TemplateFactory };
