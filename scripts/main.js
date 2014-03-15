require(["utils", "mapView", "player"], function(utils, mapView, player) {
        
    player.init(mapView);    
    
    player.watchLocation(function(position) {
        mapView.setPosition( position );
        //fogView.init( mapView, position );
    });
    
    var myLocationButton = document.createElement("button");
    myLocationButton.textContent = "where am I?";
    myLocationButton.style.position = "absolute";
    myLocationButton.style.right = "0.5em";
    myLocationButton.style.bottom = "0.5em";
    myLocationButton.onclick = function(e) {
        player.getLocation(function() {
            console.log("momo");
        });
    }
    document.body.appendChild( myLocationButton );
    
});