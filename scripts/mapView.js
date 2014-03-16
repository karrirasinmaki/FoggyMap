define(["map/leaflet"], function(L) {
    
    var mapWrapper = document.createElement("div");
    mapWrapper.id = "map";
    document.body.appendChild( mapWrapper );
    
    var map = L.map("map", { zoomControl:false }).setView([51.505, -0.09], 17);
    window.map = map;
    
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
        
    var setPosition = function(position) { 
        map.panTo([position.coords.latitude, position.coords.longitude]);
    };
    
    var appendElement = function(element) {
        mapWrapper.appendChild( element );
    };
    
    var addGeoJson = function(json, style) {
        L.geoJson(json, {
            style: style
        }).addTo( map );
    };
    
    var addLayer = function( el ) {
        el.addTo( map );
    };
    var getMap = function() {
        return map;
    };

    return {
        setPosition: setPosition,
        appendElement: appendElement,
        addGeoJson: addGeoJson,
        addLayer: addLayer,
        getMap: getMap
    }
    
});