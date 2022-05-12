let panInst: any;
const mapEl = document.getElementById('map') as HTMLDivElement;

function storageAvailable(type: any) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
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
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			storage &&
			storage.length !== 0
		);
	}
}

function loadMapData() {
	try {
		if (!storageAvailable('localStorage')) {
			throw 'No localStorage available';
		}
	} catch (e) {
		alert("Sorry, local storage isn't available in your browser. That means we can't save the data you upload.");
	} finally {
		if (localStorage.getItem('stations') !== null) {
			document.getElementById('js-welcome')!.style.display = 'none';
			addStnsToMap(usrData('get', 'stations'));
			updateLineSegs();
		} else {
			document.getElementById('js-footer')?.classList.toggle('aside-active');
			document.getElementById('js-aside')?.classList.toggle('aside-out');
		}
	}
}

function loadMap() {
	fetch('./assets/map.svg')
		.then((res) => res.text())
		.then((data) => {
			mapEl.innerHTML = data;
			const elem = document.getElementById('status-map') as HTMLDivElement;
			setTimeout(() => {
				elem.style.opacity = '1';
			}, 500);
			// @ts-ignore
			panInst = panzoom(elem, {
				filterKey: () => {
					return true;
				},
				autoCenter: true,
				maxZoom: 4,
				minZoom: 1,
				initialX: 300,
				initialY: 500,
				initialZoom: 1.5,
				bounds: true,
				boundsPadding: 0.4,
			});
			setTimeout(() => {
				loadMapData();
			}, 1500);
		});
}

document.onreadystatechange = (e) => {
	if (document.readyState === 'complete') {
		loadMap();
	}
};

window.onkeyup = (e: any) => {
	if (e.key === '/' || e.keyCode === 191) {
		document.getElementById('js-stnInput')?.focus();
	}
};

$('#js-menu').on('click', () => {
	document.getElementById('js-footer')?.classList.toggle('aside-active');
	document.getElementById('js-aside')?.classList.toggle('aside-out');
});

$('.js-stn-input').on('keyup', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) {
		const stn = (<HTMLInputElement>document.getElementById('js-stnInput')).value;
		if (newStation(stn)) {
			document.getElementById('js-stnInput')?.classList.add('confirm-animate');
		}
	}
});

function newStation(input: string) {
	addStnsToMap(input);
	usrData('save', 'stations', input);
	updateLineSegs();
	return true;
}

// @ts-ignore
const autoCompleteJS = new autoComplete({
	selector: '#js-stnInput',
	wrapper: true,
	threshold: 2,
	data: {
		src: [
			'Abbey Road',
			'Acton Central',
			'Acton Mainline',
			'Acton Town',
			'Addiscombe',
			'Addington Village',
			'Aldgate',
			'Aldgate East',
			'All Saints',
			'Alperton',
			'Amersham',
			'Ampere Way',
			'Anerley',
			'Angel',
			'Archway',
			'Arena',
			'Arnos Grove',
			'Arsenal',
			'Avenue Road',
			'Baker Street',
			'Balham',
			'Bank',
			'Barbican',
			'Barking',
			'Barkingside',
			'Barons Court',
			'Battersea Power Station',
			'Bayswater',
			'Beckenham Junction',
			'Beckenham Road',
			'Beckton',
			'Beckton Park',
			'Becontree',
			'Beddington Lane',
			'Belgrave Walk',
			'Belsize Park',
			'Bermondsey',
			'Bethnal Green',
			'Birkbeck',
			'Blackfriars',
			'Blackhorse Road',
			'Blackhorse Lane',
			'Blackwall',
			'Bond Street',
			'Borough',
			'Boston Manor',
			'Bounds Green',
			'Bow Church',
			'Bow Road',
			'Brent Cross',
			'Brixton',
			'Brockley',
			'Bromley by Bow',
			'Brondesbury',
			'Brondesbury Park',
			'Brentwood',
			'Bruce Grove',
			'Buckhurst Hill',
			'Burnham',
			'Burnt Oak',
			'Bush Hill Park',
			'Bushey',
			'Caledonian Road',
			'Caledonian Road &amp; Barnsbury',
			'Cambridge Heath',
			'Camden Road',
			'Camden Town',
			'Canada Water',
			'Canary Wharf',
			'Canning Town',
			'Cannon Street',
			'Canonbury',
			'Canons Park',
			'Carpenders Park',
			'Centrale',
			'Chadwell Heath',
			'Chalfont &amp; Latimer',
			'Chalk Farm',
			'Chancery Lane',
			'Charing Cross',
			'Chesham',
			'Chesnut',
			'Chigwell',
			'Chingford',
			'Chiswick Park',
			'Chorleywood',
			'Church Stret',
			'Clapham Common',
			'Clapham High Steet',
			'Clapham Junction',
			'Clapham North',
			'Clapham South',
			'Clapton',
			'Cockfosters',
			'Colindale',
			'Colliers Wood',
			'Coombe Lane',
			'Covent Garden',
			'Crossharbour',
			'Crouch Hill',
			'Croxley',
			'Crystal Palace',
			'Custom House for ExCeL',
			'Cutty Sark for Maritime Greenwich',
			'Cyprus',
			'Dagenham East',
			'Dagenham Heathway',
			'Dalston Junction',
			'Dalston Kingsland',
			'Debden',
			'Denmark Hill',
			'Deptford Bridge',
			'Devons Road',
			'Dollis Hill',
			'Dundonald Road',
			'Ealing Broadway',
			'Ealing Common',
			"Earl's Court",
			'East Acton',
			'East Croydon',
			'East Finchley',
			'East Ham',
			'East India',
			'East Putney',
			'Eastcote',
			'Edgware',
			'Edgware Road (Bakerloo line)',
			'Edgware Road (District, Circle, H&amp;C lines)',
			'Edmonton Green',
			'Elephant &amp; Castle',
			'Elmers End',
			'Elm Park',
			'Elverson Road',
			'Embankment',
			'Emerson Park',
			'Emirates Greenwich Peninsula',
			'Emirates Royal Docks',
			'Enfield Town',
			'Epping',
			'Euston',
			'Euston Square',
			'Fairlop',
			'Farringdon',
			'Fieldway',
			'Finchley Central',
			'Finchley Road',
			'Finchley Road &amp; Frognal',
			'Finsbury Park',
			'Forest Gate',
			'Forest Hill',
			'Fulham Broadway',
			'Gallions Reach',
			'Gants Hill',
			'George Street',
			'Gidea Park',
			'Gloucester Road',
			'Goldhawk Road',
			'Golders Green',
			'Goodge Street',
			'Goodmayes',
			'Gospel Oak',
			'Grange Hill',
			'Gravel Hill',
			'Great Portland Street',
			'Green Park',
			'Greenford',
			'Greenwich',
			'Gunnersbury',
			'Hackney Central',
			'Hackney Downs',
			'Hackney Wick',
			'Haggerston',
			'Hainault',
			'Hammersmith (Circle, H&amp;C lines)',
			'Hammersmith (District, Piccadilly lines)',
			'Hampstead',
			'Hampstead Heath',
			'Hanger Lane',
			'Hanwell',
			'Harlesden',
			'Harringay Green Lanes',
			'Harrington Road',
			'Harold Wood',
			'Harrow &amp; Wealdstone',
			'Harrow on the Hill',
			'Hatch End',
			'Hatton Cross',
			'Hayes &amp; Harrlington',
			'Headstone Lane',
			'Heathrow Terminal 4',
			'Heathrow Terminal 5',
			'Heathrow Terminals 123',
			'Hendon Central',
			'Heron Quays',
			'Highams Park',
			'High Barnet',
			'High Street Kensington',
			'Highbury &amp; Islington',
			'Highgate',
			'Hillingdon',
			'Holborn',
			'Holland Park',
			'Holloway Road',
			'Homerton',
			'Honor Oak Park',
			'Hornchurch',
			'Hounslow Central',
			'Hounslow East',
			'Hounslow West',
			'Hoxton',
			'Hyde Park Corner',
			'Ickenham',
			'Ilford',
			'Imperial Wharf',
			'Island Gardens',
			'Iver',
			'Kennington',
			'Kensal Green',
			'Kensal Rise',
			'Kensington (Olympia)',
			'Kentish Town',
			'Kentish Town West',
			'Kenton',
			'Kew Gardens',
			'Kilburn',
			'Kilburn Park',
			'Kilburn High Road',
			'King George V',
			'King Henrys Drive',
			'Kings Cross St Pancras',
			'Kings Cross St. Pancras',
			'Kingsbury',
			'Knightsbridge',
			'Ladbroke Grove',
			'Lambeth North',
			'Lancaster Gate',
			'Langley',
			'Langdon Park',
			'Latimer Road',
			'Lebanon Road',
			'Leicester Square',
			'Lewisham',
			'Leyton',
			'Leyton Midland Road',
			'Leytonstone',
			'Leytonstone High Road',
			'Limehouse',
			'Liverpool Street',
			'Lloyd Park',
			'London Bridge',
			'London City Airport',
			'London Fields',
			'Loughton',
			'Maida Vale',
			'Maidenhead',
			'Manor House',
			'Manor Park',
			'Mansion House',
			'Marble Arch',
			'Maryland',
			'Marylebone',
			'Merton Park',
			'Mile End',
			'Mill Hill East',
			'Mitcham',
			'Mitcham Junction',
			'Monument',
			'Moor Park',
			'Moorgate',
			'Morden',
			'Morden Road',
			'Mornington Crescent',
			'Mudchute',
			'Neasden',
			'Newbury Park',
			'New Addington',
			'New Cross',
			'New Cross Gate',
			'Nine Elms',
			'North Acton',
			'North Ealing',
			'North Greenwich',
			'North Harrow',
			'North Wembley',
			'Northfields',
			'Northolt',
			'Northwick Park',
			'Northwood',
			'Northwood Hills',
			'Norwood Junction',
			'Notting Hill Gate',
			'Oakwood',
			'Old Street',
			'Osterley',
			'Oval',
			'Oxford Circus',
			'Paddington',
			'Park Royal',
			'Parsons Green',
			'Peckham Rye',
			'Penge West',
			'Perivale',
			'Phipps Bridge',
			'Piccadilly Circus',
			'Pimlico',
			'Pinner',
			'Plaistow',
			'Pontoon Dock',
			'Poplar',
			'Preston Road',
			'Prince Regent',
			'Pudding Mill Lane',
			'Putney Bridge',
			"Queen's Park",
			"Queen's Road Peckham",
			'Queensbury',
			'Queensway',
			'Ravenscourt Park',
			'Rayners Lane',
			'Reading',
			'Rectory Road',
			'Redbridge',
			'Reeves Corner',
			"Regent's Park",
			'Richmond',
			'Rickmansworth',
			'Roding Valley',
			'Rotherhithe',
			'Romford',
			'Royal Albert',
			'Royal Oak',
			'Royal Victoria',
			'Ruislip',
			'Ruislip Gardens',
			'Ruislip Manor',
			'Russell Square',
			'Sandilands',
			'Seven Kings',
			'Seven Sisters',
			'Shadwell',
			'Shenfield',
			"Shepherd's Bush",
			"Shepherd's Bush (Central line)",
			"Shepherd's Bush Market",
			'Shoreditch High Street',
			'Silver Street',
			'Sloane Square',
			'Slough',
			'Snaresbrook',
			'South Acton',
			'South Ealing',
			'South Harrow',
			'South Hampstead',
			'South Kensington',
			'South Kenton',
			'South Tottenham',
			'South Quay',
			'South Ruislip',
			'South Wimbledon',
			'South Woodford',
			'Southall',
			'Southbury',
			'Southfields',
			'Southgate',
			'Southwark',
			"St John's Wood",
			"St Paul's",
			"St James' Park",
			"St James' Street",
			'Stamford Brook',
			'Stamford Hill',
			'Stanmore',
			'Star Lane',
			'Stepney Green',
			'Stockwell',
			'Stoke Newington',
			'Stonebridge Park',
			'Stratford',
			'Stratford High Street',
			'Stratford International',
			'Sudbury Hill',
			'Sudbury Town',
			'Surrey Quays',
			'Swiss Cottage',
			'Sydenham',
			'Taplow',
			'Temple',
			'Theobalds Grove',
			'Therapia Lane',
			'Theydon Bois',
			'Tooting Bec',
			'Tooting Broadway',
			'Tottenham Court Road',
			'Tottenham Hale',
			'Totteridge &amp; Whetstone',
			'Tower Gateway',
			'Tower Hill',
			'Tufnell Park',
			'Turkey Street',
			'Turnham Green',
			'Turnpike Lane',
			'Twyford',
			'Upminster',
			'Upminster Bridge',
			'Upney',
			'Upper Holloway',
			'Upton Park',
			'Uxbridge',
			'Vauxhall',
			'Victoria',
			'Waddon Marsh',
			'Walthamstow Central',
			"Walthamstow Queen's Road",
			'Wandle Park',
			'Wandsworth Road',
			'Wanstead',
			'Wantead Park',
			'Wapping',
			'Warren Street',
			'Warwick Avenue',
			'Waterloo',
			'Watford',
			'Watford High Street',
			'Watford Junction',
			'Wellesley Road',
			'Wembley Central',
			'Wembley Park',
			'Westbourne Park',
			'West Acton',
			'West Brompton',
			'West Croydon',
			'West Drayton',
			'West Ealing',
			'West Finchley',
			'West Ham',
			'West Hampstead',
			'West Harrow',
			'West India Quay',
			'West Kensington',
			'West Ruislip',
			'West Silvertown',
			'Westferry',
			'Westminster',
			'White City',
			'Whitechapel',
			'White Heart Lane',
			'Willesden Green',
			'Willesden Junction',
			'Wimbledon',
			'Wimbledon Park',
			'Wood Green',
			'Woodford',
			'Woodgrange Park',
			'Wood Lane',
			'Woodside',
			'Woodside Park',
			'Wood Street',
			'Woolwich Arsenal',
		],
		cache: true,
	},
	resultItem: {
		highlight: true,
		id: 'resultItem',
	},
	resultsList: {
		id: 'resultList',
		position: 'afterbegin',
		maxResults: 3,
		tabSelect: true,
		element: (list: any, data: any) => {
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
			selection: (event: any) => {
				const selection = event.detail.selection.value;
				autoCompleteJS.input.value = selection;
			},
		},
	},
});