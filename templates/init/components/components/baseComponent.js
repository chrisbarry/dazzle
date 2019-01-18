(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        //define(['jquery'], factory);
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        //module.exports = factory(require('jquery'));
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //    methods
    var getBaseComponent = function (flik, entity, serialisedComponent, componentName, rootViewController) {

        var component = serialisedComponent;

        component._name = componentName;
        component._entity = entity;

        //If no data passed in, make sure we have a data object ready.
        if (typeof(component.data) == "undefined") {
            component.data = {};
        };

        var iterateData = function (obj) {
            for (var prop in obj) {
                if (typeof(obj[prop]) == "object" && prop != "_parent") {
                    obj[prop]._parent = obj;
                    obj[prop]._name = prop;
                    iterateData(obj[prop]);
                }
            }
        };




        iterateData(component.data);

        //This should return a set of object references, and the propertyName to access them by.
        //We need to pass this dual object, so we can bounce references all over the shop;
        //We don't care about objects, as long as we get a list of all object references and propertyNames;
        component.__getDataProperties = function (callback, obj) {
            if (typeof(obj) == "undefined") {
                obj = component.data;
            }
            for (var prop in obj) {
                if (!Array.isArray(obj[prop]) && typeof(obj[prop]) == "object" && !prop.startsWith("_")) {
                    component.__getDataProperties(callback, obj[prop])
                } else {
                    callback({
                        ref: obj,
                        name: prop,
                        component: component
                    });
                }
            }
        };


        flik.PubSub.subscribe('socketOnMessage', function (msg, data) {
            if (data.type != "connect") {
                if (data.text.type == "message") {
                    if (data.text.subType == "sendComponentDataAndUpdate") {

                        if (flik.deps.sockets.replyChannel != data.reply_channel) {
                            component.data = JSON.parse(data.text.payload.data);
                            component.update();
                        }
                    }
                }
            }
        });

        component.updateOtherInstancesOfSelf = function () {

            flik.PubSub.publish('flikMessageSend', {
                "type": "message",
                "subType": "sendComponentDataAndUpdate",
                "payload": {
                    "entityPath": sceneTools.getPathToRootFromEntity(component._entity),
                    "componentName": component._name,
                    "data": sceneTools.objectToJson(component.data)
                }
            });
        };

        //runs before all other inits, but after object is created (allows for bindings)
        component.baseInit = function () {
            if (typeof(window) != "undefined") {
                if (typeof(component._baseWidget) != "undefined") {
                    component._baseWidget.view.draggable({
                        drag: function (event, ui) {
                            component.data.styles.left = ui.position.left;
                            component.data.styles.top = ui.position.top;
                            //component.update();
                            component.updateOtherInstancesOfSelf();
                        }
                    });
                }
            }
        };


        //init
        //finishedInit (triggers initalised callbacks)

        var afterInitCallbacks = [];

        component.initalised = function (callback) {
            afterInitCallbacks.push(callback);
        };

        //init runs first and only.
        component.finishedInit = function () {
            setTimeout(function () {
                afterInitCallbacks.forEach(function (callback) {
                    callback();
                });
            }, 200);
        };

        component.init = function(){

        };

        //update runs on demand. Run at the end of the first init, perhaps()?
        component.update = function () {
        };

        //runs every frame
        component.tick = function (globalIndex, sessionIndex) {
            //console.log("ticking");
        };

        //discard and remove self properly..
        component.remove = function () {
            component.viewController.view.remove();
        };


        return component;
    };

    //    exposed public method
    return getBaseComponent;
}));