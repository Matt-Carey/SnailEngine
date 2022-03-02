import { XMLFactory } from './xmlFactory.js';
import { UUID } from '../../3rdparty/uuid/dist/uuidv4.js';

class Template {
    #templateEntities = [];

    constructor(json) {
        for(const key in json.entity) {
            const entityJson = json.entity[key];
            const templateEntity = new TemplateEntity(entityJson);
            this.#templateEntities.push(templateEntity);
        }
    }

    toJSON() {
        const json = {"entities": []};
        for(const templateEntity of this.#templateEntities) {
            json.entities.push({
                "UUID": templateEntity.UUID,
                "meta": templateEntity.meta,
                "json": this.#process(templateEntity.json),
            });
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
    #json = null;

    constructor(json) {
        this.#UUID = UUID.get();
        this.#meta = json['@_'];
        delete json['@_'];
        this.#json = json;
    }

    get meta() {
        return this.#meta;
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
        return new Template(json.template);
    }
}

export { TemplateFactory };
