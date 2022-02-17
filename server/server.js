import { Engine } from 'http://localhost:8000/src/engine.js';

global.nodeimports = await import('./modules.mjs');

;(function() {
	console.log('Command Line Args:', process.argv)

	const gameIndex = process.argv.indexOf('--game') + 1;
	if(gameIndex == 0) {
		console.log("Missing game path! Use --game followed by path to game directory.");
		return;
	}

	const worldIndex = process.argv.indexOf('--world') + 1;
	if(worldIndex == 0) {
		console.log("Missing world name! Use --world flag followed by name of world.");
		return;
	}

	(async () => {
		const { fs, http, express, Server } = global.nodeimports;

		const gamePath = process.argv[gameIndex];
		if (!fs.existsSync(gamePath)) {
			console.log("Game directory cannot be found at ", gamePath);
			return;
		}

		const worldFile = process.argv[worldIndex];
		const worldPath = gamePath + "/" + worldFile;
		if(!fs.existsSync(worldPath)) {
			console.log("World file cannot be found at ", worldPath);
			return;
		}

		global.gamePath = gamePath;

		const app = express();
		const server = http.createServer(app);
		const io = new Server(server);

		io.on('connection', (socket) => {
			console.log('a user connected');
		});

		server.listen(8080, () => {
			console.log('listening on *:8080');
		});

		const engine = new Engine();
		engine.world.load(worldFile);
	})();

})();
