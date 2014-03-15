define(["map/leaflet"], function(L) {
    
    var points = [];
    var mapV = undefined;
    var map = undefined;
    var mapOriginX = undefined;
    var mapOriginY = undefined;
    var canvas = undefined;
    var c = undefined; // context
    
    var clipCanvas = undefined;
    var clipCtx = undefined;
    
    var init = function(mapView) {
        mapV = mapView;
        map = mapV.getMap();
        mapOriginX = map.getPixelBounds().min.x;
        mapOriginY = map.getPixelBounds().min.y;
        
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
        
        clipCanvas = canvas.cloneNode(true);
        clipCtx = clipCanvas.getContext("2d");
        
        map.getContainer().appendChild( canvas );
        
        maskDraw( clipCtx );
    };
    
    var cutCircle = function(context, x, y, radius) {
        c.save();
        context.globalCompositeOperation = 'destination-out';
        context.shadowBlur=20;
        context.shadowColor="black";
        context.arc(x, y, radius, 0, Math.PI*2, true);
        context.fill();
        c.restore();
    };
    
    var animate = function(fn) {
        try{
            requestAnimationFrame(fn);
            return;
        } catch(e) {}
        
        setTimeout(fn, 30);
    };
    
    var tick = function() {
        maskDraw(clipCtx);
        
        var mapXY = map.getPixelBounds().min;
        var mapDeltaX = mapXY.x - mapOriginX;
        var mapDeltaY = mapXY.y - mapOriginY;
        
        c.save();
        
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "rgba(100, 75, 75, 0.95)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        
//        c.translate(-mapDeltaX, -mapDeltaY);
        
        c.globalCompositeOperation = 'destination-out';
        c.drawImage( clipCanvas, 0, 0 );
        c.restore();
        
        animate(tick);
    };
    animate(tick);
    
    var maskDraw = function(c) {
        var scale = map.getZoomScale(17);
        
        c.save();
        c.shadowBlur = 20/scale;
        c.shadowColor = "black";
        c.fillStyle = "black";
        
        var tl = map.getBounds().getNorthWest();
        var rb = map.getBounds().getSouthEast();
        var r = 30/scale;
        
        c.clearRect(0, 0, c.canvas.width, c.canvas.height);
        for(var i=0, l=points.length; i<l; ++i) {
            var p = points[i];
            var lat = p[0];
            var long = p[1];
            
//            if( lat > tl.lat && lat < rb.lat &&
//               long > tl.lng && long < rb.lng ) {
                
                c.beginPath();
                c.arc(
                    canvas.offsetWidth * (1- (rb.lng - long) / (rb.lng - tl.lng)),
                    canvas.offsetHeight * (1- (rb.lat - lat) / (rb.lat - tl.lat)),
                    r, 0, Math.PI*2
                );
                c.closePath();
                c.fill();
//            }
        }
        
        c.restore();
    };
    
    var updateMapOrigin = function() {
        mapOriginX = map.getPixelBounds().min.x;
        mapOriginY = map.getPixelBounds().min.y;
    };
    
    var update = function(pts) {
        points = pts;
        maskDraw( clipCtx );
    };
    
    return {
        init: init,
        update: update,
        updateMapOrigin: updateMapOrigin
    }
    
});