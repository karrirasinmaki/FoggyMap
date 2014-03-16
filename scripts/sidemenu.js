define(function() {
    
    var element = undefined;
    var isOpen = false;
    
    var createListItem = function(params) {
        var li = document.createElement("div");
        li.textContent = params.textContent;
        li.style.padding = "0.2em 0";
        return li;
    };
    
    var create = function() {
        element = document.createElement("div");
        element.id = "sidemenu";
        element.style.position = "absolute";
        element.style.left = "0";
        element.style.top = "0";
        element.style.bottom = "0";
        element.style.background = "#000";
        element.style.color = "#fff";
        element.style.fontSize = "2.5em";
        element.style.fontFamily = "sans-serif";
        element.style.transition = "all 0.5s";
        element.style.padding = "1em";
        
        element.appendChild( createListItem({textContent: "PROFILE"}) );
        element.appendChild( createListItem({textContent: "FRIENDS"}) );
        element.appendChild( createListItem({textContent: "STATICS"}) );
        element.appendChild( createListItem({textContent: "SETTING"}) );
        
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