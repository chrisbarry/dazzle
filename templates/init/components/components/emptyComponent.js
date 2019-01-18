(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        //define(['jquery'], factory);
        define(["baseComponent"], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        //module.exports = factory(require('jquery'));
        module.exports = factory(require('baseComponent'));
    } else {
        // Browser globals (root is window)
        //root.returnExports = factory(root.jQuery);
        root.returnExports = factory(root.baseComponent);
    }
}(this, function (baseComponent) {

    var getFlikRectangle = function (flik, entity, component, componentName, rootViewController) {

        var emptyComponent = baseComponent(flik, entity, component, componentName, rootViewController);

        console.log("this is, " + componentName);

        emptyComponent.tick = function () {
            entity.components["emptyView"].data.styles.left = parseInt(entity.components["emptyView"].data.styles.left) + 1;
            entity.components["emptyView"].update();
            console.log("doing",  entity.components["emptyView"].data.styles.left);
        };


        console.log(emptyComponent.tick);
        //console.log(entity.components["emptyView"])

        return emptyComponent;
    };
    return getFlikRectangle;
}));