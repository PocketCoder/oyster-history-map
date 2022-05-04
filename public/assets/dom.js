let panInst;

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

$(document).ready(() => {
  let isMobile = false;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substring(0, 4))) {
    isMobile = true;
  }

  if (isMobile) {
    $('body').addClass('mobile');
  }

  /*
  const upH = $('#upload').height();
  const upW = $('#upload').width();
  const upHeadH = $('#upload--header').height();
  const upHeadW = $('#upload--header').width();
  console.log(`${upH}, ${upW}; ${upHeadH}, ${upHeadW}`);
  const bottom = -upH + upHeadH;
  const left = -upW + upHeadW;
  $('#upload').css({
    bottom: bottom,
    left: left
  });*/

  $('#map').load('./assets/map.svg', () => {
    const elem = document.getElementById('status-map');
    panInst = panzoom(elem, {
      filterKey: function(/* e, dx, dy, dz */) {
        // don't let panInst handle this event:
        return true;
      },
      maxZoom: 7,
      initialX: 300,
      initialY: 500,
      initialZoom: 1.5,
      contain: true,
      animate: true,
      bounds: true,
      boundsPadding: 0.4,
      handleStartEvent: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
    });
    
    try {

      if (!storageAvailable('localStorage')) {
        throw 'No localStorage available'
      }
    } catch (e) {
      alert(
        "Sorry, local storage isn't available in your browser. That means we can't save the data you upload."
      );
    } finally {
      if (localStorage.getItem('stations') !== null) {
        $('#welcome').css('display', 'none');
        addStnsToMap(usrData('get', 'stations'));
        updateLineSegs();
      }
    }
  });
});

/*
function centreOn(stn) {
  let x, y;
  const wC = $(window).height() / 2;
  const hC = $(window).width() / 2;
  try {
    x = document.querySelector(`[id*="IC_${stations[stn]}"]`).getBoundingClientRect().x;
    y = document.querySelector(`[id*="IC_${stations[stn]}"]`).getBoundingClientRect().y;
  } catch (e) {
    console.error(e);
  }
  const diffX = wC - x;
  const diffY = hC - y;
  console.log(`x: ${x}, y: ${y}; hC: ${hC}, wC: ${wC}; diffX: ${diffX}, diffY: ${diffY}`);
  panInst.pan(diffX, diffY, {
    relative: true
  });
}*/

$(window).on('keyup', (e) => {
  if (e.key === '/' || e.keyCode === 191) {
    if (!$('aside').hasClass('aside-out')) {
      $('aside').addClass('aside-out');
    }
    $('#stationInput').focus();
  }
});

$('#menu-icon').click(() => {
  $('aside').toggleClass('aside-out');
  /*
  if ($('aside').css('left') !== '0') {
    panInst.setOptions({
      'disablePan': true,
      'disableZoom': true
    });
  } else {
    panInst.setOptions({
      'disablePan': false,
      'disableZoom': false
    });
  }*/
});

$('#stationInput').on('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    if (newStation($('#stationInput').val())) {
      $('#stationInput').addClass('confirm-animate');
    }
  }
});

function newStation(input) {
  addStnsToMap(input);
  usrData('save', 'stations', input);
  updateLineSegs(input);
  return true;
}

const autoCompleteJS = new autoComplete({
  selector: '#stationInput',
  wrapper: true,
  threshold: 2,
  data: {
    src: ["Abbey Road", "Acton Central", "Acton Mainline", "Acton Town", "Addiscombe", "Addington Village", "Aldgate", "Aldgate East", "All Saints", "Alperton", "Amersham", "Ampere Way", "Anerley", "Angel", "Archway", "Arena", "Arnos Grove", "Arsenal", "Avenue Road", "Baker Street", "Balham", "Bank", "Barbican", "Barking", "Barkingside", "Barons Court", "Battersea Power Station", "Bayswater", "Beckenham Junction", "Beckenham Road", "Beckton", "Beckton Park", "Becontree", "Beddington Lane", "Belgrave Walk", "Belsize Park", "Bermondsey", "Bethnal Green", "Birkbeck", "Blackfriars", "Blackhorse Road", "Blackhorse Lane", "Blackwall", "Bond Street", "Borough", "Boston Manor", "Bounds Green", "Bow Church", "Bow Road", "Brent Cross", "Brixton", "Brockley", "Bromley by Bow", "Brondesbury", "Brondesbury Park", "Brentwood", "Bruce Grove", "Buckhurst Hill", "Burnham", "Burnt Oak", "Bush Hill Park", "Bushey", "Caledonian Road", "Caledonian Road &amp; Barnsbury", "Cambridge Heath", "Camden Road", "Camden Town", "Canada Water", "Canary Wharf", "Canning Town", "Cannon Street", "Canonbury", "Canons Park", "Carpenders Park", "Centrale", "Chadwell Heath", "Chalfont &amp; Latimer", "Chalk Farm", "Chancery Lane", "Charing Cross", "Chesham", "Chesnut", "Chigwell", "Chingford", "Chiswick Park", "Chorleywood", "Church Stret", "Clapham Common", "Clapham High Steet", "Clapham Junction", "Clapham North", "Clapham South", "Clapton", "Cockfosters", "Colindale", "Colliers Wood", "Coombe Lane", "Covent Garden", "Crossharbour", "Crouch Hill", "Croxley", "Crystal Palace", "Custom House for ExCeL", "Cutty Sark for Maritime Greenwich", "Cyprus", "Dagenham East", "Dagenham Heathway", "Dalston Junction", "Dalston Kingsland", "Debden", "Denmark Hill", "Deptford Bridge", "Devons Road", "Dollis Hill", "Dundonald Road", "Ealing Broadway", "Ealing Common", "Earl's Court", "East Acton", "East Croydon", "East Finchley", "East Ham", "East India", "East Putney", "Eastcote", "Edgware", "Edgware Road (Bakerloo line)", "Edgware Road (District, Circle, H&amp;C lines)", "Edmonton Green", "Elephant &amp; Castle", "Elmers End", "Elm Park", "Elverson Road", "Embankment", "Emerson Park", "Emirates Greenwich Peninsula", "Emirates Royal Docks", "Enfield Town", "Epping", "Euston", "Euston Square", "Fairlop", "Farringdon", "Fieldway", "Finchley Central", "Finchley Road", "Finchley Road &amp; Frognal", "Finsbury Park", "Forest Gate", "Forest Hill", "Fulham Broadway", "Gallions Reach", "Gants Hill", "George Street", "Gidea Park", "Gloucester Road", "Goldhawk Road", "Golders Green", "Goodge Street", "Goodmayes", "Gospel Oak", "Grange Hill", "Gravel Hill", "Great Portland Street", "Green Park", "Greenford", "Greenwich", "Gunnersbury", "Hackney Central", "Hackney Downs", "Hackney Wick", "Haggerston", "Hainault", "Hammersmith (Circle, H&amp;C lines)", "Hammersmith (District, Piccadilly lines)", "Hampstead", "Hampstead Heath", "Hanger Lane", "Hanwell", "Harlesden", "Harringay Green Lanes", "Harrington Road", "Harold Wood", "Harrow &amp; Wealdstone", "Harrow on the Hill", "Hatch End", "Hatton Cross", "Hayes &amp; Harrlington", "Headstone Lane", "Heathrow Terminal 4", "Heathrow Terminal 5", "Heathrow Terminals 123", "Hendon Central", "Heron Quays", "Highams Park", "High Barnet", "High Street Kensington", "Highbury &amp; Islington", "Highgate", "Hillingdon", "Holborn", "Holland Park", "Holloway Road", "Homerton", "Honor Oak Park", "Hornchurch", "Hounslow Central", "Hounslow East", "Hounslow West", "Hoxton", "Hyde Park Corner", "Ickenham", "Ilford", "Imperial Wharf", "Island Gardens", "Iver", "Kennington", "Kensal Green", "Kensal Rise", "Kensington (Olympia)", "Kentish Town", "Kentish Town West", "Kenton", "Kew Gardens", "Kilburn", "Kilburn Park", "Kilburn High Road", "King George V", "King Henrys Drive", "Kings Cross St Pancras", "Kings Cross St. Pancras", "Kingsbury", "Knightsbridge", "Ladbroke Grove", "Lambeth North", "Lancaster Gate", "Langley", "Langdon Park", "Latimer Road", "Lebanon Road", "Leicester Square", "Lewisham", "Leyton", "Leyton Midland Road", "Leytonstone", "Leytonstone High Road", "Limehouse", "Liverpool Street", "Lloyd Park", "London Bridge", "London City Airport", "London Fields", "Loughton", "Maida Vale", "Maidenhead", "Manor House", "Manor Park", "Mansion House", "Marble Arch", "Maryland", "Marylebone", "Merton Park", "Mile End", "Mill Hill East", "Mitcham", "Mitcham Junction", "Monument", "Moor Park", "Moorgate", "Morden", "Morden Road", "Mornington Crescent", "Mudchute", "Neasden", "Newbury Park", "New Addington", "New Cross", "New Cross Gate", "Nine Elms", "North Acton", "North Ealing", "North Greenwich", "North Harrow", "North Wembley", "Northfields", "Northolt", "Northwick Park", "Northwood", "Northwood Hills", "Norwood Junction", "Notting Hill Gate", "Oakwood", "Old Street", "Osterley", "Oval", "Oxford Circus", "Paddington", "Park Royal", "Parsons Green", "Peckham Rye", "Penge West", "Perivale", "Phipps Bridge", "Piccadilly Circus", "Pimlico", "Pinner", "Plaistow", "Pontoon Dock", "Poplar", "Preston Road", "Prince Regent", "Pudding Mill Lane", "Putney Bridge", "Queen's Park", "Queen's Road Peckham", "Queensbury", "Queensway", "Ravenscourt Park", "Rayners Lane", "Reading", "Rectory Road", "Redbridge", "Reeves Corner", "Regent's Park", "Richmond", "Rickmansworth", "Roding Valley", "Rotherhithe", "Romford", "Royal Albert", "Royal Oak", "Royal Victoria", "Ruislip", "Ruislip Gardens", "Ruislip Manor", "Russell Square", "Sandilands", "Seven Kings", "Seven Sisters", "Shadwell", "Shenfield", "Shepherd's Bush", "Shepherd's Bush (Central line)", "Shepherd's Bush Market", "Shoreditch High Street", "Silver Street", "Sloane Square", "Slough", "Snaresbrook", "South Acton", "South Ealing", "South Harrow", "South Hampstead", "South Kensington", "South Kenton", "South Tottenham", "South Quay", "South Ruislip", "South Wimbledon", "South Woodford", "Southall", "Southbury", "Southfields", "Southgate", "Southwark", "St John's Wood", "St Paul's", "St James' Park", "St James' Street", "Stamford Brook", "Stamford Hill", "Stanmore", "Star Lane", "Stepney Green", "Stockwell", "Stoke Newington", "Stonebridge Park", "Stratford", "Stratford High Street", "Stratford International", "Sudbury Hill", "Sudbury Town", "Surrey Quays", "Swiss Cottage", "Sydenham", "Taplow", "Temple", "Theobalds Grove", "Therapia Lane", "Theydon Bois", "Tooting Bec", "Tooting Broadway", "Tottenham Court Road", "Tottenham Hale", "Totteridge &amp; Whetstone", "Tower Gateway", "Tower Hill", "Tufnell Park", "Turkey Street", "Turnham Green", "Turnpike Lane", "Twyford", "Upminster", "Upminster Bridge", "Upney", "Upper Holloway", "Upton Park", "Uxbridge", "Vauxhall", "Victoria", "Waddon Marsh", "Walthamstow Central", "Walthamstow Queen's Road", "Wandle Park", "Wandsworth Road", "Wanstead", "Wantead Park", "Wapping", "Warren Street", "Warwick Avenue", "Waterloo", "Watford", "Watford High Street", "Watford Junction", "Wellesley Road", "Wembley Central", "Wembley Park", "Westbourne Park", "West Acton", "West Brompton", "West Croydon", "West Drayton", "West Ealing", "West Finchley", "West Ham", "West Hampstead", "West Harrow", "West India Quay", "West Kensington", "West Ruislip", "West Silvertown", "Westferry", "Westminster", "White City", "Whitechapel", "White Heart Lane", "Willesden Green", "Willesden Junction", "Wimbledon", "Wimbledon Park", "Wood Green", "Woodford", "Woodgrange Park", "Wood Lane", "Woodside", "Woodside Park", "Wood Street", "Woolwich Arsenal"],
    cache: true
  },
  resultItem: {
    highlight: true,
    id: 'resultItem'
  },
  resultsList: {
    id: 'resultList',
    maxResults: 3,
    tabSelect: true,
    element: (list, data) => {
      if (!data.results.length) {
        const message = document.createElement('div');
        message.setAttribute('class', 'no_result');
        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
        list.prepend(message);
      }
    },
    noResults: true,
  },
  events: {
    input: {
      selection: (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection;
      }
    }
  }
});

document.querySelector('#stationInput').addEventListener('selection', function (event) {
  if (newStation(event.detail.selection.value)) {
    $('#stationInput').addClass('confirm-animate');
    setTimeout(() => {
      $('#stationInput').removeClass('confirm-animate').val('');
    }, 2250);
  }
});