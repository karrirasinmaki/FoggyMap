require(["utils", "mapView", "player", "sidemenu"], function(utils, mapView, player, sidemenu) {
    
    window.receiveData = function(data) {
        alert( data );
    };
    
    var createButton = function(params) {
        var button = document.createElement("button");
        button.textContent = params.textContent;
        button.style.position = "absolute";
        button.onclick = params.onclick;
        document.body.appendChild( button );
        return button;
    };
        
    player.init(mapView);
    player.getLocation(function(position) {
        mapView.init( position );
    });
    
    var myLocationButton = createButton({
        textContent: "where am I?",
        onclick: function(e) {
            player.getLocation(function(position) {
                mapView.setPosition( position );
            });
        }
    });
    myLocationButton.style.left = "0.5em";
    myLocationButton.style.bottom = "0.5em";    
    
    sidemenu.create();
    var openMenuButton = createButton({
        textContent: "menu",
        onclick: function(e) {
            sidemenu.toggle();
        }
    });
    openMenuButton.style.left = "0.5em";
    openMenuButton.style.top = "0.5em";
    
    var syncButton = createButton({
        textContent: "sync",
        onclick: function(e) {
            if(WrapperApp) WrapperApp.receiveData( JSON.stringify(player.getPoints()) );
        }
    });
    syncButton.style.right = "0.5em";
    syncButton.style.top = "0.5em";
    
});