class UserDataHandler {
	constructor() {
		this.usrDataObj = {bus: [], stations: []};
		this.urlSpan = document.getElementById('url');
		this.wlh = window.location.hash;
		this.wlp = window.location.pathname;
		this.hash = '';
		this.phrase = '';
		this.type = 'none';
		if (this.wlh !== '') {
			this.type = 'hash';
			if (this.wlh.startsWith('#')) {
				this.hash = this.wlh.substring(1);
			}
		} else if (this.wlp !== '') {
			this.type = 'path';
			if (this.wlp.startsWith('/')) {
				this.phrase = this.wlp.substring(1);
			}
		}
		this.loadData();
	}

	async loadData() {
		if (this.type === 'none') {
			// Do nothing
			this.urlElement.innerHTML = '/# ' + 'Start entering some data to generate your URL' + '...';
			return;
		} else if (this.type === 'hash') {
			// Decode hash
			this.usrDataObj = JSON.parse(LZString.decompressFromEncodedURIComponent(this.hash));
			this.urlSpan.innerHTML = '/#' + this.wlh.substring(0, 45) + '...';
			return;
		} else if (this.type === 'path') {
			// Fetch hash and decode.
			const res = await fetch(`/hash/${this.phrase}`);
			const data = res.json();
			this.urlSpan.innerHTML = this.wlp;
			data
				.then((d) => {
					const hash = d.hash;
					try {
						const hashData = JSON.parse(LZString.decompressFromEncodedURIComponent(d.hash));
						this.usrDataObj = hashData;
					} catch (e) {
						console.error(e);
					}
				})
				.catch((e) => {
					console.error(e);
				});
			return;
		} else {
			throw new Error('loadData() & this.type error.');
		}
	}

	async get(type: string): Promise<string[]> {
		if (type === 'stations') {
			return this.usrDataObj.stations;
		} else if (type === 'bus') {
			return this.usrDataObj.bus;
		} else {
			throw new Error(`Variable type can only be 'stations' or 'bus'`);
		}
	}

	async save(type: string, data: Array<string> | string) {
		let newData = Array.isArray(data) ? data : [data];
		let unique;
		if (type === 'stations') {
			this.usrDataObj.stations.push(...newData);
			unique = this.userDataObj.stations.filter((c, i) => {
				return this.userDataObj.stations.indexOf(c) === i;
			});
		} else if (type === 'bus') {
			this.usrDataObj.bus.push(...newData);
			unique = this.usrDataObj.bus.filter((c, i) => {
				return this.usrDataObj.bus.indexOf(c) === i;
			});
		} else {
			throw new Error("Type param only accepts 'stations' or 'bus'");
		}
		const newHash = LZString.compressToEncodedURIComponent(JSON.stringify(unique));
		this.getNewPhrase(newHash);
	}

	async getNewPhrase(hash: string) {
		// TODO: Think of process for this.
		// Every single save item a new hash is generated? or after a certain time / certain number of saves or stations have been added?
	}
}
const DataHandler = new UserDataHandler();

function findVisCodes(arr: Array<string>) {
	const stnArr: Array<string> = [...arr];
	let visArr: Array<string> = [];
	for (const stn of stnArr) {
		visArr.push(stations[stn]);
	}
	return visArr;
}

function addStnsToMap(stns) {
	let unique;
	if (stns.stations !== undefined) {
		unique = stns.stations.filter((c: string, i: number) => {
			return stns.stations.indexOf(c) === i;
		});
	} else {
		unique = stns.filter((c: string, i: number) => {
			return stns.indexOf(c) === i;
		});
	}
	unique.sort();
	unique.forEach((v: string) => {
		document.querySelector(`[id*="${stations[v]}-dash"]`)?.classList.add('visible');
		document.querySelector(`[id*="${stations[v]}-label"]`)?.classList.add('visible');
		document.querySelector(`[id*="IC_${stations[v]}"]`)?.classList.add('visible');
	});
}

async function updateLineSegs(usrData: Array<string>) {
	let stnCodes: Array<string>;
	if (usrData.stations !== 'undefined') {
		stnCodes = findVisCodes(usrData);
	} else {
		stnCodes = findVisCodes(usrData.stations);
	}
	let data: {[line: string]: number} = {
		bakerloo: 0,
		central: 0,
		piccadilly: 0,
		jubilee: 0,
		metropolitan: 0,
		victoria: 0,
		northern: 0,
		circle: 0,
		'hammersmith-city': 0,
		district: 0,
		elizabeth: 0,
		overground: 10,
		'waterloo-city': 0,
		'cable-car': 0,
		dlr: 0,
		tram: 0,
		OSI: 0
	};
	for (const l in lines) {
		const lineObj = lines[l];
		if (lineObj['branch']) {
			// Check if top branches are active.
			function top() {
				let active = false;
				lineObj['top']!.forEach((a: string[]) => {
					a.forEach((s) => {
						if (stnCodes.includes(s)) {
							active = true;
						} else {
							// Hasn't been visited.
						}
					});
				});
				return active;
			}

			// Check if bottom branches are active
			function bottom() {
				let active = false;
				lineObj['bottom']!.forEach((a: string[]) => {
					a.forEach((s) => {
						if (stnCodes.includes(s)) {
							active = true;
						} else {
							// Hasn't been visited.
						}
					});
				});
				return active;
			}

			// Complete the line segments.
			function complete(top: Boolean, bottom: Boolean) {
				// If the top and bottom branches are active then go from the the first visited station of the top branches in those arrays to the last station, then from the first station of the bottom branches to the last visited station.
				if (top && bottom) {
					let total = 0;
					lineObj['top']!.forEach((e: string[]) => {
						let first = 100;
						e.forEach((a) => {
							const index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total++;
								if (index <= first) {
									first = index;
								}
							}
						});
						for (let i = first; i < e.length; i++) {
							document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)?.classList.add('visible');
						}
					});
					lineObj['bottom']!.forEach((e) => {
						let last = 0;
						e.forEach((a: string) => {
							const index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total++;
								if (index >= last) {
									last = index;
								}
							}
						});
						for (let i = 0; i < last; i++) {
							document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)?.classList.add('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total;
				} else if (top) {
					let total = 0;
					lineObj['top']!.forEach((e) => {
						let first = 100,
							last = 0;
						e.forEach((a) => {
							const index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total++;
								if (index <= first) {
									first = index;
								} else if (index >= last) {
									last = index;
								} else {
									// Error!
								}
							}
						});
						for (let i = first; i < last; i++) {
							document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)?.classList.add('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total;
				} else if (bottom) {
					let total = 0;
					lineObj['bottom']!.forEach((e) => {
						let first = 100,
							last = 0;
						e.forEach((a) => {
							const index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total++;
								if (index <= first) {
									first = index;
								} else if (index >= last) {
									last = index;
								} else {
									// Error!
								}
							}
						});
						for (let i = first; i < last; i++) {
							document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)?.classList.add('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total;
				}
			}
			complete(top(), bottom());
		} else {
			const lineArr = lineObj['stations']!;
			let first = 100,
				last = 0,
				total = 0;
			lineArr.forEach((a) => {
				const index = lineArr.indexOf(a);
				if (stnCodes.includes(a)) {
					total++;
					if (index < first) {
						first = index;
					} else if (index > last) {
						last = index;
					} else {
						// Error!
					}
				}
			});
			for (let i = first; i < last; i++) {
				document.getElementById(`lul-${lineObj['line']}_${lineArr[i]}-${lineArr[i + 1]}`)?.classList.add('visible');
			}
			data[lineObj['line']] = data[lineObj['line']] + total;
		}
	}
	updateStats(data);
}

function updateStats(data: {[line: string]: number}) {
	const totals: {[line: string]: number} = {
		bakerloo: 25,
		central: 49,
		piccadilly: 53,
		jubilee: 27,
		metropolitan: 34,
		victoria: 16,
		northern: 52,
		circle: 36,
		'hammersmith-city': 29,
		district: 60,
		elizabeth: 32,
		overground: 112,
		'waterloo-city': 2,
		'cable-car': 2,
		dlr: 45,
		tram: 39,
		OSI: 0
	};
	for (const l in totals) {
		let percent: number = 0,
			visited: number;
		if (l === 'OSI') continue;
		if (data[l] === NaN) {
			document.getElementById(`js-lp-${l}`)!.innerText = '0%';
		} else {
			const total: number = totals[l];
			visited = data[l];
			percent = Math.floor((visited / total) * 100);
		}
		document.getElementById(`js-lp-${l}`)!.innerText = percent.toString() + '%';
	}
}

function readFile(file: File) {
	const reader = new FileReader();

	reader.readAsText(file, 'UTF-8');

	// reader.onprogress = updateProgress;
	reader.onload = async (evt) => {
		const fileString: any = evt.target!.result || '';
		const CSVarr = CSVtoArray(fileString);
		await loadData(CSVarr);
	};

	reader.onerror = (err) => {
		console.error(err);
	};
}

async function loadData(arr: string[][]) {
	let stations: string[] = [],
		busses: string[] = [];
	for (const a in arr) {
		const journey = arr[a][3];
		if (journey == undefined) continue;
		if (journey.toLowerCase().indexOf('bus') !== -1) {
			const bus = journey.split('route ')[1];
			if (!busses.includes(bus)) {
				busses.push(bus);
			}
		} else if (journey.toLowerCase().indexOf(' to ') !== -1) {
			const j = journey.split(' to ');
			const s = j.map((d) => {
				const regEx = /( \[.*\])|( DLR)|( tram stop)|(\[No touch-out\])/;
				return d.replace(regEx, '');
			});
			for (const i in s) {
				if (!stations.includes(s[i])) {
					stations.push(s[i]);
				}
			}
		}
	}
	try {
		await DataHandler.save('stations', stations);
		await DataHandler.save('bus', busses);
		//await usrData('save', 'stations', stations);
		//await usrData('save', 'bus', busses);
	} catch (e) {
		console.error(`[script.ts | loadData()]: ${e}`);
	} finally {
		addStnsToMap(stations);
		const usrStns = await DataHandler.get('stations');
		await updateLineSegs(usrStns);
	}
}

function CSVtoArray(strData: string, strDelimiter = ',') {
	// https://gist.github.com/luishdez/644215
	strDelimiter = strDelimiter || ',';
	let objPattern = new RegExp(
		// Delimiters.
		'(\\' +
			strDelimiter +
			'|\\r?\\n|\\r|^)' +
			// Quoted fields.
			'(?:"([^"]*(?:""[^"]*)*)"|' +
			// Standard fields.
			'([^"\\' +
			strDelimiter +
			'\\r\\n]*))',
		'gi'
	);

	let arrData: string[][] = [[]];
	let arrMatches: any = null;

	while ((arrMatches = objPattern.exec(strData))) {
		let strMatchedDelimiter = arrMatches[1];
		if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
			arrData.push([]);
		}

		let strMatchedValue: any;
		if (arrMatches[2]) {
			strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
		} else {
			strMatchedValue = arrMatches[3];
		}
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	return arrData;
}

function dragOverHandler(e: any) {
	e.preventDefault();
	document.getElementById('drag')?.classList.add('dragOver');
}

function dragLeaveHandler(e: any) {
	e.preventDefault();
	document.getElementById('drag')?.classList.remove('dragOver');
}

function dropHandler(e: any) {
	e.preventDefault();
	const file = e.dataTransfer.items[0].getAsFile();
	readFile(file);
	document.getElementById('drag')?.classList.remove('dragOver');
}
