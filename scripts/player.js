define(["fogView"], function(fogView) {
    
    var marker = undefined;
    var map = undefined;
    var latLngs = [];
    var pixelPoints = [];
    var points = [];
    var currentPosition = undefined;
    
    var addPoint = function(position) {
        points.push( [position.coords.latitude, position.coords.longitude] );
        localStorage.points = JSON.stringify( points );
    };
    
    var rotateMarker = function(marker, position) {
        var heading = (position.coords.heading || 0) - 45;
        var icon = marker._icon;
        var transform = icon.style.webkitTransform;
        transform += " rotate(" + heading + "deg)";
        icon.style.webkitTransform = transform;
    };
    
    var locationChange = function(position) {
        currentPosition = position;
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var latLng = L.latLng(lat,long);
        
//            map.addLayer( L.circle(latLng, 3) );
//            latLngs.push( latLng );
        marker.setLatLng( latLng );
        rotateMarker( marker, position );
        
        addPoint( position );
        fogView.update( points );
    };
    
    var locationEnabled = function() {
        return navigator.geolocation;
    };
    
    var getLocation = function(callback) {
        if( currentPosition ) return currentPosition;
        if( locationEnabled() ) {
            navigator.geolocation.getCurrentPosition(function(position) {
                locationChange( position );
                callback && callback( position );
            });
        }
    };
    
    var watchLocation = function(callback) {
        if( locationEnabled() ) {
            navigator.geolocation.watchPosition(function(position) {
                locationChange( position );
                callback && callback( position );
            });
        }
    };
    var loadPoints = function() {
        points = localStorage.points ? JSON.parse( localStorage.points ) : [];
//        for(var i=0, l=points.length; i<l; ++i) {
//            var latLng = L.latLng(points[i][0],points[i][1]);
//            map.addLayer( L.circle(latLng, 3) );
//        }
    };
    
    var addPixelPoint = function() {
        var bounds = map.getPixelBounds();
        var minx = bounds.min.x;
        var miny = bounds.min.y;
        var maxx = bounds.max.x;
        var maxy = bounds.max.y;
        pixelPoints.push( [minx + (maxx-minx)/2, miny + (maxy-miny)/2] );
    };
    
    var init = function(mapView) {
        map = mapView;
                
        var curPosIcon = L.divIcon({ className: "player" });
        marker = L.marker([51.5, -0.09], {icon: curPosIcon}).addTo(map);
        window.marker = marker;
        
        var canvasTiles = L.tileLayer.canvas().addTo( mapView );

        canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
            var ctx = canvas.getContext('2d');
            // draw something on the tile canvas
        }
        
        loadPoints();
        fogView.init( map, points );
        watchLocation(locationChange);
    };
        
    return {
        init: init,
        getLocation: getLocation,
        watchLocation: watchLocation
    }

});