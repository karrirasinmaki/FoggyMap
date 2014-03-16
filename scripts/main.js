require(["utils", "mapView", "player", "sidemenu"], function(utils, mapView, player, sidemenu) {
    
    window.receiveData = function(data) {
        console.info("Data received");
        try {
            var pointsArr = JSON.parse( data );
            player.setPoints( pointsArr );
        } catch(e) {
            console.log( e );
        }
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
        textContent: "",
        onclick: function(e) {
            sidemenu.toggle();
        }
    });
    openMenuButton.innerHTML = "&#8801;";
    openMenuButton.style.fontSize = "1.5em";
    openMenuButton.style.left = "0.5em";
    openMenuButton.style.top = "0.5em";
    
    if( window.WrapperApp ) {
        var syncButton = createButton({
            textContent: "sync",
            onclick: function(e) {
                try {
                    if(WrapperApp) WrapperApp.receiveData( JSON.stringify(player.getPoints()) );
                } catch(e) {
                    console.info("WrapperApp not connected");
                }
            }
        });
        syncButton.style.right = "0.5em";
        syncButton.style.top = "0.5em";
    }
    
});