define(["map/leaflet"], function(L) {
    
    var points = [];
    var mapV = undefined;
    var map = undefined;
    var canvas = undefined;
    var c = undefined; // context
    
    var init = function(mapView) {
        mapV = mapView;
        map = mapV.getMap();
        
        var overlayPane = map.getPanes().overlayPane;
        var mapSize = map.getSize();
        
        canvas = document.createElement("canvas");
        canvas.id = "fog";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.width = mapSize.x;
        canvas.height = mapSize.y;
        
        c = canvas.getContext("2d");
        
        map.getContainer().appendChild( canvas );
    };
    
    var cutCircle = function(context, x, y, radius) {
        c.save();
        context.globalCompositeOperation = 'destination-out'
        context.arc(x, y, radius, 0, Math.PI*2, true);
        context.fill();
        c.restore();
    };
    
    var tick = function() {
        var tl = map.getBounds().getNorthWest();
        var rb = map.getBounds().getSouthEast();
        var r = 30;
        
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "rgba(100, 75, 75, 0.95)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        for(var i=0, l=points.length; i<l; ++i) {
            var p = points[i];
            var lat = p[0];
            var long = p[1];
            
//            if( lat > tl.lat && lat < rb.lat &&
//               long > tl.lng && long < rb.lng ) {
                      
                cutCircle(c,
                    canvas.offsetWidth * (1- (rb.lng - long) / (rb.lng - tl.lng)),
                    canvas.offsetHeight * (1- (rb.lat - lat) / (rb.lat - tl.lat)),
                    r, 0, 360
                );
                
//            }
        }
    };
    setInterval( tick, 1000 );
    
    var update = function(pts) {
        points = pts;
    }
    
    return {
        init: init,
        update: update
    }
    
});