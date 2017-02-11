//Pulling in fusion tables data as JSON
let fusionTablesData = {};


document.addEventListener('DOMContentLoaded', initialize() );

//Useful function if using the other approach, i.e. initiating http request from the DOM.
function handler(response) {
      for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];

        console.log(item);
        // Either show the body or the automatic columns of the template
        // if (item.body) {
        //   document.getElementById("content").innerHTML += "<br>" + item.body;
        // } else {
        //   for (var j = 0; j < item.automaticColumnNames.length; j++) {
        //     document.getElementById("content").innerHTML += "<br>" + item.automaticColumnNames[j];
        //   }
        // }
      }
    }

var map, layer;
var markers = [];
var infoWindows = [];
var buttons = [];




function createMapData(data){
	fusionTablesData = JSON.parse(data);
	for (var i = 0; i < fusionTablesData.rows.length; i++) {
    	//Fusion tables seems to like to store lng as a string; convert it to a number.
    	fusionTablesData.rows[i][3] = (fusionTablesData.rows[i][3] * 1);
    	console.log(fusionTablesData.rows[i]);

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

		  console.log(infoWindow);

		  infoWindows.push(infoWindow);

		  console.log(infoWindows);

	      markers.push(marker);
	      marker.setMap(map);
	      console.log(i);

	     if (i === fusionTablesData.rows.length -1){
	      var loadingDiv = document.getElementById("loading");
			loadingDiv.parentNode.removeChild(loadingDiv);
			}

	      var button = document.createElement("button"); 
	      button.setAttribute('content', 'test content');
			button.setAttribute('class', 'btn');
            button.setAttribute('data-index', i);
			button.innerHTML = fusionTablesData.rows[i][0] ;

		  // add the newly created element and its content into the DOM 
		  var currentDiv = document.getElementById("buttons-to-show-infowindows"); 
		  currentDiv.appendChild(button); 

		  buttons.push(button);


		   bindInfoWindow(i);

				
    }

    //bindInfoWindows();
};

//Bind Marker Click Events (to load infowindows)

function bindInfoWindow(index){
	markers[index].addListener('click', function() {
		infoWindows[index].open(map, markers[index]);
	});



	buttons[index].addEventListener('click', function() {

			for (var i = 0; i < infoWindows.length; i++) {
				if(i !== index){
					infoWindows[i].close();
				}
			}

			infoWindows[index].open(map, markers[index]);
		
		});




}

//This approach did not work.
function bindInfoWindows(){

	console.log(infoWindows);

	for (var i = 0; i < markers.length; i++) {
		markers[i].addListener('click', function() {
		    infoWindows[i].open(map, markers[i]);
		  });
	}

};


function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        	callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function initialize(){
	//Work:
	//httpGetAsync('https://www.googleapis.com/fusiontables/v2/tables/18Ztvs8DzqUTV7PlhcrN9TdzZOIPelimMmgPGYqk/columns?key=AIzaSyAOHCSB4J7eajweITpKLTTpwfv3z_3Orl8');
	//httpGetAsync('https://www.googleapis.com/fusiontables/v2/tables/18Ztvs8DzqUTV7PlhcrN9TdzZOIPelimMmgPGYqk/?key=AIzaSyAOHCSB4J7eajweITpKLTTpwfv3z_3Orl8');

	httpGetAsync('https://www.googleapis.com/fusiontables/v2/query?sql=SELECT * FROM 17vgwhmIf7ILHyHmsYVdzWNbxg_eeV71W0o8aFTbn&key=AIzaSyAOHCSB4J7eajweITpKLTTpwfv3z_3Orl8', createMapData);
	//Don't work:
	//httpGetAsync('https://www.googleapis.com/fusiontables/v2/query?sql=SELECT ROWID FROM 1e7y6mtqv891111111111_aaaaaaaaa_CvWhg9gc');

	

	 map = new google.maps.Map(document.getElementById('map_canvas'), {
    	center: new google.maps.LatLng(53.7996388, -1.5491221),
    	zoom: 9,
    	streetViewControl: false,
    	panControl: false,
    	zoomControl: true
   	});



}


function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

function hideMarker(markerNumber){
	console.log("I will hide marker " + markerNumber);
	markerToHide = markers[markerNumber];
	markerToHide.setMap(null);
    //document.querySelectorAll('[data-index=\"'+markerNumber+'\"]').style.display = 'none';
}

function addMarker(markerNumber){
	console.log("I will show marker " + markerNumber);
	markerToAdd = markers[markerNumber];
	markerToAdd.setMap(map);
    //document.querySelectorAll('[data-index="'+markerNumber+'"]').style.display = 'block';

}




//The filter

//This is very rudimentary, because it'll probably run into issues when things have multiple categories.

//A better version might push/pull filter values into an array, and then fire a sweep through that array.


var filterButton = document.getElementsByClassName("filter-button");
//Bind click events to filter buttons
for (var i = 0; i < filterButton.length; i++) {
    filterButton[i].addEventListener('click', filterAction, false);
}

function filterAction() {

	//Check its value
    var filterValue = this.getAttribute("value").toLowerCase();

    if(this.checked){

    	console.log('filter was checked');

    	for (var i = 0; i < fusionTablesData.rows.length; i++) {

    		if(fusionTablesData.rows[i][1].toLowerCase() == filterValue){
    			addMarker([i]);
                //addButton([i]);
    			}
    		}
		}

    else {
    	console.log('filter was unchecked');
    	for (var i = 0; i < fusionTablesData.rows.length; i++) {

    		if(fusionTablesData.rows[i][1].toLowerCase() == filterValue){
    			hideMarker([i]);
                //hideButton([i]);
    			}
    		}
    }
    console.log(filterValue);

};






//hide markers outside a range

var myLat = 53.7996388;
var myLng = -1.5491221;

//draw a circle

// var cityCircle = new google.maps.Circle({
//             strokeColor: '#FF0000',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#FF0000',
//             fillOpacity: 0.35,
//             map: map,
//             center: {lat: myLat, lng: myLng},
//             radius: 1500
//           });



            google.maps.event.addListener(map, 'click', function(event) {    	
                console.log(google.maps.geometry.poly.containsLocation(event.latLng, cityCircle));

    });







//find closest to where you click:




//Un-comment following line to enable:
//google.maps.event.addListener(map, 'click', find_closest_marker);
function rad(x) {return x*Math.PI/180;}
function find_closest_marker( event ) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for( i=0;i<markers.length; i++ ) {
        var mlat = markers[i].position.lat();
        var mlng = markers[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }

    alert(markers[closest].title);
}







//Search/Filter thing
var searchInput = document.querySelector('.search');
var suggestions = document.querySelector('.suggestions');

function displayMatches() {
  const matchArray = findMatches(this.value, fusionTablesData.rows);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const placeName = fusionTablesData.rows[0].replace(regex, `<span class="hl">${this.value}</span>`);
    return `
      <li>
        <span class="name">${placeName}</span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

function findMatches(wordToMatch, cities) {
  return fusionTablesData.rows.filter(place => {
    // here we need to figure out if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    return fusionTablesData.rows.match(regex) || fusionTablesData.rows.match(regex)
  });
}1

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);





//google.maps.visualRefresh = true;
function binitialize() {
 map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(53.7996388, -1.5491221),
    zoom: 11,
    streetViewControl: false,
    panControl: false,
    zoomControl: true
   

});
    
    layer = new google.maps.FusionTablesLayer({
        query: {
            select: 'location',
            from: tableid
        },
        map: map
    });
    
     layer2 = new google.maps.FusionTablesLayer({
        query: {
            select: 'location',
            from: tableid
        },
        map: map
    });
    
     layer3 = new google.maps.FusionTablesLayer({
        query: {
            select: 'location',
            from: tableid
        },
        map: map
    });
    
    layer4 = new google.maps.FusionTablesLayer({
        query: {
            select: 'location',
            from: tableid
        },
        map: map
    });
    
     layer5 = new google.maps.FusionTablesLayer({
        query: {
            select: 'location',
            from: tableid
        },
        map: map
    });    
}


//Needs updating/replacing.
function filterData() {
    var filter = [];
    var stores = document.getElementsByName('store');
    for (var i = 0, store; store = stores[i]; i++) {
        if (store.checked) {
            filter.push('\'' + store.value + '\'');
        }
    }

    if (filter.length) {
        if (!layer.getMap()) {
            layer.setMap(map);
            layer2.setMap(map);
            layer3.setMap(map);
            layer4.setMap(map);
            layer5.setMap(map);

        }
        
        layer.setOptions({
            query: {
                select: 'location',
                from: tableid,
                where: '\'Genre\' IN (' + filter.join(',') + ')'
            }
        });



layer2.setOptions({
            query: {
                select: 'location',
                from: tableid,
                where: '\'Genreb\' IN (' + filter.join(',') + ')'
            }
        });
        
layer3.setOptions({
            query: {
                select: 'location',
                from: tableid,
                where: '\'Genrec\' IN (' + filter.join(',') + ')'
            }
        });
        
layer4.setOptions({
            query: {
                select: 'location',
                from: tableid,
                where: '\'Genred\' IN (' + filter.join(',') + ')'
            }
        });
        
layer5.setOptions({
            query: {
                select: 'location',
                from: tableid,
                where: '\'Genree\' IN (' + filter.join(',') + ')'
            }
        });                
        
        
    } else {
        layer.setMap(null);
        layer2.setMap(null);
        layer3.setMap(null);
        layer4.setMap(null);
        layer5.setMap(null);
    }
}



