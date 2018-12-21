(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        //define(['jquery'], factory);
        define(["baseComponent"], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        //module.exports = factory(require('jquery'));
        module.exports = factory(require('/Users/chris/Projects/flik-ft/components2/baseComponent'));
    } else {
        // Browser globals (root is window)
        //root.returnExports = factory(root.jQuery);
        root.returnExports = factory(root.baseComponent);
    }
}(this, function (baseComponent) {

    var getFlikRectangle = function (flik, entity, component, componentName, rootViewController) {

        var rectangleComponent = baseComponent(flik, entity, component, componentName, rootViewController);


        $("#loadingOverlay").hide();

        //var canvasViewController = rootViewController;

        //console.log(rectangleComponent);
        //console.log(rectangleComponent._entity);

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

        rectangleComponent.initalised(function () {
            for (var event in rectangleComponent.events) {
                if (event === "navigate") {
                    rectangleComponent.data.styles.cursor = "pointer";
                    rectangleComponent.update();
                    rectangleComponent.viewController.view.on("click", function () {
                        flik.navigate(rectangleComponent.events[event]);
                    });
                }
            }
            for (var event in rectangleComponent.data.events) {
                if (event == "click") {
                    console.log("event", event, rectangleComponent.data.events[event]);
                    rectangleComponent.viewController.view.on("click", function () {
                        //flik.PubSub.publish("playMixcloud");
                        var path = rectangleComponent.data.events["click"];
                        console.log();
                        var object = eval(path);
                        //console.log(object);
                        //object.play();
                    });
                }
                /*if (event == "click") {
                    alert(rectangleComponent.data.events[event]);
                }*/
            }
            /*if (event === "click") {
                rectangleComponent.data.styles.cursor = "pointer";
                rectangleComponent.update();
                rectangleComponent.viewController.view.on("click", function () {
                    alert("doing something");
                });
            }*/
        });


        var s = document.createElement("script");
        s.type = "text/javascript";
        $("head").append(s);

        var widget;

        /*s.onload = function () {
            widget = Mixcloud.PlayerWidget(document.getElementById("my-widget-iframe"));
            widget.ready.then(function () {
                window.widget = widget;
                // Put code that interacts with the widget here
            });

        };

        s.src = "//widget.mixcloud.com/media/js/widgetApi.js";


        $("body").prepend("<iframe style='position:absolute;' id=\"my-widget-iframe\" width=\"100%\" height=\"60\" src=\"https://www.mixcloud.com/widget/iframe/?hide_cover" +
            "=1&mini=1&light=1&hide_art" +
            "work=1&autoplay=1&feed=%2Fcbarry%2Freckless-engineers-sheep-music-2005%2F\" frameborder=\"0\" ></iframe>");
           */

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

            /*rectangleComponent.viewController.on("click", function () {
                widget.play();
            });*/
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