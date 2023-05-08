'use strict';
async function usrData(func, type, data = []) {
	let wlh = window.location.hash;
	let usrDataObj = {bus: [], stations: []};
	if (wlh !== '') {
		if (wlh.startsWith('#')) {
			wlh = wlh.substring(1);
		}
		const obj = JSON.parse(LZString.decompressFromEncodedURIComponent(wlh));
		usrDataObj.stations.push(...obj.stations);
		usrDataObj.bus.push(...obj.bus);
		document.getElementById('url').innerHTML = '/#' + wlh.substring(0, 45) + '...';
	} else if (window.location.pathname !== '') {
		const wlp = window.location.pathname.substring(1);
		const data = (await fetch(`/hash/${wlp}`)).json();
		console.log(data);
		data
			.then(async (d) => {
				const hash = d.hash;
				const hashData = JSON.parse(LZString.decompressFromEncodedURIComponent(d.hash));
				addStnsToMap(hashData);
				await updateLineSegs(hashData);
			})
			.catch((e) => {
				console.error(e);
			});
		document.getElementById('url').innerHTML = window.location.pathname;
	} else {
		document.getElementById('url').innerHTML = '/# ' + 'Start entering some data to generate your URL' + '...';
	}
	if (func === 'get') {
		if (type === 'stations') {
			return usrDataObj.stations;
		} else if (type === 'bus') {
			return usrDataObj.bus;
		} else {
			throw "Type param only accepts 'stations' or 'bus'";
		}
	} else if (func === 'save') {
		let newData = [];
		if (typeof data === 'string') {
			newData.push(data);
		} else {
			newData.push(...data);
		}
		if (type === 'stations') {
			usrDataObj.stations.push(...newData);
			let unique = usrDataObj.stations.filter((c, i) => {
				return usrDataObj.stations.indexOf(c) === i;
			});
		} else if (type === 'bus') {
			usrDataObj.bus.push(...newData);
			let unique = usrDataObj.bus.filter((c, i) => {
				return usrDataObj.bus.indexOf(c) === i;
			});
		} else {
			throw "Type param only accepts 'stations' or 'bus'";
		}
		const newHash = LZString.compressToEncodedURIComponent(JSON.stringify(usrDataObj));
		window.location.hash = newHash;
	} else {
		throw "Func param only accepts 'get' or 'save'";
	}
}
function findVisCodes(arr) {
	const stnArr = [...arr];
	let visArr = [];
	for (const stn of stnArr) {
		visArr.push(stations[stn]);
	}
	return visArr;
}
function addStnsToMap(stns) {
	let unique = stns.stations.filter((c, i) => {
		return stns.stations.indexOf(c) === i;
	});
	unique.sort();
	unique.forEach((v) => {
		document.querySelector(`[id*="${stations[v]}-dash"]`)?.classList.add('visible');
		document.querySelector(`[id*="${stations[v]}-label"]`)?.classList.add('visible');
		document.querySelector(`[id*="IC_${stations[v]}"]`)?.classList.add('visible');
	});
}
async function updateLineSegs(usrData) {
	let stnCodes = findVisCodes(usrData.stations);
	let data = {
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
			function top() {
				let active = false;
				lineObj['top'].forEach((a) => {
					a.forEach((s) => {
						if (stnCodes.includes(s)) {
							active = true;
						} else {
						}
					});
				});
				return active;
			}
			function bottom() {
				let active = false;
				lineObj['bottom'].forEach((a) => {
					a.forEach((s) => {
						if (stnCodes.includes(s)) {
							active = true;
						} else {
						}
					});
				});
				return active;
			}
			function complete(top, bottom) {
				if (top && bottom) {
					let total = 0;
					lineObj['top'].forEach((e) => {
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
					lineObj['bottom'].forEach((e) => {
						let last = 0;
						e.forEach((a) => {
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
					lineObj['top'].forEach((e) => {
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
					lineObj['bottom'].forEach((e) => {
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
			const lineArr = lineObj['stations'];
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
function updateStats(data) {
	const totals = {
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
		let percent = 0,
			visited;
		if (l === 'OSI') continue;
		if (data[l] === NaN) {
			document.getElementById(`js-lp-${l}`).innerText = '0%';
		} else {
			const total = totals[l];
			visited = data[l];
			percent = Math.floor((visited / total) * 100);
		}
		document.getElementById(`js-lp-${l}`).innerText = percent.toString() + '%';
	}
}
function readFile(file) {
	const reader = new FileReader();
	reader.readAsText(file, 'UTF-8');
	reader.onload = async (evt) => {
		const fileString = evt.target.result || '';
		const CSVarr = CSVtoArray(fileString);
		await loadData(CSVarr);
	};
	reader.onerror = (err) => {
		console.error(err);
	};
}
async function loadData(arr) {
	let stations = [],
		busses = [];
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
		await usrData('save', 'stations', stations);
		await usrData('save', 'bus', busses);
	} catch (e) {
		console.error(`[script.ts | loadData()]: ${e}`);
	} finally {
		addStnsToMap(stations);
		const usrStns = await usrData('get', 'stations');
		await updateLineSegs(usrStns);
	}
}
function CSVtoArray(strData, strDelimiter = ',') {
	strDelimiter = strDelimiter || ',';
	let objPattern = new RegExp(
		'(\\' + strDelimiter + '|\\r?\\n|\\r|^)' + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + strDelimiter + '\\r\\n]*))',
		'gi'
	);
	let arrData = [[]];
	let arrMatches = null;
	while ((arrMatches = objPattern.exec(strData))) {
		let strMatchedDelimiter = arrMatches[1];
		if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
			arrData.push([]);
		}
		let strMatchedValue;
		if (arrMatches[2]) {
			strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
		} else {
			strMatchedValue = arrMatches[3];
		}
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	return arrData;
}
function dragOverHandler(e) {
	e.preventDefault();
	document.getElementById('drag')?.classList.add('dragOver');
}
function dragLeaveHandler(e) {
	e.preventDefault();
	document.getElementById('drag')?.classList.remove('dragOver');
}
function dropHandler(e) {
	e.preventDefault();
	const file = e.dataTransfer.items[0].getAsFile();
	readFile(file);
	document.getElementById('drag')?.classList.remove('dragOver');
}
