function getUsrData() {
    if (storageAvailable('localStorage')) {
        if (localStorage.getItem('stations') != null) {
            const stations = JSON.parse(localStorage.getItem('stations'));
            // Set up map state.
        } else {
            // Create local storage, or state that it doesn't exist.
        }
    } else {
        // TODO: Display error that localstorage isnt' available
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// Upload and handle of CSV

function uploadButt() {
    const upPop = $('#upload-popup');
    if (upPop.css('opacity') == 0) {
        upPop.toggle();
        upPop.animate({
            opacity: 1
        });
    } else {
        upPop.animate({
            opacity: 0
        }).then(() => {
            upPop.toggle();
        });
    }
}

function dragOverHandler(e) {
    e.preventDefault();
    $('#upload-popup').addClass('dragOver');
}

function dropHandler(e) {
    e.preventDefault();
    $('#upload-popup').addClass('dragOver');

    const file = e.dataTransfer.items[0].getAsFile();
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
    var stations = [];
    for (a in arr) {
        const journey = arr[a][3];
        if (journey != undefined && journey != 'Journey/Action' && journey.toLowerCase().indexOf('bus') === -1 && journey != 'Topped up' && journey.toLowerCase().indexOf('topped up') === -1 && journey.toLowerCase().indexOf('topped-up') === -1 && journey != '[No touch-out]') {
            const j = journey.split(' to ');
            for (i in j) {
                if (stations.includes(j[i]) == false) {
                    stations.push(j[i]);
                }
            }
        }
    }
    console.log(stations);
}

function CSVtoArray(strData, strDelimiter) {
    // https://gist.github.com/luishdez/644215
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    var arrData = [
        []
    ];
    var arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ) {
            arrData.push([]);
        }

        if (arrMatches[2]) {
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            var strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
}