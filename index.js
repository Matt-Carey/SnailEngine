import { Engine } from './engine/src/engine.js';
import { IS_NODE } from './engine/src/util/env.js';
import { ModuleFactory } from './engine/src/factory/moduleFactory.js';

;(function() {

	const engine = new Engine();
	engine.world.load('/games/test/world.json');
	
	if(IS_NODE) {
		(async () => {
			const modules = await ModuleFactory.getNodeModules();
			const path = modules.path;
			const express = modules.express;
			const favicon = modules.favicon;
			const http = modules.http;
			const Server = modules.Server;

			const app = express();
			app.use(express.static(path.join(process.cwd(), '/')));
			app.use(favicon(path.join(process.cwd(), '/favicon.ico'))); 

			const server = http.createServer(app);
			const io = new Server(server);

			app.get('/', (req, res) => {
				const fullPath = path.join(process.cwd(), '/index.html');
				res.sendFile(fullPath);
			});

			io.on('connection', (socket) => {
				console.log('a user connected');
			});

			server.listen(3000, () => {
				console.log('listening on *:3000');
			});
		})();
	}

})();
