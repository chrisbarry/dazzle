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

        var rectangleComponent = baseComponent(flik, entity, component, componentName, rootViewController);

        var componentReadyResolve;

        component.ready = new Promise(function (resolve, reject) {
            componentReadyResolve = resolve;
        });

        rectangleComponent._entity.getFirstParentViewController(function (viewController) {
            if (typeof(viewController) != "undefined") {
                rectangleComponent.viewController = flik.deps.widgets.view(viewController);
                rectangleComponent.viewController.ready.then(function () {
                    rectangleComponent.update();
                    rectangleComponent.finishedInit();
                    componentReadyResolve();
                });
            } else {
                rectangleComponent.viewController = flik.deps.widgets.view(rootViewController);
                rectangleComponent.viewController.ready.then(function () {
                    rectangleComponent.update();
                    rectangleComponent.finishedInit();
                    componentReadyResolve();
                });
            }
        });

        //console.log("FOUND THIS VIEW CONTROLLER", viewController);

        var schema = {
            styles: {
                type: "dict",
                default: {
                    "top": 0,
                    "background-color": "white",
                    "width": 100,
                    "height": 100,
                    "left": 0,
                    "text-align": "center"
                }
            }
        };
        //console.log("init filk rectangle: " + entity._name);

        for (var prop in schema) {
            //only set the default if it hasn't already been passed in
            if (typeof(rectangleComponent.data[prop]) == "undefined") {
                rectangleComponent.data[prop] = schema[prop].default;
            }
        }

        rectangleComponent.init = function () {

        };

        rectangleComponent.update = function () {
            //var object3D = this.el.object3D;
            //var data = this.data;
            //object3D.position.set(data.x, data.y, data.z);
            rectangleComponent.viewController.setStyles(rectangleComponent.data.styles);
            if (typeof(rectangleComponent.data.text) != "undefined") {
                rectangleComponent.viewController.setText(rectangleComponent.data.text);
            }
        };


        // WHY WAS THIS NOT NEEDED ON WEB OR ANDROID BUT WAS ON IOS!!!!!
        //OK, becuase on web, this happens async, so it needs to happen after view binding.
        //Makes ense
        //rectangleComponent.update();
        if (flik.deps.platform.device == "ios") {
            //We need a better binding method for this update;
            rectangleComponent.update();
        }

        rectangleComponent.tick = function () {

        };

        rectangleComponent.remove = function () {
            rectangleComponent.viewController.remove();
        };

        return rectangleComponent;
    };
    return getFlikRectangle;
}));