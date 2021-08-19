import { IS_BROWSER, IS_NODE } from '../util/env.js';
import { ModuleFactory } from './moduleFactory.js';

class JSONFactory {
    static get(url) {
        return (async () => {
            if(IS_BROWSER) {
                const response = await fetch(url);
                return await response.json();
            }
            else if(IS_NODE) {
                const modules = await ModuleFactory.getNodeModules();
                const fs = modules.fs;
                const path = modules.path;
                const fullPath = path.join(process.cwd(), url);
                const file = fs.readFileSync(fullPath);
                return JSON.parse(file);
            }
        })();
    }
}

export { JSONFactory };
