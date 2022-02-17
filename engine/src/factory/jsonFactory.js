import { IS_BROWSER, IS_NODE } from '../util/env.js';

class JSONFactory {
    static get(url) {
        return (async () => {
            if(IS_BROWSER) {
                const response = await fetch(url);
                return await response.json();
            }
            else if(IS_NODE) {
                const { fs, path } = global.nodeimports;
                const fullPath = path.join(global.gamePath + '/' + url);
                const file = fs.readFileSync(fullPath);
                return JSON.parse(file);
            }
        })();
    }
}

export { JSONFactory };
