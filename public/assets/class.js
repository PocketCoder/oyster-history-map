'use strict';
class DataHandler {
	constructor() {
		this.wlh = window.location.hash;
		this.wlp = window.location.pathname;
		this.type = '';
		this.hash = '';
		this.phrase = '';
		this.URLInputEl = document.getElementById('url');
		this.userData = {bus: [], stations: []};
	}
	async init() {
		this.typeDeterminer();
		this.stripper();
		this.phraseTester();
		await this.setUpDom();
		this.dehash();
	}
	getType() {
		return this.type;
	}
	gethash() {
		return this.hash;
	}
	getPhrase() {
		return this.phrase;
	}
	getUserData() {
		return this.userData;
	}
	async get(type) {
		if (type === 'stations') {
			return this.userData.stations;
		} else if (type === 'bus') {
			return this.userData.bus;
		} else {
			throw new Error(`Invalid argument: type must be 'stations' or 'bus'`);
		}
	}
	setUserData(dataObj) {
		this.userData = dataObj;
	}
	typeDeterminer(input) {
		if (input !== undefined) {
			this.type = this.phraseTester(input) ? 'phrase' : 'hash';
		} else if (this.wlh !== '' && this.wlp === '/') {
			this.type = 'hash';
		} else if (this.wlp !== '/' && this.wlh === '') {
			this.type = 'phrase';
		} else if (this.wlh === '' && this.wlp === '/') {
			this.type = 'clean';
		} else {
			this.type = '';
			console.error("DataHandler.typeDeterminer() couldn't work out the type.");
		}
	}
	stripper() {
		switch (this.type) {
			case 'hash':
				if (this.wlh.startsWith('#')) {
					this.hash = this.wlh.substring(1);
				} else {
					this.hash = this.wlh;
				}
				break;
			case 'phrase':
				if (this.wlp.startsWith('/')) {
					this.phrase = this.wlp.substring(1);
				} else {
					this.phrase = this.wlp;
				}
				break;
			case 'none':
				console.log('DataHandler.stripper() found no usable URL parts.');
				break;
			default:
				console.log('DataHandler.stripper() Defaulted.');
				break;
		}
	}
	phraseTester(phrase = this.phrase) {
		const validPhraseReg = /^\w+\.\w+\.\w+\.\w+$/;
		if (validPhraseReg.test(phrase)) {
			console.log('DataHandler.phraseTester() Phrase passes.');
			return true;
		} else {
			console.log(`DataHandler.phraseTester() Phrase fails: ${phrase}`);
			return false;
		}
	}
	async setUpDom() {
		switch (this.type) {
			case 'hash':
				this.URLInputEl.placeholder = `/#${this.hash.substring(0, 27)}...`;
				break;
			case 'phrase':
				this.URLInputEl.placeholder = `/${this.phrase}`;
				await this.getHashFromPhrase();
				break;
			case 'clean':
			default:
				this.URLInputEl.placeholder = `Add to the map to generate your URL...`;
		}
	}
	async getNewPhrase(hash = this.hash) {
		const res = await fetch(`/hash/${hash}`);
		const data = await res.json();
		this.phrase = data.phrase;
		this.setUpDom();
		return data.phrase;
	}
	async save(type, data) {
		if (!type || (type !== 'stations' && type !== 'bus')) {
			throw new Error("Invalid argument: type must be 'stations' or 'bus'");
		}
		const newData = Array.isArray(data) ? data : [data];
		if (newData.some((d) => typeof d !== 'string')) {
			throw new Error('Invalid argument: data must be a string or an array of strings.');
		}
		if (type === 'stations') {
			this.userData.stations.push(...newData);
		} else if (type === 'bus') {
			this.userData.bus.push(...newData);
		}
		const unique = Array.from(new Set(this.userData[type]));
		unique.sort();
		if (type === 'stations') {
			this.userData.stations = unique;
		} else if (type === 'bus') {
			this.userData.bus = unique;
		}
		this.newHash();
	}
	newHash() {
		this.hash = LZString.compressToEncodedURIComponent(JSON.stringify(this.userData));
		this.type = 'hash';
		this.phrase = '';
		this.urlUpdate();
		this.setUpDom();
	}
	dehash(hash = this.hash) {
		let decompressed, newData;
		try {
			decompressed = LZString.decompressFromEncodedURIComponent(hash);
			newData = JSON.parse(decompressed);
		} catch (e) {
			throw new Error(`DataHandler.dehash(): ${e}`);
		}
		if (
			newData.stations === undefined ||
			newData.stations === null ||
			newData.bus === undefined ||
			newData.bus === null
		) {
			throw new Error('Invalid Hash');
		} else {
			this.userData = newData;
		}
	}
	urlUpdate(hash = this.hash) {
		window.location.pathname = '';
		window.location.hash = hash;
		this.wlh = window.location.hash;
		this.wlp = '';
	}
	async getHashFromPhrase(phrase = this.phrase) {
		const res = await fetch(`/phrase/${phrase}`);
		const data = await res.json();
		this.hash = data.hash;
		return data.hash;
	}
	pageReload() {
		window.location.reload();
	}
	async processInput(input) {
		if (typeof input !== 'string') {
			throw new Error('input must be a string');
		}
		this.typeDeterminer(input);
		this.stripper();
		if (this.type === 'hash') {
			this.hash = input;
		} else {
			this.phrase = input;
			this.hash = await this.getHashFromPhrase();
		}
		this.dehash();
		this.urlUpdate();
		this.pageReload();
	}
}
