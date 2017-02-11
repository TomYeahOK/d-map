//This is the barebones of the old LAM system.
//Notice how it uses layers, etc.
//The method of detecting what to add to filter is also odd - looks at all checkboxes named 'store' and adds layers.

document.addEventListener('DOMContentLoaded', initialize() );


var map, layer;
var tableid = 2277718;
var zoom = 12;

//google.maps.visualRefresh = true;
function initialize() {
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

var filterButton = document.getElementsByClassName("filter-button");

var myFunction = function() {
    var attribute = this.getAttribute("value");
    console.log(attribute);
};

for (var i = 0; i < filterButton.length; i++) {
    filterButton[i].addEventListener('click', myFunction, false);
}

