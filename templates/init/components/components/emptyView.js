(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        //define(['jquery'], factory);
        define(["app/components/view.js"], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        //module.exports = factory(require('jquery'));
        module.exports = factory(require('view'));
    } else {
        // Browser globals (root is window)
        //root.returnExports = factory(root.jQuery);
        root.returnExports = factory(root.baseComponent);
    }
}(this, function (view) {

    var getFlikRectangle = function (flik, entity, component, componentName, rootViewController) {

        var emptyView = view(flik, entity, component, componentName, rootViewController);

        emptyView.data.text = "Empty View";


        emptyView.tick = function(){
            //console.log("ticking");
        };

        return emptyView;
    };
    return getFlikRectangle;
}));