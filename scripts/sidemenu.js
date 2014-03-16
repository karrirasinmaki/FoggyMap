define(function() {
    
    var element = undefined;
    var isOpen = false;
    
    var createListItem = function(params) {
        var li = document.createElement("div");
        li.textContent = params.textContent;
        li.className = "list-item";
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
        element.style.fontSize = "2em";
        element.style.fontFamily = "monospace";
        element.style.transition = "all 0.5s";
        element.style.padding = "2em 0em";
        
        element.appendChild( createListItem({textContent: "profile"}) );
        element.appendChild( createListItem({textContent: "friends"}) );
        element.appendChild( createListItem({textContent: "statics"}) );
        element.appendChild( createListItem({textContent: "settings"}) );
        
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