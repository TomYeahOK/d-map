//Pulling in fusion tables data as JSON
var fusionTablesData = {};

var map, layer;
var markers = [];
var infoWindows = [];
var buttons = [];
var openInfoWindow = null;


document.addEventListener('DOMContentLoaded', initialize() );

//A hardworking function that takes the fusionTablesData, makes sense of it, and sets up the map components.
function createMapData(data){
	fusionTablesData = JSON.parse(data);

    //Cycle through the data
	for (var i = 0; i < fusionTablesData.rows.length; i++) {

    	//Fusion tables seems to like to store lng as a string; convert it to a number.
    	fusionTablesData.rows[i][3] = (fusionTablesData.rows[i][3] * 1);
    	//console.log(fusionTablesData.rows[i]);

    	var latLng = new google.maps.LatLng(fusionTablesData.rows[i][2], fusionTablesData.rows[i][3]);
	      // Creating a marker and putting it on the map

        var marker = new google.maps.Marker({
        position: latLng,
        //animation: google.maps.Animation.DROP,
        title: fusionTablesData.rows[i][0]
        });

        var infoWindow = new google.maps.InfoWindow({
        content: '<ul><li>' + fusionTablesData.rows[i][0] + '</li> <li>' +fusionTablesData.rows[i][1] + '</li></ul>'
        });

        infoWindows.push(infoWindow);
        markers.push(marker);
        marker.setMap(map);
        bindInfoWindow(i);
    }

};


//Bind Marker Click Events (to load infowindows)
function bindInfoWindow(index){

	markers[index].addListener('click', function() {

        if(openInfoWindow !== null){
            infoWindows[openInfoWindow].close();
        }

		infoWindows[index].open(map, markers[index]);
        openInfoWindow = index;
	});

}



function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        	callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}


//Kick things off...
function initialize(){
    var baseURL = 'https://www.googleapis.com/fusiontables/v2/'
    var tableID = '17vgwhmIf7ILHyHmsYVdzWNbxg_eeV71W0o8aFTbn';
    var quay = 'AIzaSyAOHCSB4J7eajweITpKLTTpwfv3z_3Orl8';

	httpGetAsync(baseURL + 'query?sql=SELECT * FROM ' + tableID + '&key=' + quay, createMapData);
	
	 map = new google.maps.Map(document.getElementById('map_canvas'), {
    	center: new google.maps.LatLng(53.7996388, -1.5491221),
    	zoom: 9,
    	streetViewControl: false,
    	panControl: false,
    	zoomControl: true
   	});
}










