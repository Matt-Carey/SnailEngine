import { JSONFactory } from './factory/jsonFactory.js';

let Config = await JSONFactory.get('/config.json');

export { Config };
