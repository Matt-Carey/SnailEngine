const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const IS_WEB_WORKER = typeof self === 'object'
  && self.constructor
  && self.constructor.name === 'DedicatedWorkerGlobalScope';

const IS_NODE = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null;

const IS_JS_DOM = () => (typeof window !== 'undefined' && window.name === 'nodejs')
  || navigator.userAgent.includes('Node.js')
  || navigator.userAgent.includes('jsdom');

const WORKING_DIR = IS_BROWSER ? document.URL.substring(0, document.URL.lastIndexOf('/')) : '';

export { IS_BROWSER, IS_WEB_WORKER, IS_NODE, IS_JS_DOM, WORKING_DIR };
