var __spreadArray =
	(this && this.__spreadArray) ||
	function (to, from, pack) {
		if (pack || arguments.length === 2)
			for (var i = 0, l = from.length, ar; i < l; i++) {
				if (ar || !(i in from)) {
					if (!ar) ar = Array.prototype.slice.call(from, 0, i);
					ar[i] = from[i];
				}
			}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
function usrData(func, type, data) {
	if (data === void 0) {
		data = [];
	}
	if (func === 'get') {
		if (localStorage.getItem(type) != null && localStorage.getItem(type) != '[]') {
			return JSON.parse(localStorage.getItem(type));
		} else {
			// Does not exist/empty.
			return [];
		}
	} else if (func === 'save') {
		var current_1 = JSON.parse(localStorage.getItem(type)) ? JSON.parse(localStorage.getItem(type)) : [];
		var newData = [];
		if (typeof data === 'string') {
			newData.push(data);
		} else {
			newData.push.apply(newData, data);
		}
		current_1.push.apply(current_1, newData);
		var unique = current_1.filter(function (c, i) {
			return current_1.indexOf(c) === i;
		});
		localStorage.setItem(type, JSON.stringify(unique));
	} else {
		throw "Func param only accepts 'get' or 'save'";
	}
}
function findVisCodes(arr) {
	var stnArr = __spreadArray([], arr, true);
	var visArr = [];
	for (var _i = 0, stnArr_1 = stnArr; _i < stnArr_1.length; _i++) {
		var stn = stnArr_1[_i];
		visArr.push(stations[stn]);
	}
	return visArr;
}
function addStnsToMap(stns) {
	var s = [];
	if (typeof stns === 'string') {
		s.push(stns);
	} else {
		s.push.apply(s, stns);
	}
	s.sort();
	s.forEach(function (v) {
		$('[id*="'.concat(stations[v], '-dash"]')).addClass('visible');
		$('[id*="'.concat(stations[v], '-label"]')).addClass('visible');
		$('[id*="IC_'.concat(stations[v], '"]')).addClass('visible');
	});
}
function updateLineSegs() {
	var stnCodes = findVisCodes(usrData('get', 'stations'));
	var data = {
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
		OSI: 0,
	};
	var _loop_1 = function (l) {
		var lineObj = lines[l];
		if (lineObj['branch']) {
			// Check if top branches are active.
			function top() {
				var active = false;
				lineObj['top'].forEach(function (a) {
					a.forEach(function (s) {
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
				var active = false;
				lineObj['bottom'].forEach(function (a) {
					a.forEach(function (s) {
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
			function complete(top, bottom) {
				// If the top and bottom branches are active then go from the the first visited station of the top branches in those arrays to the last station, then from the first station of the bottom branches to the last visited station.
				if (top && bottom) {
					var total_1 = 0;
					lineObj['top'].forEach(function (e) {
						var first = 100;
						e.forEach(function (a) {
							var index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total_1++;
								if (index <= first) {
									first = index;
								}
							}
						});
						for (var i = first; i < e.length; i++) {
							$(
								'#lul-'
									.concat(lineObj['line'], '_')
									.concat(e[i], '-')
									.concat(e[i + 1])
							).addClass('visible');
						}
					});
					lineObj['bottom'].forEach(function (e) {
						var last = 0;
						e.forEach(function (a) {
							var index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total_1++;
								if (index >= last) {
									last = index;
								}
							}
						});
						for (var i = 0; i < last; i++) {
							$(
								'#lul-'
									.concat(lineObj['line'], '_')
									.concat(e[i], '-')
									.concat(e[i + 1])
							).addClass('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total_1;
				} else if (top) {
					var total_2 = 0;
					lineObj['top'].forEach(function (e) {
						var first = 100,
							last = 0;
						e.forEach(function (a) {
							var index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total_2++;
								if (index <= first) {
									first = index;
								} else if (index >= last) {
									last = index;
								} else {
									// Error!
								}
							}
						});
						for (var i = first; i < last; i++) {
							$(
								'#lul-'
									.concat(lineObj['line'], '_')
									.concat(e[i], '-')
									.concat(e[i + 1])
							).addClass('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total_2;
				} else if (bottom) {
					var total_3 = 0;
					lineObj['bottom'].forEach(function (e) {
						var first = 100,
							last = 0;
						e.forEach(function (a) {
							var index = e.indexOf(a);
							if (stnCodes.includes(a)) {
								total_3++;
								if (index <= first) {
									first = index;
								} else if (index >= last) {
									last = index;
								} else {
									// Error!
								}
							}
						});
						for (var i = first; i < last; i++) {
							$(
								'#lul-'
									.concat(lineObj['line'], '_')
									.concat(e[i], '-')
									.concat(e[i + 1])
							).addClass('visible');
						}
					});
					data[lineObj['line']] = data[lineObj['line']] + total_3;
				}
			}
			complete(top(), bottom());
		} else {
			var lineArr_1 = lineObj['stations'];
			var first_1 = 100,
				last_1 = 0,
				total_4 = 0;
			lineArr_1.forEach(function (a) {
				var index = lineArr_1.indexOf(a);
				if (stnCodes.includes(a)) {
					total_4++;
					if (index < first_1) {
						first_1 = index;
					} else if (index > last_1) {
						last_1 = index;
					} else {
						// Error!
					}
				}
			});
			for (var i = first_1; i < last_1; i++) {
				$(
					'#lul-'
						.concat(lineObj['line'], '_')
						.concat(lineArr_1[i], '-')
						.concat(lineArr_1[i + 1])
				).addClass('visible');
			}
			data[lineObj['line']] = data[lineObj['line']] + total_4;
		}
	};
	for (var l in lines) {
		_loop_1(l);
	}
	updateStats(data);
}
function updateStats(data) {
	var totals = {
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
	};
	for (var l in totals) {
		var percent = void 0,
			visited = void 0;
		if (data[l] === NaN) {
			$('progress#'.concat(l)).attr('value', 0);
		} else {
			var total = totals[l];
			visited = data[l];
			percent = Math.floor((visited / total) * 100);
			console.log(l, percent);
		}
		$('progress#'.concat(l)).attr('value', percent);
	}
}
function readFile(file) {
	var reader = new FileReader();
	reader.readAsText(file, 'UTF-8');
	// reader.onprogress = updateProgress;
	reader.onload = function (evt) {
		var fileString = evt.target.result;
		var CSVarr = CSVtoArray(fileString);
		loadData(CSVarr);
	};
	reader.onerror = function (err) {
		console.error(err);
	};
}
function loadData(arr) {
	var stations = [],
		busses = [];
	for (var a in arr) {
		var journey = arr[a][3];
		if (journey == undefined) continue;
		if (journey.toLowerCase().indexOf('bus') !== -1) {
			var bus = journey.split('route ')[1];
			if (!busses.includes(bus)) {
				busses.push(bus);
			}
		} else if (journey.toLowerCase().indexOf(' to ') !== -1) {
			var j = journey.split(' to ');
			var s = j.map(function (d) {
				var regEx = /( \[.*\])|( DLR)|( tram stop)|(\[No touch-out\])/;
				return d.replace(regEx, '');
			});
			for (var i in s) {
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
		console.error('loadData(): '.concat(e));
	} finally {
		updateLineSegs();
	}
}
function CSVtoArray(strData, strDelimiter) {
	if (strDelimiter === void 0) {
		strDelimiter = ',';
	}
	// https://gist.github.com/luishdez/644215
	strDelimiter = strDelimiter || ',';
	var objPattern = new RegExp(
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
	var arrData = [[]];
	var arrMatches = null;
	while ((arrMatches = objPattern.exec(strData))) {
		var strMatchedDelimiter = arrMatches[1];
		if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
			arrData.push([]);
		}
		if (arrMatches[2]) {
			var strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
		} else {
			var strMatchedValue = arrMatches[3];
		}
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	return arrData;
}
function dragOverHandler(e) {
	e.preventDefault();
	$('body').toggleClass('dragOver');
}
function dropHandler(e) {
	e.preventDefault();
	$('body').toggleClass('dragOver');
	var file = e.dataTransfer.items[0].getAsFile();
	readFile(file);
}
function uploadHandler(e) {
	$('#fileSelect').click();
	$('#fileSelect').on('change', function () {
		var fileEl = document.getElementById('fileSelect');
		var file = fileEl === null || fileEl === void 0 ? void 0 : fileEl.files[0];
		readFile(file);
	});
}
