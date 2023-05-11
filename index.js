'use strict';
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const redis = require('redis');
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
async function generateNewPhrase() {
	const keys = await client.get('keys');
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
		await client.set('keys', JSON.stringify(keyList));
		return phrase;
	}
}
async function getHashFromPhrase(vars) {
	const phrase = `${vars.one}.${vars.two}.${vars.three}.${vars.four}`;
	const hash = await client.get(phrase);
	if (hash === null) {
		throw new Error("Hash couldn't be found.");
	}
	return hash;
}
async function checkHash(hash) {
	const hashListStr = await client.get('hashList');
	const hashList = JSON.parse(hashListStr);
	if (hashList[hash]) {
		return hashList[hash];
	} else {
		return false;
	}
}
async function savePhrase(phrase, hash) {
	const keysStr = await client.get('keys');
	const keyList = JSON.parse(keysStr);
	keyList.keys.push(phrase);
	await client.set('keys', JSON.stringify(keyList));
	const hashes = await client.get('hashList');
	const hashList = JSON.parse(hashes);
	hashList[hash] = phrase;
	await client.set('hashList', JSON.stringify(hashList));
	await client.set(phrase, hash);
}
const client = redis.createClient({
	password: process.env.redisPW,
	socket: {
		host: 'redis-12926.c78.eu-west-1-2.ec2.cloud.redislabs.com',
		port: 12926
	}
});
client.on('error', (err) => console.log('Redis Client Error', err));
app.get('/:one.:two.:three.:four', async (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/phrase/:one.:two.:three.:four', async (req, res) => {
	const hash = await getHashFromPhrase(req.params);
	res.json({hash: hash});
});
app.get('/hash/:hash', async (req, res) => {
	const check = await checkHash(req.params.hash);
	if (!check) {
		const phrase = await generateNewPhrase();
		await savePhrase(phrase, req.params.hash);
		res.json({phrase: phrase});
	} else {
		res.json({phrase: check});
	}
});
app.use('/', express.static(path.join(__dirname, 'public')));
app.listen(3000, async () => {
	console.log('Listening on port 3000');
	await client.connect();
});
