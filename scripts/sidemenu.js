define(function() {
    
    var element = undefined;
    var isOpen = false;
    
    var create = function() {
        element = document.createElement("div");
        element.id = "sidemenu";
        element.style.position = "absolute";
        element.style.left = "0";
        element.style.top = "0";
        element.style.bottom = "0";
        element.style.background = "#000";
        element.style.transition = "all 0.5s";
        element.style.width = "90%";
        
        element.style.left = "-100%";
        document.body.appendChild( element );
    };
    
    var open = function() {
        element.style.left = "0";
        isOpen = true;
    };
    
    var close = function() {
        element.style.left = "-100%";
        isOpen = false;
    };
    
    var toggle = function() {
        if( isOpen ) close();
        else open();
    };
    
    return {
        create: create,
        open: open,
        close: close,
        toggle: toggle
    }

});