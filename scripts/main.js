require(["utils", "mapView", "player", "sidemenu"], function(utils, mapView, player, sidemenu) {
    
    window.receiveData = function(data) {
        alert( data );
    };
        
    player.init(mapView);
    
    var myLocationButton = utils.createButton({
        textContent: "where am I?",
        onclick: function(e) {
            player.getLocation(function(position) {
                mapView.setPosition( position );
            });
        }
    });
    myLocationButton.style.left = "0.5em";
    myLocationButton.style.bottom = "0.5em";
    
    player.getLocation(function(position) {
        mapView.setPosition( position );
    });
    
    
    sidemenu.create();
    var openMenuButton = utils.createButton({
        textContent: "menu",
        onclick: function(e) {
            sidemenu.toggle();
        }
    });
    openMenuButton.style.left = "0.5em";
    openMenuButton.style.top = "0.5em";
    
    var syncButton = utils.createButton({
        textContent: "sync",
        onclick: function(e) {
            if(WrapperApp) WrapperApp.receiveData( player.getPoints() );
        }
    });
    syncButton.style.right = "0.5em";
    syncButton.style.top = "0.5em";
    
});