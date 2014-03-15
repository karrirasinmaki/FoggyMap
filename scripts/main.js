require(["utils", "mapView", "player"], function(utils, mapView, player) {
        
    player.init(mapView);    
    
    player.watchLocation(function(position) {
        mapView.setPosition( position );
        //fogView.init( mapView, position );
    });
    
});