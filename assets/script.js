$(document).ready(() => {
    const elem = document.getElementById('map-em');
    const panzoom = Panzoom(elem, {
        maxScale: 5
    });
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
    // Intro Zoom In
    setTimeout(() => {
        panzoom.zoom('2', {
            animate: true,
            duration: 500
        })
    }, 750);
});

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