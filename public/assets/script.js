// User data and file storage

function getUsrData() {
  if (storageAvailable("localStorage")) {
    if (localStorage.getItem("stations") != null) {
      const usrStations = JSON.parse(localStorage.getItem("stations"));
      mapSetup(usrStations);
    } else {
      // TODO: Assume first visit. Show welcome pop-up.
    }
  } else {
    // TODO: Display error that localstorage isn't available.
    alert(
      "Sorry, local storage isn't available in your browser. That means we can't save the data you upload."
    );
  }
}

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function updateUsrData() {}

// Map update

function mapSetup(stns) {
  stns.sort();
  let visCodes = [];
  stns.forEach((val, i) => {
    $(`[id*="${stations[val]}-dash"]`).addClass("visible");
    $(`[id*="${stations[val]}-label"]`).addClass("visible");
    visCodes.push(stations[val]);
  });
  lineSegs(visCodes);
}

function lineSegs(vis) {
  vis = vis
    .filter((el, i, self) => {
      return i === self.indexOf(el);
    })
    .filter((el) => {
      return el !== "dash";
    });
  let end1Index = 100,
    end2Index = 0;
  let end1, end2;
  let between = [];
  for (a in lines) {
    lines[a].forEach((s, i) => {
      if (vis.includes(s)) {
        if (end1Index >= i) {
          end1Index = i;
          end1 = s;
        } else if (end2Index <= i) {
          end2Index = i;
          end2 = s;
        } else {
          console.log("idk");
        }
      } else {
        // Not visited.
      }
    });
    for (let f = end1Index; f <= end2Index; f++) {
      between.push(lines[a][f]);
    }
    between.forEach((s, i) => {
      if (i + 1 === undefined) return;
      $(`#lul-${a}_${s}-${between[i + 1]}`).animate({ opacity: "1" });
    });
  }
}

// Upload and handle CSVs

function readFile(file) {
  const reader = new FileReader();

  reader.readAsText(file, "UTF-8");

  // reader.onprogress = updateProgress;
  reader.onload = (evt) => {
    const fileString = evt.target.result;
    const CSVarr = CSVtoArray(fileString);
    loadData(CSVarr);
  };

  reader.onerror = (err) => {
    console.error(err);
  };
}

function loadData(arr) {
  let stations = [];
  for (a in arr) {
    const journey = arr[a][3];
    // FIXME: Logical & may have some issues. Double check.
    if (
      journey != undefined &&
      journey != "Journey/Action" &&
      journey.toLowerCase().indexOf("bus") === -1 &&
      journey != "Topped up" &&
      journey.toLowerCase().indexOf("topped up") === -1 &&
      journey.toLowerCase().indexOf("topped-up") === -1 &&
      journey != "[No touch-out]"
    ) {
      const j = journey.split(" to ");
      for (i in j) {
        if (stations.includes(j[i]) == false) {
          stations.push(j[i]);
        }
      }
    }
  }
  // TODO: Move data to updateMap function.
  for (s in stations) {
    if (!userStations["stations"].includes(stations[s])) {
      userStations["stations"].push(stations[s]);
    }
  }
}

function CSVtoArray(strData, strDelimiter) {
  // https://gist.github.com/luishdez/644215
  strDelimiter = strDelimiter || ",";
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );

  var arrData = [[]];
  var arrMatches = null;

  while ((arrMatches = objPattern.exec(strData))) {
    var strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
      arrData.push([]);
    }

    if (arrMatches[2]) {
      var strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      var strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  return arrData;
}

function dragOverHandler(e) {
  e.preventDefault();
  $("#upload-popup").toggleClass("dragOver");
}

function dropHandler(e) {
  e.preventDefault();
  $("#upload-popup").toggleClass("dragOver");
  const file = e.dataTransfer.items[0].getAsFile();
  readFile(file);
}

function uploadHandler(e) {
  $("#fileSelect").click();
  $("#fileSelect").on("change", () => {
    const file = document.getElementById("fileSelect").files[0];
    readFile(file);
  });
}

function addStation(st) {
  // TODO: Deal with.
}
