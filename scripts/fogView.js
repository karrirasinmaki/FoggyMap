define(["map/leaflet"], function(L) {
    
    var points = [];
    var mapV = undefined;
    var map = undefined;
    var mapOriginX = undefined;
    var mapOriginY = undefined;
    var mapDeltaX = undefined;
    var mapDeltaY = undefined;
    var canvas = undefined;
    var c = undefined; // context
    
    var canvasTiles = undefined;
    
    var clipCanvas = undefined;
    var clipCtx = undefined;
    
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
        try {
            requestAnimationFrame(fn);
            return;
        } catch(e) {}
        setTimeout(fn, 30);
    };
    
    var getScale = function() {
        return map.getZoomScale(17)
    };
    
    var drawCircle = function(c, lat, long) {
        var scale = getScale();
        var bounds = map.getBounds();
        var tl = bounds.getNorthWest();
        var rb = bounds.getSouthEast();
        var r = 30/scale;
        
        if( bounds.contains( L.latLng(lat, long) ) ) {
            c.beginPath();
            c.arc(
                window.innerWidth * (1- (rb.lng - long) / (rb.lng - tl.lng)),
                window.innerHeight * (1- (rb.lat - lat) / (rb.lat - tl.lat)),
                r, 0, Math.PI*2
            );
            c.closePath();
            c.fill();
        }
    };
    
    var maskDraw = function(c) {
        if( !map ) return;
        var scale = getScale();
        
        c.save();
        c.shadowBlur = 20/scale;
        c.shadowColor = "black";
        c.fillStyle = "black";
        
        c.clearRect(0, 0, c.canvas.width, c.canvas.height);
        
        for(var i=0, l=points.length; i<l; ++i) {
            var p = points[i];
            var lat = p[0];
            var long = p[1];
            
            drawCircle(c, lat, long);
        }
        
        c.restore();
    };
    
    var matrixToArray = function(matrix) {
        return matrix.substr(7, matrix.length - 8).split(', ');
    };
    
    var getTransformMatrix = function(el) {
        var st = window.getComputedStyle( el, null);
        var matrix = st.getPropertyValue("-webkit-transform");
        return matrixToArray( matrix );
    }
    
    var getTranformPosition = function(el) {
        var matrixArr = getTransformMatrix( el );
        return { x: matrixArr[4], y: matrixArr[5] };
    };
    
    var drawFog = function(c) {
        var mapXY = map.getPixelBounds().min;
//        var mapDeltaX = (mapXY.x - mapOriginX);
//        var mapDeltaY = (mapXY.y - mapOriginY);
        var canvas = c.canvas;
        
        c.save();
        
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "rgba(100, 75, 75, 0.95)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        c.translate(-mapDeltaX, -mapDeltaY);
        
        c.globalCompositeOperation = 'destination-out';
        
        var transformPos = getTranformPosition( canvas );
        transformPos.x = transformPos.x || parseInt(canvas.style.left.replace("px", ""));
        transformPos.y = transformPos.y || parseInt(canvas.style.top.replace("px", ""));
        c.drawImage( clipCanvas, -transformPos.x, -transformPos.y );
        c.restore();
    }
    
    var currentScale = 0;    
    var tick = function() {
        if( currentScale != getScale() ) {
            maskDraw( clipCtx );
            currentScale = getScale();
        }
        
        animate(tick);
    };
    
    var updateMapOrigin = function() {
        mapOriginX = map.getPixelBounds().min.x;
        mapOriginY = map.getPixelBounds().min.y;
    };
    
    var updateMapDelta = function(pos) {
        if( !pos || !pos.x || !pos.y ) return;
        mapDeltaX = pos.x;
        mapDeltaY = pos.y;
    };
    var updateMask = function() {
        maskDraw( clipCtx );
        canvasTiles.redraw();
    };
    
    var update = function(pts) {
        updateMapOrigin();
        points = pts;
        updateMask();
    };
    
    var windowResize = function() {
        clipCanvas.width = window.innerWidth;
        clipCanvas.height = window.innerHeight;
    };
    
    var init = function(mapView, points) {
        mapV = mapView;
        map = mapV.getMap();
        mapOriginX = map.getPixelBounds().min.x;
        mapOriginY = map.getPixelBounds().min.y;
        map.on("moveend", function(e) {
            updateMapDelta( e.target.dragging._lastPos );
            updateMask();
        });
        
        var overlayPane = map.getPanes().overlayPane;
        var mapSize = map.getSize();
        

        canvasTiles = L.tileLayer.canvas().addTo( map );
        canvasTiles.on("loading", function() {
            maskDraw( clipCtx );
        });
        canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
            var ctx = canvas.getContext('2d');
            // draw something on the tile canvas
            drawFog(ctx);
        }
        canvasTiles.bringToFront();
        
        clipCanvas = document.createElement("canvas");
        clipCanvas.width = window.innerWidth;
        clipCanvas.height = window.innerHeight;
        clipCanvas.id = "mask";
        clipCtx = clipCanvas.getContext("2d");
//        clipCanvas.style.opacity = "0.2";
//        map.getContainer().appendChild( clipCanvas );
        
        window.onresize = windowResize;
        
        update( points );
        tick();
    };
    
    return {
        init: init,
        update: update,
        updateMapOrigin: updateMapOrigin
    }
    
});