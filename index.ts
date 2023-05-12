import {Application, Router} from 'https://deno.land/x/oak/mod.ts';
const app = new Application();
const router = new Router();
import {config} from 'https://deno.land/x/dotenv/mod.ts';
import {connect} from 'https://deno.land/x/redis/mod.ts';
const redis = await connect({
	hostname: 'redis-12926.c78.eu-west-1-2.ec2.cloud.redislabs.com',
	port: 12926,
	password: config().redisPW
});
//redis.on('error', (err) => console.log('Redis Client Error', err));

const words = [
	'bakerloo',
	'barking',
	'barnet',
	'bexley',
	'bike',
	'brent',
	'bromley',
	'bus',
	'camden',
	'central',
	'chelsea',
	'circle',
	'commute',
	'crossrail',
	'croydon',
	'cycle',
	'cycleway',
	'dagenham',
	'delay',
	'district',
	'dlr',
	'ealing',
	'elizabeth',
	'enfield',
	'euston',
	'fare',
	'fulham',
	'gatwick',
	'gla',
	'greenwich',
	'hackney',
	'hammersmith',
	'haringey',
	'harrow',
	'havering',
	'heathrow',
	'hillingdon',
	'hounslow',
	'interchange',
	'islington',
	'journey',
	'jubilee',
	'kensington',
	'kingscross',
	'kingston',
	'lambeth',
	'lewisham',
	'liverpoolst',
	'london',
	'londonbridge',
	'map',
	'merton',
	'metropolitan',
	'newham',
	'northern',
	'offpeak',
	'overground',
	'oyster',
	'paddington',
	'peak',
	'piccadilly',
	'platform',
	'platform',
	'railcard',
	'redbridge',
	'richmond',
	'route',
	'route',
	'rushhour',
	'schedule',
	'southwark',
	'stop',
	'stpancras',
	'stratford',
	'sutton',
	'taxi',
	'tfl',
	'ticket',
	'ticket',
	'timetable',
	'timetable',
	'tower-hamlets',
	'train',
	'tramlink',
	'travelcard',
	'tube',
	'underground',
	'victoria',
	'waltham-forest',
	'wandsworth',
	'waterloo',
	'waterloo',
	'westminster',
	'zone',
	'zone1',
	'zone2',
	'zone3',
	'zone4',
	'zone5',
	'zone6',
	'zone7',
	'zone8',
	'zone9'
];

async function generateNewPhrase(): Promise<any> {
	const keys = await redis.get('keys');
	const keyList = JSON.parse(keys);
	let phrase = '';
	const one = Math.floor(Math.random() * words.length),
		two = Math.floor(Math.random() * words.length),
		three = Math.floor(Math.random() * words.length),
		four = Math.floor(Math.random() * words.length);
	phrase = words[one] + '.' + words[two] + '.' + words[three] + '.' + words[four];

	if (keyList.keys.includes(phrase)) {
		return generateNewPhrase();
	} else {
		keyList.keys.push(phrase);
		await redis.set('keys', JSON.stringify(keyList));
		return phrase;
	}
}

async function getHashFromPhrase(vars: {
	one: string;
	two: string;
	three: string;
	four: string;
}): Promise<string | null> {
	const phrase = `${vars.one}.${vars.two}.${vars.three}.${vars.four}`;
	const hash = await redis.get(phrase);
	if (hash === null) {
		throw new Error("Hash couldn't be found.");
	}
	return hash;
}

async function checkHash(hash: string) {
	const hashListStr = await redis.get('hashList');
	const hashList = JSON.parse(hashListStr);
	if (hashList[hash]) {
		return hashList[hash];
	} else {
		// Hash doesn't have a phrase yet.
		return false;
	}
}

async function savePhrase(phrase: string, hash: string) {
	const keysStr = await redis.get('keys');
	const keyList = JSON.parse(keysStr);
	keyList.keys.push(phrase);
	await redis.set('keys', JSON.stringify(keyList));
	const hashes = await redis.get('hashList');
	const hashList = JSON.parse(hashes);
	hashList[hash] = phrase;
	await redis.set('hashList', JSON.stringify(hashList));
	await redis.set(phrase, hash);
}

// Functions end

// Logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.headers.get('X-Response-Time');
	console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

router
	.get('/:one.:two.:three.:four', (ctx, next) => {
		// Send back index.html
		next();
	})
	.get('/phrase/:one.:two.:three.:four', async (ctx) => {
		// Returns Hash
		console.log(ctx);
		const hash = await getHashFromPhrase(ctx.params);
		ctx.response.body = {hash: hash}; // Check what's receiving this and change to .text()?
	})
	.get('/hash/:hash', async (ctx) => {
		// Receives new hash. Returns existing key or generates a new one and returns it.
		const check = await checkHash(ctx.params.hash);
		if (!check) {
			const phrase = await generateNewPhrase();
			await savePhrase(phrase, ctx.params.hash);
			ctx.response.body = {phrase: phrase};
		} else {
			ctx.response.body = {phrase: check};
		}
	});

app.use(async (ctx, next) => {
	try {
		await ctx.send({
			root: `${Deno.cwd()}/public/`,
			index: 'index.html'
		});
	} catch {
		await next();
	}
});

app.use(router.routes());
app.use(router.allowedMethods());
app.addEventListener('listen', async () => {
	console.log('Listening on port 3000');
	await redis.connect();
});

await app.listen({port: 3000});
