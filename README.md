# Map of Oyster History
Your Oyster history, on an SVG TfL Map

## Set up
### UI
#### Map
- [x] SVG Map of TfL Underground
	- [x] Lines
	- [x] Stations
	- [x] Scrollable/Draggable
		- [ ] Add alert/pop-up if dragging starts without shift key being held
	- [ ] Hidden initially

#### Upload
- [x] Upload button
	- [x] Show/Hide upload box
- [ ] Upload box with drag/drop area
	- [ ] Cross close button
	- [ ] Drag/Drop area with description
	- [ ] Changes colour on success/failiure
- [ ] Page UI Change for drag/drop file on page without warning
	- [ ] Success/Failiure colour change
- [ ] First visit info pop-up

### Frontend
- [ ] On page load, retrieve get user data from localstorage
	- [ ] Create if first visit
- [ ] CSV File handling
	- [ ] CSV to array of unique stations
	- [ ] Compare with user data, append new stations
		- [ ] Save new user data
	- [ ] Update map
		- [ ] New stations are visible
		- [ ] New segments between stations on line are visible

### Backend
- [ ] Express to serve front-end

## Eventually
- [ ] Login for users
- [ ] Save data in database
- [ ] SQL database for history of journeys
- [ ] Hover on line/stations for emphasis and information (number of visits, last visit)
