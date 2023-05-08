const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const redis = require('redis');
const words = [
	'bakerloo',
	'central',
	'circle',
	'district',
	'hammersmith',
	'jubilee',
	'metropolitan',
	'northern',
	'piccadilly',
	'victoria',
	'waterloo',
	'dlr',
	'tube',
	'bus',
	'london',
	'underground',
	'oyster',
	'tfl',
	'train',
	'travelcard',
	'cycle',
	'bike',
	'overground',
	'crossrail',
	'elizabeth',
	'fare',
	'journey',
	'map',
	'route',
	'timetable',
	'platform',
	'ticket',
	'zone',
	'tramlink',
	'cycleway',
	'waterloo',
	'liverpoolst',
	'londonbridge',
	'euston',
	'paddington',
	'stpancras',
	'stratford',
	'kingscross',
	'heathrow',
	'gatwick',
	'ticket',
	'taxi',
	'commute',
	'schedule',
	'timetable',
	'route',
	'stop',
	'platform',
	'peak',
	'offpeak',
	'rushhour',
	'delay',
	'interchange'
];

const existingStrings: Array<string> = []; // TODO: Keep in a database.

function generateUniqueString(): string {
	let phrase = '';
	const one = Math.floor(Math.random() * words.length),
		two = Math.floor(Math.random() * words.length),
		three = Math.floor(Math.random() * words.length);
	phrase = words[one];
	phrase += '.' + words[two];
	phrase += '.' + words[three];

	if (existingStrings.includes(phrase)) {
		// TODO: Add in more words/aceess to a dictionary.
		return generateUniqueString();
	} else {
		existingStrings.push(phrase);
		return phrase;
	}
}

const client = redis.createClient({
	password: process.env.redisPW,
	socket: {
		host: 'redis-12926.c78.eu-west-1-2.ec2.cloud.redislabs.com',
		port: 12926
	}
});
client.on('error', (err) => console.log('Redis Client Error', err));

async function getHash(vars) {
	await client.connect();
	const key = vars.one + '.' + vars.two + '.' + vars.three;
	const hash = await client.get(key);
	if (hash === null) {
		// TODO: Handle error.
	} else {
		return hash;
	}
}

app.get('/:one.:two.:three', async (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/hash/:one.:two.:three', async (req, res) => {
	console.log(req.params);
	const hash = await getHash(req.params);
	res.json({hash});
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
