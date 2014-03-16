define(function() {
    
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
    var createButton = function(params) {
        var button = document.createElement("button");
        button.textContent = params.textContent;
        button.style.position = "absolute";
        button.onclick = params.onclick;
        document.body.appendChild( button );
        return button;
    };
    
    return {
        createButton: createButton
    }
    
});
