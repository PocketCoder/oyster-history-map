'use strict';
function usrData(func, type, data = []) {
	if (func === 'get') {
		if (localStorage.getItem(type) != null && localStorage.getItem(type) != '[]') {
			return JSON.parse(localStorage.getItem(type));
		} else {
			return [];
		}
	} else if (func === 'save') {
		let current = JSON.parse(localStorage.getItem(type)) ? JSON.parse(localStorage.getItem(type)) : [];
		let newData = [];
		if (typeof data === 'string') {
			newData.push(data);
		} else {
			newData.push(...data);
		}
		current.push(...newData);
		let unique = current.filter((c, i) => {
			return current.indexOf(c) === i;
		});
		localStorage.setItem(type, JSON.stringify(unique));
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
	let s = [];
	if (typeof stns === 'string') {
		s.push(stns);
	} else {
		s.push(...stns);
	}
	s.sort();
	s.forEach((v) => {
		var _a, _b, _c;
		(_a = document.querySelector(`[id*="${stations[v]}-dash"]`)) === null || _a === void 0
			? void 0
			: _a.classList.add('visible');
		(_b = document.querySelector(`[id*="${stations[v]}-label"]`)) === null || _b === void 0
			? void 0
			: _b.classList.add('visible');
		(_c = document.querySelector(`[id*="IC_${stations[v]}"]`)) === null || _c === void 0
			? void 0
			: _c.classList.add('visible');
	});
}
function updateLineSegs() {
	var _a;
	let stnCodes = findVisCodes(usrData('get', 'stations'));
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
		overground: 0,
		'waterloo-city': 0,
		'cable-car': 0,
		dlr: 0,
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
						var _a;
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
							(_a = document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)) === null || _a === void 0
								? void 0
								: _a.classList.add('visible');
						}
					});
					lineObj['bottom'].forEach((e) => {
						var _a;
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
							(_a = document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)) === null || _a === void 0
								? void 0
								: _a.classList.add('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total;
				} else if (top) {
					let total = 0;
					lineObj['top'].forEach((e) => {
						var _a;
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
							(_a = document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)) === null || _a === void 0
								? void 0
								: _a.classList.add('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total;
				} else if (bottom) {
					let total = 0;
					lineObj['bottom'].forEach((e) => {
						var _a;
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
							(_a = document.getElementById(`lul-${lineObj['line']}_${e[i]}-${e[i + 1]}`)) === null || _a === void 0
								? void 0
								: _a.classList.add('visible');
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
				(_a = document.getElementById(`lul-${lineObj['line']}_${lineArr[i]}-${lineArr[i + 1]}`)) === null ||
				_a === void 0
					? void 0
					: _a.classList.add('visible');
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
		tram: 39
	};
	for (const l in totals) {
		let percent = 0,
			visited;
		if (data[l] === NaN) {
			document.getElementById(`${l}`).setAttribute('value', '0');
		} else {
			const total = totals[l];
			visited = data[l];
			percent = Math.floor((visited / total) * 100);
		}
		document.getElementById(`${l}`).setAttribute('value', percent.toString());
	}
}
function readFile(file) {
	const reader = new FileReader();
	reader.readAsText(file, 'UTF-8');
	reader.onload = (evt) => {
		const fileString = evt.target.result || '';
		const CSVarr = CSVtoArray(fileString);
		loadData(CSVarr);
	};
	reader.onerror = (err) => {
		console.error(err);
	};
}
function loadData(arr) {
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
		usrData('save', 'stations', stations);
		usrData('save', 'bus', busses);
	} catch (e) {
		console.error(`[script.ts | loadData()]: ${e}`);
	} finally {
		addStnsToMap(stations);
		updateLineSegs();
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
}
function dropHandler(e) {
	e.preventDefault();
	const file = e.dataTransfer.items[0].getAsFile();
	readFile(file);
}
