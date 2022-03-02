import { IS_BROWSER, IS_NODE } from '../util/env.js';
import { XMLParser } from '../../3rdparty/fast-xml-parser/lib/fxparser.min.js';

class XMLFactory {
    static async get(url, options) {
        if(IS_BROWSER) {
            const response = await fetch(url);
            const xmlString = await response.text();
            const parser = new XMLParser(options);
            return parser.parse(xmlString);
        }
        else if(IS_NODE) {
            const { fs, path } = global.nodeimports;
            const fullPath = path.join(global.gamePath + '/' + url);
            const file = fs.readFileSync(fullPath);
            const parser = new XMLParser(options);
            return parser.parse(file);
        }
    }
}

export { XMLFactory };
