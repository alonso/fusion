/**
 * Fusion.Error
 *
 * $Id: Error.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*****************************************************************************
 * Class: Fusion.Error
 *
 * General purpose Error object
 */

Fusion.Error = OpenLayers.Class({
    type: null,
    message: null,
    initialize: function(type, message) {
        this.type = type;
        this.message = message;
    },
    
    alert: function() {
        var type = this.typeToString(this.type);
        alert(OpenLayers.i18n('fusionError', {'type':type, 'message': this.message}));
    },
    
    toString: function() {
        var type = this.typeToString(this.type);
        return type + ": " + this.message;
    },
    
    typeToString: function(type) {
        switch (type) {
            case Fusion.Error.FATAL:
                return 'FATAL';
            case Fusion.Error.WARNING:
                return 'WARNING';
            case Fusion.Error.NOTICE:
                return 'NOTICE';
            default:
                return 'UNKNOWN ('+type+')';
        }
    }
});

Fusion.Error.FATAL = 0;
Fusion.Error.WARNING = 1;
Fusion.Error.NOTICE = 2;


/**
 * Class: Fusion.Lib.EventMgr
 *
 * an internal class for managing generic events.  Classes that wish to
 * publish and trigger events that other objects can listen for need to
 * inherit from Fusion.Lib.EventMgr.
 *
 * To publish an event, call registerEventID with some unique numeric or
 * string value.  Other objects can then call registerForEvent with the
 * eventID and a function to call when the event is triggered.
 *
 * To trigger an event, call triggerEvent with the eventID and any additional
 * arguments that should be passed to listeners.
 */
Fusion.Lib.EventMgr = OpenLayers.Class({
    /* an array of eventIDs and associated listener functions */
    events : null,
    
    initialize: function() { if (!this.events) {this.events = []; }},

    /**
     * Method: destroy
     *
     */
    destroy: function() {
       this.events = []; 
    },
    
    /**
     * register an event ID so that others can use it.  This should really
     * only be called by 'this' object.
     *
     * @param eventID the event ID to register
     */
    registerEventID : function( eventID ) {
        if (!this.events) {this.events = []; }
        if (!eventID) {
            Fusion.reportError(new Fusion.Error(Fusion.Error.WARNING, 
                          OpenLayers.i18n('regsiterEventError')));
        }
        var ev = new String(eventID);
        if (!this.events[eventID]) {
            this.events[eventID] = [];
        }
    },

    /**
     * register for receiving a callback when an event happens. If you
     * want the callback to be a method on an instance of some object, 
     * use the OpenLayers.Function.bind() function as in:
     *
     * otherObj.registerForEvent(SOME_EVENT, OpenLayers.Function.bind(this.callback,this));
     *
     * @param eventID the event ID to register for
     * @param f the function to call when the event happens.  
     */
    registerForEvent : function(eventID, f) {
        var ev = new String(eventID);
        this.events[eventID].push(f);
    },

    /**
     * deregister a callback function when you no longer want to
     * recieve it.  Note that if you used bind() when registering,
     * you need to pass EXACTLY THE SAME FUNCTION when
     * deregistering.  Typically, this means you need to assign the
     * result of bind() to an instance variable and pass that instance
     * variable to both registerForEvent and deregisterForEvent.
     *
     * For instance:
     *
     * this.callbackFn = OpenLayers.Function.bind(this.callback, this);
     * otherObj.registerForEvent(SOME_EVENT, this.callbackFn);
     * otherObj.deregisterForEvent(SOME_EVENT, this.callbackFn);
     *
     * @param eventID the event ID to deregister
     * @param f the function that used when registering.
     */
    deregisterForEvent : function( eventID, f ) {
        var ev = new String(eventID);
        var bResult = false;
        if (!this.events[eventID]){
            return false;
        }

        for (var i=0;i<this.events[eventID].length;i++) {
            if (this.events[eventID][i]== f) {
                this.events[eventID].splice(i,1);
                bResult = true;
            }
        }
        return bResult;
    },       

    /**
     * trigger an event and call all registered listener functions.
     * This is intended to be called by 'this'.  The eventID param
     * is mandatory.  Any additional arguments will be passed to the
     * listener function.
     *
     * @param eventID the event ID to trigger
     */
    triggerEvent : function( eventID ) {
        var ev = new String(eventID);
        if (!this.events || !this.events[eventID]) {
            return false;
        }

        for (var i=0; i<this.events[eventID].length; i++) {
            this.events[eventID][i].apply(null, arguments);
        }
        return true;
    }
});
        
//window.Fusion = OpenLayers.Class(Fusion.Lib.EventMgr, Fusion.prototype);
//OpenLayers.Util.extend(Fusion, Fusion.Lib.EventMgr.prototype);
Fusion.events = [];
Fusion.registerEventID = Fusion.Lib.EventMgr.prototype.registerEventID;
Fusion.registerForEvent = Fusion.Lib.EventMgr.prototype.registerForEvent;
Fusion.triggerEvent = Fusion.Lib.EventMgr.prototype.triggerEvent;

Fusion.Event.FUSION_INITIALIZED = Fusion.Event.lastEventId++;
Fusion.Event.FUSION_ERROR = Fusion.Event.lastEventId++;
Fusion.registerEventID(Fusion.Event.FUSION_INITIALIZED);
Fusion.registerEventID(Fusion.Event.FUSION_ERROR);
        
/**
 * Fusion.Lib.ApplicationDefinition
 *
 * $Id: ApplicationDefinition.js 1458 2008-08-12 20:17:15Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition
 *
 * Utility class to parse an application definition
 *
 */

Fusion.Lib.ApplicationDefinition = OpenLayers.Class({
    /**
     * Property: mapGroups
     * 
     * array of map groups, parsed from ApplicationDefinition.  A MapGroup 
     * consists of one or more Maps that can be combined into the same
     * OpenLayers Map object
     */
    mapGroups: null,
    
    /**
     * Property: widgetSets
     *
     * array of widget sets (each one corresponding to a map) parsed
     * from the ApplicationDefinition.
     */
    widgetSets: null,
    
    /**
     * Property: {Object} oBroker
     *
     * A Broker object that can communicate with a MapGuide instance
     * in the case we are running against a MapGuide server
     */
    oBroker: null,
    
    /**
     * Property: {Array} searchDefinitions
     *
     * An array of search definitions
     */
    searchDefinitions: null,
    
    /**
     * Property: {Array} searchCategories
     *
     * An array of search categories
     */
    searchCategories: null,
    
    /**
     * Constructor: ApplicationDefinition
     *
     * construct a new instance of the ApplicationDefinition object.  While
     * not enforced, this is intended to be a singleton.
     *
     * Parameter: sessionId
     *
     * an optional session id to initialize the application with, passed to
     * the map widgets when they are created.
     */
     
    initialize: function(sessionId) {   
        //console.log('ApplicationDefinition initialize');
        this.sessionId = sessionId;
        this.oBroker = Fusion.getBroker();
        this.applicationDefinition =  Fusion.getApplicationDefinitionURL();
        
        this.widgetSets = [];
        this.mapGroups = [];
        this.searchDefinitions = [];
        this.searchCategories = [];
        this.parse();
    },
    
    /**
     * Function: parse
     *
     * start parsing the ApplicationDefinition file.  This happens
     * asynchronously since the ApplicationDefinition has to be
     * retrieved from the server or the MapGuide repository.  When
     * parsing is complete, an APPLICATIONDEFINITION_PARSED event
     * will be emitted.  This function returns true if parsing
     * will start, false if it will not (due to a missing
     * application definition for instance).
     */
    parse : function() {
        if (this.applicationDefinition == '') {
            //TODO: emit an error
            return null;
        }
        /* if the application definition is not in the mapguide server, 
           just load the xml*/
        
        if ( (this.applicationDefinition.match('Library://') == null) &&
             (this.applicationDefinition.match('Session:') == null) ) {
            if (Fusion.appDefJson) {
                this.parseAppDef(Fusion.appDefJson);
            } else {
                Fusion.getXmlAsJson(this.applicationDefinition, 
                              OpenLayers.Function.bind(this.getAppDefCB, this));
            }
        } else {
            //TODO: request as JSON format
            if (!this.sessionId) {
              var r = new Fusion.Lib.MGRequest.MGCreateSession();
              this.oBroker.dispatchRequest(r, OpenLayers.Function.bind(this.getAppDef, this));
            } else {
              this.getAppDef();
            }
        }
        return true;
    },
    
    getAppDef: function(xhr){
      if (xhr) {
        this.sessionId = xhr.responseText;
        Fusion.sessionId = this.sessionId;
      }
      var r = new Fusion.Lib.MGRequest.MGGetResourceContent(this.applicationDefinition);
      r.parameters.session = this.sessionId;
      this.oBroker.dispatchRequest(r, 
            OpenLayers.Function.bind(Fusion.xml2json, this, 
                  OpenLayers.Function.bind(this.getAppDefCB, this)));
    },
    
    getAppDefCB: function(xhr) {
        var o;
        eval("o="+xhr.responseText);
        this.parseAppDef(o);
        Fusion.setLoadState(Fusion.LOAD_WIDGETS);
    },

    /**
     * Function: parseAppDef
     *
     * parse the ApplicationDefinition file into the appropriate Fusion objects
     *
     * Parameter: {XmlHttpRequest} xhr
     *
     * the XmlHttpRequest object
     */
    parseAppDef: function(json) {
        var appDef = json.ApplicationDefinition;

        /* Set the application title */
        if (appDef.Title) {
            var title = appDef.Title[0];
            document.title = title;
        }

        /* process Map nodes */
        if (appDef.MapSet) {
            var mapSet = appDef.MapSet[0];
            if (mapSet.MapGroup instanceof Array) {
                for (var i=0; i<mapSet.MapGroup.length; i++) {
                    var mapGroup = new Fusion.Lib.ApplicationDefinition.MapGroup(mapSet.MapGroup[i]);
                    this.mapGroups.push(mapGroup);
                }
            }
        } else {
          Fusion.reportError(new Fusion.Error(Fusion.Error.FATAL, 
                        OpenLayers.i18n('appDefParseError')));
        }
        
        /* process WIDGET sets */
        if (appDef.WidgetSet) {
            for (var i=0; i<appDef.WidgetSet.length; i++) {
                var widgetSet = new Fusion.Lib.ApplicationDefinition.WidgetSet(appDef.WidgetSet[i]);
                this.widgetSets.push(widgetSet);
            }
        } else {
          Fusion.reportError(new Fusion.Error(Fusion.Error.FATAL, 
                      OpenLayers.i18n('widgetSetParseError')));
        }
        
        /* process extensions */
        if (appDef.Extension) {
            var extension = appDef.Extension[0];
            /* process search definitions */
            if (extension.SearchDefinitions instanceof Array) {
                var categories = extension.SearchDefinitions[0];
                if (categories.SearchCategory instanceof Array) {
                    for (var i=0; i<categories.SearchCategory.length; i++) {
                        var oCategory = {};
                        var category = categories.SearchCategory[i];
                        oCategory.id = category['@id'];
                        oCategory.name = category['@name'];
                        oCategory.layer = category.Layer ? category.Layer[0] : '';
                        oCategory.searchDefinitions = [];
                        this.searchCategories[oCategory.id] = oCategory;
                        var defns = category.SearchDefinition;
                        for (var k=0; k<defns.length; k++) {
                            var defn = new Fusion.Lib.ApplicationDefinition.SearchDefinition(defns[k]);
                            defn.category = oCategory;
                            oCategory.searchDefinitions[defn.id] = defn;
                            this.searchDefinitions[defn.id] = defn;
                        }
                    }
                }
            }
            
        }
    },
    
    /**
     * Function: create
     *
     * Create the application definition.  This actually triggers initializing
     * every widget and container.
     */
    create: function() {
        for (var i=0; i<this.widgetSets.length; i++) {
            this.widgetSets[i].create(this);
        }
    },
    
    /**
     * Function: getMapByName
     *
     * return a map widget with the given name
     *
     * Parameter: {String} name
     *
     * The map name to return
     *
     * Returns: {Object} a map object or null if not found.
     */
    getMapByName : function(name) {
        var map = null;
        for (var i=0; i<this.widgetSets.length; i++) {
            map = this.widgetSets[i].getMapByName(name);
            if (map) {
                break;
            }
        }
        return map;
    },
    
    /**
     * Function: getMapById
     *
     * return a map widget with the given id
     *
     * Parameter: {String} id
     *
     * The map id to return.  ID is distinct from map.name in that id is the 
     * id of the HTML tag where the map widget is inserted.
     *
     * Returns: {Object} a map object or null if not found.
     */
    getMapById : function(id) {
        var map = null;
        for (var i=0; i<this.widgetSets.length; i++) {
            map = this.widgetSets[i].mapWidget;
            if (map.mapId == id) {
                break;
            }
        }
        return map;
    },
    
    /**
     * Function: getMapByIndice
     *
     * return the map widget at the given index
     *
     * Parameter: {String} indice
     *
     * The map indice to return
     *
     * Returns: {Object} a map object or null if not found.
     */
     getMapByIndice : function(indice) {
         var map = null;
         if (this.widgetSets.length > indice) {
             map = this.widgetSets[indice].getMapWidget();
         }
         return map;
     },
     
    /**
     * Function: getMapGroup
     *
     * return the specified map group from the application definition
     *
     * Parameter: {String} mapgroup
     *
     * The id of the MapGroup to return
     *
     * Returns: {Object} a MapGroup appdef or null if not found.
     */
     getMapGroup : function(mapGroupId) {
         var mapGroup = null;
         for (var i=0; i<this.mapGroups.length; ++i) {
           if (this.mapGroups[i].mapId == mapGroupId) {
             mapGroup = this.mapGroups[i];
             break;
           }
         }
         return mapGroup;
     },
     
     /**
      * Function getWidgetsByType
      *
      * returns an array of widgets by type.
      *
      * Parameter: {String} type
      *
      * the type of widget to get references to
      *
      * Returns: {Array} an array of widgets, which may be empty
      */
     getWidgetsByType: function(type) {
         var widgets = [];
         for (var i=0; i<this.widgetSets.length; i++) {
             widgets = widgets.concat(this.widgetSets[i].getWidgetsByType(type));
         }
         return widgets;
     }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.MapGroup
 *
 * Holds an internal representation of MapGroup objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.MapGroup = OpenLayers.Class({
    initialView: null,
    maps: null,
    
    initialize: function(jsonNode) {
        this.mapId = jsonNode['@id'][0];
        this.maps = [];
        /* parse InitialView */
        if (jsonNode.InitialView) {
            var iv = jsonNode.InitialView[0];
            if (iv.CenterX && iv.CenterY && iv.Scale) {
                this.setInitialView({x:parseFloat(iv.CenterX[0]),
                                     y:parseFloat(iv.CenterY[0]),
                                     scale:parseFloat(iv.Scale[0])});
            } else if (iv.MinX && iv.MinY && iv.MaxX && iv.MaxY) {
                this.setInitialView({minX:parseFloat(iv.MinX[0]),
                                     minY:parseFloat(iv.MinY[0]),
                                     maxX:parseFloat(iv.MaxX[0]),
                                     maxY:parseFloat(iv.MaxY[0])});
            } else {
                //TODO: emit warning that the initial view was incomplete
            }
        }
        /* parse maps */
        if (jsonNode.Map instanceof Array) {
            for (var i=0; i<jsonNode.Map.length; i++) {
                var map = new Fusion.Lib.ApplicationDefinition.Map(jsonNode.Map[i]);
                var links = {groups:[], layers:[]};
                var mapEvents = {layerEvents:{},groupEvents:{}};
                if (jsonNode.Map[i].Extension) {
                    var extension = jsonNode.Map[i].Extension[0];
                    if (extension.Links) {
                        /* process Groups */
                        if (extension.Links[0].Group instanceof Array) {
                            for (var j=0; j<extension.Links[0].Group.length; j++) {
                                var group = extension.Links[0].Group[j];
                                links.groups.push({name:group.Name[0],url:group.Url[0]});
                            }
                        }
                        if (extension.Links[0].Layer instanceof Array) {
                            for (var j=0; j<extension.Links[0].Layer.length; j++) {
                                var layer = extension.Links[0].Layer[j];
                                links.layers.push({name:layer.Name[0],url:layer.Url[0]});
                            }
                        }
                    }
                    /* process layer events */
                    //TODO: Should this be called MapEvents?
                    if (extension.MapEvents) {
                        if (extension.MapEvents[0].Layer instanceof Array) {
                            for (var j=0; j<extension.MapEvents[0].Layer.length; j++) {
                                var layer = extension.MapEvents[0].Layer[j];
                                var layerObj = {};
                                layerObj.name = layer.Name[0];
                                layerObj.onEnable = [];
                                if (layer.OnEnable instanceof Array) {
                                    layerObj.onEnable = this.parseMapEventSubBlock(layer.OnEnable[0]);
                                }
                                layerObj.onDisable = [];
                                if (layer.OnDisable instanceof Array) {
                                    layerObj.onDisable = this.parseMapEventSubBlock(layer.OnDisable[0]);
                                }
                                mapEvents.layerEvents[layerObj.name] = layerObj;
                            }
                        }
                        if (extension.MapEvents[0].Group instanceof Array) {
                            for (var j=0; j<extension.MapEvents[0].Group.length; j++) {
                                var group = extension.MapEvents[0].Group[j];
                                var groupObj = {};
                                groupObj.name = group.Name[0];
                                groupObj.onEnable = [];
                                if (layer.OnEnable instanceof Array) {
                                    groupObj.onEnable = this.parseMapEventSubBlock(group.OnEnable[0]);
                                }
                                groupObj.onDisable = [];
                                if (layer.OnDisable instanceof Array) {
                                    groupObj.onDisable = this.parseMapEventSubBlock(group.OnDisable[0]);
                                }
                                mapEvents.groupEvents[groupObj.name] = groupObj;
                            }
                        }
                    }
                }
                map.mapInfo = {links: links, mapEvents: mapEvents};
                this.maps.push(map);
            }
        } else {
            //TODO: do we need a warning that there are no layers in this map?
        }
    },
    
    parseMapEventSubBlock: function(block) {
        var a = [];
        if (block.Layer && block.Layer instanceof Array) {
            for (var i=0; i<block.Layer.length; i++) {
                var layer = block.Layer[i];
                a.push({type: 'layer', name:layer.Name[0], enable: layer.Enable[0] == 'true' ? true : false});
            }
        }
        if (block.Group && block.Group instanceof Array) {
            for (var i=0; i<block.Group.length; i++) {
                var group = block.Group[i];
                a.push({type: 'group', name:group.Name[0], enable: group.Enable[0] == 'true' ? true : false});
            }            
        }
        return a;
    },
    
    getInitialView: function() {
        return this.initialView;
    },
    
    setInitialView: function(view) {
        this.initialView = view;
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.Map
 *
 * Holds an internal representation of Map objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.Map = OpenLayers.Class({
    type: null,
    singleTile: false,
    extension: null,
    initialize: function(jsonNode) {
        /* TODO: type can be any supported OpenLayers type */
        this.type = jsonNode.Type[0];
        if (jsonNode.SingleTile) {
            var b = jsonNode.SingleTile[0].toLowerCase();
            this.singleTile = (b == "true") ? true : false;
        }
        if (jsonNode.Extension) {
            this.extension = jsonNode.Extension[0];
        } else {
            this.extension = {};
        }
        this.resourceId = this.extension.ResourceId ? this.extension.ResourceId[0] : '';
        if ( !Fusion.Maps[this.type] ) {
          Fusion.require(this.type + '/' + this.type + '.js');
        }
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.WidgetSet
 *
 * Holds an internal representation of WidgetSet objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.WidgetSet = OpenLayers.Class({
    containers: null,
    containersByName: null,
    widgetTags: null,
    widgetTagsByName: null,
    widgetInstances: null,
    mapWidget: null,
    mapId: null,
    initialize: function(jsonNode) {
        this.containers = [];
        this.widgetTags = [];
        this.widgetInstances = [];
        this.widgetTagsByName = {};
        this.containersByName = {};
        /* process map widgets */
        if (jsonNode.MapWidget) {
            for (var i=0; i<jsonNode.MapWidget.length; i++) {
                var widget = new Fusion.Lib.ApplicationDefinition.Widget(jsonNode.MapWidget[i]);
                widget.widgetSet = this;
                this.mapWidgetTag = widget;
                this.mapId = jsonNode.MapWidget[i].MapId[0];
            }
        }
        
        //allow over-ride of mapId via URL parameter
        var paramMapId = Fusion.getQueryParam('mapid');
        if (paramMapId.length>0) {
          this.mapId = paramMapId;
        }
        
        /* process widgets */
        if (jsonNode.Widget) {
            for (var i=0; i<jsonNode.Widget.length; i++) {
                var widget = new Fusion.Lib.ApplicationDefinition.Widget(jsonNode.Widget[i]);
                widget.widgetSet = this;
                this.widgetTags.push(widget);
                this.widgetTagsByName[widget.name] = widget;
            }
        }
        /* process containers */
        if (jsonNode.Container) {
            for (var i=0; i<jsonNode.Container.length; i++) {
                var container = new Fusion.Lib.ApplicationDefinition.Container(jsonNode.Container[i]);
                this.containers.push(container);
                this.containersByName[container.name] = container;
            }
        }
        
    },
    
    /**
     * Function: addWidgetInstance
     *
     * keep track of live widgets created in this widgetSet
     *
     * Parameter: {<Fusion.Widget>} widget
     *
     * the widget to add
     */
    addWidgetInstance: function(widget) {
        this.widgetInstances.push(widget);
    },
    
    /**
     * Function: getMapWidget
     *
     * return the map widget for this widget set
     *
     * Returns: {<Fusion.Lib.Map>} a map widget or null
     */
    getMapWidget: function() {
        return this.mapWidget;
    },
    
    /**
     * Function: create
     *
     * create all the things required by this widgetSet, including
     * containers and widgets.
     *
     * Parameter: {<Fusion.Lib.ApplicationDefinition>} 
     *
     * the application definition that this widgetSet is part of
     */
    create: function(appDef) {

        //find the map group for the map requested
        var mapGroup = null;
        if (this.mapId) {
            for (var i=0; i<appDef.mapGroups.length; ++i) {
              if (this.mapId == appDef.mapGroups[i].mapId) {
                mapGroup = appDef.mapGroups[i];
                break;
              }
            }
        }
        
        //create the Map widget for this WidgetSet
        this.mapWidget = new Fusion.Widget.Map(this.mapWidgetTag,mapGroup,this);
        this.mapWidget.setMenu();
        $(this.mapWidgetTag.name).widget = this.mapWidget;

        //create all the other widgets for the widget set
        for (var i=0; i<this.widgetTags.length; i++) {
            this.widgetTags[i].create(this);
        }

        //create all the containers for the widget set
        for (var i=0; i<this.containers.length; i++) {
            this.containers[i].create(this);
        }
    },
    /**
     * Function: getMapByName
     *
     * return the map widget from this widget set if the map's name
     * matches the requested name, or null.
     *
     * Parameter: {String} name
     *
     * The map name to check
     *
     * Returns: {Object} a map object or null.
     */
    getMapByName : function(name) {
        var map = null;
        if (this.mapWidget.getMapName() == name) {
            map = this.mapWidget;
        }
        return map;
    },
    
    /**
     * Function getWidgetsByType
     *
     * returns an array of widgets by type.
     *
     * Parameter: {String} type
     *
     * the type of widget to get references to
     *
     * Returns: {Array} an array of widgets, which may be empty
     */
    getWidgetsByType: function(type) {
        var widgets = [];
        for (var i=0; i<this.widgetInstances.length; i++) {
            if (this.widgetInstances[i].sType == type) {
                widgets.push(this.widgetInstances[i]);
            }
        }
        return widgets;
    },
    
    getWidgetByName: function(name) {
        return this.widgetTagsByName[name];
    },
    
    getContainerByName: function(name) {
        return this.containersByName[name];
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.Container
 *
 * Holds an internal representation of Container objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.Container = OpenLayers.Class({
    name: null,
    type: null,
    validPositions: ['top', 'left', 'bottom', 'right'],
    position: 'top',
    items: null,
    initialize: function(jsonNode) {
        this.type = jsonNode.Type[0];
        this.name = jsonNode.Name[0];
        var position = jsonNode.Position ? jsonNode.Position[0].toLowerCase() : this.position;
        for (var i=0; i<this.validPositions.length; i++) {
            if (this.validPositions[i] == position) {
                this.position = position;
                break;
            }
        }
        this.items = [];
        if (jsonNode.Item) {
            for (var i=0; i<jsonNode.Item.length; i++) {
                var item = new Fusion.Lib.ApplicationDefinition.Item(jsonNode.Item[i]);
                this.items.push(item);
            }
        } else {
            //TODO: is this a problem if there are no items?
        }
    },
    
    create: function(widgetSet) {
        var container;
        if (this.type == 'Toolbar' || this.type == 'Statusbar') {
            if ($(this.name)) {
                container = new Jx.Toolbar(this.name, this.position);
                $(this.name).container = container;
            }
            this.createWidgets(widgetSet, container);
        } else if (this.type == 'Splitterbar') {
            if ($(this.name)) {
                container = new Jx.Splitter(this.name, {splitInto: this.items.length});
                for (var i=0; i<this.items.length; i++) {
                    container.elements[i].id = this.name + '_' + i;
                }
                $(this.name).container = container;
            }
            this.createWidgets(widgetSet, container);
        }
        if (container && container.domObj.jxLayout) {
            container.domObj.jxLayout.resize({forceResize: true});
        }
    },
    
    createWidgets: function(widgetSet, container) {
        for (var i=0; i<this.items.length; i++) {
            this.items[i].create(widgetSet, container, this.name + '_' + i);
        }
    }
    
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.Widget
 *
 * Holds an internal representation of Widget objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.Widget = OpenLayers.Class({
    name: null,
    type: null,
    statusText: null,
    location: null,
    imageUrl: null,
    imageClass: null,
    tooltip: null,
    label: null,
    disabled: null,
    extension: null,
    initialize: function(jsonNode) {
        if (jsonNode) {
            this.type = jsonNode.Type[0];
            this.name = jsonNode.Name ? jsonNode.Name[0] : '';
            this.statusText = jsonNode.StatusText ? jsonNode.StatusText[0] : '';
            //TODO: this may be an extension
            this.location = jsonNode.Location ? jsonNode.Location[0] : 'widgets/';
            if (this.location.slice(-1) != '/') {
                this.location += '/';
            }
            this.imageUrl = jsonNode.ImageUrl ? jsonNode.ImageUrl[0] : '';
            this.imageClass = jsonNode.ImageClass ? jsonNode.ImageClass[0] : '';
            this.tooltip = jsonNode.Tooltip ? jsonNode.Tooltip[0] : '';
            this.label = jsonNode.Label ? jsonNode.Label[0] : '';
            this.disabled = jsonNode.Disabled ? (jsonNode.Disabled[0].toLowerCase() == 'true' ? true : false) : false;
            
            //console.log('Widget: ' + this.type + ', ' + this.name + ', ' + this.description);
        
            if (jsonNode.Extension) {
                this.extension = jsonNode.Extension[0];
            } else {
                this.extension = {};
            }
            //require the widget code
            if ( !Fusion.Widget[this.type] ) {
              Fusion.require(this.location + this.type + '.js');
            }
        }
    },
    
    getMapWidget: function() {
        if (this.widgetSet) {
            return this.widgetSet.getMapWidget();
        } else {
            return null;
        }
    },
    
    /**
     * Function: create
     *
     * creates a new instance of the widget, optionally using a
     * different name during instantiation to accomodate
     * containers
     *
     * Parameter: name
     *
     * An optional name to use for the widget, overrides the
     * original name temporarily if passed.
     *
     * Returns: an instance of the widget represented by this
     * object.
     */
    create: function(widgetSet, widgetName) {
        var widget = null;
        this.widgetSet = widgetSet;
        var oldName = this.name;
        if (typeof widgetName == 'undefined') {
            widgetName = this.name;
        }
        /* create the widget if the name is not null and the name
         * is either an empty string (in the case of buttons in menus)
         * or something exists in the dom with the right id
         */
        if (widgetName != null && (widgetName == '' || $(widgetName) != null)) {
            this.name = widgetName;
            widget = eval("new Fusion.Widget."+this.type+"(this)");
            widgetSet.addWidgetInstance(widget);
            if ($(this.name)) {
                widget.id = this.name;
                $(this.name).widget = widget;
            }
            this.name = oldName;
        }
        return widget;
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.Item
 *
 * Holds an internal representation of Menu Item objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.Item = OpenLayers.Class({
    uniqueId: [0],
    type: null,
    initialize: function(jsonNode) {
        this.type = jsonNode.Function[0];
        switch(this.type) {
            case 'Widget':
                this.widgetName = jsonNode.Widget[0];
                break;
            case 'Flyout':
                this.flyout = new Fusion.Lib.ApplicationDefinition.Flyout(jsonNode);
                break;
            case 'Separator':   
                break;
                  break;
        }
    },
      
    create: function(widgetSet, container, idx) {
        switch(this.type) {
            case 'Widget':
                var widgetTag = widgetSet.getWidgetByName(this.widgetName);
                if (widgetTag) {
                    var name = 'FusionItem'+this.uniqueId[0];
                    this.uniqueId[0]++;
                    if (container instanceof Jx.Toolbar) {
                        /* create a button for the widget */
                        var tbItem = new Jx.ToolbarItem();
                        tbItem.domObj.id = name;
                        container.add(tbItem);
                        widgetTag.create(widgetSet, name);
                    } else if (container instanceof Jx.Splitter) {
                        var widget = widgetTag.create(widgetSet, idx);
                    } else if (container instanceof Jx.Menu ||
                               container instanceof Jx.ContextMenu ||
                               container instanceof Jx.SubMenu) {
                        var widget = widgetTag.create(widgetSet, '');
                        widget.id = name; 
                        if (widget.oMenu) {   //for widgets that extend MenuBase
                          widget.oMenu.domObj.id = name;
                          widget.oMenu.domObj.widget = widget;
                          container.add(widget.oMenu);
                        } else {
                          var action = new Jx.Action(OpenLayers.Function.bind(widget.activateTool, widget));
                          var opt = {};
                          opt.label = widgetTag.label;
                          opt.image = widgetTag.imageUrl;
                          var menuItem = new Jx.MenuItem(action, opt);
                          menuItem.domObj.id = name;
                          menuItem.domObj.widget = widget;
                          container.add(menuItem);
                        }
                    }
                } else {
                  Fusion.reportError(new Fusion.Error(Fusion.Error.WARNING, 
                    "can't find widget: " + this.widgetName));
                 }
                break;
            case 'Flyout':
                /* create a menu */
                var menu;
                var opt = {};
                opt.label = this.flyout.label;
                opt.tooltip = this.flyout.tooltip;
                opt.image = this.flyout.imageUrl;
                opt.imageClass = this.flyout.imageClass;
                if (container instanceof Jx.Toolbar) {
                    menu = new Jx.Menu(opt);
                } else if (container instanceof Jx.Menu || 
                           container instanceof Jx.ContextMenu || 
                           container instanceof Jx.SubMenu) {
                    menu = new Jx.SubMenu(opt);
                }
                container.add(menu);
                this.flyout.create(widgetSet, menu);
                
                break;
            case 'Separator':
                if (container instanceof Jx.Toolbar) {
                    container.add(new Jx.ToolbarSeparator());
                } else if (container instanceof( Jx.Menu) || 
                           container instanceof(Jx.SubMenu) ||
                           container instanceof(Jx.ContextMenu)) {
                    container.add(new Jx.MenuSeparator());
                }
                break;
        }
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.Flyout
 *
 * Holds an internal representation of Flyout objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.Flyout = OpenLayers.Class({
    label: null,
    tooltip: null,
    description: null,
    imageUrl: null,
    items: null,
    
    initialize: function(jsonNode) {
        this.label = jsonNode.Label ? jsonNode.Label[0] : '';
        this.tooltip = jsonNode.Tooltip ? jsonNode.Tooltip[0] : '';
        this.description = jsonNode.Description ? jsonNode.Description[0] : '';
        this.imageUrl = jsonNode.ImageUrl ? jsonNode.ImageUrl[0] : '';
        this.items = [];
        if (jsonNode.Item instanceof Array) {
            for (var i=0; i<jsonNode.Item.length; i++) {
                this.items.push(new Fusion.Lib.ApplicationDefinition.Item(jsonNode.Item[i]));
            }
        }
    },
    
    create: function(widgetSet, menu) {
        for (var i=0; i<this.items.length; i++) {
            this.items[i].create(widgetSet, menu);
        }
    }
    
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.SearchDefinition
 *
 * Holds an internal representation of SearchDefinition objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.SearchDefinition = OpenLayers.Class({
    id: null,
    name: null,
    category: null,
    parameters: null,
    join: null,
    rule: null,
    
    initialize: function(json) {
        this.id = json['@id'];
        this.name = json['@name'];
        if (json.Join instanceof Array) {
            this.join = new Fusion.Lib.ApplicationDefinition.SearchJoin(json.Join[0]);
        }
        this.parameters = [];
        if (json.Parameter instanceof Array) {
            for (var i=0; i<json.Parameter.length; i++) {
                this.parameters.push(json.Parameter[i]['@name']);
            }
        }
        var rule;
        if (json.SearchAnd instanceof Array) {
            this.rule = new Fusion.Lib.ApplicationDefinition.SearchRule('AND');
            rule = json.SearchAnd[0];
        } else if (json.SearchOr instanceof Array) {
            this.rule = new Fusion.Lib.ApplicationDefinition.SearchRule('OR');
            rule = json.SearchOr[0];
        }
        if (rule && rule.SearchCondition instanceof Array) {
            for (var i=0; i<rule.SearchCondition.length; i++) {
                this.rule.add(new Fusion.Lib.ApplicationDefinition.SearchCondition(rule.SearchCondition[i]));
            }
        }
    },
    
    getJoinUrl: function(params) {
        if (this.join) {
            return '&joinlayer='+this.join.layer+'&joinpk='+this.join.primaryKey+'&joinfk='+this.join.foreignKey;
        } else {
            return '';
        }
    },
    
    getFilterUrl: function(params) {
        return '&filter='+encodeURIComponent(this.rule.toString(params));
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.SearchJoin
 *
 * Holds an internal representation of SearchJoin objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.SearchJoin = OpenLayers.Class({
    layer: null,
    primaryKey: null,
    foreignKey: null,
    initialize: function(json) {
        this.layer = json.Layer ? json.Layer[0] : '';
        this.primaryKey = json.PrimaryKey ? json.PrimaryKey[0] : '';
        this.foreignKey = json.ForeignKey ? json.ForeignKey[0] : '';
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.SearchRule
 *
 * Holds an internal representation of SearchRule objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.SearchRule = OpenLayers.Class({
    type: null,
    conditions: null,
    initialize: function(type) {
        this.type = type;
        this.conditions = [];
    },
    
    add: function(condition) {
        this.conditions.push(condition);
    },
    
    remove: function(condition) {
        for (var i=0; i<this.conditions.length; i++) {
            if (this.conditions[i] == condition) {
                this.conditions.splice(i, 1);
                break;
            }
        }
    },
    
    toString: function(params) {
        var conditions = [];
        for (var i=0; i<this.conditions.length; i++) {
            this.conditions[i].setParams(params);
            var c = this.conditions[i].toString();
            if (c != '') {
                conditions.push(c);
            }
        }
        return '(' + conditions.join(') ' + this.type + ' (') + ')';
    }
});

/****************************************************************************
 * Class: Fusion.Lib.ApplicationDefinition.SearchCondition
 *
 * Holds an internal representation of SearchCondition objects as defined in the AppDef
 *
 */

Fusion.Lib.ApplicationDefinition.SearchCondition = OpenLayers.Class({
    column: null,
    operator: null,
    parameter: null,
    quote: null,
    value: null,
    operators: {eq:'=', like:'like', lt:'<', lte:'<=', gt:'>', gte:'>=', neq:'<>'},
    includeIfEmpty: false,

    initialize: function(json) {
        this.column = json.Column[0];
        this.operator = this.operators[json.Operator[0].toLowerCase()];
        this.parameter = json.Parameter[0];
        this.quote = json['@quote'] ? json['@quote'] : '';
        this.wildcard = json['@wildcard'] ? json['@wildcard'] : 'both';
        this.caseSensitive = true;
        if (json['@caseSensitive'] && json['@caseSensitive'] == 'false') {
            this.caseSensitive = false;
        }
    },

    setParams: function(p) {
        if (p[this.parameter]) {
            this.value = p[this.parameter];
        } else {
            this.value = '';
        }
    },

    toString: function() {
        var value = this.value ? this.value : '';
        if (value == '' && !this.includeIfEmpty) {
            return '';
        }
        var upper = '';
        if (!this.caseSensitive) {
            value = value.toUpperCase();
            upper = 'Upper';
        }
        var prewildcard = '';
        var prewildcard = '';
        var postwildcard = '';
        if (this.operator == 'like') {
            if (this.wildcard == 'before' || this.wildcard == 'both') {
                prewildcard = '*';
            }
            if (this.wildcard == 'after' || this.wildcard == 'both') {
                postwildcard = '*';
            }
        }
        var wildcard = this.operator == 'like' ? '*' : '';
        return upper + '('+this.column + ') ' + this.operator + ' ' + this.quote + prewildcard + value + postwildcard + this.quote;
    }
});
/**
 * Fusion.Lib.MGBroker
 *
 * $Id: MGBroker.js 1393 2008-05-07 17:20:48Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
 
/****************************************************************************
 * Class: Fusion.Lib.MGBroker
 *
 * MGBroker is used to broker requests to the MapGuide Open Source
 * mapagent interface.  It is a very simple class that is configured
 * with a URL and credentials via the setSiteURL method and can
 * send requests to the server via the dispatchRequest method.
 */

Fusion.Lib.MGBroker = OpenLayers.Class({
    /**
     * the URL to a MapGuide Open Source installation.  Set this using
     * setSiteURL
     * @type String
     */
    mapGuideURL : '',
    /**
     * the agent URL for the MapGuide Open Source installation.  Set from
     * setSiteURL
     * @type String
     */
    mapAgentURL : '',
    
    /**
     * default method for communicating with the server, if set
     * this overrides the individual request methods
     */
    method: null,
    
    /**
     * @class
     * MGBroker constructor
     *
     * @constructor
     * create a new MGBroker instance
     */
    initialize : function() { 
    },
    /**
     * send a request to the MapGuide Open Source server using
     * XMLHttpRequest and return the result to the specified
     * function.
     * @param r {Object} an MGRequest-subclass instance that
     *        defines the operation to request.
     * @param f {Function} a function object to invoke when the
     *        XMLHttpRequest call completes
     */
    dispatchRequest : function( r, f ) {
        var s = r.encode() + '&ts='+(new Date()).getTime();
        if (this.method) {
            r.options.method = this.method;
        }
        var a = new OpenLayers.Ajax.Request( this.mapAgentURL, 
            Object.extend({parameters:r.parameters, onComplete:f }, r.options));
        a.originalRequest = r;
    },
    /**
     * set up a connection to a MapGuide Open Source site.  This function
     * expects that url is in the form http(s)://<address>/path-to-mapguide.
     * Path-to-mapguide is should be the base URL to a MapGuide Open
     * Source install.  It is expected that the mapagent is
     * in the expected place (mapagent/mapagent.fcgi) under that URL.  If
     * (for some strange reason) its not, then you can include the full
     * path to mapagent.fcgi in the URL and this function won't try to
     * guess its location.
     * The user name and password are passed on using basic HTML
     * authentication (http://<user>:<pass>@<server>/path-to-mapguide).
     * @param url {String} a properly formatted universal reverse locator
     *        to a MapGuide Open Source installation.
     * @param user {String} a valid user name
     * @param pass {String} the password for the given user.
     */
    setSiteURL : function(url, user, pass) {
        //url = url.replace('://', '://'+user+':'+pass+'@');
        this.user = user;
        this.pass = pass;
        if (url.indexOf('mapagent.fcgi') == -1) {
            if (url.charAt(url.length - 1) != '/') {
                url = url + '/';
            }
            this.mapGuideURL = url;            
            url = url + 'mapagent/mapagent.fcgi';
        }
        this.mapAgentURL = url;
    },
    /**
     * remove all authentication information from the broker
     */
    clearSiteURL: function() {
        this.user = '';
        this.pass = '';
        this.mapGuideURL = '';
        this.mapAgentURL = '';
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest
 *
 * MGRequest is the base class for all broker-compatible requests.  A request
 * is a wrapper around an operation that is supported by the mapagent.
 */
Fusion.Lib.MGRequest = OpenLayers.Class({
    /**
     * core options shared by all requests
     */
    options : null,
    
    /**
     * core parameters shared by all requests
     */
    parameters : null,
    
    /**
     * @constructor
     * initialize a new instance of MGRequest
     */
    initializeRequest : function() {
        this.options = { method:'post' };
        this.parameters = { version : '1.0.0', locale : Fusion.locale, clientagent : 'Fusion Viewer' };
    },
    
    /**
     * set the parameters associated with this request.  Parameters are
     * dependent on the specific MGRequest subclass except for two
     * mandatory parameters, version and locale, that are provided by
     * this base class.
     *
     * @param o {Object} an object that contains named key : value pairs 
     * representing parameters to a request
     */
    setParams : function( o ){ Object.extend( this.parameters, (o || {}) ); },

    /**
     * set the options associated with this request
     * @param o {Object} an object that contains named key : value pairs 
     * representing for a request
     */
    setOptions : function( o ){ Object.extend( this.options, (o || {}) ); },
    
    /**
     * returns a string containing all the request parameters in URL form suitable
     * for appending to a URL.
     * @return {String} the parameters in URL form.
     */
    encode : function() {
        var s = sep = '';
        for (var p in this.parameters) {
            if (this.parameters[p]) {
                s = s + sep + p + '=' + encodeURI(this.parameters[p]);
            }
            sep = '&';
        }
        return s;
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGEnumerateResources
 *
 * encapsulate a request to the server to enumerate resources in the library.
 */
Fusion.Lib.MGRequest.MGEnumerateResources = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of MGEnumerateResources
     *
     * @param resourceID {String} optional parameter indicating the resource
     * to enumerate.  If not set or null, it defaults to "Library://" which
     * is the root of the library.
     *
     * @param type {String} optional parameter indicating the type of resources
     * to enumerate.  If not set, it will default to an empty string which
     * indicates all types will be returned.
     *
     * @param depth {Integer} optional parameter that controls the depth of the
     * resource tree to enumerate.  If not set, it will default to -1 which
     * means the tree will be fully enumerated.
     *
     * @return {Object} an instance of MGEnumerateResources
     */
    initialize : function( resourceID, type, depth ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'ENUMERATERESOURCES',
            resourceid : (resourceID || "Library://"),
            type : (type || ""),
            depth : (typeof depth == 'undefined' ? -1 : depth) } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGGetResourceContent
 *
 * encapsulate a request to the server to get resource contents from the library.
 */
Fusion.Lib.MGRequest.MGGetResourceContent = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGGetResourceContent
     *
     * @param resourceID {String} optional parameter indicating the resource
     * to enumerate.  If not set or null, it defaults to "Library://" which
     * is the root of the library.
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGGetResourceContent
     */
    initialize : function( resourceID ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'GETRESOURCECONTENT',
            resourceid : (resourceID || "Library://")
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGGetResourceHeader
 *
 * encapsulate a request to the server to get resource header from the library.
 */
Fusion.Lib.MGRequest.MGGetResourceHeader = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGGetResourceHeader
     *
     * @param resourceID {String} optional parameter indicating the resource
     * to enumerate.  If not set or null, it defaults to "Library://" which
     * is the root of the library.
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGGetResourceHeader
     */
    initialize : function( resourceID ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'GETRESOURCEHEADER',
            resourceid : (resourceID || "Library://")
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGCreateSession
 *
 * encapsulate a request to the server to create a new session on the server.
 *
 */
Fusion.Lib.MGRequest.MGCreateSession = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGCreateSession
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGCreateSession
     */
    initialize : function( ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'CREATESESSION'
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGCopyResource
 *
 * encapsulate a request to the server to copy a resource.
 *
 */
Fusion.Lib.MGRequest.MGCopyResource = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGCopyResource
     *
     * @param sourceID {String} the Resource ID of the source
     * @param destinationID {String} the Resource ID of the destination
     * @param overwrite {Boolean} overwrite the destination if it exists
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGCopyResource
     */
    initialize : function( sourceID, destinationID, overwrite ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'COPYRESOURCE',
            source : sourceID,
            destination: destinationID,
            overwrite : overwrite
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGDeleteResource
 *
 * encapsulate a request to the server to delete a resource.
 *
 */
Fusion.Lib.MGRequest.MGDeleteResource = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGDeleteResource
     *
     * @param resourceID {String} the id of the resource to delete
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGDeleteResource
     */
    initialize : function( resourceID ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'DELETERESOURCE',
            resourceid : resourceID
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGMoveResource
 *
 * encapsulate a request to the server to move a resource in the repository.
 *
 */
Fusion.Lib.MGRequest.MGMoveResource = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGMoveResource
     *
     * @param sourceID {String} the Resource ID of the source
     * @param destinationID {String} the Resource ID of the destination
     * @param overwrite {Boolean} overwrite the destination if it exists
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGMoveResource
     */
    initialize : function( sourceID, destinationID, overwrite ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'MOVERESOURCE',
            source : sourceID,
            destination : destinationID,
            overwrite : overwrite
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGMoveResource
 *
 * encapsulate a request to the server to set the content XML of a resource.
 *
 */
Fusion.Lib.MGRequest.MGMoveResource = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGMoveResource
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGMoveResource
     */
    initialize : function( resourceID, content, header ) {
        this.initializeRequest();
        this.setParams( {
            method: 'post', /* SetContent requires post method */
            operation : 'SETRESOURCE',
            resourceid : resourceID,
            content : content,
            header : header
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGDescribeSchema
 *
 * encapsulate a request to the server to describe the schema of a FeatureSource.
 *
 */
Fusion.Lib.MGRequest.MGDescribeSchema = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGDescribeSchema
     *
     * @param resourceID {String} the id of the resource to describe the schema for
     * @param schema {String} what does this do?
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGDescribeSchema
     */
    initialize : function( resourceID, schema ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'DESCRIBEFEATURESCHEMA',
            resourceid : resourceID,
            schema : schema
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGGetSpatialContexts
 *
 * encapsulate a request to the server to retrieve the spatial context of a resource.
 *
 */
Fusion.Lib.MGRequest.MGGetSpatialContexts = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGGetSpatialContexts
     *
     * @param resourceID {String} the id of the resource to retrieve the spatial context for
     * @param activeonly {Boolean} what does this do?
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGGetSpatialContexts
     */
    initialize : function(resourceID, activeonly) {
        this.initializeRequest();
        this.setParams( {
            operation : 'GETSPATIALCONTEXTS',
            resourceid : resourceID,
            activeonly : activeonly?'1':'0'
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGEnumerateResourceReferences
 *
 * encapsulate a request to the server to enumerate the references to a resource id.
 *
 */
Fusion.Lib.MGRequest.MGEnumerateResourceReferences = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGEnumerateResourceReferences
     *
     * @param resourceID {String} the id of the resource to retrieve the spatial context for
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGEnumerateResourceReferences
     */
    initialize : function( resourceID ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'ENUMERATERESOURCEREFERENCES',
            resourceid: resourceID
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGEnumerateResourceData
 *
 * encapsulate a request to the server to enumerate the data associated with
 * a FeatureSource
 * N.B. This does not enumerate resource data for 'unmanaged' FeatureSources
 *      (those referencing files or directories outside the respository)
 *      Fusion.Lib.MGRequest.MGDescribeSchema should be used for those sources.
 */
Fusion.Lib.MGRequest.MGEnumerateResourceData = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGEnumerateResourceData
     *
     * @param resourceID {String} the id of the FeatureSource to retrieve data for
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGEnumerateResourceData
     */
    initialize : function( resourceID ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'ENUMERATERESOURCEDATA',
            resourceid: resourceID
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGGetVisibleMapExtent
 *
 * encapsulate a request to the server to enumerate the data associated with
 * a FeatureSource
 * N.B. This does not enumerate resource data for 'unmanaged' FeatureSources
 *      (those referencing files or directories outside the respository)
 *      Fusion.Lib.MGRequest.MGDescribeSchema should be used for those sources.
 */
Fusion.Lib.MGRequest.MGGetVisibleMapExtent = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGGetVisibleMapExtent
     *
     * @param sessionId {String} the id of the session to restore
     * @param mapName {String} the name of the map
     * @param viewCenterX {String} the horizontal center of the view
     * @param viewCenterY {String} the vertical center of the view
     * @param viewScale {String} the scale of the map
     * @param dataExtent {String} the extent of the data 
     * @param displayDpi {String} the DPI of the display
     * @param displayWidth {String} the width of the map
     * @param displayHeight {String} the height of the map
     * @param showLayers {String} a list of layer names to show
     * @param hideLayers {String} a list of layer names to hide
     * @param showGroups {String} a list of group names to show
     * @param hideGroups {String} a list of groupnames to hide
     * @param refreshLayers {String} a list of layers that need to be refreshed
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGGetVisibleMapExtent
     */
    initialize : function( sessionId, mapName, viewCenterX, viewCenterY,
                           viewScale, dataExtent, displayDpi, displayWidth, 
                           displayHeight, showLayers, hideLayers, 
                           showGroups, hideGroups, refreshLayers ) {
        this.initializeRequest();
        this.setParams( {
            operation : 'GETVISIBLEMAPEXTENT',
            session: sessionId,
            mapname: mapName,
            setviewcenterx: viewCenterX,
            setviewcentery: viewCenterY,
            setviewscale: viewScale,
            setdataextent: dataExtent,
            setdisplaydpi: displayDpi,
            setdisplaywidth: displayWidth,
            setdisplayheight: displayHeight,
            showlayers: showLayers,
            hidelayers: hideLayers,
            showgroups: showGroups,
            hidegroups: hideGroups,
            refreshlayers: refreshLayers
        } );
    }
});


/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGQueryMapFeatures
 *
 * encapsulate a request to the server to query map features on 
 * selectable layers
 */
Fusion.Lib.MGRequest.MGQueryMapFeatures = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGQueryMapFeatures
     *
     * @param sessionId {String} the id of the session to restore
     * @param mapName {String} the id of the session to restore
     * @param geometry (sting wkt} gemetry to use for selection.  Example : POLYGON(x1 y1, x2,y2)
     * @param maxFeatures {integer} number of maximum results (-1 to indicate no maximum)
     * @param selectionPersist {boolean} save the selection (valid values are 0 and 1) 
     * @param selectionVariant {String} indicates the spatial operation. Valid values are 'INTERSECTS', ...
     * @param layerNames {String} comma separated list of layer names to include in the query
     * @param layerAttributeFilter {integer} bitmask determining layer selection behaviour (1=visible layers,
     *          2=selectable layers, 4=layers with tooltips)
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGQueryMapFeatures
     */
    initialize : function( sessionId, mapName, geometry, maxFeatures, persist, selectionVariant, layerNames, layerAttributeFilter ) 
    {
        this.initializeRequest();
        this.setParams( {
            operation : 'QUERYMAPFEATURES',
            session: sessionId,
            mapname: mapName,
            geometry: geometry,
            maxFeatures: maxFeatures,
            persist: persist,
            selectionVariant: selectionVariant,
            layerNames: layerNames,
            layerAttributeFilter: layerAttributeFilter
        } );
    }
});

/****************************************************************************
 * Class: Fusion.Lib.MGRequest.MGGetFeatureSetEnvelope
 *
 * encapsulate a request to the server to query map features on 
 * selectable layers
 */
Fusion.Lib.MGRequest.MGGetFeatureSetEnvelope = OpenLayers.Class(Fusion.Lib.MGRequest, {
    /**
     * @constructor
     * initialize a new instance of Fusion.Lib.MGRequest.MGGetFeatureSetEnvelope
     *
     * @param sessionId {String} the id of the session to restore
     * @param mapName {String} the id of the session to restore
     * @param features (String XML} a feature set selection XML
     *
     * @return {Object} an instance of Fusion.Lib.MGRequest.MGGetFeatureSetEnvelope
     */
    initialize : function( sessionId, mapName, features ) 
    {
        this.initializeRequest();
        this.setParams( {
            operation : 'GETFEATURESETENVELOPE',
            session: sessionId,
            mapname: mapName,
            featureSet: features
        } );
    }
});
/**
 * Fusion.Widget
 *
 * $Id: Widget.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /* ***************************************************************************
 * Class: Fusion.Widget
 *
 * This is the base class for all widgets.  It provides some basic
 * functionality that all widgets should need.
 *
 * ***************************************************************************/
 
Fusion.Event.WIDGET_STATE_CHANGED = Fusion.Event.lastEventId++;
 
Fusion.Widget = OpenLayers.Class(Fusion.Lib.EventMgr, {
    bIsMutuallyExclusive: null,
    sName: null,
    sType: null,
    oMap: null,
    bEnabled: false,
    mapLoadedWatcher: null,
    paramRegister: null,
    groups: [],
    group: null,
    domObj: null,
    
    /**
     * initialize the widget
     * @param sName {string} the name of the widget
     */
    initialize: function(widgetTag, bMutEx) {
        this.bIsMutuallyExclusive = bMutEx;
        this.sType = widgetTag.type;
        this.sName = widgetTag.name;
        this.widgetTag = widgetTag;
        this.registerEventID(Fusion.Event.WIDGET_STATE_CHANGED);
        
        var group = widgetTag.extension.Group ? widgetTag.extension.Group[0] : '';
        if (group != '') {
            if (!this.groups[group]) {
                this.groups[group] = [];
            }
            this.groups[group].push(this);
            this.group = group;
        }
        this.setMap(widgetTag.getMapWidget());
        
        if (widgetTag.name) {
            this.domObj = $(widgetTag.name);
        }

        this.paramRegister = [];
    },
    /**
     * set the map object that this widget is associated with
     * @param oMap {Object} the map
     */
    setMap: function(oMap) {
        if (this.mapLoadedWatcher) {
            this.oMap.deregisterForEvent(Fusion.Event.MAP_LOADED, this.mapLoadedWatcher);
            this.mapLoadedWatcher = null;
        }
        
        this.oMap = oMap;
        if (oMap) {
            this.mapLoadedWatcher = OpenLayers.Function.bind(this._mapLoaded, this);
            oMap.registerForEvent(Fusion.Event.MAP_LOADED, this.mapLoadedWatcher);
        }
        
        if (oMap && oMap.isLoaded()) {
            this.enable();
        } else {
            this.disable();
        }
    },
    /**
     * accessor to get the Map object that this widget is associated with
     * @return {object} the map
     */
    getMap: function() {
        return this.oMap;
    },
    
    /**
     * utility method to add an OL control to the OL map object
     */
    addControl: function(control) {
        this.getMap().oMapOL.addControl(control);
    },
    
    /**
     */
    _mapLoaded: function() {
        if (this.oMap && this.oMap.isLoaded()) {
            //console.log('enable');
            this.enable();
        } else {
            //console.log('disable');
            this.disable();
        }
    },
    
    /** 
     * set whether this widget is mutually exclusive on its map
     * @param bIsMutEx {boolean} is the widget mutually exclusive?
     */
    setMutEx: function(bIsMutEx) {
        this.bIsMutuallyExclusive = bIsMutEx;
    },
    
    /**
     * accessor to determine if the widget should be activated mutually
     * exclusively from other widgets on the map.
     * @return {boolean} true if the widget is mutually exclusive
     */
    isMutEx: function() {
        return this.bIsMutuallyExclusive;
    },
    
    /**
     * accessor to return the name of the widget.  Mostly for debugging
     * @return {string} the name of the widget
     */
    getName: function() {
        return this.sName;
    },
    
    /**
     * Method: getLocation
     *
     * returns the location of this widget relative to the installation
     * of fusion.  Can be used to construct URLs to resources that
     * the widget needs.
     *
     * Returns: {String} the location of this widget
     */
    getLocation: function() {
        return this.widgetTag.location;    
    },
    
    isEnabled: function() { return this.bEnabled; },
    
    enable: function() { this.bEnabled = true; this.triggerEvent(Fusion.Event.WIDGET_STATE_CHANGED, this);},

    disable: function() { this.bEnabled = false; this.triggerEvent(Fusion.Event.WIDGET_STATE_CHANGED, this);},

    setParameter : function(param, value){},

    registerParameter : function(param) {
      this.paramRegister.push(param);
    }
});
/**
 * Fusion.Tool.ButtonBase
 *
 * $Id: ButtonBase.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/********************************************
 * Class: Fusion.Tool.ButtonBase
 *
 * Utility base class for a button type widgets.
 *
 * Configurations for the buttons come from :
 * - html area : corresponds to the web layout command name
 * - width,height : default are 20,20. Classes should redifine teh
 *   getButtonWidth and getButtonHeight to provide othe values
 * - imageurl : image that will be used when the button is active.
 *   Default value is read from the web layout command imageurl parameter.
 *   Classes can redifine getImageURL.
 * - imageurl : image that will be used when the button is active.
 *   Default value is read from the web layout command disabledimageurl 
 *   parameter.  Classes can redifine getDisabledImageURL.
 * 
 * Clases inheriting should redefine the function activateTool which is
 * called when the button is clicked
 * **********************************************************************/

 
Fusion.Tool.ButtonBase = OpenLayers.Class({
    /**
     * constructor
     */
    initialize : function() {
        /* overload enable/disable.  Normal inheritance should
         * work but because we use inheritFrom, it doesn't overload
         * Widget's enable/disable functions.  We do it manually
         * here.
         */
        this.enable = Fusion.Tool.ButtonBase.prototype.enable;
        this.disable = Fusion.Tool.ButtonBase.prototype.disable;

        //console.log('Fusion.Tool.ButtonBase.initialize');

        this._oButton = new Fusion.Tool.Button(this.domObj, this.widgetTag);
        if (!this.isEnabled()) {
            this._oButton.disableTool();
        }
        this.clickWatcher = OpenLayers.Function.bind(this.clickCB, this);
        this._oButton.observeEvent('click', this.clickWatcher);
    },
    
    clickCB : function(e) {
        //console.log('Fusion.Tool.ButtonBase.clickCB');
        if (this.isEnabled()) {
            this.activateTool();
        }
        /* I put this in to prevent the context menu from activating tools twice but it doesn't seem to be needed now */
        /* Event.stop(e); */
        //remove the focus on the button to prevent a problem in IE with some
        //buttons retaining their background colour when they shouldn't
        this._oButton._oButton.domObj.blur();
        return false;
    },

    activateTool :  function() {
        //console.log('Fusion.Tool.ButtonBase.activateTool');
        if (this.execute) {
            this.execute();
        }
        if (this.group) {
            this._oButton.activateTool();
            for (var i=0; i<this.groups[this.group].length; i++) {
                if (this.groups[this.group][i] != this) {
                    this.groups[this.group][i]._oButton.deactivateTool();
                }
            }
        }
    },
    
    enable: function() {
        //console.log('button base enable');
        Fusion.Widget.prototype.enable.apply(this,[]);
        if (this._oButton) {
          this._oButton.enableTool();
        }
    },
    
    disable: function() {
        //console.log('button base disable');
        Fusion.Widget.prototype.disable.apply(this,[]);
        if (this._oButton) {
            this._oButton.disableTool();
        }
    }
});
/**
 * Fusion.Tool.MenuBase
 *
 * $Id: MenuBase.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /****************************************************************************
 * Class: Fusion.Tool.MenuBase
 *
 * generic base class for implementing widgets that incorporate a menu
 * **********************************************************************/
 
Fusion.Tool.MenuBase = OpenLayers.Class({
    /**
     * constructor
     */
    initialize : function() {
        //console.log('Fusion.Tool.MenuBase.initialize');
        var options = {};
        options.imgPath = this.widgetTag.imageUrl;
        options.imgClass = this.widgetTag.imageClass;
        options.tooltip = this.widgetTag.tooltip;
        options.label = this.widgetTag.label;

        if ( $(this.widgetTag.name) ) { 
          this.oMenu = new Jx.Menu(options);
          $(this.widgetTag.name).appendChild(this.oMenu.domObj);
        } else {
          this.oMenu = new Jx.SubMenu(options);
        }
    },
    
    enable: function() {
        //TODO: figure out how to enable and disable menu widgets
        Fusion.Widget.prototype.enable.apply(this,[]);
    },
    
    disable: function() {
        Fusion.Widget.prototype.disable.apply(this,[]);
    }
});
/**
 * Fusion.Tool.Button
 *
 * $Id: ButtonTool.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
 
/********************************************
 * Class: Fusion.Tool.Button
 *
 * Utility base class for the actual buttons used by widgets.
 * **********************************************************************/

Fusion.Tool.Button = OpenLayers.Class({
    bActive: null,
    sActiveClass: 'jxButtonActive',
    sDisabledClass: 'jxButtonDisabled',
  
    initialize : function(domObj, widgetTag)  {
        //console.log('Fusion.Tool.Button.initialize');
        var json = widgetTag.extension;
        
        this.buttonAction = new Jx.Action(OpenLayers.Function.bind(this.buttonClicked, this));
        if (domObj) {
            var options = {};
            options.imgPath = widgetTag.imageUrl;
            options.imgClass = widgetTag.imageClass;
            options.tooltip = widgetTag.tooltip;
            options.label = widgetTag.label;
            this._oButton = new Jx.Button(this.buttonAction, options);
            domObj.appendChild(this._oButton.domObj);
        }
        this.bActive = false;
        this.bEnabled = true;
        
        if (widgetTag.disabled) {
            this.disableTool();
        }
    },
    
    buttonClicked: function() {
        
    },

    observeEvent : function(sEvent, fnCB) {
        if (this._oButton) {
             Event.observe(this._oButton.domObj, sEvent, fnCB);
        }
    },
    
    stopObserveEvent : function(sEvent, fnCB) {
        if (this._oButton) {
             Event.stopObserving(this._oButton.domObj, sEvent, fnCB);
        }
    },
    
    enableTool : function() {
        this.buttonAction.setEnabled(true);
    },

    disableTool : function() {
        this.buttonAction.setEnabled(false);
    },

    activateTool : function() {
        //console.log('Fusion.Tool.Button.activateTool');
        this.bActive = true;
        if (!this._oButton) {
            return;
        }
        if (this._sImageURL != null && this._sImageURL.length > 0) {
            this._oButton.setImage(this._sImageURL);
        }
        if (this.sActiveClass != '') {
            Element.addClassName(this._oButton.domA, this.sActiveClass);
        }
    },

    deactivateTool :  function() {
        //console.log('Fusion.Tool.Button.deactivateTool');
        this.bActive = false;
        if (!this._oButton) {
            return;
        }
        if (this.sActiveClass != '') {
            Element.removeClassName(this._oButton.domA, this.sActiveClass);
        }
    },

    clickCB : function(e) { this.activateTool(); },
    isActive: function() {return this.bActive;}
});
/**
 * Fusion.Tool.Canvas
 *
 * $Id: CanvasTool.js 1628 2008-10-31 13:33:48Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/********************************************
 * Class: Fusion.Tool.Canvas
 *
 * Utility base class for drawing features on the map.
 * **********************************************************************/

Fusion.Tool.Canvas = OpenLayers.Class({
    context: null,
    canvas: null,
    width: null,
    height: null,
    
    initialize : function()
    {
        this.context = null;
        this.canvas = null;
        this.width = null;
        this.height = null;
        
        this.mouseMoveCB = OpenLayers.Function.bindAsEventListener(this.mouseMove, this);
        this.mouseUpCB = OpenLayers.Function.bindAsEventListener(this.mouseUp, this);
        this.mouseDownCB = OpenLayers.Function.bindAsEventListener(this.mouseDown, this);
        this.dblClickCB = OpenLayers.Function.bindAsEventListener(this.dblClick, this);
        
        this.resizeCanvasFn = OpenLayers.Function.bind(this.resizeCanvas, this);
    },
    
    /**
     * (public) clearContext()
     *
     * wipe the slate clean
     */
    clearContext: function() {
        //console.log('Fusion.Tool.Canvas.clearContext');
        if (this.context) {
            this.context.clearRect(0,0,this.width,this.height);
        }
    },

    activateCanvas: function() {
        var map = this.getMap();
        map.registerForEvent(Fusion.Event.MAP_RESIZED, this.resizeCanvasFn);
        var domObj = map.getDomObj();
        
        var size = Element.getDimensions(domObj);
        this.width = size.width;
        this.height = size.height;
        
        /* create dynamic canvas */
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            
            // we need to init this for IE 
            if (typeof G_vmlCanvasManager != "undefined") { 
                document.getElementsByTagName('BODY')[0].appendChild(this.canvas);
                G_vmlCanvasManager.initElement(this.canvas); 
                this.canvas = document.getElementsByTagName('BODY')[0].lastChild;
            } 
            
            this.canvas.id = 'featureDigitizer';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0px';
            this.canvas.style.left = '0px';
            this.canvas.style.width = this.width+'px';
            this.canvas.style.height = this.height+'px';
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            //this.canvas.style.zIndex = 99;
            
        }
    
        domObj.appendChild(this.canvas);
        if (!this.context) {
            this.context = this.canvas.getContext('2d');
        }
        this.canvas.style.width = this.width+'px';
        this.canvas.style.height = this.height+'px';
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        map.observeEvent('mousemove', this.mouseMoveCB);
        map.observeEvent('mouseup', this.mouseUpCB);
        map.observeEvent('mousedown', this.mouseDownCB);
        map.observeEvent('dblclick', this.dblClickCB);
    },
    
    resizeCanvas: function() {
        var map = this.getMap();
        var domObj = map.getDomObj();
        var size = Element.getDimensions(domObj);
        this.width = size.width;
        this.height = size.height;
        this.canvas.style.width = this.width+'px';
        this.canvas.style.height = this.height+'px';
        this.canvas.width = this.width;
        this.canvas.height = this.height;        
    },
    
    /**
     * (public) deactivate()
     *
     * deactivate the line digitizing tool
     */
    deactivateCanvas: function() {
        //console.log('Fusion.Tool.Canvas.deactivate');
        var map = this.getMap();
        map.deregisterForEvent(Fusion.Event.MAP_RESIZED, this.resizeCanvasFn);
        map.getDomObj().removeChild(this.canvas);
        this.context.clearRect(0,0,this.width,this.height);
        map.stopObserveEvent('mousemove', this.mouseMoveCB);
        map.stopObserveEvent('mouseup', this.mouseUpCB);
        map.stopObserveEvent('mousedown', this.mouseDownCB);
        map.stopObserveEvent('dblclick', this.dblClickCB);
    },
    
    /**
     * (public) mouseDown(e)
     *
     * handle the mouse down event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseDown: function(e) { },

    /**
     * (public) mouseUp(e)
     *
     * handle the mouse up event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseUp: function(e) { },

    /**
     * (public) mouseMove(e)
     *
     * handle the mouse move event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseMove: function(e) { },

    /**
     * (public) dblClick(e)
     *
     * handle the mouse dblclick event
     *
     * @param e Event the event that happened on the mapObj
     */
    dblClick: function(e) { }
});

/********************************************
 * Class: Fusion.Tool.Canvas.Point
 *
 * Utility base class for drawing point features on the map.
 * **********************************************************************/

Fusion.Tool.Canvas.Point = OpenLayers.Class({
    center: null,
    radius: null,
    lineStyle: null,
    fillStyle: null,
    
    initialize: function(map) {
        this.center = new Fusion.Tool.Canvas.Node(0,0, map);
        this.radius = 5;
        this.lineStyle = new Fusion.Tool.Canvas.Style({lineWidth:2,strokeStyle:'rgba(0,0,0,1.0)'});
        this.fillStyle = new Fusion.Tool.Canvas.Style({fillStyle:'rgba(0,0,255, 0.5)'});
        this.segments = [];
        
    },
    
    setPoint: function(x,y) {
        this.center.set(x,y);
    },
    
    getPoint: function() {
        this.center.updateGeo();
        return {x:this.center.x, y:this.center.y};
    },
    
    draw: function( context ) {
        var x = this.center.px;
        var y = this.center.py;
        var radius = this.radius;
        
        this.fillStyle.apply(context);
        this.lineStyle.apply(context);
        
        context.beginPath();
        context.arc(x,y,radius, 0, 2*Math.PI, 1);
        context.closePath();
        context.fill(); 
        context.stroke();
        
    },

    getNodes: function() {
        return [this.center];
    },

    clean: function() {},
    
    updateGeo: function() {
        this.center.updateGeo();
    },
    
    updatePx: function() {
        this.center.updatePx();
    }
});

/********************************************
 * Class: Fusion.Tool.Canvas.Circle
 *
 * Utility base class for drawing circle features on the map.
 * **********************************************************************/

Fusion.Tool.Canvas.Circle = OpenLayers.Class({
    map: null,
    center: null,
    radius: null,
    radiusPx: null,
    start: null,
    end: null,
    lineStyle: null,
    fillStyle: null,
    
    initialize: function(map) {
        this.map = map;
        this.center = new Fusion.Tool.Canvas.Node(0,0, map);
        this.radius = 1;
        this.lineStyle = new Fusion.Tool.Canvas.Style({lineWidth:2,strokeStyle:'rgba(0,0,0,1.0)'});
        this.fillStyle = new Fusion.Tool.Canvas.Style({fillStyle:'rgba(0,0,255, 0.5)'});
        this.segments = [];
    },
    
    setCenter: function(x,y) {
        this.center.set(x,y);
    },
    
    setRadius: function(r) {
        this.radius = Math.abs(r);
        this.radiusPx = this.map.geoToPixMeasure(this.radius);
    },
    
    draw: function( context ) {
        var x = this.center.px;
        var y = this.center.py;
        var radius = this.radiusPx;
        this.fillStyle.apply(context);
        this.lineStyle.apply(context);
        
        context.beginPath();
        if (this.start && this.end) {
            context.moveTo(x,y);
            var s = this.start;
            var e = this.end;
            if (s < e) {
                var t = s;
                s = e;
                e = t;
            }
            var sx = x + Math.sin(s) * radius;
            var sy = y - Math.cos(s) * radius;
            context.lineTo(sx,sy);
            context.arc(x,y,radius, s - Math.PI/2, e - Math.PI/2, 1);
            context.lineTo(x, y);
        } else {
            context.arc(x,y,radius, 0, 2*Math.PI, 1);
        }
        context.closePath();
        context.fill(); 
        context.stroke();        
    },
    
    getNodes: function() {
        return [this.center];
    },
    
    clean: function() {},
    
    updateGeo: function() {
        this.center.updateGeo();
        this.radius = this.map.pixToGeoMeasure(this.radiusPx);
    },
    
    updatePx: function() {
        this.center.updatePx();
        this.radiusPx = this.map.geoToPixMeasure(this.radius);
    }
});

/********************************************
 * Class: Fusion.Tool.Canvas.Polygon
 *
 * Utility base class for drawing polygon features on the map.
 * **********************************************************************/

Fusion.Tool.Canvas.Polygon = OpenLayers.Class({
    segments: null,
    lineStyle: null,
    fillStyle: null,
    map: null,
    
    initialize: function(map) {
        this.map = map;
        this.segments = [];
        this.lineStyle = new Fusion.Tool.Canvas.Style({lineWidth:2,strokeStyle:'rgba(0,0,0,1.0)'});
        this.fillStyle = new Fusion.Tool.Canvas.Style({fillStyle:'rgba(0,0,255, 0.5)'});
    },

    clean: function() {
        var nodes = this.getNodes();
        this.segments = [];
        var n1 = nodes[0];
        //console.log('n1: '+ n1);
        var n2 = nodes[1];
        for (var i=1; i<nodes.length;i++) {
            if (n1.x != n2.x || n1.y != n2.y) {
                this.addSegment(new Fusion.Tool.Canvas.Segment(n1,n2));
                //console.log('n2: '+ n2);
                n1 = n2;
            }
            n2 = nodes[i];
        }
        
        this.addSegment(new Fusion.Tool.Canvas.Segment(n1, nodes[0]));
        //console.log(this);
    },

    getNodes: function() {
        var nodes = [];
        nodes.push(this.segments[0].from);
        for (var i=0; i<this.segments.length; i++) {
            nodes.push(this.segments[i].to);
        }
        return nodes;
    },

    /*
     * reverse the nodes in the feature
     * and adjust segments
     */
    reverseNodes: function() {
        var nSegments = this.segments.length;
        if (!nSegments) {
            return;
        }
        //flip nodes on each segment
        for (var i=0; i < nSegments; i++) {
            var seg = this.segments[i];
            var tmp = seg.from;
            seg.from = seg.to;
            seg.to = tmp;
        };
        //reverse segment order
        this.segments.reverse();
    },
    
    /*
     * remove node from the nodes in this feature
     * and adjust segments
     */
    removeNode: function(node) {
        //end cases
        if (node == this.segments[0].from) {
            this.segments[0].from = null;
            this.segments.shift();
            this.segments[0].from = this.segments[this.segments.length - 1].to;
            return;
        }
        if (node == this.segments[this.segments.length -1].from) {
            this.segments[this.segments.length -1].from = null;
            this.segments.pop();
            this.segments[0].from = this.segments[this.segments.length - 1].to;
            return;
        }
        //general case
        for (var i=1; i < this.segments.length; i++) {
            if (node == this.segments[i].from){
                this.segments[i-1].to = this.segments[i].to;
                this.segments[i].from = null;
                this.segments.splice(i, 1);
                return;
            }
        };
        
    },
    
    draw: function( context ) {
        var x = this.segments[0].from.px;
        var y = this.segments[0].from.py;
        if (this.segments.length > 2) {
            /* draw closing line and fill */
        
            this.fillStyle.apply(context);
            context.beginPath();
            context.moveTo(x,y);
            for (var i=0; i<this.segments.length; i++) {
                var s = this.segments[i];
                context.lineTo(s.to.px, s.to.py);         
            }
            context.lineTo(x,y); //closing line
            context.closePath();
            context.fill(); 
        }
        /* draw outline */
        this.lineStyle.apply(context);
        for (var i=0; i<this.segments.length; i++) {
            this.segments[i].draw(context);
        }
    
        var last = this.lastSegment();
        context.beginPath();
        context.moveTo(last.to.px,last.to.py);
        context.lineTo(x,y);
        context.stroke();
    },

    addSegment: function( s ) {
        s.normalStyle = this.lineStyle;
        this.segments[this.segments.length] = s;
        //console.log('add segment ' + s);
    },

    lastSegment: function() {
        return this.segments[this.segments.length-1];
    },

    /* find the segment with the given node as its end
     * @param Object node - the node at the end
     * @param Int tolerance - an optional tolerance in pixels
     * @return the segment or null if nothing is found.
     */
     segmentTo: function(node) {
         var margin = arguments.length > 1?arguments[1]:3;
         for (var i=0; i<this.segments.length; i++) {
             if (this.segments[i].hasTo(node, margin)) {
                 return this.segments[i];
             }
         }
         return null;        
     },

    /* find the segment with the given node as its start
     * @param Object node - the node at the start
     * @param Int tolerance - an optional tolerance in pixels
     * @return the segment or null if there is none.
     */
     segmentFrom: function(node) {
         var margin = arguments.length > 1?arguments[1]:3;
         for (var i=0; i<this.segments.length; i++) {
             if (this.segments[i].hasFrom(node, margin)) {
                 return this.segments[i];
             }
         }
         return null;        
     },

    /* extend an existing line by creating a new segment attached
     * to the last segment
     * @return the new segment
     */
    extendLine: function() {
        var last = this.lastSegment();
        var newNode = new Fusion.Tool.Canvas.Node(last.to.x, last.to.y, this.map);
        var newSegment = new Fusion.Tool.Canvas.Segment( last.to, newNode );
        this.addSegment(newSegment);
        return newSegment;  
    },

    /* determine if the passed pixel coordinate is within this feature
     * @param point Object - {px,py} representation of point
     * @return true if the point is contained
     *
     * uses crossing test (Jordan Curve Theorem) algorithm discussed at
     * http://www.acm.org/tog/editors/erich/ptinpoly/
     */
    contains: function(node) {
        return true;  
    },
    
    
    toString: function() {
        var szFeature = this.segments[0].from.toString();
        for (var i=0; i < this.segments.length; i++) {
            szFeature += ',' + this.segments[i].to.toString();
        }
        return 'POLYGON(' + szFeature + ')';
    },
    
    updateGeo: function() {
        for (var i=0; i < this.segments.length; i++) {
            this.segments[i].updateGeo();
        }
    },
    
    updatePx: function() {
        for (var i=0; i < this.segments.length; i++) {
            this.segments[i].updatePx();
        }
    }
});

/********************************************
 * Class: Fusion.Tool.Canvas.line
 *
 * Utility base class for drawing line features on the map.
 * **********************************************************************/

Fusion.Tool.Canvas.Line = OpenLayers.Class({
    segments: null,
    lineStyle: null,
    map: null,
    
    initialize: function(map) {
        this.map = map;
        this.segments = [];
        this.lineStyle = new Fusion.Tool.Canvas.Style({strokeStyle:'rgba(0,0,0,1.0)'});
    },

    clean: function() {
        var nodes = this.getNodes();
        this.segments = [];
        var n1 = nodes[0];
        var n2 = nodes[1];
        for (var i=1; i<nodes.length;i++) {
            //console.log('n1: '+ n1);
            //console.log('n2: '+ n2);
            n2 = nodes[i];
            if (n1.x != n2.x || n1.y != n2.y) {
                this.addSegment(new Fusion.Tool.Canvas.Segment(n1,n2));
                n1 = n2;
            }
        }
        //console.log(this);
    },

    getNodes: function() {
        var nodes = [];
        nodes.push(this.segments[0].from);
        for (var i=0; i<this.segments.length; i++) {
            nodes.push(this.segments[i].to);
        }
        return nodes;
    },

    /*
     * reverse the nodes in the feature
     * and adjust segments
     */
    reverseNodes: function() {
        var nSegments = this.segments.length;
        if (!nSegments) {
            return;
        }
        //flip nodes on each segment
        for (var i=0; i < nSegments; i++) {
            var seg = this.segments[i];
            var tmp = seg.from;
            seg.from = seg.to;
            seg.to = tmp;
        };
        //reverse segment order
        this.segments.reverse();
    },
    
    /*
     * remove node from the nodes in this feature
     * and adjust segments
     */
    removeNode: function(node) {
        //end cases
        if (node == this.segments[0].from) {
            this.segments[0].from = null;
            this.segments.shift();
            return;
        }
        if (node == this.segments[this.segments.length -1].from) {
            this.segments[this.segments.length -1].from = null;
            this.segments.pop();
            return;
        }
        //general case
        for (var i=1; i < this.segments.length; i++) {
            if (node == this.segments[i].from){
                this.segments[i-1].to = this.segments[i].to;
                this.segments[i].from = null;
                this.segments.splice(i, 1);
                return;
            }
        };
        
    },

    draw: function( context ) {
        for (var i=0; i<this.segments.length; i++) {
            this.segments[i].draw(context);
        }
    },

    addSegment: function( s ) {
        s.normalStyle = this.lineStyle;
        this.segments[this.segments.length] = s;
    },

    lastSegment: function() {
        return this.segments[this.segments.length-1];
    },

    /* find the segment with the given node as its end
     * @param Object node - the node at the end
     * @param Int tolerance - an optional tolerance in pixels
     * @return the segment or null if nothing is found.
     */
     segmentTo: function(node) {
         var margin = arguments.length > 1?arguments[1]:3;
         for (var i=0; i<this.segments.length; i++) {
             if (this.segments[i].hasTo(node, margin)) {
                 return this.segments[i];
             }
         }
         return null;        
     },

    /* find the segment with the given node as its start
     * @param Object node - the node at the start
     * @param Int tolerance - an optional tolerance in pixels
     * @return the segment or null if there is none.
     */
     segmentFrom: function(node) {
         var margin = arguments.length > 1?arguments[1]:3;
         for (var i=0; i<this.segments.length; i++) {
             if (this.segments[i].hasFrom(node, margin)) {
                 return this.segments[i];
             }
         }
         return null;        
     },

    /* extend an existing line by creating a new segment attached
     * to the last segment
     * @return the new segment
     */
    extendLine: function() {
        var last = this.lastSegment();
        var newNode = new Fusion.Tool.Canvas.Node(last.to.x, last.to.y, this.map);
        var newSegment = new Fusion.Tool.Canvas.Segment( last.to, newNode );
        this.addSegment(newSegment);
        return newSegment;  
    },
    
    updateGeo: function() {
        for (var i=0; i < this.segments.length; i++) {
            this.segments[i].updateGeo();
        }
    },
    
    updatePx: function() {
        for (var i=0; i < this.segments.length; i++) {
            this.segments[i].updatePx();
        }
    }
});

/********************************************
 * Class: Fusion.Tool.Canvas.Segment
 *
 * Utility base class for drawing line segments on the map.
 * **********************************************************************/

Fusion.Tool.Canvas.Segment = OpenLayers.Class({
    from: null,
    to: null,
    
    initialize: function(from, to) {
        this.from = from;
        this.to = to;
        this.isEditing = false;
        this.normalStyle = new Fusion.Tool.Canvas.Style({lineWidth:1, strokeStyle:'rgba(0,0,0,1.0)'});
        this.editStyle = new Fusion.Tool.Canvas.Style({lineWidth:1, strokeStyle:'rgba(255,0,0,1.0)'});
    },

    /* returns true if the node is at the end of this segment
     * within the given margin
     * @return Bool true if found within margin, false otherwise
     */
    hasTo: function(node, margin) {
        return this.to.near({x:node.px, y:node.py}, margin);
    },

    /* returns true if the node is at the start of this segment
     * within the given margin
     * @return Bool true if found within margin, false otherwise
     */
    hasFrom: function(node, margin) {
        return this.from.near({x:node.px, y:node.py}, margin);
    },
    
    /* returns true if the given point falls along this segment
     * within the given margin
     * @return Bool true if found within margin, false otherwise
     */
    intersectsPoint: function(point, margin){
        //check bbox
        var minX = Math.min(this.to.px, this.from.px);
        var maxX = Math.max(this.to.px, this.from.px);
        if (point.x > maxX || point.x < minX){return false;};
        var maxY = Math.max(this.to.py, this.from.py);
        var minY = Math.min(this.to.py, this.from.py);
        if (point.y < minY || point.y > maxY){return false;};
        
        //determine slope
        var slope = parseFloat((maxY-minY))/(maxX-minX);
        var segY = slope * (point.x - minX) + minY;
        return (segY - margin < point.y && segY + margin > point.y);

    },
    
    setNormalStyle: function( style ) {
        this.normalStyle = style;
    },

    setEditStyle: function( style ) {
        this.editStyle = style;
    },

    draw: function( context ) {
        /* set up correct style */
        if (this.isEditing) {
            this.editStyle.apply(context);
        } else {
            this.normalStyle.apply(context);
        }
    
        /* draw segment */
        context.beginPath();
        context.moveTo(this.from.px, this.from.py);
        context.lineTo(this.to.px, this.to.py);
        context.closePath();
        context.stroke();
    
        /* draw nodes if editing */
        if (this.isEditing) {
            this.from.draw( context );
            this.to.draw( context );
        }
    },

    /* changes rendering style */
    setEditing: function(bEditing) {
        this.isEditing = bEditing;
    },
    
    toString: function() {
        return this.from.toString() + ', '+ this.to.toString();
    },
    
    updateGeo: function() {
        this.from.updateGeo();
        this.to.updateGeo();
    },
    
    updatePx: function() {
        this.from.updatePx();
        this.to.updatePx();
    }
});

/********************************************
 * Class: Fusion.Tool.Canvas.Node
 *
 * Utility base class to hold nodes that make up otherr features
 * **********************************************************************/

Fusion.Tool.Canvas.Node = OpenLayers.Class({
    x: null,
    y: null,
    px: null,
    py: null,
    uid: null,
    map: null,
    counter: [0],
    isSelected: false,
    
    initialize: function(x,y, map) {
        this.map = map;
        this.set(x,y);
        var p = map.geoToPix(x, y);
        this.setPx(p.x, p.y);
        this.radius = 3;
        this.uid = this.counter[0];
        this.counter[0]++;
        this.normalStyle = new Fusion.Tool.Canvas.Style({lineWidth:1, strokeStyle:'rgba(0,0,0,1.0)'});
        this.selectedStyle = new Fusion.Tool.Canvas.Style({lineWidth:1, fillStyle:'rgba(255,0,0,1.0)',
                                                strokeStyle:'rgba(255,0,0,1.0)'});
    },

    set: function(x,y) {
        this.x = x;
        this.y = y;
        //update px position
        var p = this.map.geoToPix(x, y);
        this.setPx(p.x, p.y);
    },
    
    setPx: function(px, py) {
        this.px = px;
        this.py = py;
    },
    
    updateGeo: function() {
        if (!this.px || !this.py) {return;};
        var g = this.map.pixToGeo(this.px, this.py);
        this.set(g.x, g.y);
    },
    
    updatePx: function() {
        if (!this.x || !this.y) {return;};
        var p = this.map.geoToPix(this.x, this.y);
        this.setPx(p.x, p.y);
    },
    
    /* returns true if the supplied pixel position is
     * within the given tolerance
     * @return Bool true if found within margin, false otherwise
     */
     /*TODO: uses a square envelope for speed but could use radius
      *TODO: should support geographic tolerance
      */
    near: function(point, tolerance) {
        var minX = point.x - tolerance;
        var maxX = point.x + tolerance;
        var maxY = point.y + tolerance;
        var minY = point.y - tolerance;
        return ((this.px > minX && this.px < maxX) && (this.py > minY && this.py < maxY))?true:false;
    },

    /* returns true if this node is
     * within the given bbox
     * @param Array bbox - array of pixel coordinates to search within
     * @return Bool true if found within, false otherwise
     */
    within: function(bbox) {
        //TODO: handle > 2 coord pairs
        var minX = Math.min(bbox[0], bbox[2]);
        var maxX = Math.max(bbox[0], bbox[2]);
        var minY = Math.min(bbox[1], bbox[3]);
        var maxY = Math.max(bbox[1], bbox[3]);
        return ((this.px > minX && this.px < maxX) && (this.py > minY && this.py < maxY))?true:false;
    },

    /* draw a node on a canvas. */
    draw: function( context ) {
        /* set up correct style */
        if (this.isSelected) {
            this.selectedStyle.apply(context);
        } else {
            this.normalStyle.apply(context);
        }

        context.beginPath();
        context.arc(this.px, this.py, this.radius, 0, 2*Math.PI,1);
        context.closePath();
        context.stroke();
        if(this.isSelected){
            context.fill();
        };
    },
    
    /* changes rendering style */
    setSelected: function(bSelected) {
        this.isSelected = bSelected;
    },

    toString: function() {
        return '('+this.uid+') '+ this.x + ' ['+this.px+'px] '+ this.y+ ' ['+this.py+'px] ';
    }
});

/* encapsulate a context style */
/********************************************
 * Class: Fusion.Tool.Canvas.Style
 *
 * Utility base class to encapsulate a context style.
 * **********************************************************************/

Fusion.Tool.Canvas.Style = OpenLayers.Class({
    properties: ['fillStyle',
                 'globalAlpha',
                 'globalCompositeOperation',
                 'lineCap',
                 'lineJoin',
                 'lineWidth',
                 'miterLimit',
                 'shadowBlur',
                 'shadowColor',
                 'shadowOffsetX',
                 'shadowOffsetY',
                 'strokeStyle'],
    
    initialize: function( o ) { 
        for (var i=0; i<this.properties.length; i++) {
            var p = this.properties[i];
            this[p] = o[p] ? o[p]:null;
        }
    },

    set: function( p, v ) {
        this[p] = v;
    },

    apply: function(context) {
        for (var i=0; i<this.properties.length; i++) {
            var p = this.properties[i];
            if (this[p]) {
                context[p] = this[p];
            }
        }
    }
});
/**
 * Fusion.Tool.Click
 *
 * $Id: ClickTool.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /****************************************************************************
 * Class: Fusion.Tool.Click
 *
 * Utility class to manage a click on the map (mouse up event).
 *
 * All classes using this should redefine the execute function
 * **********************************************************************/

Fusion.Tool.Click = OpenLayers.Class({
    /**
     * constructor
     * @param oMap {Object} a map widget
     */
    initialize : function()
    {
        this.mouseUpCB = OpenLayers.Function.bindAsEventListener(this.mouseUp, this);
    },

    execute : function(x,y)
    {
    },

    activateClickTool : function()
    {
        //console.log('Fusion.Tool.Click.activateClickTool');
        if (this.oMap) {
            this.oMap.observeEvent('mouseup', this.mouseUpCB);
        }
    },

    deactivateClickTool : function()
    {
        //console.log('Fusion.Tool.Click.deactivateClickTool');
        if (this.oMap) {
            this.oMap.stopObserveEvent('mouseup', this.mouseUpCB);
        }
    },


    mouseUp : function(e)
    {
        //console.log('Fusion.Tool.Click.mouseUp');
        if (OpenLayers.Event.isLeftClick(e)) {
            var sPixPoint = this.oMap.getEventPosition(e);
            this.execute(sPixPoint.x, sPixPoint.y);
        }
    }
});
/**
 * Fusion.Tool.Rectangle
 *
 * $Id: RectTool.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Tool.Rectangle
 * 
 * Utility class to draw a rectangle on the map and return the coordinates
 * through the doAction function.
 * All classes should redifine the doAction function
 * **********************************************************************/
Fusion.Tool.Rectangle = OpenLayers.Class({
    oRectDiv : null,
    _sStartPos : null,
    _bIsActive : null,

    /**
     * constructor
     * @param oMap {Object} a map widget
     */
    initialize : function() {
        //console.log('Fusion.Tool.Rectangle.initialize');
        this.oRectDiv = document.createElement('div');
        this.oRectDiv.style.position = 'absolute';
        this.oRectDiv.style.border = '1px solid red';
        this.oRectDiv.style.top = '0px';
        this.oRectDiv.style.left = '0px';
        this.oRectDiv.style.width = '1px';
        this.oRectDiv.style.height = '1px';
        this.oRectDiv.style.visibility = 'hidden';
        this.oRectDiv.style.lineHeight = '1px'; //for IE
        this.oRectDiv.style.zIndex = 99;

        this._bIsActive = false;

        this.mouseMoveCB = OpenLayers.Function.bindAsEventListener(this.mouseMove, this);
        this.mouseUpCB = OpenLayers.Function.bindAsEventListener(this.mouseUp, this);
        this.mouseDownCB = OpenLayers.Function.bindAsEventListener(this.mouseDown, this);
        this.mouseOutCB = OpenLayers.Function.bindAsEventListener(this.mouseOut, this);
    },

    execute : function(l,b,r,t) {},

    activateRectTool : function() {
        //console.log('Fusion.Tool.Rectangle.activateRectTool');
        if (this._bIsActive) {
            //console.log('tool is already active');
            return;
        }
        if (this.oMap) {
            this.oRectDiv.style.left = '0px';
            this.oRectDiv.style.top = '0px';
            this.oRectDiv.style.width = '1px';
            this.oRectDiv.style.height = '1px';
            this.oRectDiv.style.visibility = 'hidden';
            this._bIsActive = true;
            var oDomElem =  this.oMap.getDomObj();
            oDomElem.appendChild(this.oRectDiv);
            this.oMap.observeEvent('mousemove', this.mouseMoveCB);
            this.oMap.observeEvent('mouseup', this.mouseUpCB);
            this.oMap.observeEvent('mousedown', this.mouseDownCB);
        }
    },

    deactivateRectTool : function() {
        this._sStartPos = null;
        //console.log('Fusion.Tool.Rectangle.deactivateRectTool');
        if (!this._bIsActive) {
            //console.log('tool is not active');
            return;
        }
        this._bIsActive = false;
        var oDomElem =  this.oMap.getDomObj();
        oDomElem.removeChild(this.oRectDiv);
        this.oMap.stopObserveEvent('mousemove', this.mouseMoveCB);
        this.oMap.stopObserveEvent('mouseup', this.mouseUpCB);
        this.oMap.stopObserveEvent('mousedown', this.mouseDownCB);
    },

    mouseDown : function (e) {
        if (OpenLayers.Event.isLeftClick(e)) {
            var p = this.oMap.getEventPosition(e);
            this._sStartPos = p;

            this.oRectDiv.style.left = p.x + 'px';
            this.oRectDiv.style.top = p.y + 'px';
            this.oRectDiv.style.width = '1px';
            this.oRectDiv.style.height = '1px';
            this.oRectDiv.style.visibility = 'visible';
            OpenLayers.Event.observe(document, 'mouseout', this.mouseOutCB);
        }
        OpenLayers.Event.stop(e);
    },

    mouseUp : function(e) {
        if (this._sStartPos != null) {
            var t = parseInt(this.oRectDiv.style.top);
            var l = parseInt(this.oRectDiv.style.left);
            var r = l + parseInt(this.oRectDiv.style.width);
            var b = t + parseInt(this.oRectDiv.style.height);
            this.event = e;
            this.execute(l,b,r,t);

            this.oRectDiv.style.left = '0px';
            this.oRectDiv.style.top = '0px';
            this.oRectDiv.style.width = '1px';
            this.oRectDiv.style.height = '1px';
            this.oRectDiv.style.visibility = 'hidden';

            this._sStartPos = null;
            OpenLayers.Event.stop(e);
        }
        OpenLayers.Event.stopObserving(document, 'mouseout', this.mouseOutCB);
    },

    mouseMove : function(e) {
        if (this._sStartPos != null)
        {
            var p = this.oMap.getEventPosition(e);
            var l = this._sStartPos.x;
            var t = this._sStartPos.y;
            var r = p.x;
            var b = p.y;

            this.oRectDiv.style.left = Math.min(l,r) + 'px';
            this.oRectDiv.style.top = Math.min(t,b) + 'px';
            this.oRectDiv.style.width = Math.abs(r-l) + 'px';
            this.oRectDiv.style.height = Math.abs(t-b) + 'px';
            OpenLayers.Event.stop(e);
        }
    },
    
    mouseOut: function(e) {
        var target = e.target || e.srcElement;
        if (target.tagName.toLowerCase() == 'html') {
            this.mouseUp(e);
        }
    }
        
});
/**
 * Fusion.Tool.Search
 *
 * $Id: Search.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Tool.Search
 *
 * The Fusion search mechanism defines a common capability for searches that
 * link individual searches to a common search set maintained for all
 * search-based widgets.  The common search set can be statically and/or
 * dynamically created.  Static definition is done in the WebLayout.  Dynamic
 * creation is done by individual widgets and creating instances of
 * Fusion.Tool.SearchDefinition(s) - or rather a MGSearchDefinition.
 *
 * Widgets that want to take advantage of this behaviour can sub-class this
 * widget.  Just make sure to initialize properly!
 * 
 * **********************************************************************/

Fusion.Tool.Search = OpenLayers.Class({
    lastSearch: null,
    lastResult: null,
    resultOffset: 0,
    initialize : function() {
        //console.log('Fusion.Tool.Search.initialize');
    },
    getProperties: function() {
        var properties = null;
        if (this.lastResult && this.lastResult.properties) {
            properties = this.lastResult.properties;
        }
        return properties;
    },
    getNumberOfProperties: function() {
        var n = 0;
        if (this.lastResult && this.lastResult.properties) {
            n = this.lastResult.properties.length;
        }
        return n;
    },
    getProperty: function(n) {
        var property = '';
        if (this.lastResult && this.lastResult.properties) {
            property = this.lastResult.properties[n];
        }
        return property;
    },
    getNumberOfResults: function() {
        result = 0;
        if (this.lastResult && this.lastResult.values) {
            result = this.lastResult.values.length;
        }
        return result;
    },
    getFirstResult: function() {
        this.resultOffset = 0;
        return this.getResult(this.resultOffset);
    },
    getNextResult: function() {
        this.resultOffset++;
        return this.getResult(this.resultOffset);
    },
    getResult: function(idx) {
        result = null;
        if (this.lastResult && this.lastResult.values) {
            result = this.lastResult.values[idx];
        }
        return result;
    },
    zoomToResult: function(filter) {
        //console.log('zoomTo ' + filter);
        var filter = '&filter='+filter;
        
        var s = this.getMap().arch + '/' + Fusion.getScriptLanguage() + "/Query." + Fusion.getScriptLanguage() ;
        var params = {};
        params.parameters = 'session='+this.getMap().getSessionID()+'&mapname='+ this.getMap().getMapName()+
                         '&layers='+this.layerName+filter; 
        params.onComplete = OpenLayers.Function.bind(this.selectComplete, this);
        Fusion.ajaxRequest(s, params);
    },
    selectComplete: function(r) {
        var node = new DomNode(r.responseXML);
        var success = node.getNodeText('Selection');
        if (success == 'true') {
            this.getMap().newSelection();
            this.getMap().getSelection(OpenLayers.Function.bind(this.zoomToSelection, this));
        }    
    },
    /**
     * set the extents of the map based on the pixel coordinates
     * passed
     * 
     * @param selection the active selection, or null if there is none
     */
    zoomToSelection : function(selection) {
        var ll = selection.getLowerLeftCoord();
        var ur = selection.getUpperRightCoord();
        //buffer extents (zoom out by factor of two)
        var dX = ur.x - ll.x;
        var dY = ur.y - ll.y;
        ll.x = ll.x - dX;
        ur.x = ur.x + dX;
        ll.y = ll.y - dY;
        ur.y = ur.y + dY;
        this.getMap().setExtents(new OpenLayers.Bounds(ll.x,ll.y,ur.x,ur.y));
    }
});

/**
 * Fusion.Widget.Map
 *
 * $Id: Map.js 1577 2008-10-01 14:45:17Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /****************************************************************************
 * Class: Fusion.Widget.Map 
 *
 * generic class for map widgets. Provides common utility classes.
 * **********************************************************************/

Fusion.Event.MAP_EXTENTS_CHANGED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_BUSY_CHANGED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_GENERIC_EVENT = Fusion.Event.lastEventId++;
Fusion.Event.MAP_RESIZED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_SELECTION_ON = Fusion.Event.lastEventId++;
Fusion.Event.MAP_SELECTION_OFF = Fusion.Event.lastEventId++;
Fusion.Event.MAP_ACTIVE_LAYER_CHANGED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_LOADED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_LOADING = Fusion.Event.lastEventId++;
Fusion.Event.MAP_RELOADED = Fusion.Event.lastEventId++;
Fusion.Event.MAP_SESSION_CREATED = Fusion.Event.lastEventId++;


Fusion.Constant.LAYER_POINT_TYPE = 0;
Fusion.Constant.LAYER_LINE_TYPE = 1;
Fusion.Constant.LAYER_POLYGON_TYPE = 2;
Fusion.Constant.LAYER_SOLID_TYPE = 3;
Fusion.Constant.LAYER_RASTER_TYPE = 4;
Fusion.Constant.LAYER_DWF_TYPE = 5;

Fusion.Widget.Map = OpenLayers.Class(Fusion.Lib.EventMgr, {
    _oDomObj : null,
    _sDomObj : '',
    _sMapname : '',  
    _nWidth : -1,
    _nHeight : -1,  
    _fMetersperunit : -1,
    _fScale : -1,
    _nDpi : 96,
    _oCurrentExtents: null,
    maxExtent: new OpenLayers.Bounds(),
    _nWorkers: 0,
    oContextMenu: null,
    bSupressContextMenu: false,
    
    aMaps: null,
    layerRoot: null,
    singleTile: true,
    fractionalZoom: true,  //TODO: set this in AppDef?
    maxScale: null, //set this to a large number in AppDef to zoom out beyond maxExtent, e.g. 1 billion
    
    /**
     * construct a new view Fusion.Widget.Map class.  
     */
    initialize : function(widgetTag, mapGroup, widgetSet) {    
        this.widgetTag = widgetTag;
        var name = widgetTag.name;
        
        this.widgetSet = widgetSet;
        this._nCellSize = -1;
        this._sDomObj = name;
        this._oDomObj = $(this._sDomObj);
        this.layerRoot = new Fusion.Widget.Map.Group();
        
        if (this._oDomObj.jxLayout) {
            this._oDomObj.jxLayout.addSizeChangeListener(this);
        }
        
        if (widgetTag.extension.FractionalZoom) {
          this.fractionalZoom = widgetTag.extension.FractionalZoom[0]=='false'?false:true;
        }
        
        var scalesArray = null;
        if (widgetTag.extension.Scales) {
          scalesArray = widgetTag.extension.Scales[0].split(',');
          this.fractionalZoom = false;
        }
        
        //Set a MaxScale in MapWIdget extension to allow zoom out to that scale
        //otherwise, MaxScale is calculated automatically
        if (widgetTag.extension.MaxScale) {
          this.maxScale = parseInt(widgetTag.extension.MaxExtent[0]);
        }
        
        var maxExtent = null;
        if (widgetTag.extension.MaxExtent) {
          maxExtent = OpenLayers.Bounds.fromString(widgetTag.extension.MaxExtent[0]);
        }
        
        OpenLayers.DOTS_PER_INCH = this._nDpi;
        if (!this.oMapOL) {
            var options = {
                controls: [], 
                fallThrough: true,
                scales: scalesArray,
                fractionalZoom: this.fractionalZoom
            };
            if (widgetTag.extension.ConstrainMapExtent) {
              this.bRestrictExtent = widgetTag.extension.ConstrainMapExtent[0]=='true'?true:false;
            }
            if (maxExtent) {
              options.maxExtent = maxExtent;
              this.maxExtent = maxExtent;
            }
            this.oMapOL = new OpenLayers.Map(this._sDomObj, options );
        }
        
        this.oMapOL.viewPortDiv.style.position = 'absolute';  //not the top level container so set it to absolute
        this.oMapOL.viewPortDiv.style.zIndex = 0;   //must explicitly set the z-index for FF3
        
        //add in the handler for mouse wheel actions
        var useMouseWheel = true;
        if (widgetTag.extension.DisableMouseWheel && 
            widgetTag.extension.DisableMouseWheel[0] == 'true') {
            useMouseWheel = false;
        }
        if (useMouseWheel) {
          this.wheelHandler = new OpenLayers.Handler.MouseWheel(this, 
                                            {"up"  : this.wheelUp,
                                             "down": this.wheelDown} );
          this.wheelHandler.map = this.oMapOL;
          this.wheelHandler.activate();
        }
       
        //create the 'Map' layer widgets defined in the MapGroup
        this.aMaps = [];
        this.mapGroup = mapGroup;
        for (var i=0; i<mapGroup.maps.length; ++i) {
          var mapTag = mapGroup.maps[i];
          if (Fusion.Maps[mapTag.type]) {
              this.aMaps[i] = eval("new Fusion.Maps."+mapTag.type+"(this,mapTag)");
              this.layerRoot.addGroup(this.aMaps[i].layerRoot);
              
          } else {
              //TODO: we can add more OpenLayers layers ...
          }
        }
        $(name).widget = this;

        this.registerEventID(Fusion.Event.MAP_EXTENTS_CHANGED);
        this.registerEventID(Fusion.Event.MAP_BUSY_CHANGED);
        this.registerEventID(Fusion.Event.MAP_GENERIC_EVENT);
        this.registerEventID(Fusion.Event.MAP_RESIZED);
        this.registerEventID(Fusion.Event.MAP_ACTIVE_LAYER_CHANGED);
        this.registerEventID(Fusion.Event.MAP_LOADED);
        this.registerEventID(Fusion.Event.MAP_LOADING);
        this.registerEventID(Fusion.Event.MAP_RELOADED);
        this.registerEventID(Fusion.Event.MAP_SELECTION_ON);
        this.registerEventID(Fusion.Event.MAP_SELECTION_OFF);
        
        this.registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.mapLoaded,this));
        
        //register for OL map extent change events
        this.oMapOL.events.register('moveend', this, this.mapExtentsChanged);
        
        this._oDomObj.oncontextmenu = function() {return false;};
        this._oDomObj.onselectstart = function() {return false;};
        OpenLayers.Event.observe(this._oDomObj, 'contextmenu', 
                            OpenLayers.Function.bind(this.onContextMenu, this));
        
        this.aSelectionCallbacks = [];
        this.bFetchingSelection = false;
    },
    
    mapLoaded: function() {
      this.setViewOptions(this.getUnits());
    },
    
    setMenu: function() {  
        if (this.widgetTag.extension.MenuContainer) {
            var contextMenu = new Jx.ContextMenu();
            var container = this.widgetSet.getContainerByName(this.widgetTag.extension.MenuContainer[0]);
            if (container) {
                container.createWidgets(this.widgetSet, contextMenu);
                this.setContextMenu(contextMenu);
            }
            
        }
        
    },
    
    loadMapGroup: function(mapGroup) {
        //clear any existing workers since loading a new map cancels all previous requests
        while (this.isBusy()) {
          this._removeWorker();
        }
        
        //clear any existing selection
        this.clearSelection();
        
        this.mapGroup = mapGroup;
        for (var i=0; i<this.aMaps.length; i++) {
            this.aMaps[i].oLayerOL.destroy();
        }
        
        this.aMaps = [];
        this.layerRoot = new Fusion.Widget.Map.Group();
        for (var i=0; i<mapGroup.maps.length; ++i) {
          var mapTag = mapGroup.maps[i];
          if (Fusion.Maps[mapTag.type]) {
              this.aMaps[i] = eval("new Fusion.Maps."+mapTag.type+"(this,mapTag)");
              this.layerRoot.addGroup(this.aMaps[i].layerRoot);
              
          } else {
              //TODO: we can add more OpenLayers layers ...
          }
        }
    },
    
    /**
     * Method: wheelChange  
     *
     * Parameters:
     * evt - {Event}
     */
    wheelChange: function(evt, deltaZ) {
        var size    = this.oMapOL.getSize();
        var deltaX  = size.w/2 - evt.xy.x;
        var deltaY  = evt.xy.y - size.h/2;
        
        var deltaRes = deltaZ > 0 ? 0.5 : 2;  //TODO: use some sort of factor here
        var newRes  = this.oMapOL.baseLayer.getResolution()*deltaRes;
        var zoomPoint = this.oMapOL.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(
                            zoomPoint.lon + deltaX * newRes,
                            zoomPoint.lat + deltaY * newRes );
        var newBounds = new OpenLayers.Bounds(
                            newCenter.lon - size.w*newRes/2,
                            newCenter.lat - size.h*newRes/2,
                            newCenter.lon + size.w*newRes/2,
                            newCenter.lat + size.h*newRes/2);
        this.setExtents(newBounds);
    },

    /** 
     * Method: wheelUp
     * User spun scroll wheel up
     * 
     * Parameters:
     * evt - {Event}
     */
    wheelUp: function(evt) {
        this.wheelChange(evt, 1);
    },

    /** 
     * Method: wheelDown
     * User spun scroll wheel down
     * 
     * Parameters:
     * evt - {Event}
     */
    wheelDown: function(evt) {
        this.wheelChange(evt, -1);
    },

    /**
     * returns the dom element 
     */
    getDomObj : function() {
        return this._oDomObj;
    },


    getMapName : function() {  
        //TODO: what is the mapname in the case of multiple map layer objects?
        //just return baselayer mapname for now
        return this.aMaps[0].getMapName();
    },

    getMapTitle : function() {  
        //TODO: what is the map title in the case of multiple map layer objects?
        //just return baselayer mapTitle for now
        return this.aMaps[0]._sMapTitle;
    },

    getSessionID : function() {  
        //TODO: what is the mapname in the case of multiple map layer objects?
        //just return baselayer session ID for now
        return this.aMaps[0].getSessionID();
    },

    getDomId : function() {  
        return this._sDomObj;
    },

    setMapOptions: function(options) {
        this.oMapOL.setOptions(options);
    },

    addMap: function(map) {
        if (!map.bSingleTile) {
            this.singleTile = false;
        }
        this.projection = map.projection;
        this.units = map.units;
        this.maxExtent.extend(map._oMaxExtent);
        this.oMapOL.setOptions({
                maxExtent: this.maxExtent,
                units: map.units, 
                projection: this.projection});
        
        //if bRestrictExtent is null, use the default OL behaviour with somewhat restricted map navigation
        //if bRestrictExtent is set to true, map navigation is limited to the map extent
        //if bRestrictExtent is set to false, map navigation is not restricted at all        
        if (this.bRestrictExtent != null) {
          if (this.bRestrictExtent) {
            this.oMapOL.restrictedExtent = map._oMaxExtent;
          } else {
            this.oMapOL.restrictedExtent = false;
          }
        }
        this.oMapOL.addLayer(map.oLayerOL);
        map.registerForEvent(Fusion.Event.MAP_SELECTION_OFF, 
                OpenLayers.Function.bind(this.selectionHandler, this));
        map.registerForEvent(Fusion.Event.MAP_SELECTION_ON, 
                OpenLayers.Function.bind(this.selectionHandler, this));
    },

    getAllMaps: function() {
        return this.aMaps;
    },
    
    //this uses setTimeout so this method can be called from an IFRAME
    reloadMap: function() {
      for (var i=0; i<this.aMaps.length; ++i) {
        var map = this.aMaps[i];
        window.setTimeout(OpenLayers.Function.bind(map.reloadMap, map),1);
      }
    },
    
    /**
     * Function: query
     *
     * dispatch query requests to maps
     */
    query: function(options) {
        for (var i=0; i<this.aMaps.length; i++ ) {
            if (this.aMaps[i].query(options)) {
            }
        }
    },
    
    /**
     * Function: selectionHandler
     *
     * handle selection events from maps and republish for
     * widgets as appropriate
     */
    selectionHandler: function() {
        if (this.hasSelection()) {
            this.triggerEvent(Fusion.Event.MAP_SELECTION_ON);
        } else {
            this.triggerEvent(Fusion.Event.MAP_SELECTION_OFF);
        }
    },
    
    /**
     * Function: hasSelection
     *
     * returns true if any map has a selection
     */
     hasSelection: function() {
         for (var i=0; i<this.aMaps.length; i++ ) {
             if (this.aMaps[i].hasSelection()) {
                 return true;
             }
         }
         return false;
     },
     
     /**
      * Function: clearSelection
      *
      * clear the selection on all maps
      */
     clearSelection: function() {
         this.oSelection = null;
         for (var i=0; i<this.aMaps.length; i++ ) {
             this.aMaps[i].clearSelection();
         }
     },
     
     /**
      * Function: getSelection
      *
      * returns the current selection asynchronously in case we
      * need to retrieve the details from the server
      */
     getSelection: function(callback, layers, startcount) {
       //console.log('map.js : getselection ' + layers);

       var layers = (arguments[1]) ? arguments[1] : '';
       var startcount = (arguments[2]) ? arguments[2] : '';
         this.aSelectionCallbacks.push(callback);
         if (this.bFetchingSelection) {
             return;
         }
         this.bFetchingSelection = true;
         this.oSelection = {};
         this.nSelectionMaps = 0;
         for (var i=0; i<this.aMaps.length; i++ ) {
             this.nSelectionMaps++;
             this.aMaps[i].getSelection( 
                    OpenLayers.Function.bind(this.accumulateSelection, this, this.aMaps[i]), 
                    layers, startcount);
         }
     },

     /**
      * Function: setSelection
      *
      * sets a Selection XML back to the server
      */
      setSelection: function(selText, zoomTo) {
         for (var i=0; i<this.aMaps.length; i++ ) {
             this.aMaps[i].setSelection(selText, zoomTo);
         }
      },

     /**
      * Function: accumulateSelection
      *
      * accumulate the selection results from each map and when all have
      * reported in, pass the results to the callback function
      */
     accumulateSelection: function(map, oSelection) {
         this.oSelection[map._sMapname] = oSelection;
         
         if (!--this.nSelectionMaps) {
             this.bFetchingSelection = false;
             for (var i=0; i<this.aSelectionCallbacks.length; i++) {
                 this.aSelectionCallbacks[i](this.oSelection);
             }
             this.aSelectionCallbacks = [];
         }
     },

     /**
      * Function: setActiveLayer
      *
      * sets the active layer for selection/manipulation
      */
    setActiveLayer: function( oLayer ) {
        this.oActiveLayer = oLayer;
        this.oActiveMap = oLayer.map;
        this.triggerEvent(Fusion.Event.MAP_ACTIVE_LAYER_CHANGED, oLayer);
    },

     /**
      * Function: getActiveLayer
      *
      * returns the active layer for selection/manipulation
      */
    getActiveLayer: function() {
        return this.oActiveLayer;
    },

    /**
     * indicate that a new asynchronous process has started and make sure the
     * visual indicator is visible for the user.  This is intended to be used
     * internally by gMap but could be used by external tools if appropriate.
     */
    _addWorker : function() {
        this._nWorkers += 1;
        this.triggerEvent(Fusion.Event.MAP_BUSY_CHANGED, this);
        this._oDomObj.style.cursor = 'wait';  
    },

    /**
     * indicate that an asynchronous process has completed and hide the
     * visual indicator if no remaining processes are active.  This is 
     * intended to be used internally by gMap but could be used by 
     * external tools if appropriate.  Only call this function if
     * addWorker was previously called
     */
    _removeWorker : function() {
        if (this._nWorkers > 0) {
            this._nWorkers -= 1;
        }
        this.setCursor(this.cursor);
        this.triggerEvent(Fusion.Event.MAP_BUSY_CHANGED, this);
    },
    
    mapExtentsChanged: function() {
        this._oCurrentExtents = this.oMapOL.getExtent();
        this.triggerEvent(Fusion.Event.MAP_EXTENTS_CHANGED);
    },

    isBusy: function() {
        return this._nWorkers > 0;
    },

    sizeChanged: function() {
        this.resize();
    },
    
    resize : function() {
      //console.log('Fusion.Widget.Map.resize');
        this.oMapOL.updateSize();
        var d = Element.getDimensions(this.getDomObj());
        this._nWidth = d.width;
        this._nHeight = d.height;
        if (this._oCurrentExtents) {
          this.setExtents(this._oCurrentExtents);
        }
        this.triggerEvent(Fusion.Event.MAP_RESIZED, this);
    },
    
    redraw: function() {
      for (var i=0; i<this.aMaps.length; i++ ) {
        this.aMaps[i].oLayerOL.params.ts = (new Date()).getTime();
        //mergeNewParams calls redraw on the layer, which will get called below anyway
        //this.aMaps[i].oLayerOL.mergeNewParams({ts : (new Date()).getTime()});
      }
      this.oMapOL.setCenter(this.oMapOL.getCenter(), this.oMapOL.getZoom(), false, true);
    },
    
    setExtents: function(oExtents) {
        if (!oExtents) {
            Fusion.reportError(new Fusion.Error(Fusion.Error.WARNING, 
                                OpenLayers.i18n('nullExtents')));
        }
        if (oExtents instanceof Array && oExtents.length == 4) {
            oExtents = new OpenLayers.Bounds(oExtents[0], oExtents[1], oExtents[2], oExtents[3]);
        }
        
        //update the timestamp param to prevent caching
        for (var i=0; i<this.aMaps.length; i++ ) {
          this.aMaps[i].oLayerOL.params.ts = (new Date()).getTime();
        }
        this.oMapOL.zoomToExtent(oExtents);
        this._oCurrentExtents = this.oMapOL.getExtent();
    },

    /**
     * determine the initialExtents of the map from (in order of precedence):
     * 1. a URL query parameter called 'extent'
     * 2. an <InitialView> specified in the MapGroup in AppDef
     * 3. the maxExtent as specified by the LoadMap call (default)
     */
    setInitialExtents: function() {
      var initialExtents;
      var bbox = Fusion.getQueryParam("extent");   //set as min x,y, max x,y
      if (bbox) {
        initialExtents = new OpenLayers.Bounds.fromArray(bbox.split(","));
      } else if (this.mapGroup.initialView) {
          var iv = this.mapGroup.getInitialView();
          if (iv.x) {
              initialExtents = this.getExtentFromPoint(iv.x, iv.y, iv.scale);                
          } else if (iv.minX) {
              initialExtents = new OpenLayers.Bounds(iv.minX, iv.minY, iv.maxX, iv.maxY);
          }
          if (!initialExtents.intersectsBounds(this.maxExtent)) {
            Fusion.reportError("AppDef initial view is outside map maxExtent, resetting initialView to maxExtent");
            initialExtents = this.maxExtent;
          }
      } else {
        /*
        var viewSize = this.oMapOL.getSize();
        var oExtents = this.oMapOL.getMaxExtent();
        var center = oExtents.getCenterLonLat();
        var initRes = Math.max( oExtents.getWidth()  / viewSize.w,
                                oExtents.getHeight() / viewSize.h);
        var w_deg = viewSize.w * initRes/2;
        var h_deg = viewSize.h * initRes/2;
        initialExtents = new OpenLayers.Bounds(center.lon - w_deg,
                                           center.lat - h_deg,
                                           center.lon + w_deg,
                                           center.lat + h_deg);
        */
        initialExtents = new OpenLayers.Bounds();
        for (var i=0; i<this.aMaps.length; ++i) {
          initialExtents.extend(this.aMaps[i]._oMaxExtent);
        }
      }
      this.initialExtents = initialExtents;
      return initialExtents; 
    },

    /**
     * sets the extent of the map to the max as returned by loadMap
     */
    fullExtents: function() {
      var extents = this.maxExtent;
      this.setExtents(extents); 
    },

    isMapLoaded: function() {
        return (this._oCurrentExtents) ? true : false;
    },

    zoom : function(fX, fY, nFactor) {
        //do this differntly with OL code??
        if (nFactor == 1 || nFactor == 0) {
            /*recenter*/
            this.oMapOL.panTo(new OpenLayers.LonLat(fX, fY));
        } else {
            var extent = this.oMapOL.getExtent();
            if (this.fractionalZoom) {
                var fDeltaX = extent.right - extent.left;
                var fDeltaY = extent.top - extent.bottom;
                var fMinX,fMaxX,fMinY,fMaxY;
                if (nFactor > 0) {
                    /*zoomin*/
                    fMinX = fX - (fDeltaX/2 / nFactor);
                    fMaxX = fX + (fDeltaX/2 / nFactor);
                    fMinY = fY - (fDeltaY/2 / nFactor);
                    fMaxY = fY + (fDeltaY/2 / nFactor);
                } else if (nFactor < 0) {
                    /*zoomout*/
                    fMinX = fX - ((fDeltaX/2) * Math.abs(nFactor));
                    fMaxX = fX + ((fDeltaX/2) * Math.abs(nFactor));
                    fMinY = fY - ((fDeltaY/2) * Math.abs(nFactor));
                    fMaxY = fY + ((fDeltaY/2) * Math.abs(nFactor));
                }
                this.setExtents(new OpenLayers.Bounds(fMinX, fMinY, fMaxX, fMaxY));
            } else {
                var currentZoomLevel = this.oMapOL.getZoom();
                if (nFactor > 1) {
                    this.oMapOL.zoomTo(currentZoomLevel+1);
                } else if (nFactor < 1) {
                    this.oMapOL.zoomTo(currentZoomLevel-1);
                }
            }
        }   
    },
    
    zoomToScale: function(fScale) {
        var center = this.getCurrentCenter();
        var extent = this.getExtentFromPoint(center.x, center.y, fScale);
        this.setExtents(extent);
    },
    
    queryRect : function(fMinX, fMinY, fMaxX, fMaxY) { },
    
    queryPoint : function(fX, fY) { },
    
    /**
     *
     * convert pixel coordinates into geographic coordinates.
     *
     * @paran pX int the x coordinate in pixel units
     * @param pY int the y coordinate in pixel units
     *
     * @return an object with geographic coordinates in x and y properties of the 
     *         object.
     */
    pixToGeo : function( pX, pY ) {
        var lonLat = this.oMapOL.getLonLatFromPixel( new OpenLayers.Pixel(pX,pY) );
        if (lonLat != null) {
          return {x:lonLat.lon, y:lonLat.lat}; 
        }
        return null;
    },

    /**
     *
     * convert geographic coordinates into pixel coordinates.
     *
     * @paran gX int the x coordinate in geographic units
     * @param gY int the y coordinate in geographic units
     *
     * @return an object with pixel coordinates in x and y properties of the 
     *         object.
     */
    geoToPix : function( gX, gY ) {
        if (!(this._oCurrentExtents)) {
            return null;
        }
        var px = this.oMapOL.getPixelFromLonLat(new OpenLayers.LonLat(gX,gY));  //use getViewPortPxFromLonLat instead?
        return {x:Math.floor(px.x), y:Math.floor(px.y)};
    },

    /**
     *
     * convert pixel into geographic : used to measure.
     *
     * @param nPixels int measures in pixel
     *
     * @return geographic measure
     */
    pixToGeoMeasure : function(nPixels) {
        var resolution = this.oMapOL.getResolution();
        return (nPixels*resolution);
    },
    
  /**
     *
     * initializes the meters per unit values when a new map is loaded.  Some systems make different 
     * assumptions for the conversion of degrees to meters so this makes sure both Fusion and
     * OpenLayers are using the same value.
     *
     * @param metersPerUnit the value returned by LoadMap.php for meters per unit
     */
    setMetersPerUnit: function(metersPerUnit) {
        if (this._fMetersperunit < 0) {
            Fusion.initUnits(metersPerUnit);
            this._fMetersperunit = metersPerUnit;
        } else {
            if (metersPerUnit != this._fMetersperunit) {
                Fusion.reportError(new Fusion.Error(Fusion.Error.WARNING, 
                                    'meters per unit value already set'));
            }
        }
    },
    
    /**
     *
     * returns the meters per unit value
     *
     * @return metersPerUnit the value as set when the map initialized
     */
    getMetersPerUnit: function() {
        return this._fMetersperunit;
    },
    
  /**
     *
     * initializes all widgets with the map units after the map has loaded
     *
     */
    setViewOptions: function(data) {
      this.setWidgetParam('Units', data);
    },
    
  /**
     *
     * initializes all widgets with a parameter and value at runtime
     *
     */
    setWidgetParam: function(param, data) {
      for (var i=0; i<Fusion.applicationDefinition.widgetSets.length; ++i) {
        var widgetSet = Fusion.applicationDefinition.widgetSets[i];
        for (var j=0; j<widgetSet.widgetInstances.length; ++j) {
          var widget = widgetSet.widgetInstances[j];
          for (var k=0; k<widget.paramRegister.length; ++k) {
            if (widget.paramRegister[k] == param) {
              widget.setParameter(param, data);
            }
          }
        }
      }
    },
    
    /**
     *
     * convert geographic into pixels.
     *
     * @param fGeo float distance in geographic units
     *
     * @return pixels
     */
    geoToPixMeasure : function(fGeo) {
        return parseInt(fGeo/this.oMapOL.getResolution());
    },
    
    /**
     * Function: getCurrentCenter
     *
     * returns the current center of the map view
     *
     * Return: {Object} an object with the following attributes
     * x - the x coordinate of the center
     * y - the y coordinate of the center
     */
    getCurrentCenter : function() {
        var c = this.getCurrentExtents().getCenterLonLat();
        return {x:c.lon, y:c.lat};
    },

    /**
     *
     * returns the current extents
     */
    getCurrentExtents : function() {
        return this.oMapOL.getExtent();
    },

    /**
     * Function: getExtentFromPoint
     *
     * returns the Extent of the map given a center point and a scale (optional)
     *
     * Return: {OpenLayers.Bounds} the bounds for the map centered on a point
     */
    getExtentFromPoint: function(fX,fY,fScale) {
        if (!fScale) {
            fScale = this.getScale();
        }
        
        var res = OpenLayers.Util.getResolutionFromScale(fScale, this.oMapOL.baseLayer.units);
        var size = this.getSize();
        var w_deg = size.w * res;
        var h_deg = size.h * res;
        return new OpenLayers.Bounds(fX - w_deg / 2,
                                           fY - h_deg / 2,
                                           fX + w_deg / 2,
                                           fY + h_deg / 2);
    },
    
    getScale : function() {
        return this.oMapOL.getScale();
    },
    
    getResolution : function() {
        return this.oMapOL.getResolution();
    },
    
    getUnits : function() {
        return this.oMapOL.baseLayer.units;
    },
    
    getSize: function() {
        return this.oMapOL.getSize();
    },

    getEventPosition : function(e) {
        return this.oMapOL.events.getMousePosition(e);
    },

    setCursor : function(cursor) {
        this.cursor = cursor;
        if (this.isBusy()) {
            return;
        }
        if (cursor && cursor.length && typeof cursor == 'object') {
            for (var i = 0; i < cursor.length; i++) {
                this._oDomObj.style.cursor = cursor[i];
                if (this._oDomObj.style.cursor == cursor[i]) {
                    break;
                }
            }
        } else if (typeof cursor == 'string') {
            this._oDomObj.style.cursor = cursor;
        } else {
            this._oDomObj.style.cursor = 'auto';  
        }
    },
    /**
     *
     * Observe specified event on the event div of the map
     *
     * @param sEventName string event name (eg : mousemove')
     * @param fnCB function Call back function name
     *
     */
     observeEvent  : function(sEventName, fnCB)
     {
         OpenLayers.Event.observe(this._oDomObj, sEventName, fnCB, false);
     },

     /**
     *
     * Stop observing specified event on the event div of the map
     *
     * @param sEventName string event name (eg : mousemove')
     * @param fnCB function Call back function name
     *
     */
     stopObserveEvent : function(sEventName, fnCB)
     {
       //debugger;  //shows error in IE and Safari: OpenLayers.Event is 
                    //overriden by prototype Event for some reason.  Uncomment 
                    //the debugger line and step into next function to see it
         OpenLayers.Event.stopObserving(this._oDomObj, sEventName, fnCB, false);
     },

     /**
     *
     * call the Activate method on the widget
     * if widgets is set to be mutually exclusive,
     * all other widgets are deactivated
     *
     * @param nId integer widget id
     */
     activateWidget : function(oWidget)
     {
         /*console.log('Fusion.Widget.Map.activateWidget ' + oWidget.getName());*/
         if (oWidget.isMutEx()) {
             if (this.oActiveWidget) {
                 this.deactivateWidget(this.oActiveWidget);
             }
             oWidget.activate();
             this.oActiveWidget = oWidget;
         } else {
             oWidget.activate();
         }
     },

     /**
     *
     * call the Activate method on the widget
     * if widgets is set to be mutually exclusive,
     * all other widgets are deactivated
     *
     * @param oWidget the widget to deactivate
     */
     deactivateWidget : function(oWidget)
     {
         /*console.log('Fusion.Widget.Map.deactivateWidget ' + oWidget.getName());*/
         oWidget.deactivate();
         this.oActiveWidget = null;
     },
     
     /**
      */
     isLoaded: function() {
         return (this.oMapOL.getExtent() != null);
     },
     
     supressContextMenu: function( bSupress ) {
         this.bSupressContextMenu = bSupress;
     },
     
     setContextMenu: function(menu) {
         //console.log('setcontextmenu');
         this.oContextMenu = menu;
     },
     
     onContextMenu: function(e) {
         //console.log('oncontextmenu');
         if (this.oContextMenu && !this.bSupressContextMenu && this.isLoaded()) {
             this.oContextMenu.show(e);
             this.contextMenuPosition = this.getEventPosition(e);
             OpenLayers.Event.stop(e);
         }
     },
     
     executeFromContextMenu: function(widget) {
         //console.log('executefromcontextmenu');
         widget.execute(this.contextMenuPosition.x, this.contextMenuPosition.y);
     }
});

 /****************************************************************************
 * Class: Fusion.Widget.Map.Layer
 *
 * generic class for map layers.  This class is primarily for legends.
 * **********************************************************************/
Fusion.Event.LAYER_PROPERTY_CHANGED = Fusion.Event.lastEventId++;
Fusion.Widget.Map.Layer = OpenLayers.Class(Fusion.Lib.EventMgr, {
    name: null,
    initialize: function(name) {
        this.name = name;
        this.registerEventID(Fusion.Event.LAYER_PROPERTY_CHANGED);
    },
    clear: function() {},
    set: function(property, value) {
        this[property] = value;
        this.triggerEvent(Fusion.Event.LAYER_PROPERTY_CHANGED, this);
    }
});

 /****************************************************************************
 * Class: Fusion.Widget.Map.Group
 *
 * generic class for map layer groups.  This class is primarily for legends.
 * **********************************************************************/
Fusion.Event.GROUP_PROPERTY_CHANGED = Fusion.Event.lastEventId++;
Fusion.Widget.Map.Group = OpenLayers.Class(Fusion.Lib.EventMgr, {
    name: null,
    groups: null,
    layers: null,
    initialize: function(name) {
        this.name = name;
        this.groups = [];
        this.layers = [];
        this.registerEventID(Fusion.Event.GROUP_PROPERTY_CHANGED);
    },
    clear: function() {
        for (var i=0; i<this.groups.length; i++) {
            this.groups[i].clear();
        }
        for (var i=0; i<this.layers.length; i++) {
            this.layers[i].clear();
        }
        this.groups = [];
        this.layers = [];
    },
    set: function(property, value) {
        this[property] = value;
        this.triggerEvent(Fusion.Event.GROUP_PROPERTY_CHANGED, this);
    },
    addGroup: function(group,reverse) {
        group.parentGroup = this;
        if (reverse) {
          this.groups.unshift(group);
        } else {
          this.groups.push(group);
        }
    },
    addLayer: function(layer,reverse) {
        layer.parentGroup = this;
        if (reverse) {
          this.layers.unshift(layer);
        } else {
          this.layers.push(layer);
        }
    },
    findGroup: function(name) {
        return this.findGroupByAttribute('name', name);
    },
    findGroupByAttribute: function(attribute, value) {
        if (this[attribute] == value) {
            return this;
        }
        for (var i=0; i<this.groups.length; i++) {
            var group = this.groups[i].findGroupByAttribute(attribute, value);
            if (group) {
                return group;
            }
        }
        return null;
    },
    findLayer: function(name) {
        return this.findLayerByAttribute('name', name);
    },
    findLayerByAttribute: function(attribute, value) {
        for (var i=0; i<this.layers.length; i++) {
            if (this.layers[i][attribute] == value) {
                return this.layers[i];
            }
        }
        for (var i=0; i<this.groups.length; i++) {
            var layer = this.groups[i].findLayerByAttribute(attribute,value);
            if (layer) {
                return layer;
            }
        }
        return null;
    }
});


/**
 * SelectionObject
 *
 * Utility class to hold slection information
 *
 */
Fusion.SelectionObject = OpenLayers.Class({
    aLayers : null,

    initialize: function(o) 
    {
        this.aLayers = [];
        this.nTotalElements =0;
        this.nLayers = 0;

        if ( o.layers &&  o.layers.length > 0)
        {
            this.fMinX =  o.extents.minx;
            this.fMinY =  o.extents.miny;
            this.fMaxX =  o.extents.maxx;
            this.fMaxY =  o.extents.maxy;
            
            this.nLayers =  o.layers.length;
            for (var i=0; i<o.layers.length; i++)
            {
                this.aLayers[i] = new Fusion.SelectionObject.Layer(o, o.layers[i]);
            }
        }
    },

    getNumElements : function()
    {
        return this.nTotalElements;
    },

    getLowerLeftCoord : function()
    {
        return {x:this.fMinX, y:this.fMinY};
    },

    getUpperRightCoord : function()
    {
        return {x:this.fMaxX, y:this.fMaxY};
    },

    getNumLayers : function()
    {
        return this.nLayers;
    },
    
    getLayerByName : function(name)
    {
        var oLayer = null;
        for (var i=0; i<this.nLayers; i++)
        {
            if (this.aLayers[i].getName() == name)
            {
                oLayer = this.aLayers[i];
                break;
            }
        }
        return oLayer;
    },

    getLayer : function(iIndice)
    {
        if (iIndice >=0 && iIndice < this.nLayers)
        {
            return this.aLayers[iIndice];
        }
        else
        {
            return null;
        }
            
    }
});


Fusion.SelectionObject.Layer = OpenLayers.Class({
    sName: null,
    nElements: null,
    aElements: null,
    nProperties: null,
    aPropertiesName: null,
    aPropertiesTypes: null,

    type: null,
    area: null,
    distance: null,
    bbox: null,
    center: null,
    
    initialize: function(o, layerName) 
    {
        this.sName =  layerName;
        this.nElements =  o[layerName].numelements;

        this.aElements = [];

        this.nProperties = o[layerName].propertyvalues.length;

        this.aPropertiesName = [];
        this.aPropertiesName  = o[layerName].propertyvalues;

        this.aPropertiesTypes = [];
        this.aPropertiesTypes = o[layerName].propertytypes;
        
        //var oValueCollection = oNode.findNextNode('ValueCollection');
        
        this.area = 0;
        this.distance = 0;
        
        for (var i=0; i<o[layerName].values.length; i++)
        {
            this.aElements[i] =[];
            for (var j=0; j<o[layerName].values[i].length; j++)
            {
                this.aElements[i][j] = o[layerName].values[i][j];
            }
        }
        
        //loop over all features in the metadata array
        for (var i=0; i<o[layerName].metadata.length; i++) {
          var featureMetadata = o[layerName].metadata[i];
          var dim = featureMetadata[0];   //nothing to do with this one
          var bbox = featureMetadata[1];
          var center = featureMetadata[2];
          var area = featureMetadata[3];
          var length = featureMetadata[4];
          this.area += parseFloat(area);
          this.distance += parseFloat(length);
        }
        
        /*
        var iElement=0;
        while(oValueCollection) 
        {
            this.aElements[iElement] = [];
            for (var i=0; i<oValueCollection.childNodes.length; i++)
            {
                oTmp = oValueCollection.childNodes[i].findFirstNode('v');
                this.aElements[iElement][i] = oTmp.textContent;
                
            }
            var type = oValueCollection.attributes['type'];
            var area = oValueCollection.attributes['area'];
            var distance = oValueCollection.attributes['distance'];
            var bbox = oValueCollection.attributes['bbox'];
            var center = oValueCollection.attributes['center'];
            
            this.aElements[iElement]['attributes'] = {};
            this.aElements[iElement]['attributes'].type = type;
            this.aElements[iElement]['attributes'].bbox = bbox;
            this.aElements[iElement]['attributes'].center = bbox;
            //console.log('type is ' + type);
            if (type > 1) {
                this.area += parseFloat(area);
                this.aElements[iElement]['attributes'].area = area;
            }
            if (type > 0) {
                this.aElements[iElement]['attributes'].distance = distance;
                this.distance += parseFloat(distance);
            }
            oValueCollection = oNode.findNextNode('ValueCollection');
            iElement++;
        }
        */
        //console.log( 'final area is ' + this.area);
        //console.log( 'final distance is ' + this.distance);
        
    },

    getName : function()
    {
        return this.sName;
    },

    getNumElements : function()
    {
        return this.nElements;
    },

    getNumProperties : function()
    {
        return this.nProperties;
    },

    getPropertyNames : function()
    {
        return this.aPropertiesName;
    },

    getPropertyTypes : function()
    {
        return this.aPropertiesTypes;
    },

    getElementValue : function(iElement, iProperty)
    {
        if (iElement >=0 && iElement < this.nElements &&
            iProperty >=0 && iProperty < this.nProperties)
        {
            return this.aElements[iElement][iProperty];
        }
        else
        {
            return null;
        }
    }
});
/**
 * Fusion.Maps.MapGuide
 *
 * $Id: MapGuide.js 1617 2008-10-27 19:26:24Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/***************************************************************************
* Class: Fusion.Maps.MapGuide
*
* Implements the map widget for MapGuide Open Source services.
*/

Fusion.Maps.MapGuide = OpenLayers.Class(Fusion.Lib.EventMgr, {
    arch: 'MapGuide',
    session: [null],
    bSingleTile: null,
    aShowLayers: null,
    aHideLayers: null,
    aShowGroups: null,
    aHideGroups: null,
    aRefreshLayers: null,
    sActiveLayer: null,
    selectionType: 'INTERSECTS',
    bSelectionOn: false,
    oSelection: null,
    bDisplayInLegend: true,   //TODO: set this in AppDef?
    bExpandInLegend: true,   //TODO: set this in AppDef?
    bMapLoaded : false,
    bIsMapWidgetLayer : true,  //Setthis to false for overview map layers
    bLayersReversed: false,     //MGOS returns layers top-most layer first

    //the resource id of the current MapDefinition
    _sResourceId: null,

    clientAgent: 'Fusion Viewer',
    
    initialize : function(map, mapTag, isMapWidgetLayer) {
        // console.log('MapGuide.initialize');
                
        this.registerEventID(Fusion.Event.MAP_SESSION_CREATED);
        this.registerEventID(Fusion.Event.MAP_SELECTION_ON);
        this.registerEventID(Fusion.Event.MAP_SELECTION_OFF);
        this.registerEventID(Fusion.Event.MAP_LOADED);
        this.registerEventID(Fusion.Event.MAP_LOADING);

        this.mapWidget = map;
        this.oSelection = null;
        if (isMapWidgetLayer != null) {
            this.bIsMapWidgetLayer = isMapWidgetLayer;
        }
        this.mapInfo = mapTag.mapInfo;
        var extension = mapTag.extension; //TBD: this belongs in layer tag?
        this.selectionType = extension.SelectionType ? extension.SelectionType[0] : 'INTERSECTS';
        this.ratio = extension.MapRatio ? extension.MapRatio[0] : 1.0;
        
        //add in the handler for CTRL-click actions for the map, not an overviewmap
        if (this.bIsMapWidgetLayer) {
          var ctrlClickEnabled = true;
          if (extension.DisableCtrlClick && extension.DisableCtrlClick[0] == 'true') {
              ctrlClickEnabled = false;
          }
          if (ctrlClickEnabled) {
            this.map = this.mapWidget.oMapOL;
            this.handler = new OpenLayers.Handler.Click(this,
                {click: OpenLayers.Function.bind(this.mouseUpCRTLClick, this)},
                {keyMask: OpenLayers.Handler.MOD_CTRL});
            this.handler.activate();
            this.nTolerance = 2; //pixels, default pixel tolernace for a point click; TBD make this configurable
          }
        }
       
        var newTheme = Fusion.getQueryParam('theme');
        if (newTheme != '') {
          this.sMapResourceId = newTheme;
        } else {
          this.sMapResourceId = mapTag.resourceId ? mapTag.resourceId : '';
        }
        
        rootOpts = {
          displayInLegend: this.bDisplayInLegend,
          expandInLegend: this.bExpandInLegend,
          legendLabel: this._sMapname,
          groupName: 'layerRoot'
          //TODO: set other opts for group initialization as required
        };
        this.layerRoot = new Fusion.Maps.MapGuide.Group(rootOpts,this);
        
        this.bSingleTile = mapTag.singleTile; //this is set in thhe AppDef.Map class

        this.keepAliveInterval = parseInt(extension.KeepAliveInterval ? extension.KeepAliveInterval[0] : 300);
        
        var sid = Fusion.sessionId;
        if (sid) {
            this.session[0] = sid;
            this.mapSessionCreated();
        } else {
            this.createSession();
        }
        
        
    },

    createSession: function() {
        if (!this.session[0]) {
            this.session[0] = this;
            var sl = Fusion.getScriptLanguage();
            var scriptURL = this.arch + '/' + sl + '/CreateSession.' + sl;
            var options = {onSuccess: OpenLayers.Function.bind(this.createSessionCB, this)};
            Fusion.ajaxRequest(scriptURL,options);  
        }
        if (this.session[0] instanceof Fusion.Maps.MapGuide) {
            // console.log('register for event');
            this.session[0].registerForEvent(Fusion.Event.MAP_SESSION_CREATED, 
                OpenLayers.Function.bind(this.mapSessionCreated, this));
        } else {
            this.mapSessionCreated();
        }
    },
    
    createSessionCB : function(xhr) {
        if (xhr.status == 200) {
            var o;
            eval('o='+xhr.responseText);
            this.session[0] = o.sessionId;
            this.triggerEvent(Fusion.Event.MAP_SESSION_CREATED);
        }
    },

    mapSessionCreated: function() {
        if (this.sMapResourceId != '') {
            this.loadMap(this.sMapResourceId);
        }
        window.setInterval(OpenLayers.Function.bind(this.pingServer, this), this.keepAliveInterval * 1000);
    },

    sessionReady: function() {
        return (typeof this.session[0] == 'string');
    },

    getSessionID: function() {
        return this.session[0];
    },
    
    getMapName: function() {
        return this._sMapname;
    },
    
    getMapTitle: function() {
        return this._sMapTitle;
    },
    
    loadMap: function(resourceId, options) {
        this.bMapLoaded = false;

        /* don't do anything if the map is already loaded? */
        if (this._sResourceId == resourceId) {
            return;
        }

        if (!this.sessionReady()) {
            this.sMapResourceId = resourceId;
            return;
        }
        
        if (this.bIsMapWidgetLayer) {
            this.mapWidget.triggerEvent(Fusion.Event.MAP_LOADING);
        } else {
          this.triggerEvent(Fusion.Event.MAP_LOADING);
        }
        this.mapWidget._addWorker();
        
        this._fScale = -1;
        this._nDpi = 96;
        
        options = options || {};
        
        this._oMaxExtent = null;
        this.aShowLayers = options.showlayers || [];
        this.aHideLayers = options.hidelayers || [];
        this.aShowGroups = options.showgroups || [];
        this.aHideGroups = options.hidegroups || [];
        this.aRefreshLayers = options.refreshlayers || [];
        this.aLayers = [];

        this.oSelection = null;
        this.aSelectionCallbacks = [];
        this._bSelectionIsLoading = false;

        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/LoadMap.' + sl;
        
        var sessionid = this.getSessionID();
        
        var params = {'mapid': resourceId, "session": sessionid};
        var options = {onSuccess: OpenLayers.Function.bind(this.mapLoaded,this), 
                       parameters:params};
        Fusion.ajaxRequest(loadmapScript, options);
    },
    
    mapLoaded: function(r) {
        if (r.status == 200) {
            var o;
            eval('o='+r.responseText);
            this._sResourceId = o.mapId;
            this._sMapname = o.mapName;
            this._sMapTitle = o.mapTitle;
            this.mapWidget.setMetersPerUnit(o.metersPerUnit);

            this._oMaxExtent = OpenLayers.Bounds.fromArray(o.extent); 

            this.layerRoot.clear();
            this.layerRoot.legendLabel = this._sMapTitle;
            
            this.parseMapLayersAndGroups(o);
            
            this.minScale = 1.0e10;
            this.maxScale = 0;
            for (var i=0; i<this.aLayers.length; i++) {
              this.minScale = Math.min(this.minScale, this.aLayers[i].minScale);
              this.maxScale = Math.max(this.maxScale, this.aLayers[i].maxScale);
            }
            //a scale value of 0 is undefined
            if (this.minScale <= 0) {
              this.minScale = 1.0;
            }
            
            for (var i=0; i<this.aShowLayers.length; i++) {
                var layer =  this.layerRoot.findLayerByAttribute('layerName', this.aShowLayers[i]);
                if (layer) {
                    this.aShowLayers[i] = layer.uniqueId;
                } else {
                    this.aShowLayers[i] = '';
                }
            }
            for (var i=0; i<this.aHideLayers.length; i++) {
                var layer =  this.layerRoot.findLayerByAttribute('layerName', this.aHideLayers[i]);
                if (layer) {
                    this.aHideLayers[i] = layer.uniqueId;
                } else {
                    this.aHideLayers[i] = '';
                }
            }
            
            for (var i=0; i<this.aShowGroups.length; i++) {
                var group =  this.layerRoot.findGroupByAttribute('groupName', this.aShowGroups[i]);
                if (group) {
                    this.aShowGroups[i] = group.uniqueId;
                } else {
                    this.aShowGroups[i] = '';
                }
            }
            
            for (var i=0; i<this.aHideGroups.length; i++) {
                var group =  this.layerRoot.findGroupByAttribute('groupName', this.aHideGroups[i]);
                if (group) {
                    this.aHideGroups[i] = group.uniqueId;
                } else {
                    this.aHideGroups[i] = '';
                }
            }
            
            if (!this.bSingleTile) {
              if (o.groups.length >0) {
                this.bSingleTile = false;
                this.groupName = o.groups[0].groupName  //assumes only one group for now
                this.mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
                    OpenLayers.Function.bind(this.mapExtentsChanged, this));
              } else {
                this.bSingleTile = true;
              }
            }

            //set projection units and code if supplied
            //TODO: consider passing the metersPerUnit value into the framework
            //to allow for scaling that doesn't match any of the pre-canned units
            this.units = Fusion.getClosestUnits(o.metersPerUnit);
            
            //add in scales array if supplied
            if (o.FiniteDisplayScales && o.FiniteDisplayScales.length>0) {
              this.scales = o.FiniteDisplayScales;
              this.mapWidget.fractionalZoom = false;
              this.mapWidget.oMapOL.fractionalZoom = false;
            }
            
            //remove this layer if it was already created
            if (this.oLayerOL) {
                this.oLayerOL.events.unregister("loadstart", this, this.loadStart);
                this.oLayerOL.events.unregister("loadend", this, this.loadEnd);
                this.oLayerOL.events.unregister("loadcancel", this, this.loadEnd);
                this.oLayerOL.destroy();
            }

            this.oLayerOL = this.createOLLayer(this._sMapname, true, this.bSingleTile);
            this.oLayerOL.events.register("loadstart", this, this.loadStart);
            this.oLayerOL.events.register("loadend", this, this.loadEnd);
            this.oLayerOL.events.register("loadcancel", this, this.loadEnd);
            
            //this is to distinguish between a regular map and an overview map
            this.bMapLoaded = true;
            if (this.bIsMapWidgetLayer) {
              this.mapWidget.addMap(this);
              this.mapWidget.oMapOL.setBaseLayer(this.oLayerOL);
              var initialExtent = this.mapWidget.setInitialExtents();
              this.mapWidget.setExtents(initialExtent);
              this.mapWidget.triggerEvent(Fusion.Event.MAP_LOADED);
            } else {
              this.triggerEvent(Fusion.Event.MAP_LOADED);
            }
        }
        this.mapWidget._removeWorker();
    },
    
//TBD: this function not yet converted for OL    
    reloadMap: function() {
        
        this.mapWidget._addWorker();
        //console.log('loadMap: ' + resourceId);
        this.aShowLayers = [];
        this.aHideLayers = [];
        this.aShowGroups = [];
        this.aHideGroups = [];
        this.aRefreshLayers = [];
        this.layerRoot.clear();
        this.oldLayers = this.aLayers.clone();
        this.aLayers = [];
        
        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/LoadMap.' + sl;
        
        var sessionid = this.getSessionID();
        
        var params = {'mapname': this._sMapname, 'session': sessionid};
        var options = {
              onSuccess: OpenLayers.Function.bind(this.mapReloaded,this), 
              onException: OpenLayers.Function.bind(this.reloadFailed, this),
              parameters: params};
        Fusion.ajaxRequest(loadmapScript, options);
    },

    reloadFailed: function(r) {
      Fusion.reportError( new Fusion.Error(Fusion.Error.FATAL, 
        OpenLayers.i18n('mapLoadError', {'error':r.transport.responseText})));
      this.mapWidget._removeWorker();
    },

//TBD: this function not yet converted for OL    
    mapReloaded: function(r) {
        if (r.status == 200) {
            var o;
            eval('o='+r.responseText);
            this.parseMapLayersAndGroups(o);
            for (var i=0; i<this.aLayers.length; ++i) {
              var newLayer = this.aLayers[i];
              for (var j=0; j<this.oldLayers.length; ++j){
                if (this.oldLayers[j].uniqueId == newLayer.uniqueId) {
                  newLayer.selectedFeatureCount = this.oldLayers[j].selectedFeatureCount;
                  newLayer.noCache = this.oldLayers[j].noCache;
                  break;
                }
              }
            }
            this.oldLayers = null;
            this.mapWidget.triggerEvent(Fusion.Event.MAP_RELOADED);
            this.drawMap();
        }
        this.mapWidget._removeWorker();
    },
    
    reorderLayers: function(aLayerIndex) {
        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/SetLayers.' + sl;
        
        var params = {
            'mapname': this._sMapname, 
            'session': this.getSessionID(),
            'layerindex': aLayerIndex.join()
        };
        
        var options = {
            onSuccess: OpenLayers.Function.bind(this.mapLayersReset, this, aLayerIndex), 
            parameters: params};
        Fusion.ajaxRequest(loadmapScript, options);
    },
    
    mapLayersReset: function(aLayerIndex,r) {  
      if (r.status == 200) {
        var o;
        eval('o='+r.responseText);
            if (o.success) {
                var layerCopy = this.aLayers.clone();
                this.aLayers = [];
                this.aVisibleLayers = [];
          for (var i=0; i<aLayerIndex.length; ++i) {
            this.aLayers.push( layerCopy[ aLayerIndex[i] ] );
            if (this.aLayers[i].visible) {
                this.aVisibleLayers.push(this.aLayers[i].layerName);
            }
          } 
            
                this.drawMap();
                this.triggerEvent(Fusion.Event.MAP_LAYER_ORDER_CHANGED);
            } else {
                alert(OpenLayers.i18n('setLayersError', {'error':o.layerindex}));
            }
        }
    },
            
    parseMapLayersAndGroups: function(o) {
        for (var i=0; i<o.groups.length; i++) {
            var group = new Fusion.Maps.MapGuide.Group(o.groups[i], this);
            var parent;
            if (group.parentUniqueId != '') {
                parent = this.layerRoot.findGroupByAttribute('uniqueId', group.parentUniqueId);
            } else {
                parent = this.layerRoot;
            }
            parent.addGroup(group, this.bLayersReversed);
        }

        for (var i=0; i<o.layers.length; i++) {
            var layer = new Fusion.Maps.MapGuide.Layer(o.layers[i], this);
            var parent;
            if (layer.parentGroup != '') {
                parent = this.layerRoot.findGroupByAttribute('uniqueId', layer.parentGroup);
            } else {
                parent = this.layerRoot;
            }
            parent.addLayer(layer, this.bLayersReversed);
            this.aLayers.push(layer);
        }
    },
    
    drawMap: function() {
        if (!this.bMapLoaded) {
            return;
        }
        
        var params = {
          ts : (new Date()).getTime(),  //add a timestamp to prevent caching on the server
          showLayers : this.aShowLayers.length > 0 ? this.aShowLayers.toString() : null,
          hideLayers : this.aHideLayers.length > 0 ? this.aHideLayers.toString() : null,
          showGroups : this.aShowGroups.length > 0 ? this.aShowGroups.toString() : null,
          hideGroups : this.aHideGroups.length > 0 ? this.aHideGroups.toString() : null,
          refreshLayers : this.aRefreshLayers.length > 0 ? this.aRefreshLayers.toString() : null
        };
        this.aShowLayers = [];
        this.aHideLayers = [];
        this.aShowGroups = [];
        this.aHideGroups = [];
        this.aRefreshLayers = [];

        this.oLayerOL.mergeNewParams(params);
        if (this.queryLayer) this.queryLayer.redraw();
    },

    /**
     * Function: createOLLayer
     * 
     * Returns an OpenLayers MapGuide layer object
     */
    createOLLayer: function(layerName, bIsBaseLayer, bSingleTile) {
      var layerOptions = {
        units : this.units,
        isBaseLayer : bIsBaseLayer,
        maxExtent : this._oMaxExtent,
        maxResolution : 'auto',
        ratio : this.ratio
      };
      if (!/WebKit/.test(navigator.userAgent)) {
        layerOptions.transitionEffect = 'resize';
      }

      //add in scales array if supplied
      if (this.scales && this.scales.length>0) {
        layerOptions.scales = this.scales;
      }
      if (this.maxScale != Infinity) {
        layerOptions.minScale = this.maxScale;    //OL interpretation of min/max scale is reversed from Fusion
      } else {
        if (this.mapWidget.minScale) {
          layerOptions.minScale = this.mapWidget.maxScale;
        }// otherwise minscale is set automatically by OL
      }
      layerOptions.maxScale = this.minScale;

      layerOptions.singleTile = bSingleTile;
      
      var params = {};
      if ( bSingleTile ) {
        params = {        //single tile params
          session: this.getSessionID(),
          mapName: this._sMapname,
          clientagent: this.clientAgent
        };
        params.showLayers = this.aShowLayers.length > 0 ? this.aShowLayers.toString() : null;
        params.hideLayers = this.aHideLayers.length > 0 ? this.aHideLayers.toString() : null;
        params.showGroups = this.aShowGroups.length > 0 ? this.aShowGroups.toString() : null;
        params.hideGroups = this.aHideGroups.length > 0 ? this.aHideGroups.toString() : null;
        params.refreshLayers = this.aRefreshLayers.length > 0 ? this.aRefreshLayers.toString() : null;

      } else {
        params = {      //tiled version
          mapdefinition: this._sResourceId,
          basemaplayergroupname: this.groupName,  //assumes only one group for now
          session: this.getSessionID(),
          clientagent: this.clientAgent
        };
      }

      var url = Fusion.getConfigurationItem('mapguide', 'mapAgentUrl');
      var oLayerOL = new OpenLayers.Layer.MapGuide( layerName, url, params, layerOptions );
      return oLayerOL;
    },
            
    /**
     * Function: getLayerByName
     * 
     * Returns the MapGuide layer object as identified by the layer name
     */
    getLayerByName : function(name)
    {
        var oLayer = null;
        for (var i=0; i<this.aLayers.length; i++)
        {
            if (this.aLayers[i].layerName == name)
            {
                oLayer = this.aLayers[i];
                break;
            }
        }
        return oLayer;
    },

    /**
     * Function: isMapLoaded
     * 
     * Returns true if the Map has been laoded succesfully form the server
     */
    isMapLoaded: function() {
        return this.bMapLoaded;
    },

    hasSelection: function() { return this.bSelectionOn; },
    
    getSelectionCB : function(userFunc, layers, startend, r) {
      if (r.status == 200) 
      {
          var o;
          eval("o="+r.responseText);

          var oSelection = new Fusion.SelectionObject(o);
          userFunc(oSelection);
      }
      
    },
    
    /**
     * advertise a new selection is available and redraw the map
     */
    newSelection: function() {
        if (this.oSelection) {
            this.oSelection = null;
        }
        this.bSelectionOn = true;
        this.drawMap();
        this.triggerEvent(Fusion.Event.MAP_SELECTION_ON);
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectedFeatureCount : function() {
      var total = 0;
      for (var j=0; j<this.aLayers.length; ++j) {
        total += this.aLayers[j].selectedFeatureCount;
      }
      return total;
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectedLayers : function() {
      var layers = [];
      for (var j=0; j<this.aLayers.length; ++j) {
        if (this.aLayers[j].selectedFeatureCount>0) {
          layers.push(this.aLayers[j]);
        }
      }
      return layers;
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectableLayers : function() {
      var layers = [];
      for (var j=0; j<this.aLayers.length; ++j) {
        if (this.aLayers[j].selectable) {
          layers.push(this.aLayers[j]);
        }
      }
      return layers;
    },

     /**
      * Function: zoomToSelection
      *
      * sets a Selection XML back to the server
      */
    zoomToSelection: function(extent) {
      var center = extent.getCenterPixel();
      var size = extent.getSize();
      extent.left = center.x - 2*size.w;
      extent.right = center.x + 2*size.w;
      extent.bottom = center.y - 2*size.h;
      extent.top = center.y + 2*size.h;
      this.mapWidget.setExtents(extent);
    },  

    setSelection: function (selText, zoomTo) {
      this.mapWidget._addWorker();
      var sl = Fusion.getScriptLanguage();
      var setSelectionScript = this.arch + '/' + sl  + '/SetSelection.' + sl;
      var params = {
          'mapname': this.getMapName(),
          'session': this.getSessionID(),
          'selection': selText,
          'seq': Math.random()
      };
      var options = {onSuccess: OpenLayers.Function.bind(this.processQueryResults, this, zoomTo), 
                     parameters:params, asynchronous:false};
      Fusion.ajaxRequest(setSelectionScript, options);
    },


     /**
     * asynchronously load the current selection.  When the current
     * selection changes, the selection is not loaded because it
     * could be a lengthy process.  The user-supplied function will
     * be called when the selection is available.
     *
     * @param userFunc {Function} a function to call when the
     *        selection has loaded
     *
     * @param layers {string} Optional parameter.  A comma separated
     *        list of layer names (Roads,Parcels). If it is not
     *        given, all the layers that have a selection will be used  
     *
     * @param startcount {string} Optional parameter.  A comma separated
     *        list of a statinh index and the number of features to be retured for
     *        each layer given in the layers parameter. Index starts at 0
     *        (eg: 0:4,2:6 : return 4 elements for the first layers starting at index 0 and
     *         six elements for layer 2 starting at index 6). If it is not
     *        given, all the elemsnts will be returned.  
     */
    getSelection : function(userFunc, layers, startcount) {

      /*for now always go back to server to fetch selection */
       
      if (userFunc) 
      {
          //this.aSelectionCallbacks.push(userFunc);
      
      
          //this.mapWidget._addWorker();
          // this._bSelectionIsLoading = true;
          var s = this.arch + '/' + Fusion.getScriptLanguage() + "/Selection." + Fusion.getScriptLanguage() ;
          var options = {
              parameters: {'session': this.getSessionID(),
                          'mapname': this._sMapname,
                          'layers': layers,
                          'startcount': startcount},
              onSuccess: OpenLayers.Function.bind(this.getSelectionCB, this, userFunc, layers, startcount)
          };
          Fusion.ajaxRequest(s, options);
      }
    },

    /**
       Call back function when selection is cleared
    */
    selectionCleared : function()
    {
        //clear the selection count for the layers
        for (var j=0; j<this.aLayers.length; ++j) {
          this.aLayers[j].selectedFeatureCount = 0;
        }

        this.bSelectionOn = false;
        if (this.queryLayer) {
          this.queryLayer.setVisibility(false);
        }
        this.triggerEvent(Fusion.Event.MAP_SELECTION_OFF);
        this.drawMap();
        this.oSelection = null;
    },

    /**
       Utility function to clear current selection
    */
    clearSelection : function() {
      if (this.hasSelection()) {
          var s = this.arch + '/' + Fusion.getScriptLanguage() + "/ClearSelection." + Fusion.getScriptLanguage() ;
          var options = {
              parameters: {'session': this.getSessionID(),
                          'mapname': this._sMapname},
              onSuccess: OpenLayers.Function.bind(this.selectionCleared, this)
          };
          Fusion.ajaxRequest(s, options);
      }
    },

    /**
       removes the queryLayer from the map
    */
    removeQueryLayer : function() {
      if (this.queryLayer) {
        this.queryLayer.destroy();
        this.queryLayer = null;
      }
    },


    /**
       Call back function when slect functions are called (eg queryRect)
    */
    processQueryResults : function(zoomTo, r) {
        this.mapWidget._removeWorker();
        if (r.responseText) {   //TODO: make the equivalent change to MapServer.js
            var oNode;
            eval('oNode='+r.responseText);
            
            if (oNode.hasSelection) {
              if (!this.bSingleTile) {
                if (!this.queryLayer) {
                  this.queryLayer = this.createOLLayer("query layer", false, true);
                  this.mapWidget.oMapOL.addLayer(this.queryLayer);
                  this.mapWidget.registerForEvent(Fusion.Event.MAP_LOADING, 
                        OpenLayers.Function.bind(this.removeQueryLayer, this));
                } else {
                  this.queryLayer.setVisibility(true);
                }
              }

              // set the feature count on each layer making up this map
              for (var i=0; i<oNode.layers.length; ++i) {
                var layerName = oNode.layers[i];
                for (var j=0; j<this.aLayers.length; ++j) {
                  if (layerName == this.aLayers[j].layerName) {
                    this.aLayers[j].selectedFeatureCount = oNode[layerName].featureCount;
                  }
                }
              }
              
              if (zoomTo) {
                var ext = oNode.extents
                var extents = new OpenLayers.Bounds(ext.minx, ext.miny, ext.maxx, ext.maxy);
                this.zoomToSelection(extents);
              }
              this.newSelection();
            } else {
              this.clearSelection();
              return;
            }
        }
    },

    /**
       Do a query on the map
    */
    query : function(options) {
        this.mapWidget._addWorker();
        
        //clear the selection count for the layers
        for (var j=0; j<this.aLayers.length; ++j) {
          this.aLayers[j].selectedFeatureCount = 0;
        }

        var bPersistant = options.persistent || true;
        var zoomTo = options.zoomTo ?  true : false;
        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/Query.' + sl;

        var params = {
            'mapname': this._sMapname,
            'session': this.getSessionID(),
            'spatialfilter': options.geometry || '',
            'computed': options.computed || '',
            'queryHiddenLayers': options.queryHiddenLayers || 'false',
            'maxfeatures': options.maxFeatures || 0, //zero means select all features
            'layers': options.layers || '',
            'variant': options.selectionType || this.selectionType
        }
        if (options.filter) {
            params.filter= options.filter;
        }
        if (options.extendSelection) {
            params.extendselection = true;
        }
        if (options.computedProperties) {
            params.computed = true;
        }
        var ajaxOptions = {
            onSuccess: OpenLayers.Function.bind(this.processQueryResults, this, zoomTo), 
            parameters: params};
        Fusion.ajaxRequest(loadmapScript, ajaxOptions);
    },
    
    processLayerEvents: function(layer, isEnabling) {
        if (this.mapInfo && this.mapInfo.mapEvents.layerEvents[layer.layerName]) {
            var layerEvent = this.mapInfo.mapEvents.layerEvents[layer.layerName];
            var events = isEnabling ? layerEvent.onEnable : layerEvent.onDisable;
            for (var i=0; i<events.length; i++) {
                var o = events[i];
                if (o.type == 'layer') {
                    var l = this.layerRoot.findLayer(o.name);
                    if (l) {
                        if (o.enable) {
                            l.show(true);
                        } else {
                            l.hide(true);
                        }
                    }
                    
                } else if (o.type == 'group') {
                    var g = this.layerRoot.findGroupByAttribute('groupName', o.name);
                    if (g) {
                        if (o.enable) {
                            g.show(true);
                        } else {
                            g.hide(true);
                        }
                    }
                }
            }
        }
    },
    
    processGroupEvents: function(group, isEnabling) {
        if (this.mapInfo && this.mapInfo.mapEvents.groupEvents[group.groupName]) {
            var groupEvent = this.mapInfo.mapEvents.groupEvents[group.groupName];
            var events = isEnabling ? groupEvent.onEnable : groupEvent.onDisable;
            for (var i=0; i<events.length; i++) {
                var o = events[i];
                if (o.type == 'layer') {
                    var l = this.layerRoot.findLayer(o.name);
                    if (l) {
                        if (o.enable) {
                            l.show(true);
                        } else {
                            l.hide(true);
                        }
                    }
                    
                } else if (o.type == 'group') {
                    var g = this.layerRoot.findGroupByAttribute('groupName', o.name);
                    if (g) {
                        if (o.enable) {
                            g.show(true);
                        } else {
                            g.hide(true);
                        }
                    }
                }
            }
        }
    },
        
    showLayer: function( layer, noDraw ) {
        this.processLayerEvents(layer, true);
        this.aShowLayers.push(layer.uniqueId);
        if (!noDraw) {
            this.drawMap();
        }
    },
    
    hideLayer: function( layer, noDraw ) {
        this.processLayerEvents(layer, false);
        this.aHideLayers.push(layer.uniqueId);
        if (!noDraw) {
            this.drawMap();
        }
    },
    
    showGroup: function( group, noDraw ) {
        this.processGroupEvents(group, true);
        if (group.groupName == 'layerRoot') {
            this.oLayerOL.setVisibility(true);
        } else {
            this.aShowGroups.push(group.uniqueId);
            if (!noDraw) {
                this.drawMap();
            }
        }
    },
    hideGroup: function( group, noDraw ) {
        this.processGroupEvents(group, false);
        if (group.groupName == 'layerRoot') {
            this.oLayerOL.setVisibility(false);
        } else {
            this.aHideGroups.push(group.uniqueId);
            if (!noDraw) {
                this.drawMap();
            }
        }
    },
    refreshLayer: function( layer ) {
        this.aRefreshLayers.push(layer.uniqueId);        
        this.drawMap();
    },
    setParameter : function(param, value) {
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    },

    loadStart: function() {
        this.mapWidget._addWorker();
    },

    loadEnd: function() {
        this.mapWidget._removeWorker();
    },
    
  /**
     * called when there is a click on the map holding the CTRL key: query features at that postion.
     **/
    mouseUpCRTLClick: function(evt) {
      if (evt.ctrlKey) {
        var min = this.mapWidget.pixToGeo(evt.xy.x-this.nTolerance, evt.xy.y-this.nTolerance);
        var max = this.mapWidget.pixToGeo(evt.xy.x+this.nTolerance, evt.xy.y+this.nTolerance);
        if (!min) {
          return;
        }   
        var sGeometry = 'POLYGON(('+ min.x + ' ' +  min.y + ', ' +  min.x + ' ' +  max.y + ', ' + max.x + ' ' +  max.y + ', ' + max.x + ' ' +  min.y + ', ' + min.x + ' ' +  min.y + '))';
        //var sGeometry = 'POINT('+ min.x + ' ' +  min.y + ')';

        var maxFeatures = 1;
        var persist = 0;
        var selection = 'INTERSECTS';
        var layerNames = '';
        var layerAttributeFilter = 3;
        var sep = '';
        for (var i=0; i<this.aLayers.length; ++i) {
          layerNames += sep + this.aLayers[i].layerName;
          sep = ',';
        }
        var r = new Fusion.Lib.MGRequest.MGQueryMapFeatures(this.mapWidget.getSessionID(),
                                                            this._sMapname,
                                                            sGeometry,
                                                            maxFeatures, persist, selection, layerNames, 
                                                            layerAttributeFilter);
        var callback = OpenLayers.Function.bind(this.crtlClickDisplay, this);
        Fusion.oBroker.dispatchRequest(r, OpenLayers.Function.bind(Fusion.xml2json, this, callback));
      }
    },

    /**
     * open a window if a URL is defined for the feature.
     **/
    crtlClickDisplay: function(xhr) {
        //console.log('ctrlclcik  _display');
        if (xhr.status == 200) {
            var o;
            eval('o='+xhr.responseText);
            var h = o['FeatureInformation']['Hyperlink'];
            if (h) {
              var linkURL;
              if (h[0].indexOf('href=') > 0) {
                //MGOS allows full anchor tag as the hyperlink, extract the href
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = h[0];
                linkURL = tempDiv.firstChild.href;
                tempDiv = null;
              } else {
                linkURL = h[0];
              }
              window.open(linkURL, "");
            }
        }
    },
    
    //GETVISIBLEMAPEXTENT must be called for tiled maps whenever the extents 
    //are changed so that tooltips will work properly
    mapExtentsChanged: function() {
      if (!this.singleTile) {
          var center = this.mapWidget.oMapOL.getCenter(); 
          var display = this.mapWidget.oMapOL.getSize(); 
          var r = new Fusion.Lib.MGRequest.MGGetVisibleMapExtent(this.mapWidget.getSessionID(),
                                                              this._sMapname,
                                                              center.lon, center.lat,
                                                              this.mapWidget.oMapOL.getScale(),
                                                              null,
                                                              this._nDpi,
                                                              display.w, display.h);
          Fusion.oBroker.dispatchRequest(r);
      }
    },
    
    pingServer: function() {
        var s = this.arch + '/' + Fusion.getScriptLanguage() + "/Common." + Fusion.getScriptLanguage() ;
        var params = {};
        params.parameters = {'session': this.getSessionID()};
        Fusion.ajaxRequest(s, params);
    },
    getGroupInfoUrl: function(groupName) {
        if (this.mapInfo) {
            var groups = this.mapInfo.links.groups;
            for (var i=0; i<groups.length; i++) {
                if (groups[i].name == groupName) {
                    return groups[i].url;
                }
            }
        }
        return null;
    },
    getLayerInfoUrl: function(layerName) {
        if (this.mapInfo) {
            var layers = this.mapInfo.links.layers;
            for (var i=0; i<layers.length; i++) {
                if (layers[i].name == layerName) {
                    return layers[i].url;
                }
            }
        }
        return null;
    }
});
    
/***************************************************************************
* Class: Fusion.Maps.MapGuide.Group
*
* Implements the map layer groups for MapGuide services
*/

Fusion.Maps.MapGuide.Group = OpenLayers.Class(Fusion.Widget.Map.Group, {
    oMap: null,
    initialize: function(o, oMap) {
        this.uniqueId = o.uniqueId;
        Fusion.Widget.Map.Group.prototype.initialize.apply(this, [o.groupName]);
        this.oMap = oMap;
        this.groupName = o.groupName;
        this.legendLabel = o.legendLabel;
        this.parentUniqueId = o.parentUniqueId;
        this.groupType = o.groupType;
        this.displayInLegend = o.displayInLegend;
        this.expandInLegend = o.expandInLegend;
        this.visible = o.visible;
        this.actuallyVisible = o.actuallyVisible;
    },
    
    show: function(noDraw) {
        if (this.visible) {
            return;
        }
        this.oMap.showGroup(this, noDraw ? true : false);
        this.visible = true;
        if (this.legend && this.legend.checkBox) {
            this.legend.checkBox.checked = true;
        }
    },
    
    hide: function(noDraw) {
        if (!this.visible) {
            return;
        }
        this.oMap.hideGroup(this, noDraw ? true : false);
        this.visible = false;
        if (this.legend && this.legend.checkBox) {
            this.legend.checkBox.checked = false;
        }
    },
    
    isVisible: function() {
        return this.visible;
    }
});

/***************************************************************************
* Class: Fusion.Maps.MapGuide
*
* Implements individual map legend layers for MapGuide services
*/

Fusion.Maps.MapGuide.Layer = OpenLayers.Class(Fusion.Widget.Map.Layer, {
    
    scaleRanges: null,
    oMap: null,
    
    initialize: function(o, oMap) {
        this.uniqueId = o.uniqueId;
        Fusion.Widget.Map.Layer.prototype.initialize.apply(this, [o.layerName]);
        this.oMap = oMap;
        this.layerName = o.layerName;
        this.uniqueId = o.uniqueId;
        this.resourceId = o.resourceId;
        this.legendLabel = o.legendLabel;
        this.selectable = o.selectable;
        this.selectedFeatureCount = 0;
        this.layerTypes = [].concat(o.layerTypes);
        this.displayInLegend = o.displayInLegend;
        this.expandInLegend = o.expandInLegend;
        this.visible = o.visible;
        this.actuallyVisible = o.actuallyVisible;
        this.editable = o.editable;
        
        //determine the layer type so that the correct icon can be displayed in the legend
        this.layerType = null;
        if (this.supportsType(Fusion.Constant.LAYER_RASTER_TYPE)) {   //raster layers
          this.layerType = Fusion.Constant.LAYER_RASTER_TYPE;
        } else if (this.supportsType(Fusion.Constant.LAYER_DWF_TYPE)) {  //DWF layers
          this.layerType = Fusion.Constant.LAYER_DWF_TYPE;
        }
        
        this.parentGroup = o.parentGroup;
        this.scaleRanges = [];
        this.minScale = 1.0e10;
        this.maxScale = 0;
        for (var i=0; i<o.scaleRanges.length; i++) {
          var scaleRange = new Fusion.Maps.MapGuide.ScaleRange(o.scaleRanges[i], 
                                this.layerType);
          this.scaleRanges.push(scaleRange);
          this.minScale = Math.min(this.minScale, scaleRange.minScale);
          this.maxScale = Math.max(this.maxScale, scaleRange.maxScale);
        }
    },
    
    supportsType: function(type) {
        for (var i=0; i<this.layerTypes.length; i++) {
            if (this.layerTypes[i] == type) {
                return true;
            }
        }
        return false;
    },
    
    getScaleRange: function(fScale) {
        for (var i=0; i<this.scaleRanges.length; i++) {
            if (this.scaleRanges[i].contains(fScale)) {
                return this.scaleRanges[i];
            }
        }
        return null;
    },

    show: function(noDraw) {
        if (this.visible) {
            return;
        }
        this.oMap.showLayer(this, noDraw ? true : false);
        this.set('visible', true);
        if (this.legend && this.legend.checkBox) {
            this.legend.checkBox.checked = true;
        }
    },

    hide: function(noDraw) {
        if (!this.visible) {
            return;
        }
        this.oMap.hideLayer(this, noDraw ? true : false);
        this.set('visible',false);
        if (this.legend && this.legend.checkBox) {
            this.legend.checkBox.checked = false;
        }
    },

    isVisible: function() {
        return this.visible;
    }
});

/***************************************************************************
* Class: Fusion.Maps.MapGuide
*
* Implements a scale range object for MapGuide services
*/

Fusion.Maps.MapGuide.ScaleRange = OpenLayers.Class({
    styles: null,
    initialize: function(o, layerType) {
        this.minScale = o.minScale;
        this.maxScale = o.maxScale;
        if (this.maxScale == 'infinity') {
          this.maxScale = Infinity;
        }
        this.styles = [];
        if (!o.styles) {
          var styleItem = new Fusion.Maps.MapGuide.StyleItem({legendLabel:'DWF'}, layerType);
          this.styles.push(styleItem);
          return;
        }
        var staticIcon = o.styles.length>1 ? false : layerType;
        for (var i=0; i<o.styles.length; i++) {
            var styleItem = new Fusion.Maps.MapGuide.StyleItem(o.styles[i], staticIcon);
            this.styles.push(styleItem);
        }
    },
    contains: function(fScale) {
        var testScale = Math.round(fScale);
        return testScale >= this.minScale && testScale <= this.maxScale;
    }
});

/***************************************************************************
* Class: Fusion.Maps.MapGuide
*
* Implements the legend style items to get a legend icon from the server
*/

Fusion.Maps.MapGuide.StyleItem = OpenLayers.Class({
    clientAgent: 'Fusion Viewer',
    initialize: function(o, staticIcon) {
        this.legendLabel = o.legendLabel;
        this.filter = o.filter;
        this.geometryType = o.geometryType;
        if (this.geometryType == '') {
            this.geometryType = -1;
        }
        this.categoryIndex = o.categoryIndex;
        if (this.categoryindex == '') {
            this.categoryindex = -1;
        }
        this.staticIcon = staticIcon;
    },
    getLegendImageURL: function(fScale, layer) {
        var url = Fusion.getConfigurationItem('mapguide', 'mapAgentUrl');
        url += "?OPERATION=GETLEGENDIMAGE&SESSION=" + layer.oMap.getSessionID();
        url += "&VERSION=1.0.0&SCALE=" + fScale;
        url += "&LAYERDEFINITION=" + encodeURIComponent(layer.resourceId);
        url += "&THEMECATEGORY=" + this.categoryIndex;
        url += "&TYPE=" + this.geometryType;
        url += "&CLIENTAGENT=" + encodeURIComponent(this.clientAgent);
        if (layer.noCache) {
          url += "&TS=" + (new Date()).getTime();
        }
        return url;
    }
});
/**
 * Fusion API AjaxViewer API layer
 *
 * $Id: MapGuideViewerApi.js 1445 2008-08-01 19:21:15Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/***************************************************************************
* This is a simple API layer to mimick the MapGuide ajaxviewer API
*/
var mapWidgetId = 'Map';

function Refresh() {
    var Fusion = window.top.Fusion;
    var mapWidget = Fusion.getWidgetById(mapWidgetId);
    if (mapWidget && mapWidget.isMapLoaded()) {
        mapWidget.redraw();
    }
}

function SetSelectionXML(selectionXml) {
    var Fusion = window.top.Fusion;
    var mapWidget = Fusion.getWidgetById(mapWidgetId);
    if (mapWidget && mapWidget.isMapLoaded()) {
        mapWidget.setSelection(selectionXml, true);
    }
}

function ZoomToView(x, y, scale, refresh) {
    var Fusion = window.top.Fusion;
    var mapWidget = Fusion.getWidgetById(mapWidgetId);
    if (mapWidget && mapWidget.isMapLoaded()) {
        var extent = mapWidget.getExtentFromPoint(x, y, scale);
        mapWidget.setExtents(extent);
    }
}

function DigitizePoint(handler) {
    if (handler) {
      var Fusion = window.top.Fusion;
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      var digitizer = new Fusion.Tool.Canvas.Point(mapWidget);
      digitizer.mouseUp = PointHandlers.prototype.mouseUp;
      Object.inheritFrom(digitizer, Fusion.Tool.Canvas.prototype, []);
      digitizer.handler = handler;
      digitizer.activateCanvas();
      
      //add a listener to update the position of the features
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
        function(){
          digitizer.updatePx();
          digitizer.clearContext();
          digitizer.draw(digitizer.context);
        }
      );
    }
}

function DigitizeLine(handler) {
    if (handler) {
      var Fusion = window.top.Fusion;
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      var digitizer = new Fusion.Tool.Canvas.Line(mapWidget);
      digitizer.mouseDown = LineHandlers.prototype.mouseDown;
      digitizer.mouseMove = LineHandlers.prototype.mouseMove;
      Object.inheritFrom(digitizer, Fusion.Tool.Canvas.prototype, []);
      digitizer.handler = handler;
      digitizer.activateCanvas();
      
      //add a listener to update the position of the features
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
        function(){
          digitizer.updatePx();
          digitizer.clearContext();
          digitizer.draw(digitizer.context);
        }
      );
    }
}

function DigitizeLineString(handler) {
    if (handler) {
      var Fusion = window.top.Fusion;
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      var digitizer = new Fusion.Tool.Canvas.Line(mapWidget);
      digitizer.mouseDown = MultiPointHandlers.prototype.mouseDown;
      digitizer.mouseMove = MultiPointHandlers.prototype.mouseMove;
      digitizer.dblClick = MultiPointHandlers.prototype.dblClick;
      Object.inheritFrom(digitizer, Fusion.Tool.Canvas.prototype, []);
      digitizer.handler = handler;
      digitizer.activateCanvas();
      
      //add a listener to update the position of the features
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
        function(){
          digitizer.updatePx();
          digitizer.clearContext();
          digitizer.draw(digitizer.context);
        }
      );
    }
}

function DigitizeRectangle(handler) {
    if (handler) {
      var Fusion = window.top.Fusion;
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      var digitizer = new Fusion.Tool.Canvas.Polygon(mapWidget);
      digitizer.mouseDown = RectangleHandlers.prototype.mouseDown;
      digitizer.mouseMove = RectangleHandlers.prototype.mouseMove;
      Object.inheritFrom(digitizer, Fusion.Tool.Canvas.prototype, []);
      digitizer.handler = handler;
      digitizer.activateCanvas();
      
      //add a listener to update the position of the features
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
        function(){
          digitizer.updatePx();
          digitizer.clearContext();
          digitizer.draw(digitizer.context);
        }
      );
    }
}

function DigitizePolygon(handler) {
    if (handler) {
      var Fusion = window.top.Fusion;
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      var digitizer = new Fusion.Tool.Canvas.Polygon(mapWidget);
      digitizer.mouseDown = MultiPointHandlers.prototype.mouseDown;
      digitizer.mouseMove = MultiPointHandlers.prototype.mouseMove;
      digitizer.dblClick = MultiPointHandlers.prototype.dblClick;
      Object.inheritFrom(digitizer, Fusion.Tool.Canvas.prototype, []);
      digitizer.handler = handler;
      digitizer.activateCanvas();
      
      //add a listener to update the position of the features
      var mapWidget = Fusion.getWidgetById(mapWidgetId);
      mapWidget.registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
        function(){
          digitizer.updatePx();
          digitizer.clearContext();
          digitizer.draw(digitizer.context);
        }
      );
    }
}

Fusion.Tool.Canvas.prototype.getMap = function() {
  return Fusion.getWidgetById(mapWidgetId);
}

Fusion.Tool.Canvas.prototype.deactivateCanvas = function() {
    var map = this.getMap();
    map.deregisterForEvent(Fusion.Event.MAP_RESIZED, this.resizeCanvasFn);
    map.stopObserveEvent('mousemove', this.mouseMoveCB);
    map.stopObserveEvent('mouseup', this.mouseUpCB);
    map.stopObserveEvent('mousedown', this.mouseDownCB);
    map.stopObserveEvent('dblclick', this.dblClickCB);
}


PointHandlers = Class.create();
PointHandlers.prototype = {
    mouseUp: function(e) {
        var p = this.getMap().getEventPosition(e);
        var point = this.getMap().pixToGeo(p.x, p.y);
        this.setPoint(point.x, point.y);
        this.clearContext();
        this.draw(this.context);
        this.isDigitizing = false;
        this.deactivateCanvas();
        this.handler(new Point(point.x, point.y));
    }
}
    
LineHandlers = Class.create();
LineHandlers.prototype = {
    mouseDown: function(e) {
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);

            if (!this.isDigitizing) {
                this.segments = [];
                var point = this.getMap().pixToGeo(p.x, p.y);
                var from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var seg = new Fusion.Tool.Canvas.Segment(from,to);
                seg.setEditing(true);
                this.addSegment(seg);
                this.clearContext();
                this.draw(this.context);     

                this.isDigitizing = true;
            } else {
                this.isDigitizing = false;
                var seg = this.lastSegment();
                seg.setEditing(false);
                //seg = this.extendLine();
                this.clearContext();
                this.draw(this.context);
                this.deactivateCanvas();
                
                this.clean();
                var ls = new LineString();
                var nodes = this.getNodes();
                for (var i=0; i<nodes.length; ++i) {
                  var node = nodes[i];
                  ls.AddPoint(new Point(node.x, node.y));
                }
                this.handler(ls);
                
            }
        }
    },

    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove');
        if (!this.isDigitizing) {
            return;
        }
    
        var p = this.getMap().getEventPosition(e);
        var seg = this.lastSegment();
        seg.to.setPx(p.x,p.y);
        seg.to.updateGeo();
        this.clearContext();
        this.draw(this.context);
    },
}
    
RectangleHandlers = Class.create();
RectangleHandlers.prototype = {
    mouseDown: function(e) {
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);

            if (!this.isDigitizing) {
                this.segments = [];
                var point = this.getMap().pixToGeo(p.x, p.y);
                var from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                this.seg1 = new Fusion.Tool.Canvas.Segment(from,to);
                this.addSegment(this.seg1);
                from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                this.seg2 = new Fusion.Tool.Canvas.Segment(from,to);
                this.addSegment(this.seg2);
                from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                this.seg3 = new Fusion.Tool.Canvas.Segment(from,to);
                this.addSegment(this.seg3);
                from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                this.seg4 = new Fusion.Tool.Canvas.Segment(from,to);
                this.addSegment(this.seg4);
                this.clearContext();
                this.draw(this.context);     

                this.isDigitizing = true;
            } else {
                this.clearContext();
                this.draw(this.context);
                this.deactivateCanvas();
                
                this.clean();
                var p1 = new Point(this.seg1.from.x,this.seg1.from.y);
                var p2 = new Point(this.seg3.from.x,this.seg3.from.y);
                var rect = new Rectangle(p1, p2);
                this.handler(rect);
                
            }
        }
    },

    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove');
        if (!this.isDigitizing) {
            return;
        }
    
        var p = this.getMap().getEventPosition(e);
        this.seg1.to.setPx(p.x, this.seg1.from.py);
        this.seg1.to.updateGeo();
        this.seg2.from.setPx(p.x, this.seg1.from.py);
        this.seg2.from.updateGeo();
        this.seg2.to.setPx(p.x, p.y);
        this.seg2.to.updateGeo();
        this.seg3.from.setPx(p.x, p.y);
        this.seg3.from.updateGeo();
        this.seg3.to.setPx(this.seg1.from.px, p.y);
        this.seg3.to.updateGeo();
        this.seg4.from.setPx(this.seg1.from.px, p.y);
        this.seg4.from.updateGeo();
        this.clearContext();
        this.draw(this.context);
    },
}
    
MultiPointHandlers = Class.create();
MultiPointHandlers.prototype = {
    mouseDown: function(e) {
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);

            if (!this.isDigitizing) {
                this.segments = [];
                var point = this.getMap().pixToGeo(p.x, p.y);
                var from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var seg = new Fusion.Tool.Canvas.Segment(from,to);
                seg.setEditing(true);
                this.addSegment(seg);
                this.clearContext();
                this.draw(this.context);     

                this.isDigitizing = true;
            } else {
                var seg = this.lastSegment();
                seg.setEditing(false);
                seg = this.extendLine();
                seg.setEditing(true);
                this.clearContext();
                this.draw(this.context);
            }
        }
    },

    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove');
        if (!this.isDigitizing) {
            return;
        }
    
        var p = this.getMap().getEventPosition(e);
        var seg = this.lastSegment();
        seg.to.setPx(p.x,p.y);
        seg.to.updateGeo();
        this.clearContext();
        this.draw(this.context);
    },
    
    dblClick: function(e) {
        //console.log('Digitizer.dblClick');
        if (!this.isDigitizing) {
            return;
        }
        this.event = e;
        var p = this.getMap().getEventPosition(e);
        var point = this.getMap().pixToGeo(p.x, p.y);
        var seg = this.lastSegment();
        seg.setEditing(false);
        seg.to.set(point.x,point.y);
        this.clearContext();
        this.draw(this.context);
        this.isDigitizing = false;
        this.deactivateCanvas();
        
        this.clean();
        var ls = new LineString();
        var nodes = this.getNodes();
        for (var i=0; i<nodes.length; ++i) {
          var node = nodes[i];
          ls.AddPoint(new Point(node.x, node.y));
        }
        this.handler(ls);
    }
}
    
function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function LineString()
{
    this.points = new Array();
    this.Count = 0;

    this.AddPoint = function(pt)
    {
        this.points.push(pt);
        this.Count ++;
    }

    this.Point = function(i)
    {
        if(i < 0 || i >= this.points.length)
            return null;
        return this.points[i];
    }
}

function Circle()
{
    this.Center = null;
    this.Radius = 0;

    this.SetRadius = function(pt)
    {
        dx = pt.X - this.Center.X;
        dy = pt.Y - this.Center.Y;
        this.Radius = Math.sqrt(dx*dx + dy*dy);
    }
}

function Rectangle(p1, p2)
{
    this.Point1 = p1;
    this.Point2 = p2;
}

function Polygon()
{
    this.LineStringInfo = LineString;
    this.LineStringInfo();
}

/**
 * Fusion.Maps.MapServer
 *
 * $Id: MapServer.js 1464 2008-08-21 20:42:10Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/******************************************************************************
 * Class: Fusion.Maps.MapServer
 *
 * Implementation of the map widget for MapServer CGI interface services
*/
Fusion.Event.MAP_LAYER_ORDER_CHANGED = Fusion.Event.lastEventId++;

Fusion.Maps.MapServer = OpenLayers.Class(Fusion.Lib.EventMgr, {
    arch: 'MapServer',
    session: [null],
    aShowLayers: null,
    aHideLayers: null,
    aShowGroups: null,
    aHideGroups: null,
    aRefreshLayers: null,
    sActiveLayer: null,
    selectionType: 'INTERSECTS',
    bSelectionOn: false,
    bDisplayInLegend: true,   //TODO: set this in AppDef?
    bExpandInLegend: true,   //TODO: set this in AppDef?
    oSelection: null,
    bMapLoaded : false,
    bIsMapWidgetLayer : true,  //Setthis to false for overview map layers
    bLayersReversed: true,     //MS returns layers bottom-most layer first, we treat layer order in reverse sense
    mapMetadataKeys: null,
    layerMetadataKeys: null,

    //the map file
    sMapFile: null,

    //imagetype
    _sImageType : 'png',

    initialize : function(map, mapTag, isMapWidgetLayer) {
        //console.log('Fusion.Maps.MapServer.initialize');
        /*
        //Object.inheritFrom(this, Fusion.Lib.EventMgr, []);
        
        prototype is not yet defined when this is called now omitting. 

        Fusion.Lib.EventMgr.prototype.initialize.apply(this, []);
        */

        this.registerEventID(Fusion.Event.MAP_SESSION_CREATED);
        this.registerEventID(Fusion.Event.MAP_SELECTION_ON);
        this.registerEventID(Fusion.Event.MAP_SELECTION_OFF);
        this.registerEventID(Fusion.Event.MAP_LOADED);
        this.registerEventID(Fusion.Event.MAP_LOADING);
        this.registerEventID(Fusion.Event.MAP_LAYER_ORDER_CHANGED);

        this.mapWidget = map;
        this.oSelection = null;
        if (isMapWidgetLayer != null) {
            this.bIsMapWidgetLayer = isMapWidgetLayer;
        }

        var extension = mapTag.extension;
        this.ratio = extension.MapRatio ? extension.MapRatio[0] : '1.0';
        //this.selectionType = extension.SelectionType ? extension.SelectionType[0] : 'INTERSECTS';

        rootOpts = {
          displayInLegend: this.bDisplayInLegend,
          expandInLegend: this.bExpandInLegend,
          legendLabel: this._sMapname,
          uniqueId: 'layerRoot',
          groupName: 'layerRoot',
          visible: true,
          actuallyVisible: true
          //TODO: set other opts for group initialization as required
        };
        this.layerRoot = new Fusion.Maps.MapServer.Group(rootOpts,this);

        this.sMapFile = extension.MapFile ? extension.MapFile[0] : '';

        this.mapMetadataKeys = extension.MapMetadata ? extension.MapMetadata[0] : null;
        this.layerMetadataKeys = extension.LayerMetadata ? extension.LayerMetadata[0] : null;

        this.bSingleTile = mapTag.singleTile;// this is set by the AppDef.Map object

        this.keepAliveInterval = parseInt(extension.KeepAliveInterval ? extension.KeepAliveInterval[0] : 300);

        if (mapTag.sid) {
            this.session[0] = mapTag.sid;
            this.mapSessionCreated();
        } else {
            this.createSession();
        }
    },

    createSession: function() {
        if (!this.session[0]) {
            this.session[0] = this;
            var sl = Fusion.getScriptLanguage();
            var scriptURL = this.arch + '/' + sl + '/CreateSession.' + sl;
            var options = {onSuccess: OpenLayers.Function.bind(this.createSessionCB, this)};
            Fusion.ajaxRequest(scriptURL,options);
        }
        if (this.session[0] instanceof Fusion.Maps.MapServer) {
            this.session[0].registerForEvent(Fusion.Event.MAP_SESSION_CREATED, 
                        OpenLayers.Function.bind(this.mapSessionCreated, this));
        } else {
            this.mapSessionCreated();
        }
    },

    createSessionCB : function(r) {
        if (r.status == 200) {
            var o;
            eval('o='+r.responseText);
            this.session[0] = o.sessionId;
            this.triggerEvent(Fusion.Event.MAP_SESSION_CREATED);
        }
    },

    mapSessionCreated: function() {
        if (this.sMapFile != '') {
            this.loadMap(this.sMapFile);
        }
        window.setInterval(OpenLayers.Function.bind(this.pingServer, this), 
                                                this.keepAliveInterval * 1000);
    },

    sessionReady: function() {
        return (typeof this.session[0] == 'string');
    },

    getSessionID: function() {
        return this.session[0];
    },

    getMapName: function() {
        return this._sMapname;
    },

    getMapTitle: function() {
        return this._sMapTitle;
    },

    loadMap: function(mapfile, options) {
        while (this.mapWidget.isBusy()) {
	        this.mapWidget._removeWorker();
        }
        this.bMapLoaded = false;
        //console.log('loadMap: ' + resourceId);
        /* don't do anything if the map is already loaded? */
        if (this._sMapFile == mapfile) {
            return;
        }

        if (!this.sessionReady()) {
            this.sMapFile = mapfile;
            return;
        }

        if (this.bIsMapWidgetLayer) {
            this.mapWidget.triggerEvent(Fusion.Event.MAP_LOADING);
        } else {
            this.triggerEvent(Fusion.Event.MAP_LOADING);
        }
        this.mapWidget._addWorker();

        this._fScale = -1;
        this._nDpi = 72;

        options = options || {};

        this._oMaxExtent = null;
        this.aVisibleLayers = options.showlayers || [];
        this.aVisibleGroups = options.showgroups || [];
        this.aLayers = [];

        this.oSelection = null;
        this.aSelectionCallbacks = [];
        this._bSelectionIsLoading = false;

        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/LoadMap.' + sl;
        var params = {
            'mapfile': mapfile,
            'session': this.getSessionID()
        };
        if (this.mapMetadataKeys) {
            params.map_metadata = this.mapMetadataKeys;
        }
        if (this.layerMetadataKeys) {
            params.layer_metadata = this.layerMetadataKeys;
        }
        var options = {onSuccess:OpenLayers.Function.bind(this.mapLoaded, this), parameters: params};
        Fusion.ajaxRequest(loadmapScript, options);
    },

    mapLoaded: function(r) {
        if (r.status == 200)
        {
            var o;
            eval('o='+r.responseText);
            this._sMapFile = o.mapId;
            this._sMapname = o.mapName;
            this._sMapTitle = o.mapTitle;
            this.mapWidget.setMetersPerUnit(o.metersPerUnit);
            this._sImageType = o.imagetype;
            this.metadata = o.metadata;

            this._oMaxExtent = OpenLayers.Bounds.fromArray(o.extent);

            this.layerRoot.clear();
            this.layerRoot.legendLabel = this._sMapTitle;

            this.parseMapLayersAndGroups(o);

            var minScale = 1.0e10;
            var maxScale = 0;
            for (var i=0; i<this.aLayers.length; i++) {
              if (this.aLayers[i].visible) {
                  this.aVisibleLayers.push(this.aLayers[i].layerName);
              }
      				minScale = Math.min(minScale, this.aLayers[i].minScale);
      				maxScale = Math.max(maxScale, this.aLayers[i].maxScale);
            }
            //a scale value of 0 is undefined
            if (minScale <= 0) {
              minScale = 1.0;
            }

            if (o.dpi) {
                OpenLayers.DOTS_PER_INCH = o.dpi;
            }

            //to allow for scaling that doesn't match any of the pre-canned units
            this.units = Fusion.getClosestUnits(o.metersPerUnit);
            
            var layerOptions = {
      				singleTile: true,
      				ratio: this.ratio,
              units: this.units,
      				maxExtent : this._oMaxExtent,
              maxResolution : 'auto',
      				minScale : maxScale,	//OL interpretation of min/max scale is reversed from Fusion
      				maxScale : minScale
      			};

            //create the OL layer for this Map layer
            var params = {
              layers: this.aVisibleLayers.join(' '),
              session : this.getSessionID(),
              map : this._sMapFile,
              map_imagetype : this._sImageType
            };

            //remove this layer if it was already loaded
            if (this.oLayerOL) {
                this.oLayerOL.events.unregister("loadstart", this, this.loadStart);
                this.oLayerOL.events.unregister("loadend", this, this.loadEnd);
                this.oLayerOL.events.unregister("loadcancel", this, this.loadEnd);
                this.oLayerOL.destroy();
            }

            var url = Fusion.getConfigurationItem('mapserver', 'cgi');
            this.oLayerOL = new OpenLayers.Layer.MapServer( o.mapName, url, params, layerOptions);
            this.oLayerOL.events.register("loadstart", this, this.loadStart);
            this.oLayerOL.events.register("loadend", this, this.loadEnd);
            this.oLayerOL.events.register("loadcancel", this, this.loadEnd);

            if (this.bIsMapWidgetLayer) {
              this.mapWidget.addMap(this);
              this.mapWidget.oMapOL.setBaseLayer(this.oLayerOL);
              this.mapWidget.oMapOL.units = this.oLayerOL.units;
              var initialExtent = this.mapWidget.setInitialExtents();
              this.mapWidget.setExtents(initialExtent);
              this.mapWidget.triggerEvent(Fusion.Event.MAP_LOADED);
            } else {
              this.triggerEvent(Fusion.Event.MAP_LOADED);
            }

            this.bMapLoaded = true;
        }
        else
        {
            Fusion.reportError( new Fusion.Error(Fusion.Error.FATAL,
					'Failed to load requested map:\n'+r.responseText));
        }
        this.mapWidget._removeWorker();
    },

    reloadMap: function() {
        this.mapWidget._addWorker();
        this.aShowLayers = [];
        this.aHideLayers = [];
        this.aShowGroups = [];
        this.aHideGroups = [];
        this.aRefreshLayers = [];
        this.layerRoot.clear();
        this.aLayers = [];

        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/LoadMap.' + sl;

        var params = {
            'mapname': this._sMapname,
            'session': this.getSessionID()
        };
        if (this.mapMetadataKeys) {
            params.map_metadata = this.mapMetadataKeys;
        }
        if (this.layerMetadataKeys) {
            params.layer_metadata = this.layerMetadataKeys;
        }
        var options = {onSuccess: OpenLayers.Function.bind(this.mapReloaded, this),
                                     parameters: params};
        Fusion.ajaxRequest(loadmapScript, options);
    },

    mapReloaded: function(r) {  
        if (r.status == 200) {
            var o;
            eval('o='+r.responseText);

            //can metadata change?
            //this.metadata = o.metadata;

            this.parseMapLayersAndGroups(o);
            this.aVisibleLayers = [];
            for (var i=0; i<this.aLayers.length; i++) {
                if (this.aLayers[i].visible) {
                    this.aVisibleLayers.push(this.aLayers[i].layerName);
                }
            }
            this.drawMap();
            this.mapWidget.triggerEvent(Fusion.Event.MAP_RELOADED);
        } else {
            Fusion.reportError( new Fusion.Error(Fusion.Error.FATAL,
                OpenLayers.i18n('mapLoadError', {'error':r.responseText})));
        }
        this.mapWidget._removeWorker();
    },

    reorderLayers: function(aLayerIndex) {
        var sl = Fusion.getScriptLanguage();
        var loadmapScript = this.arch + '/' + sl  + '/SetLayers.' + sl;

        var params = {
            'mapname': this._sMapname,
            'session': this.getSessionID(),
            'layerindex': aLayerIndex.join()
        };
        var options = {onSuccess: OpenLayers.Function.bind(this.mapLayersReset, this, aLayerIndex),
                                     parameters: params};
        Fusion.ajaxRequest(loadmapScript, options);
    },

    mapLayersReset: function(aLayerIndex,r) {
      if (r.status == 200) {
        var o;
        eval('o='+r.responseText);
  			if (o.success) {
  				var layerCopy = this.aLayers.clone();
  				this.aLayers = [];
  				this.aVisibleLayers = [];

          for (var i=0; i<aLayerIndex.length; ++i) {
            this.aLayers.push( layerCopy[ aLayerIndex[i] ] );
            if (this.aLayers[i].visible) {
                this.aVisibleLayers.push(this.aLayers[i].layerName);
            }
  				}
  				//this.layerRoot.clear();

  				this.drawMap();
  				this.triggerEvent(Fusion.Event.MAP_LAYER_ORDER_CHANGED);
  			} else {
          alert(OpenLayers.i18n('setLayersError', {'error':o.layerindex}));
  			}
      }
    },

    parseMapLayersAndGroups: function(o) {
        for (var i=0; i<o.groups.length; i++) {
            var group = new Fusion.Maps.MapServer.Group(o.groups[i], this);
            var parent;
            if (group.parentUniqueId != '') {
                parent = this.layerRoot.findGroup(group.parentUniqueId);
            } else {
                parent = this.layerRoot;
            }
            parent.addGroup(group, this.bLayersReversed);
        }

        for (var i=0; i<o.layers.length; i++) {
            var layer = new Fusion.Maps.MapServer.Layer(o.layers[i], this);
            var parent;
            if (layer.parentGroup != '') {
                parent = this.layerRoot.findGroup(layer.parentGroup);
            } else {
                parent = this.layerRoot;
            }
            parent.addLayer(layer, this.bLayersReversed);
            this.aLayers.push(layer);
        }
    },

    /**
     * Function: isMapLoaded
     *
     * Returns true if the Map has been laoded succesfully form the server
     */
    isMapLoaded: function() {
        return this.bMapLoaded;
    },

    getScale : function() {
        return this.mapWidget.getScale();
    },

    updateLayer: function() {   //to be fleshed out, add query file to layer if selection, call this before draw
      if (this.hasSelection()) {
          this.oLayerOL.addOptions({queryfile: this._sQueryfile});
      }
    },

    drawMap: function() {
        if (!this.bMapLoaded || this.deferredDraw) {
            return;
        }
        var aLayers = [];
        for (var i=0; i<this.aLayers.length; i++) {
            var l = this.aLayers[i];
            if (l.isVisible()) {
                aLayers.push(l.layerName);
            }
        }
        var params = { layers: /*this.aVisibleLayers */aLayers.join(' '), ts : (new Date()).getTime()};
        if (this.hasSelection()) {
            params['queryfile']=this._sQueryfile;
        } else {
            params['queryfile'] = '';
        }
        this.oLayerOL.mergeNewParams(params);
    },

    showLayer: function( sLayer ) {
        this.aVisibleLayers.push(sLayer);
        this.drawMap();
    },

    hideLayer: function( sLayer ) {
        for (var i=0; i<this.aLayers.length; i++) {
            if (this.aVisibleLayers[i] == sLayer) {
                this.aVisibleLayers.splice(i,1);
                break;
            }
        }
        this.drawMap();
    },

    showGroup: function( sGroup ) {
      if (sGroup == 'layerRoot') {
        this.oLayerOL.setVisibility(true);
      } else {
        this.aVisibleGroups.push(sGroup);
        var group = this.layerRoot.findGroup(sGroup);
        this.deferredDraw = true;
        for (var i=0; i<group.layers.length; ++i) {
          group.layers[i].show();
        }
        this.deferredDraw = false;
        this.drawMap();
      }
    },

    hideGroup: function( sGroup ) {
      if (sGroup == 'layerRoot') {
        this.oLayerOL.setVisibility(false);
      } else {
        for (var i=0; i<this.aVisibleGroups.length; i++) {
            if (this.aVisibleGroups[i] == sGroup) {
                this.aVisibleGroups.splice(i,1);
                break;
            }
        }
        var group = this.layerRoot.findGroup(sGroup);
        this.deferredDraw = true;
        for (var i=0; i<group.layers.length; ++i) {
          group.layers[i].hide();
        }
        this.deferredDraw = false;
        this.drawMap();
      }
    },

    refreshLayer: function( sLayer ) {
        this.drawMap();
    },

    hasSelection: function() { return this.bSelectionOn; },

    getSelectionCB : function(userFunc, layers, startend, r) {
      if (r.status == 200)
      {
          var o;
          eval("o="+r.responseText);

          var oSelection = new Fusion.SelectionObject(o);
          userFunc(oSelection);
      }
    },

    /**
     * advertise a new selection is available and redraw the map
     */
    newSelection: function() {

        this.bSelectionOn = true;
        this.drawMap();
        this.triggerEvent(Fusion.Event.MAP_SELECTION_ON);
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectedFeatureCount : function() {
      var total = 0;
      for (var j=0; j<this.aLayers.length; ++j) {
        total += this.aLayers[j].selectedFeatureCount;
      }
      return total;
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectedLayers : function() {
      var layers = [];
      for (var j=0; j<this.aLayers.length; ++j) {
        if (this.aLayers[j].selectedFeatureCount>0) {
          layers.push(this.aLayers[j]);
        }
      }
      return layers;
    },

    /**
     * Returns the number of features selected for this map layer
     */
    getSelectableLayers : function() {
      var layers = [];
      for (var j=0; j<this.aLayers.length; ++j) {
        if (this.aLayers[j].selectable) {
          layers.push(this.aLayers[j]);
        }
      }
      return layers;
    },

    /**
     * asynchronously load the current selection.  When the current
     * selection changes, the selection is not loaded because it
     * could be a lengthy process.  The user-supplied function will
     * be called when the selection is available.
     *
     * @param userFunc {Function} a function to call when the
     *        selection has loaded
     * @param layers {string} Optional parameter.  A comma separated
     *        list of layer names (Roads,Parcels). If it is not
     *        given, all the layers that have a selection will be used
     *
     * @param startcount {string} Optional parameter.  A comma separated
     *        list of a statinh index and the number of features to be retured for
     *        each layer given in the layers parameter. Index starts at 0
     *        (eg: 0:4,2:6 : return 4 elements for the first layers starting at index 0 and
     *         six elements for layer 2 starting at index 6). If it is not
     *        given, all the elemsnts will be returned.
     */
    getSelection : function(userFunc, layers, startcount) {

        if (userFunc)
        {
            var s = this.arch + '/' + Fusion.getScriptLanguage() + "/Selection." + Fusion.getScriptLanguage() ;
            var params = {
                'mapname': this._sMapname,
                'session': this.getSessionID(),
                'layers': layers,
                'startcount': startcount,
                'queryfile': this._sQueryfile
            };
            var options = {
                parameters:params,
                onSuccess: OpenLayers.Function.bind(this.getSelectionCB, this, userFunc, layers, startcount)
            };
            Fusion.ajaxRequest(s, options);
        }

    },

    /**
       Utility function to clear current selection
    */
    clearSelection : function() {
      if (!this.aLayers) return;

        //clear the selection count for the layers
        for (var j=0; j<this.aLayers.length; ++j) {
          this.aLayers[j].selectedFeatureCount = 0;
        }

        this.bSelectionOn = false;
        this._sQueryfile = "";
        this.triggerEvent(Fusion.Event.MAP_SELECTION_OFF);
        this.drawMap();
        this.oSelection = null;
    },


    /**
       Call back function when slect functions are called (eg queryRect)
    */
    processQueryResults : function(zoomTo, r) {
        this.mapWidget._removeWorker();
        if (r.status == 200) {
            var o;
            eval("o="+r.responseText);
            if (!o.hasSelection) {
                //this.drawMap();
                return;
            } else {
                this._sQueryfile = o.queryFile;
                for (var i=0; i<o.layers.length; ++i) {
                  var layerName = o.layers[i];
                  for (var j=0; j<this.aLayers.length; ++j) {
                    if (layerName == this.aLayers[j].layerName) {
                      this.aLayers[j].selectedFeatureCount = o[layerName].featureCount;
                    }
                  }
                }
                this.newSelection();
                if (zoomTo) {
                var ext = oNode.extents
                var extents = new OpenLayers.Bounds(ext.minx, ext.miny, ext.maxx, ext.maxy);
                this.zoomToSelection(extents);
              }
            }
        }
    },
    /**
       Do a query on the map
    */
    query : function(options) {
        this.mapWidget._addWorker();

        //clear the selection count for the layers
        for (var j=0; j<this.aLayers.length; ++j) {
          this.aLayers[j].selectedFeatureCount = 0;
        }

        var bPersistant = options.persistent || true;
        var layers = options.layers || '';
        /* if no layes are given, query only visible layers. This is ususally the most common case*/
        if (layers == '') {
          layers = this.aVisibleLayers.join(',');
        }
        var zoomTo = options.zoomTo || false;
        var sl = Fusion.getScriptLanguage();
        var queryScript = this.arch + '/' + sl  + '/Query.' + sl;

        var params = {
            'mapname': this._sMapname,
            'session': this.getSessionID(),
            'spatialfilter': options.geometry || '',
            'maxfeatures': options.maxFeatures || -1, //-1 means select all features
            'layers': layers,
            'variant': options.selectionType || this.selectionType
        }
        if (options.filter) {
            params.filter = options.filter;
        }
        if (options.extendSelection) {
            params.extendselection = true;
        }
        if (options.computedProperties) {
            params.computed = true;
        }
        var ajaxOptions = {
            onSuccess: OpenLayers.Function.bind(this.processQueryResults, this, zoomTo), 
            parameters: params
        };
        Fusion.ajaxRequest(queryScript, ajaxOptions);
    },

    loadStart: function() {
      this.mapWidget._addWorker();
    },

    loadEnd: function() {
      this.mapWidget._removeWorker();
    },

    pingServer: function() {
        var s = this.arch + '/' + Fusion.getScriptLanguage() + "/Common." + Fusion.getScriptLanguage() ;
        var params = {};
        params.parameters = {'session': this.getSessionID()};
        Fusion.ajaxRequest(s, params);
  },

    getGroupInfoUrl: function(groupName) {
      return null;
   },

    getLayerInfoUrl: function(layerName) {
      return null;
  },

  getMetadata: function(key) {
      if (typeof this.metadata[key] != 'undefined') {
          return this.metadata[key];
      } else {
          return '';
      }
  }

});


/******************************************************************************
 * Class: Fusion.Maps.MapServer.Group
 *
 * Implements the map layer groups for MapServer CGI services
*/

Fusion.Maps.MapServer.Group = OpenLayers.Class(Fusion.Widget.Map.Group, {
    oMap: null,
    initialize: function(o, oMap) {
        this.uniqueId = o.uniqueId;
        Fusion.Widget.Map.Group.prototype.initialize.apply(this, [o.groupName]);
        this.oMap = oMap;
        this.groupName = o.groupName;
        this.legendLabel = o.legendLabel;
        this.parentUniqueId = o.parentUniqueId;
        this.groupType = o.groupType;
        this.displayInLegend = o.displayInLegend;
        this.expandInLegend = o.expandInLegend;
        this.visible = o.visible;
        this.actuallyVisible = o.actuallyVisible;
    },

    clear: function() {
        Fusion.Widget.Map.Group.prototype.clear.apply(this, []);
        //this.oMap = null;
    },

    show: function() {
        this.visible = true;
        this.oMap.showGroup(this.groupName);
    },

    hide: function() {
        this.visible = false;
        this.oMap.hideGroup(this.groupName);
    },

    isVisible: function() {
        var bParentVisible = (this.parentGroup && this.parentGroup.isVisible) ? this.parentGroup.isVisible() : true;
        return this.visible && bParentVisible;
    }

});

var MSLAYER_POINT_TYPE = 0;
var MSLAYER_LINE_TYPE = 1;
var MSLAYER_POLYGON_TYPE = 2;
var MSLAYER_SOLID_TYPE = 3;
var MSLAYER_RASTER_TYPE = 4;

/******************************************************************************
 * Class: Fusion.Maps.MapServer.Layer
 *
* Implements individual map legend layers for MapServer services
*/

Fusion.Maps.MapServer.Layer = OpenLayers.Class(Fusion.Widget.Map.Group, {

    scaleRanges: null,

    oMap: null,

    initialize: function(o, oMap) {
        this.uniqueId = o.uniqueId;
        Fusion.Widget.Map.Layer.prototype.initialize.apply(this, [this.uniqueId]);
        this.oMap = oMap;
        this.layerName = o.layerName;
        this.uniqueId = o.uniqueId;
        this.resourceId = o.resourceId;
        this.legendLabel = o.legendLabel;
        this.selectable = o.selectable;
        this.selectedFeatureCount = 0;
        this.layerTypes = [].concat(o.layerTypes);
        this.displayInLegend = o.displayInLegend;
        this.expandInLegend = o.expandInLegend;
        this.visible = o.visible;
        this.actuallyVisible = o.actuallyVisible;
        this.editable = o.editable;
        this.parentGroup = o.parentGroup;
        this.metadata = o.metadata;
        this.extent = o.extent;
        this.scaleRanges = [];
    		this.minScale = 1.0e10;
    		this.maxScale = 0;
        for (var i=0; i<o.scaleRanges.length; i++) {
            var scaleRange = new Fusion.Maps.MapServer.ScaleRange(o.scaleRanges[i], this.supportsType(4));
            this.scaleRanges.push(scaleRange);
      			this.minScale = Math.min(this.minScale, scaleRange.minScale);
      			this.maxScale = Math.max(this.maxScale, scaleRange.maxScale);
        }
    },

    clear: function() {
        Fusion.Widget.Map.Layer.prototype.clear.apply(this, []);
        this.oMap = null;
        this.legend = null;
    },

    supportsType: function(type) {
        for (var i=0; i<this.layerTypes.length; i++) {
            if (this.layerTypes[i] == type) {
                return true;
            }
        }
        return false;
    },

    getScaleRange: function(fScale) {
        for (var i=0; i<this.scaleRanges.length; i++) {
            if (this.scaleRanges[i].contains(fScale)) {
                return this.scaleRanges[i];
            }
        }
        return null;
    },

    show: function() {
        this.set('visible', true);
        this.oMap.showLayer(this.layerName);
    },

    hide: function() {
        this.set('visible',false);
        this.oMap.hideLayer(this.layerName);
    },

    isVisible: function() {
        var bParentVisible = this.parentGroup ? this.parentGroup.isVisible() : true;
        return this.visible && bParentVisible;
    },

    getMetadata: function(key) {
        if (typeof this.metadata[key] != 'undefined') {
            return this.metadata[key];
        } else {
            return '';
        }
    }
});

/******************************************************************************
 * Class: Fusion.Maps.MapServer.ScaleRange
 *
* Implements a scale range object for MapServer services
*/

Fusion.Maps.MapServer.ScaleRange = OpenLayers.Class({
    styles: null,
    initialize: function(o, bRaster) {
        this.minScale = o.minScale;
        this.maxScale = o.maxScale;
        this.styles = [];
        if (!o.styles) {
            return;
        }

        /*special case : if there are no classes and it is a raster layer
          we set it to use the default static raster icon*/
        if (o.styles.length == 0 && bRaster)
        {
          var tmpsyle = {};
          tmpsyle.legendLabel = "raster";
          tmpsyle.filter = "";
          tmpsyle.index = 0;
          tmpsyle.staticIcon = true;
          var styleItem = new Fusion.Maps.MapServer.StyleItem(tmpsyle, tmpsyle.staticIcon);
          this.styles.push(styleItem);
        }
        else
        {
          var staticIcon = o.styles.length>=1 ? false : bRaster;
          for (var i=0; i<o.styles.length; i++) {
            var styleItem = new Fusion.Maps.MapServer.StyleItem(o.styles[i], staticIcon);
            this.styles.push(styleItem);
          }
        }
    },
    contains: function(fScale) {
        var testScale = Math.round(fScale);
        return testScale >= this.minScale && testScale <= this.maxScale;
    }
});

/******************************************************************************
 * Class: Fusion.Maps.MapServer.StyleItem
 *
* Implements the legend style items to get a legend icon from the server
*/

Fusion.Maps.MapServer.StyleItem = OpenLayers.Class({
    initialize: function(o, staticIcon) {
        this.legendLabel = o.legendLabel;
        this.filter = o.filter;
        this.index = o.index;
        this.staticIcon = staticIcon;
    },
    getLegendImageURL: function(fScale, layer) {
        var sl = Fusion.getScriptLanguage();
        var url = Fusion.getFusionURL() + '/' + layer.oMap.arch + '/' + sl  + '/LegendIcon.' + sl;
        var sessionid = layer.oMap.getSessionID();
        var params = 'mapname='+layer.oMap._sMapname+"&session="+sessionid + '&layername='+layer.resourceId + '&classindex='+this.index;
        return url + '?'+params;
    }
});
Fusion.Strings.en = {
'scriptFailed': 'failed to load script: ${script}',
'configParseError': 'Error parsing fusion configuration file, initialization aborted',
'configLoadError': 'Error loading fusion configuration file, initialization aborted.' +
                  'Make sure that you have copied config_dist.json to config.json ' +
                  'and have configured the settings for your system',
'ajaxError': 'Exception occurred in AJAX callback.\nMessage: ${exception}\nLocation: ${filename} (${line})\nResponse: ${response}',
'importFailed': 'failed to import stylesheet: ${url}',
'registerEventError': 'Error registering eventID, invalid (empty) eventID.',
'appDefLoadFailed': 'failed to load: ${script}',
'appDefParseError': 'failed to parse ApplicationDefinition',
'widgetSetParseError': 'failed to parse the WidgetSet',
'fusionError': 'Fusion Error: ${type}\n${message}',
'nullExtents': 'Map.setExtents called with null extents',
'mapLoadError': 'Failed to load requested map:\n${error}',
'setLayersError': "setLayers failure: ${error}",
'printTitle': 'Printable Page ',
'noSelection': 'No Selection',
'selectionInfo': '${features} features selected on ${layers} layers',
'attribute': 'Attribute',
'value': 'Value',
'taskHome': 'return to the task pane home',
'prevTask': 'go to previous task executed',
'nextTask': 'go to next task executed',
'taskList': 'Task List',
'taskPane': 'Task Pane',
'imperial': 'Imperial',
'metric': 'Metric',
'deg': 'Degrees',
'refresh': 'Refresh',
'expandAll': 'Expand All',
'expand': 'Expand',
'collapseAll': 'Collapse All',
'collapse': 'Collapse',
'defaultMapTitle': 'Map',
'legendTitle': 'Legend',
'selectionPanelTitle': 'Selection',
'ovmapTitle': 'Overview Map',
'ovmapTitleShort': 'Overview',
'taskPaneTitle': 'Tasks',
'segment': 'Segment ${seg}',
'calculating': 'calculating ...',
'panWest': 'Pan West',
'panEast': 'Pan East',
'panSouth': 'Pan South',
'panNorth': 'Pan North',
'zoomOut': 'Zoom Out',
'zoomIn': 'Zoom In',

'end': ''
};
Fusion.Strings.fr = {
'scriptFailed': 'failed to load script: ${script}',
'configParseError': 'Error parsing fusion configuration file, initialization aborted',
'configLoadError': 'Error loading fusion configuration file, initialization aborted.' +
                  'Make sure that you have copied config_dist.json to config.json ' +
                  'and have configured the settings for your system',
'ajaxError': 'Exception occurred in AJAX callback.\n${exception}\nLocation: ${file} (${line}))',
'importFailed': 'failed to import stylesheet: ${url}',
'registerEventError': 'Error registering eventID, invalid (empty) eventID.',
'appDefLoadFailed': 'failed to load: ${script}',
'appDefParseError': 'failed to parse ApplicationDefinition',
'widgetSetParseError': 'failed to parse the WidgetSet',
'fusionError': 'Fusion Error: ${type}\n${message}',
'nullExtents': 'Map.setExtents called with null extents',
'mapLoadError': 'Failed to load requested map:\n${error}',
'setLayersError': "setLayers failure: ${error}",
'printTitle': 'Printable Page ',
'noSelection': 'Aucun SÃ©lection',
'selectionInfo': '${features} features selected on ${layers} layers',
'attribute': 'Attribute',
'value': 'Value',
'taskHome': 'return to the task pane home',
'prevTask': 'go to previous task executed',
'nextTask': 'go to next task executed',
'taskList': 'Task List',
'taskPane': 'Task Pane',
'imperial': 'Imperial',
'metric': 'Metric',
'deg': 'Degrees',
'refresh': 'Refresh',
'expandAll': 'Expand All',
'expand': 'Expand',
'collapseAll': 'Collapse All',
'collapse': 'Collapse',
'defaultMapTitle': 'Map',
'legendTitle': 'Legend',
'selectionPanelTitle': 'SÃ©lection',
'ovmapTitle': 'Overview Map',
'ovmapTitleShort': 'Overview',
'taskPaneTitle': 'Tasks',
'segment': 'Segment ${seg}',
'calculating': 'calculating ...',
'panWest': 'Ouest',
'panEast': 'Est',
'panSouth': 'Sud',
'panNorth': 'Nord',
'zoomOut': 'Cliquer pour rÃ©duire',
'zoomIn': 'Cliquer pour agrandir',

'end': ''
};
/**
 * Fusion.Widget.About
 *
 * $Id: About.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/********************************************************************
* Class: Fusion.Widget.About
*
* About widget to display a pop-up window about the application.  The contents
* of the page are come from an HTML page set as the AboutUrl extension property.
*
* **********************************************************************/

Fusion.Widget.About = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, {
    _nWidth : 500,
    _nHeight : 400,
    _sDefaultUrl : '/mapguide/mapadmin/about.php',  //TBD we need a Fusion specific About page

/*
 * Constructor: About
 *
 * Parameters:
 *
 * widgetTag - JSON node for this widget from the Application definition
 *
 */
    initialize : function(widgetTag) {
        //console.log('About.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        var json = widgetTag.extension;
        this._sAboutUrl = (json.AboutURL) ? 
                json.AboutURL[0] : this._sDefaultUrl;
        this.enable();
    },

    /**
     * Function: execute
     *
     * opens a pop-up window with the about information when invoked
     * 
     */
    execute : function() {
      //console.log('About.execute');

      var sFeatures = 'menubar=no,location=no,resizable=no,status=no';
      sFeatures += ',width=' + this._nWidth;
      sFeatures += ',height=' + this._nHeight;
      window.open(this._sAboutUrl, 'AboutPopup', sFeatures);
    }
});
/**
 * Fusion.Widget.ActivityIndicator
 *
 * $Id: ActivityIndicator.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*****************************************************************************
 * Class: Fusion.Widget.ActivityIndicator
 *
 * AcitivityIndicator is a widget that shows or hides its DOM element
 * based on whether the map widget is busy or not.  The map widget
 * becomes busy when loading maps, reloading maps or redrawing
 * layers.
 *
 * **************************************************************************/


Fusion.Widget.ActivityIndicator = OpenLayers.Class(Fusion.Widget, {
    element: null,
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        this.element = this.domObj;
        var json = widgetTag.extension;
        if (json.ElementId) {
            var elm = $(json.ElementId[0]);
            if (elm && elm != this.domObj) {
                this.domObj.appendChild(elm);
                this.element = elm;
            }
        }
        this.element.style.visibility = 'hidden';
        this.getMap().registerForEvent(Fusion.Event.MAP_BUSY_CHANGED, 
                              OpenLayers.Function.bind(this.busyChanged, this));
    },
    busyChanged: function() {
        this.element.style.visibility = this.getMap().isBusy() ? 'visible' : 'hidden';
    }
});
/**
 * Fusion.Widget.Buffer
 *
 * $Id: Buffer.js 1459 2008-08-13 17:34:30Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*****************************************************************************
 * Class: Fusion.Widget.Buffer
 *
 * The Buffer widget prompts the user for some inputs and then creates a buffer
 * around the current selection based on those inputs.
 *
 * NOTE: This version of the widget is not currently being used.  
 * Use BufferPanel instead. The 2 widgets will be merged eventually.
 *
 * **************************************************************************/

Fusion.Widget.Buffer = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    layerName: null,
    layerNameInput: null,
    bufferDistance: null,
    bufferDistanceInput: null,
    bufferUnits: null,
    bufferUnitsInput: null,
    borderColor: null,
    borderColorInput: null,
    fillColor: null,
    fillColorInput: null,
    initialize: function(widgetTag) {
        //console.log('Buffer.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        
        /* pick up default values */
        this.layerName = json.LayerName ? json.LayerName[0] : '';
        this.layerNameInput = json.LayerNameInput ? json.LayerNameInput[0] : null;
        this.bufferDistance = json.BufferDistance ? parseFloat(json.BufferDistance[0]) : '';
        this.bufferDistanceInput = json.BufferDistanceInput ? json.BufferDistanceInput[0] : null;
        this.bufferUnits = Fusion.unitFromName(json.BufferUnits ? json.BufferUnits[0] : 'meters');
        this.bufferUnitsInput = json.BufferUnitsInput ? json.BufferUnitsInput[0] : null;
        this.borderColor = json.BorderColor ? json.BorderColor[0] :'00000000';
        this.borderColorInput = json.BorderColorInput ? json.BorderColorInput[0] : null;
        this.fillColor = json.FillColor ? json.FillColor[0] : '00000000';
        this.fillColorInput = json.FillColorInput ? json.FillColorInput[0] : null;
        
        /* initialize inputs with defaults */
        if (this.layerNameInput) {
            this.layerNameInput = $(this.layerNameInput);
            this.setValue(this.layerNameInput, this.layerName);
        }
        if (this.bufferDistanceInput) {
            this.bufferDistanceInput = $(this.bufferDistanceInput);
            this.setValue(this.bufferDistanceInput, this.bufferDistance);
        }
        if (this.bufferUnitsInput) {
            this.bufferUnitsInput = $(this.bufferUnitsInput);
            this.setValue(this.bufferUnitsInput, this.bufferUnits);
        }
        if (this.borderColorInput) {
            this.borderColorInput = $(this.borderColorInput);
            this.setValue(this.borderColorInput, this.borderColor);
        }
        if (this.fillColorInput) {
            this.fillColorInput = $(this.fillColorInput);
            this.setValue(this.fillColorInput, this.fillColor);
        }
        
        /* override selection behaviour */
        this.enable = Fusion.Widget.Buffer.prototype.enable;
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.disable, this));
    },
    
    setValue: function(input, value) {
        if (input.tagName.toLowerCase() == "input") {
            switch(input.type) {
                case 'radio':
                case 'checkbox':
                    for (var i=0; i<input.length; i++) {
                        if (input[i].value == value) {
                            input[i].checked = true;
                        }
                    }
                    break;
                case 'file':
                    break;
                case 'button':
                case 'hidden':
                case 'image':
                case 'password':
                case 'reset':
                case 'submit':
                case 'text':
                    input.value = value;
                    break;
                default:
            }
        }
        if (input.tagName.toLowerCase() == 'textarea') {
            input.value = value;
        }
        if (input.tagName.toLowerCase() == 'select') {
            for (var i=0; i<input.options.length; i++) {
                if (input.options[i].value == value) {
                    input.options[i].selected = true;
                    break;
                }
            }
        }
    },
    
    getValue: function(input) {
        if (input.tagName.toLowerCase() == "input") {
            switch(input.type) {
                case 'radio':
                case 'checkbox':
                    return input.value;
                    break;
                case 'file':
                case 'button':
                case 'hidden':
                case 'image':
                case 'password':
                case 'reset':
                case 'submit':
                case 'text':
                    return input.value;
                    break;
                default:
            }
        }
        if (input.tagName.toLowerCase() == 'textarea') {
            return input.value;
        }
        if (input.tagName.toLowerCase() == 'select') {
            return input.options[input.selectedIndex].value;
        }
    },
    
    enable: function() {
        if (this.oMap && this.oMap.hasSelection()) {
            Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
        } else {
            this.disable();
        }
    },
    
    execute: function() {
        if (this.layerNameInput) {
            this.layerName = this.getValue(this.layerNameInput);
        }
        var layer = '&layer=' + this.layerName;
        
        var d;
        if (this.bufferDistanceInput) {
            d = this.getValue(this.bufferDistanceInput);
        } else {
            d = this.bufferDistance;
        }
        
        var du;
        if (this.bufferUnitsInput) {
            du = this.getValue(this.bufferUnitsInput);
        } else {
            du = this.bufferUnits;
        }
        
        /* convert distance to meters client side */
        var distance = '&distance='+Fusion.toMeter(Fusion.unitFromName(du), d);
        
        var borderColor = '&bordercolor=';
        if (this.borderColorInput) {
            borderColor += this.getValue(this.borderColorInput);
        } else {
            borderColor += this.borderColor;
        }
        
        var fillColor = '&fillcolor=';
        if (this.fillColorInput) {
            fillColor += this.getValue(this.fillColorInput);
        } else {
            fillColor += this.fillColor;
        }
        
        var mapWidget = this.getMap();
        var aMaps = mapWidget.getAllMaps();        
        var s = aMaps[0].arch + '/' + Fusion.getScriptLanguage() + "/Buffer." + Fusion.getScriptLanguage();
        var params = {};
        params.parameters = 'locale='+Fusion.locale +
                            '&merge=1' +
                            '&session='+aMaps[0].getSessionID() +
                            '&mapname='+ aMaps[0].getMapName()+
                            layer+distance+borderColor+fillColor; 
        params.onComplete = OpenLayers.Function.bind(this.bufferCreated, this);
        Fusion.ajaxRequest(s, params);
    },
    
    bufferCreated: function() {
        var aMaps = this.getMap().getAllMaps();
        var layer = aMaps[0].getLayerByName(this.layerName);
        if (layer) {
          layer.noCache = true;
        }
        aMaps[0].reloadMap();
        aMaps[0].drawMap();
    }
});
/**
 * Fusion.Widget.BufferPanel
 *
 * $Id: BufferPanel.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /*****************************************************************************
 * Class: Fusion.Widget.BufferPanel
 *
 * The BufferPanel widget prompts the user for some inputs and then creates a 
 * buffer around the current selection based on those inputs.
 *
 * If the Target property points to TaskPane widget, the task will be listed in
 * the menu list of the TaskPane and loaded there.
 * Otherwise if the target is an existing IFrame in the page it will be loaded 
 * there, otherwise it will open a new window with that name.
 * **********************************************************************/

Fusion.Widget.BufferPanel = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, {
    sFeatures : 'menubar=no,location=no,resizable=no,status=no',

    initialize : function(widgetTag) {
        //console.log('BufferPanel.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.sTarget = json.Target ? json.Target[0] : "BufferPanelWindow";
        this.sBaseUrl = Fusion.getFusionURL() + 'widgets/BufferPanel/BufferPanel.php';
        
        this.bSelectionOnly = (json.DisableIfSelectionEmpty &&
                           (json.DisableIfSelectionEmpty[0] == 'true' ||
                            json.DisableIfSelectionEmpty[0] == '1')) ? true : false;
                            
        this.additionalParameters = [];
        if (json.AdditionalParameter) {
            for (var i=0; i<json.AdditionalParameter.length; i++) {
                var p = json.AdditionalParameter[i];
                var k = p.Key[0];
                var v = p.Value[0];
                this.additionalParameters.push(k+'='+encodeURIComponent(v));
            }
        }
        
        this.enable = Fusion.Widget.BufferPanel.prototype.enable;
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.enable, this));
        this.disable();
    },

    enable: function() {
        var map = this.getMap();
        if (this.bSelectionOnly || !map) {
            if (map && map.hasSelection()) {
                if (this.action) {
                    this.action.setEnabled(true);
                } else {
                    Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
                }
            } else {
                if (this.action) {
                    this.action.setEnabled(false);
                } else {
                    this.disable();
                }
            }
        } else {
            if (this.action) {
                this.action.setEnabled(true);
            } else {
                Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
            }
        }
    },
    
    execute : function() {
        var url = this.sBaseUrl;
        //add in other parameters to the url here
        
        var map = this.getMap();
        var mapLayers = map.getAllMaps();
        var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
        var pageElement = $(this.sTarget);

        var params = [];
        params.push('locale='+Fusion.locale);
        params.push('session='+mapLayers[0].getSessionID());
        params.push('mapname='+mapLayers[0].getMapName());
        if (taskPaneTarget || pageElement) {
          params.push('popup=false');
        } else {
          params.push('popup=true');
        }
        params.push('us=0');  //TODO: get displayunits from viewOptions; as it stands. us=1 means miles, anything else is kilometers
        params = params.concat(this.additionalParameters);

        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url.slice(-1) != '&') {
            url += '&';
        }
        url += params.join('&');
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                window.open(url, this.sTarget, this.sWinFeatures);
            }
        }
    }
});
/**
 * Fusion.Widget.CenterSelection
 *
 * $Id: CenterSelection.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.CenterSelection
 *
 * Center the current selection, if any, but maintain the current scale
 * if possible.  Zoom out if not.
 *
 * **********************************************************************/


Fusion.Widget.CenterSelection = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, {
    initialize : function(widgetTag) {
        //console.log('CenterSelection.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        this.enable = Fusion.Widget.CenterSelection.prototype.enable;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.disable, this));
    },

    /**
     * get the selection from the map (which may not be loaded yet).
     * zoomToSelection is called when the selection is ready.
     */
    execute : function() {
        this.getMap().getSelection(OpenLayers.Function.bind(this.centerSelection, this));
    },

    /**
     * set the extents of the map based on the pixel coordinates
     * passed
     * 
     * @param selection the active selection, or null if there is none
     */
    centerSelection : function(selection) {
        var map = this.getMap(); 
        var extents = map.getCurrentExtents();
        var curWidth = extents[2] - extents[0];
        var curHeight = extents[3] - extents[1];
        
        var ll = selection[map.getMapName()].getLowerLeftCoord();
        var ur = selection[map.getMapName()].getUpperRightCoord();
        
        var newWidth = ur.x - ll.x;
        var newHeight = ur.y - ll.y;
        
        if (newWidth < curWidth && newHeight < curHeight) {
            var cx = (ur.x + ll.x) / 2;
            var cy = (ur.y + ll.y) / 2;
            map.zoom(cx,cy,1);
        } else {
            var buffer = 0.1;
            var minx = ll.x-newWidth*buffer;
            var miny = ll.y-newHeight*buffer;
            var maxx = ur.x+newWidth*buffer;
            var maxy = ur.y+newHeight*buffer;
            map.setExtents(new OpenLayers.Bounds(minx,miny,maxx,maxy));
        }
    },

    enable: function() {
        if (this.oMap && this.oMap.hasSelection()) {
            Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
        } else {
            this.disable();
        }
    }
});
/**
 * Fusion.Widget.ClearSelection
 *
 * $Id: ClearSelection.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ClearSelection
 *
 * Clears the current selection, if any.
 * **********************************************************************/

Fusion.Widget.ClearSelection = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, {

    initialize : function(widgetTag) {
        //console.log('ClearSelection.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        this.enable = Fusion.Widget.ClearSelection.prototype.enable;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.disable, this));
    },
    
    /**
     * clears slection on map.
     */
    execute : function() {
        this.getMap().clearSelection();
    },
    
    enable: function() {
        if (this.oMap && this.oMap.hasSelection()) {
            Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
        } else {
            this.disable();
        }
    }
});
/**
 * Fusion.Widget.ColorPicker
 *
 * $Id: ColorPicker.js 1381 2008-04-21 20:02:54Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ColorPicker
 *
 * The user can pick from a palette of web-safe colours or enter a hex value. 
 * The colour selected will be entered into the configured input element.
 *
 * **********************************************************************/

Fusion.Widget.ColorPicker = OpenLayers.Class(Fusion.Widget, {
    /* HTML input element that is used to store both the initial
       value for this widget and receives the color value as the
       color changes */
    colorInput: null,

    /* Int (0-100) containing the alpha chosen by the user */
    alpha: 100,
    
    /* String containing the HEX value of the color chosen by the
       user, in RRGGBB format */
    color: '#000000',
    
    colorButton: null,
    
    initialize : function(widgetTag) {      
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        var json = widgetTag.extension;
        if (json.ColorInputId) {
            this.colorInput = $(json.ColorInputId[0]);
        }
        
        if (this.colorInput) {
            this.alpha = 100 * parseInt('0x'+this.colorInput.value.substring(0,2))/255;
            this.color = '#'+this.colorInput.value.substring(2);
            this.colorInput.widget = this;
        }
        
        this.colorButton = new Jx.Button.Color({color: this.color, alpha: this.alpha, label: widgetTag.label, tooltip: widgetTag.tooltip});
        this.colorButton.addColorChangeListener(this);
        
        if (this.domObj) {
            this.domObj.appendChild(this.colorButton.domObj);
        }
    },
    
    colorChanged: function(button) {
        var a = parseInt(this.colorButton.alpha*255/100).toString(16);
        var c = a + this.colorButton.color.substring(1);
        //console.log('colorChanged: '+c);
        if (this.colorInput) {
            this.colorInput.value = c;
        }
    }
});/**
 * Fusion.Widget.CursorPosition
 *
 * $Id: CursorPosition.js 1388 2008-05-06 14:46:04Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.CursorPosition
 *
 * Displays the geographic position of the cursor when it is over the map.
 *
 * Precision (integer, optional)
 *
 * The number of digits to round the output to.  The geographic location
 * is calculated with arbitrary precision and is often not necessary. A
 * value of less than 0 means no rounding (the default if parameter is
 * missing).
 *
 * Template (string, optional) 
 *
 * The format of the output string.  Use {x} and {y} as placeholders for
 * the x and y location.  The default template is:
 *
 * x: {x}, y: {y}
 *
 * You can embed HTML in the template, but you must escape any characters
 * that result in illegal HTML.  This would include:
 *
 * < is &lt;
 * > is &gt;
 * & is &amp;
 *
 * So a two-line display would be:
 *
 * x: {x}&lt;br/&gt;y: {y}
 * **********************************************************************/

Fusion.Widget.CursorPosition = OpenLayers.Class(Fusion.Widget, {
    defaultTemplate: 'x: {x}, y: {y}',
    domSpan: null,
    
    /* the units to display distances in */
    units: Fusion.UNKNOWN,

    initialize : function(widgetTag) {
        //console.log('CursorPosition.initialize');
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
                
        
        var json = widgetTag.extension;
        
        this.emptyText = json.EmptyText ? json.EmptyText[0] : this.domObj.innerHTML;
        this.template = json.Template ? json.Template[0] : this.defaultTemplate;
        this.precision = json.Precision ? parseInt(json.Precision[0]) : -1;
        this.units = json.Units ? Fusion.unitFromName(json.Units[0]) : Fusion.UNKOWN;

        this.domSpan = document.createElement('span');
        this.domSpan.className = 'spanCursorPosition';
        this.domSpan.innerHTML = this.emptyText;
        this.domObj.innerHTML = '';
        this.domObj.appendChild(this.domSpan);

        this.enable = Fusion.Widget.CursorPosition.prototype.enable;
        this.disable = Fusion.Widget.CursorPosition.prototype.enable;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setUnits, this));
        this.registerParameter('Units');
    },
    
    enable: function() {
        this.mouseMoveWatcher = OpenLayers.Function.bind(this.mouseMove, this);
        this.mouseOutWatcher = OpenLayers.Function.bind(this.mouseOut, this);

        this.getMap().observeEvent('mousemove', this.mouseMoveWatcher);
        this.getMap().observeEvent('mouseout', this.mouseOutWatcher);
    },
    
    disable: function() {
        this.getMap().stopObserveEvent('mousemove', this.mouseMoveWatcher);
        this.getMap().stopObserveEvent('mouseout', this.mouseOutWatcher);
    },
    
    mouseOut: function(e) {
        this.domSpan.innerHTML = this.emptyText;
    },
    
    mouseMove: function(e) {
        var map = this.getMap();
        var p = map.getEventPosition(e);
        if (this.units != Fusion.PIXELS) {
            p = map.pixToGeo(p.x, p.y);
            if (p) {
                if (this.units != Fusion.UNKNOWN) {
                    var convFactor = map.getMetersPerUnit();
                    p.x = Fusion.fromMeter(this.units, p.x * convFactor);
                    p.y = Fusion.fromMeter(this.units, p.y * convFactor);
                }
                if (this.precision >= 0) {
                    var factor = Math.pow(10,this.precision);
                    p.x = Math.round(p.x * factor)/factor;
                    p.y = Math.round(p.y * factor)/factor;
                }
            }
        }
        if (p) {
            var unitAbbr = Fusion.unitAbbr(this.units);
            this.domSpan.innerHTML = this.template.replace('{x}',p.x).replace('{y}',p.y).replace('{units}', unitAbbr).replace('{units}', unitAbbr);
        }
    },

    setUnits: function() {
      if (this.units == Fusion.UNKNOWN) {
        this.setParameter('Units',this.getMap().getUnits());
      }
    },

    setParameter: function(param, value) {
        if (param == 'Units') {
            this.units = Fusion.unitFromName(value);
        }
    }
});
/**
 * Fusion.Widget.EditableScale
 *
 * $Id: EditableScale.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.EditableScale
 *
 * The user can manually type in a new scale
 *
 * **********************************************************************/

Fusion.Widget.EditableScale = OpenLayers.Class(Fusion.Widget, {
    precision: 4,
    
    initialize : function(widgetTag) {
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        
        var json = widgetTag.extension;
        
        var domPrefix = document.createElement('span');
        domPrefix.className = 'inputEditableScalePrefix';
        domPrefix.innerHTML = '1: ';
        this.domObj.appendChild(domPrefix);
        this.domScale = document.createElement('input');
        this.domScale.className = 'inputEditableScale';
        this.domObj.appendChild(this.domScale);
        Event.observe(this.domScale, 'keypress', 
           OpenLayers.Function.bindAsEventListener(this.keyPressHandler, this));
        this.precision = json.Precision ? parseInt(json.Precision[0]) : this.precision;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.scaleChanged, this));
        
        Fusion.addWidgetStyleSheet(widgetTag.location + '/EditableScale/EditableScale.css');
        
        
    },
    
    scaleChanged: function() {
        this.domScale.value = this.scaleToString(this.getMap().oMapOL.getScale());
    },
    
    scaleToString: function(scale) {
        scale = Math.abs(parseFloat(scale));
        return "" + Math.round(scale * Math.pow(10,this.precision))/Math.pow(10,this.precision);
    },
    
    keyPressHandler: function(e) {
        if (e.keyCode == Event.KEY_RETURN) {
            this.zoomToScale();
        }
    },
    
    zoomToScale: function(e) {
        var scale = parseFloat(this.domScale.value);
        if (scale) {
            this.getMap().zoomToScale(scale);
        }
    }
});/**
 * Fusion.Widget.ExtentHistory
 *
 * $Id: ExtentHistory.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ExtentHistory
 *
 * Maintain and navigate through a history of extents
 * 
 * **********************************************************************/

Fusion.Event.HISTORY_CHANGED = Fusion.Event.lastEventId++;

Fusion.Widget.ExtentHistory = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,  {
    events: [],
    aHistory: [],
    sDirection: null,
    EPS: 0.00000001,  //percentage difference allowed in bounds values for test for equal
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        var sDirection = json.Direction ? json.Direction[0].toLowerCase() : 'previous';
        if (sDirection != 'previous' && sDirection != 'next') {
            this.sDirection = 'previous';
        } else {
            this.sDirection = sDirection;
        }
        
        if (!this.aHistory['history']) {
            this.aHistory['history'] = [];
            this.aHistory['index'] = -1;
            this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, 
                          OpenLayers.Function.bind(this.extentsChanged, this));
            this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, 
                          OpenLayers.Function.bind(this.reset, this));
            
        }
        this.enable = Fusion.Widget.ExtentHistory.prototype.historyChanged;
        
        this.disable = Fusion.Widget.ExtentHistory.prototype.historyChanged;
        
        this.registerEventID(Fusion.Event.HISTORY_CHANGED);
        
        this.registerForEvent(Fusion.Event.HISTORY_CHANGED, 
                          OpenLayers.Function.bind(this.historyChanged, this));
        //console.log(this.events[Fusion.Event.HISTORY_CHANGED].length);
        this.disable();
    },
    
    reset: function() {
        if (this.getMap().isMapLoaded()) {
            this.aHistory['history'] = [this.getMap().getCurrentExtents()];
            this.aHistory['index'] = 0;
        } else {
            this.aHistory['history'] = [];
            this.aHistory['index'] = -1;
        }
        this.historyChanged();
    },
    
    extentsChanged: function() {
        var extents = this.getMap().getCurrentExtents();
        if (this.aHistory['history'].length == 0) {
            this.aHistory['history'].push(extents);
            this.aHistory['index'] = 0;
        } else {
            var aExtents = this.aHistory['history'][this.aHistory['index']];
            if (this.boundsEqual(extents, aExtents)) {
                return;
            }
            //clear forward history if we zoom to a different extent than contained in the history
            if (this.aHistory['index'] != (this.aHistory['history'].length - 1)) {
                this.aHistory['history'] = this.aHistory['history'].slice(0, this.aHistory['index'] + 1);
            }
            this.aHistory['history'].push(extents);
            this.aHistory['index'] = this.aHistory['history'].length - 1;
        }
        this.triggerEvent(Fusion.Event.HISTORY_CHANGED);
    },
    
    historyChanged: function() {
        if (this.sDirection == 'previous') {
            if (this.aHistory['index'] > 0) {
                Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
            } else {
                Fusion.Tool.ButtonBase.prototype.disable.apply(this,[]);
            }
        } else {
            if (this.aHistory['index'] < (this.aHistory['history'].length - 1)) {
                Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
            } else {
                Fusion.Tool.ButtonBase.prototype.disable.apply(this,[]);
            }
        }
    },

    execute: function() {
        if (this.sDirection == 'previous') {
            if (this.aHistory['index'] > 0) {
                this.aHistory['index'] --;
                this.getMap().setExtents(this.aHistory['history'][this.aHistory['index']]);
                this.triggerEvent(Fusion.Event.HISTORY_CHANGED);
            }
        } else {
            if (this.aHistory['index'] < (this.aHistory['history'].length - 1)) {
                this.aHistory['index'] ++;
                this.getMap().setExtents(this.aHistory['history'][this.aHistory['index']]);
                this.triggerEvent(Fusion.Event.HISTORY_CHANGED);
            }
        }
    },
    
    /* 
      * test if 2 OpenLayers.Bounds objects are equal to within some precision
      */
    boundsEqual: function(b1, b2) {
      var equal = false;
      
      //prevent divide by 0 errors
      var offset = 100;
      if (b2.top == 0) {
        b1.top += offset;
        b2.top += offset;
      }
      if (b2.bottom == 0) {
        b1.bottom += offset;
        b2.bottom += offset;
      }
      if (b2.left == 0) {
        b1.left += offset;
        b2.left += offset;
      }
      if (b2.right == 0) {
        b1.right += offset;
        b2.right += offset;
      }
      //calculate difference as percentage so all ranges of coordinates can be accommodated
      equal = (Math.abs(b1.top - b2.top)/b2.top < this.EPS &&
               Math.abs(b1.bottom - b2.bottom)/b2.bottom < this.EPS &&
               Math.abs(b1.left - b2.left)/b2.left < this.EPS &&
               Math.abs(b1.right - b2.right)/b2.right < this.EPS);
      return equal;
    }
});

/**
 * Fusion.Widget.Help
 *
 * $Id: Help.js 1591 2008-10-10 15:24:02Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Help
 *
 * Display a user help page.
 * 
 * **********************************************************************/

Fusion.Widget.Help = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, {
    /* popup window initialization parameters */
    sFeatures : 'menubar=no,location=no,resizable=no,status=no',

    /* the frame or window name to target.  If set to the Name of a
     * task pane widget, then it will appear in the task pane
     */
    target: 'HelpWindow',
    
    /* the url to open.  If specified, it is relative to the
     * application, not fusion
     */
    baseUrl: null,
    
    initialize : function(widgetTag) {
        //console.log('Help.initialize');
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.target = json.Target ? json.Target[0] : "HelpWindow";
        this.baseUrl = json.Url ? json.Url[0] : Fusion.getFusionURL() + widgetTag.location + '/Help/Help.html';

        /* this widget is always enabled unless it was explicitly disabled
         * in the widget tag
         */
        if (!widgetTag.Disabled || widgetTag.Disabled[0].toLowerCase() != 'true') {
            this.enable();                   
        }
    },
    
    execute : function() {
        var url = this.baseUrl;
        
        var map = this.getMap();
        var params = [];
        params.push('LOCALE='+Fusion.locale);
        params.push('SESSION='+map.getSessionID());
        params.push('MAPNAME='+map.getMapName());
        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url.slice(-1) != '&') {
            url += '&';
        }
        url += params.join('&');
        
        /* check to see if this is going into a task pane */
        var taskPaneTarget = Fusion.getWidgetById(this.target);
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            /* check to see if it is going into a frame in the page */
            var pageElement = $(this.target);
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                /* open in a window */
                window.open(url, this.target, this.sWinFeatures);
            }
        }
    }
});
/**
 * Fusion.Widget.InitialMapView
 *
 * $Id: InitialMapView.js 1546 2008-09-23 19:34:14Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.InitialMapView
 *
 * Restore the map to it's full extents determined when it was initially loaded.
 * 
 * **********************************************************************/


Fusion.Widget.InitialMapView = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,  {
    viewType: 'initial',
    
    initialize : function(widgetTag) {
        //console.log('InitialMapView.initialize');
        var json = widgetTag.extension;
        if (json.ViewType && (json.ViewType[0] == 'full')) {
          this.viewType = 'full';
        }

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
    },

    execute: function() {
        //console.log('InitialMapView.activateTool');
        if (this.viewType == 'full') {
          this.getMap().fullExtents();
        } else {
          var mapWidget = this.getMap();
          mapWidget.setExtents(mapWidget.initialExtents);
        }
    }
});
/**
 * Fusion.Widget.InvokeScript
 *
 * $Id: InvokeScript.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.InvokeScript
 *
 * Executes an arbitrary piece of JavaScript code
 * **********************************************************************/

Fusion.Widget.InvokeScript = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,  {
    sScript: null,
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        this.sScript = json.Script ? json.Script[0] : '';
    },

    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    execute : function() {
        eval(this.sScript);
    }
});/**
 * Fusion.Widget.InvokeURL
 *
 * $Id: InvokeURL.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /***************************************************************************
 * Class: Fusion.Widget.InvokeURL
 *
 * A widget that will open the configured URL in the target element.
 * 
 * If the Target property points to TaskPane widget, the task will be listed in
 * the menu list of the TaskPane and loaded there.
 * Otherwise if the target is an existing HTML elementt in the page it will be 
 * loaded there, otherwise it will open a new window with that name.
 *
 * **********************************************************************/

Fusion.Widget.InvokeURL = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,  {
    sFeatures : 'menubar=no,location=no,resizable=no,status=no',

    initialize : function(widgetTag) {
        //console.log('InvokeURL.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        this.sTarget = json.Target ? json.Target[0] : "InvokeUrlWindow";
        this.sBaseUrl = json.Url[0];  //must be supplied
        
        this.bSelectionOnly = (json.DisableIfSelectionEmpty &&
                           (json.DisableIfSelectionEmpty[0] == 'true' ||
                            json.DisableIfSelectionEmpty[0] == '1')) ? true : false;
                            
        this.additionalParameters = [];
        if (json.AdditionalParameter) {
            for (var i=0; i<json.AdditionalParameter.length; i++) {
                var p = json.AdditionalParameter[i];
                var k = p.Key[0];
                var v = p.Value[0];
                this.additionalParameters.push(k+'='+encodeURIComponent(v));
            }
        }
        
        this.enable = Fusion.Widget.InvokeURL.prototype.enable;
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.enable, this));
        this.disable();
    },

    enable: function() {
        var map = this.getMap();
        if (this.bSelectionOnly || !map) {
            if (map && map.hasSelection()) {
                if (this.action) {
                    this.action.setEnabled(true);
                } else {
                    Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
                }
            } else {
                if (this.action) {
                    this.action.setEnabled(false);
                } else {
                    this.disable();
                }
            }
        } else {
            if (this.action) {
                this.action.setEnabled(true);
            } else {
                Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
            }
        }
    },
    
    execute : function() {
        var url = this.sBaseUrl;
        //add in other parameters to the url here
        
        var map = this.getMap();
        var params = [];
        params.push('LOCALE='+Fusion.locale);
        params.push('SESSION='+map.getSessionID());
        params.push('MAPNAME='+map.getMapName());
        params = params.concat(this.additionalParameters);
        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url.slice(-1) != '&') {
            url += '&';
        }
        url += params.join('&');
        var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            var pageElement = $(this.sTarget);
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                window.open(url, this.sTarget, this.sWinFeatures);
            }
        }
    }
});
/**
 * Fusion.Widget.LayerManager
 *
 * $Id: LayerManager.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /***************************************************************************
 * Class: Fusion.Widget.LayerManager
 * 
 * Displays a LayerManager of all the layers in the map as a collapsable tree.
 *
 * ShowRootFolder (boolean, optional)
 *
 * This controls whether the tree will have a single root node that
 * contains the name of the map as its label.  By default, the root
 * node does not appear.  Set to "true" or "1" to make the root node
 * appear.
 *
 * RootFolderIcon: (string, optional)
 *
 * The url to an image to use for the root folder.  This only has an
 * affect if ShowRootFolder is set to show the root folder.
 *
 * LayerThemeIcon: (string, optional)
 *
 * The url to an image to use for layers that are currently themed.
 *
 * DisabledLayerIcon: (string, optional)
 *
 * The url to an image to use for layers that are out of scale.
 *
 * **********************************************************************/

Fusion.Widget.LayerManager = OpenLayers.Class(Fusion.Widget,  {
    currentNode: null,
    bIsDrawn: false,
    initialize : function(widgetTag) {
        //console.log('LayerManager.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
         
        var json = widgetTag.extension;
        this.delIconSrc = json.DeleteIcon ? json.DeleteIcon[0] : 'images/icons/select-delete.png';
    
        Fusion.addWidgetStyleSheet(widgetTag.location + 'LayerManager/LayerManager.css');
        this.cursorNormal = ["url('images/grab.cur'),move", 'grab', '-moz-grab', 'move'];
        this.cursorDrag = ["url('images/grabbing.cur'),move", 'grabbing', '-moz-grabbing', 'move'];
        
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.mapLoaded, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_RELOADED, OpenLayers.Function.bind(this.mapLoaded, this));
    },
    
   
    mapLoaded: function() {
        this.draw();
    },
    
   
   /**
     * remove the dom objects representing the legend layers and groups
     */
    clear: function(node) {
        while (node.childNodes.length > 0) {
          this.clear(node.childNodes[0]);
            node.remove(node.childNodes[0]);
        }
    },
  
    /**
     * Draws the layer manager
     *
     * @param r Object the reponse xhr object
     */
    draw: function(r) {
      if (this.mapList) {
        //this.clear(this.mapList);
        this.mapList.remove();
        this.mapList = null;
      }
       
      //create the master UL element to hold the list of layers
      this.mapList = document.createElement('ul');
      Element.addClassName(this.mapList, 'jxLman');
      this.domObj.appendChild(this.mapList);
        
      //this processes the OL layers
      var map = this.getMap();
      for (var i=0; i<map.aMaps.length; ++i) {
        var mapBlock = document.createElement('li');
        Element.addClassName(this.mapBlock, 'jxLmanMap');
        mapBlock.id = 'mapBlock_'+i;
        
        //add a handle so the map blocks can be re-arranged
        var handle = document.createElement('a');
        handle.innerHTML = map.aMaps[i]._sMapTitle;
        Element.addClassName(handle, 'jxLmanHandle');
        mapBlock.appendChild(handle);
        
        this.mapList.appendChild(mapBlock);
        this.processMapBlock(mapBlock, map.aMaps[i]);
      }
      
      if (map.aMaps.length >1) {
        var options = [];
        options.onUpdate = OpenLayers.Function.bind(this.updateMapBlock, this, map);
        options.handle = 'jxLmanHandle';
        options.scroll = this.domObj.id;
        Sortable.create(this.mapList.id, options);
      }
    },

    processMapBlock: function(blockDom, map) {
      var mapBlockList = document.createElement('ul');
      Element.addClassName(mapBlockList, 'jxLmanSet');
      mapBlockList.id = 'fusionLayerManager_'+map.getMapName();
      blockDom.appendChild(mapBlockList);
      map.layerPrefix = 'layer_';   //TODO make this unique for each block
      
      //this process all layers within an OL layer
      var processArray = map.aLayers;
      if (map.bLayersReversed) {
        processArray.reverse();
      }
      for (var i=0; i<processArray.length; ++i) {
        var blockItem = document.createElement('li');
        Element.addClassName(blockItem, 'jxLmanLayer');
        blockItem.id = map.layerPrefix+i;
        mapBlockList.appendChild(blockItem);
        this.createItemHtml(blockItem, processArray[i]);
        blockItem.layer = processArray[i];
      }
      
      var options = [];
      options.onUpdate = OpenLayers.Function.bind(this.updateLayer, this, map);
      options.scroll = this.domObj.id;    //docs for this at: http://wiki.script.aculo.us/scriptaculous/show/Sortable.create
      Position.includeScrollOffsets = true;
      Sortable.create(mapBlockList.id, options);
    },
   
  createItemHtml: function(parent, layer) {
    var delIcon = document.createElement('img');
    delIcon.src = this.delIconSrc;
    Event.observe(delIcon, 'click', OpenLayers.Function.bind(this.deleteLayer, this, layer));
    delIcon.style.visibility = 'hidden';
    parent.appendChild(delIcon);
    
    var visSelect = document.createElement('input');
    visSelect.type = 'checkbox';
    Event.observe(visSelect, 'click', OpenLayers.Function.bind(this.visChanged, this, layer));
    parent.appendChild(visSelect);
    if (layer.visible) {
      visSelect.checked = true;
    } else {
      visSelect.checked = false;
    }
    
    var label = document.createElement('a');
    label.innerHTML = layer.legendLabel;
    Event.observe(label, 'mouseover', OpenLayers.Function.bind(this.setGrabCursor, this));
    Event.observe(label, 'mousedown', OpenLayers.Function.bind(this.setDragCursor, this));
    Event.observe(label, 'mouseout', OpenLayers.Function.bind(this.setNormalCursor, this));
    parent.appendChild(label);
    
    Event.observe(parent, 'mouseover', OpenLayers.Function.bind(this.setHandleVis, this, delIcon));
    Event.observe(parent, 'mouseout', OpenLayers.Function.bind(this.setHandleHide, this, delIcon));
  },
  
  setHandleVis: function(delIcon) {
    delIcon.style.visibility = 'visible';
  },
  
  setHandleHide: function(delIcon) {
    delIcon.style.visibility = 'hidden';
  },
  
  setGrabCursor: function(ev) {
    this.setCursor(this.cursorNormal, Event.element(ev) );
  },
  
  setDragCursor: function(ev) {
    this.setCursor(this.cursorDrag, Event.element(ev) );
  },
  
  setNormalCursor: function(ev) {
    this.setCursor('auto', Event.element(ev) );
  },
  
  setCursor : function(cursor, domObj) {
      this.cursor = cursor;
      if (cursor && cursor.length && typeof cursor == 'object') {
          for (var i = 0; i < cursor.length; i++) {
              domObj.style.cursor = cursor[i];
              if (domObj.style.cursor == cursor[i]) {
                  break;
              }
          }
      } else if (typeof cursor == 'string') {
          domObj.style.cursor = cursor;
      } else {
          domObj.style.cursor = 'auto';  
      }
  },
  
  updateLayer: function(map, ul) {
    //reorder the layers in the client as well as the session
    var aLayerIndex = [];
    var aIds = [];
    var nLayers = ul.childNodes.length;
    for (var i=0; i<nLayers; ++i) {
      aIds[i] = ul.childNodes[i].id.split('_');
      var index = parseInt(aIds[i].pop());
      if (map.bLayersReversed) {
        index = nLayers - (index+1);
      }
      aLayerIndex.push(index);
      ul.childNodes[i].id = '';
    }
    
    //reset the ID's on the LI elements to be in order
    for (var i=0; i<ul.childNodes.length; ++i) {
      var node = ul.childNodes[i];
      aIds[i].push(i);
      node.id = aIds[i].join('_');
      node.childNodes[1].checked = node.layer.isVisible()
    }
    if (map.bLayersReversed) {
      aLayerIndex.reverse();
    }
    map.reorderLayers(aLayerIndex);
  },
   
  updateMapBlock: function(map, ul) {
    //reorder the OL layers
  },
  
  deleteLayer: function(layer, ev) {
    var targetLI = Event.element(ev).parentNode;
    var ul = targetLI.parentNode;
    Element.remove(targetLI.id);
    this.updateLayer(layer.oMap, ul);
  },
  
  visChanged: function(layer2, ev) {
    var target = Event.element(ev);
    var layer = target.parentNode.layer;
    if (target.checked) {
      layer.show();
    } else {
      layer.hide();
    }
  }

});
/**
 * Fusion.Widget.Legend
 *
 * $Id: Legend.js 1527 2008-09-12 19:05:45Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Legend
 *
 * A widget to display a legend of all layers.
 *
 * **********************************************************************/

Fusion.Widget.Legend = OpenLayers.Class(Fusion.Widget,  {

    /**
     * Constant: defaultLayerDWFIcon
     * {String} The default image for DWF layer
     */
    defaultLayerDWFIcon: 'images/icons/legend-DWF.png',
    
    /**
     * Constant: defaultLayerRasterIcon
     * {String} The default image for Raster layer
     */
    defaultLayerRasterIcon: 'images/icons/legend-raster.png',
    
    /**
     * Constant: defaultLayerThemeIcon
     * {String} The default image for layers that are currently themed.
     */
    defaultLayerThemeIcon: 'images/icons/legend-theme.png',

    /**
     * Constant: defaultDisabledLayerIcon
     * {String} The default image for layers that are out of scale.
     */
    defaultDisabledLayerIcon: 'images/icons/legend-layer.png',

    /**
     * Constant: defaultRootFolderIcon
     * {String} The default image for the root folder
     */   
    defaultRootFolderIcon: 'images/icons/legend-map.png',
    
    /**
     * Constant: defaultLayerInfoIcon
     * {String} The default image for layer info
     */
    defaultLayerInfoIcon: 'images/icons/tree_layer_info.png',
    
    /**
     * Constant: defaultGroupInfoIcon
     * {String} The default image for groupd info
     */
    defaultGroupInfoIcon: 'images/icons/tree_group_info.png',
    
    initialize : function(widgetTag) {           
        //console.log('Legend.initialize');
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        
        // TODO: maybe it's a good idea to do a function like Fusion.Widget.BindRenderer.. for limit the code
        //       duplication if we plan to apply this pattern to others widgets
        var json = widgetTag.extension;
        if (json.LegendRenderer)
        {
            var renderer = eval(json.LegendRenderer[0]);
            if (renderer && renderer.prototype.CLASS_NAME 
                && renderer.prototype.CLASS_NAME == "Fusion.Widget.Legend.LegendRenderer") {
                this.renderer = new renderer(this, widgetTag);
            } else if (typeof renderer == "function") {
                var renderFunction = renderer;
                this.renderer = new Fusion.Widget.Legend.LegendRenderer(this);
                this.renderer.mapLoaded = renderFunction;
                this.renderer.mapReloaded = renderFunction;
                this.renderer.mapLoading = false;
            } else {
                this.renderer = new Fusion.Widget.Legend.LegendRendererDefault(this, widgetTag);
            }
        } else {
            this.renderer = new Fusion.Widget.Legend.LegendRendererDefault(this, widgetTag);
        }

        if (this.renderer.mapReloaded)
            this.getMap().registerForEvent(Fusion.Event.MAP_RELOADED, 
                                           OpenLayers.Function.bind(this.renderer.mapReloaded, this.renderer));
        if (this.renderer.mapLoading)
            this.getMap().registerForEvent(Fusion.Event.MAP_LOADING, 
                                           OpenLayers.Function.bind(this.renderer.mapLoading,this.renderer));
        if (this.renderer.mapLoaded)
            this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, 
                                           OpenLayers.Function.bind(this.renderer.mapLoaded, this.renderer));
    }
});

/* Class: Fusion.Widget.Legend.LegendRenderer
 * This is a class designed to help users to create their own renderer
 * for customize the legend.
 */
Fusion.Widget.Legend.LegendRenderer = OpenLayers.Class(
{
     /**
     * Property: oLegend
     * {<Fusion.Widget.Legend>} The parent widget that uses
     *                                  the renderer.
     */
    oLegend: null,

    /**
     * Property: layerRoot
     * {Groups} The groups of all layers.
     *
     */
    layerRoot: null,

    initialize: function(legend) {
        this.oLegend = legend;
        this.layerRoot = this.getMap().layerRoot;
    },

    /**
     * Method: renderLegend
     * Abstract method that have the main purpose to draw the legend. This method
     * should be implemented by all concrete class.
     *
     */
    renderLegend: function() {},
    
    /**
     * Method: mapLoading
     * Abstract method that handle the event: Fusion.Event.MAP_LOADING. This method
     * is optional.
     *
     */
    mapLoading: function() {},

    /**
     * Method: mapLoaded
     * Abstract method that handle the event: Fusion.Event.MAP_LOADED. This method
     * occur only at the first load of the map and should be implemented by all concrete class.
     *
     */
    mapLoaded: function() {},

     /**
     * Method: mapReloaded
     * Abstract method that handle the event: Fusion.Event.MAP_RELOADED. This method
     * should be implemented by all concrete class.
     *
     */
    mapReloaded: function() {},

    /**
     * Method: getMap
     * Helper method to obtains the map.
     *
     * Returns:
     * {<Fusion.Maps>} The map that uses the SelectionPanel Widget.
     */
    getMap: function() {
        return this.oLegend.getMap();
    },

    CLASS_NAME: "Fusion.Widget.Legend.LegendRenderer"
});


/* Class: Fusion.Widget.Legend.LegendRendererDefault
 * This class provide a default legend as a collapsable tree.
 * 
 */

Fusion.Widget.Legend.LegendRendererDefault = OpenLayers.Class(Fusion.Widget.Legend.LegendRenderer,  
{
    /**
     * Property: showRootFolder
     * {Boolean} This controls whether the tree will have a single root node that
     * contains the name of the map as its label.  By default, the root node does 
     * not appear.  Set to "true" or "1" to make the root node appear.
     */
    showRootFolder: false,

    /**
     * Property: currentNode
     * {Jx.TreeNode} The current selected node.
     */
    currentNode: null,
    
    /**
     * Property: bIsDrawn
     * {Boolean} Determine if the map is drawn.
     */
    bIsDrawn: false,

    /**
     * Property: targetFolder
     * {Jx.TreeFolder} The current TreeFolder that the mouse will interact with.
     */
    targetFolder: null,

    /**
     * Property: bIncludeVisToggle
     * {Boolean} Determine if non-visible layer must be draw in the legend.
     */
    bIncludeVisToggle: true,
   
    initialize : function(legend, widgetTag) {   
        Fusion.Widget.Legend.LegendRenderer.prototype.initialize.apply(this, [legend]);

        var json = widgetTag.extension;
        this.imgLayerDWFIcon = json.LayerDWFIcon ? json.LayerDWFIcon[0] : this.oLegend.defaultLayerDWFIcon;
        this.imgLayerRasterIcon = json.LayerRasterIcon ? json.LayerRasterIcon[0] : this.oLegend.defaultLayerRasterIcon;
        this.imgLayerThemeIcon = json.LayerThemeIcon ? json.LayerThemeIcon[0] : this.oLegend.defaultLayerThemeIcon;
        this.imgDisabledLayerIcon = json.DisabledLayerIcon ? json.DisabledLayerIcon[0] : this.oLegend.defaultDisabledLayerIcon;       
        this.imgLayerInfoIcon = json.LayerInfoIcon ? json.LayerInfoIcon[0] : this.oLegend.defaultLayerInfoIcon;
        this.imgGroupInfoIcon = json.GroupInfoIcon ? json.GroupInfoIcon[0] : this.oLegend.defaultGroupInfoIcon;
       
        //not used?
        //this.layerInfoURL = json.LayerInfoURL ? json.LayerInfoURL[0] : '';
        this.selectedLayer = null;
       
        this.oTree = new Jx.Tree(this.oLegend.domObj);
       
        this.hideInvisibleLayers = (json.HideInvisibleLayers && json.HideInvisibleLayers[0]) == 'true' ? true : false;
        
        this.refreshAction = new Jx.Action(OpenLayers.Function.bind(this.update, this));
        this.refreshItem = new Jx.MenuItem(this.refreshAction, {label: OpenLayers.i18n('refresh')});
        this.expandAllAction = new Jx.Action(OpenLayers.Function.bind(this.expandAll, this));
        this.expandAllItem = new Jx.MenuItem(this.expandAllAction, {label: OpenLayers.i18n('expandAll')});
        this.expandBranchAction = new Jx.Action(OpenLayers.Function.bind(this.expandBranch, this));
        this.expandBranchItem = new Jx.MenuItem(this.expandBranchAction, {label: OpenLayers.i18n('expand')});
        this.collapseAllAction = new Jx.Action(OpenLayers.Function.bind(this.collapseAll, this));
        this.collapseAllItem = new Jx.MenuItem(this.collapseAllAction, {label: OpenLayers.i18n('collapseAll')});
        this.collapseBranchAction = new Jx.Action(OpenLayers.Function.bind(this.collapseBranch, this));
        this.collapseBranchItem = new Jx.MenuItem(this.collapseBranchAction, {label: OpenLayers.i18n('collapse')});
        //this.collapseBranchItem.disable();
        
        this.contextMenu = new Jx.ContextMenu(this.sName);
        this.contextMenu.add(this.collapseBranchItem, 
                              this.expandBranchItem, 
                              this.refreshItem, 
                              this.expandAllItem, 
                              this.collapseAllItem );
        this.showRootFolder = (json.ShowRootFolder && json.ShowRootFolder[0] == 'false') ? false:true;
        this.showMapFolder = (json.ShowMapFolder && json.ShowMapFolder[0] == 'false') ? false:true;
        if (this.showRootFolder) {
            var opt = {};
            opt.label = OpenLayers.i18n('defaultMapTitle');
            opt.data = null;
            opt.imgTreeFolder = json.RootFolderIcon ? json.RootFolderIcon[0] : this.defRootFolderIcon;
            opt.imgTreeFolderOpen = opt.imgTreeFolder;
            opt.isOpen = true;
            opt.contextMenu = this.contextMenu;
            this.oRoot = new Jx.TreeFolder(opt);
            this.oTree.append(this.oRoot);
            Event.observe(this.oRoot.domObj, 'mouseover', OpenLayers.Function.bind(this.setFolder, this));
        } else {
            this.oRoot = this.oTree;
        }
        this.extentsChangedWatcher = this.update.bind(this);
    },
    
    expandAll: function() {
        this.recurseTree('expand', this.oRoot);
    },
    
    collapseAll: function() {
        this.recurseTree('collapse', this.oRoot);
    },
    
    collapseBranch: function() {
        if (this.targetFolder && this.targetFolder instanceof Jx.TreeFolder) {
          this.targetFolder.collapse();
        }
    },
    
    expandBranch: function() {
        if (this.targetFolder && this.targetFolder instanceof Jx.TreeFolder) {
          this.targetFolder.expand();
        }
    },
    
  /**
     * recursively descend the tree applying the request operation which is either 'collapse' or 'expand'
     *
     * @param op the operation to execute
     * @param the folder to operate on
     */
    recurseTree: function(op, folder) {
        for (var i=0; i<folder.nodes.length; i++) {
            var item = folder.nodes[i];
            if (item instanceof Jx.TreeFolder) {
                this.recurseTree(op, item);
                item[op]();
            }
        }
    },
   
  /**
     * mouseover action handler for tree folders.  Sets the folder to be collapsed/expanded for 
     * collapsing individual branches.  Adding a mouseout action handler to clear the target folder
     * doesn't work because the action of right clicking the context menu issues a mouseout.
     *
     * @param evt the browser event object that occured
     */
    setFolder: function(evt) {
      var element = Event.element(evt);
      this.targetFolder = element.jxTreeItem;
    },
    
    mapLoading: function() {
        this.getMap().deregisterForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, this.extentsChangedWatcher);
        this.clear();
    },
   
    mapLoaded: function() {
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, this.extentsChangedWatcher);
        this.layerRoot = this.getMap().layerRoot;
        this.renderLegend();
    },
    
    mapReloaded: function() {
        this.renderLegend();
    },
    /**
     * the map state has become invalid in some way (layer added, removed,
     * ect).  For now, we just re-request the map state from the server
     * which calls draw which recreates the entire legend from scratch
     *
     * TODO: more fine grained updating of the legend would be nice
     */
    invalidate: function() {
        this.draw();
    },
   
    /**
     * Callback for legend XML response. Creates a list of layers and sets up event
     * handling. Create groups if applicable.
     * TODO: error handling
     *
     * @param r Object the reponse xhr object
     */
    renderLegend: function(r) {
        this.bIsDrawn = false;
        this.clear();

        if (this.showRootFolder) {
            this.oRoot.setName(this.getMap().getMapTitle());
        }
        var startGroup = this.layerRoot;
        if (!this.showMapFolder) {
          startGroup = this.layerRoot.groups[0];
        }
        if (!startGroup.legend) {
            startGroup.legend = {};
            startGroup.legend.treeItem = this.oRoot;
        }
        for (var i=0; i<startGroup.groups.length; i++) {
            startGroup.groups[i].visible = true;
            this.processMapGroup(startGroup.groups[i], this.oRoot);
        }
        for (var i=0; i<startGroup.layers.length; i++) {
            this.processMapLayer(startGroup.layers[i], this.oRoot);
        }
        this.bIsDrawn = true;
        this.update();
    },
   
    processMapGroup: function(group, folder) {
        if (group.displayInLegend) {
            /* make a 'namespace' on the group object to store legend-related info */
            group.legend = {};
            var opt = {};
            opt.label = group.legendLabel;
            opt.data = group;
            opt.contextMenu = this.contextMenu;
            opt.isOpen = group.expandInLegend;
            group.legend.treeItem = new Jx.TreeFolder(opt);
            folder.append(group.legend.treeItem);
            group.legend.checkBox = document.createElement('input');
            group.legend.checkBox.type = 'checkbox';
            group.legend.treeItem.domObj.insertBefore(group.legend.checkBox, group.legend.treeItem.domObj.childNodes[1]);
            group.legend.checkBox.checked = group.visible?true:false;
            Event.observe(group.legend.checkBox, 'click', OpenLayers.Function.bind(this.stateChanged, this, group));
            Event.observe(group.legend.treeItem.domObj, 'mouseover', OpenLayers.Function.bind(this.setFolder, this));
            var groupInfo = group.oMap.getGroupInfoUrl(group.groupName);
            if (groupInfo) {
                var a = document.createElement('a');
                a.href = groupInfo;
                if (groupInfo.indexOf('javascript:') < 0) {
                  a.target = '_blank';
                }
                var img = document.createElement('img');
                Jx.addToImgQueue({domElement:img, src: this.imgGroupInfoIcon});
                img.border = 0;
                a.appendChild(img);
                group.legend.treeItem.domObj.insertBefore(a, group.legend.treeItem.domObj.childNodes[4]);
            }
            if (this.oSelectionListener) {
                group.legend.treeItem.addSelectionListener(this);
            }
            for (var i=0; i<group.groups.length; i++) {
                this.processMapGroup(group.groups[i], group.legend.treeItem);
            }
            for (var i=0; i<group.layers.length; i++) {
                this.processMapLayer(group.layers[i], group.legend.treeItem);
            }
        }
    },
   
    processMapLayer: function(layer, folder) {
        /* make a 'namespace' on the layer object to store legend-related info */
        layer.legend = {};
        layer.legend.parentItem = folder;
        layer.legend.checkBox = document.createElement('input');
        layer.legend.checkBox.type = 'checkbox';
        Event.observe(layer.legend.checkBox, 'click', OpenLayers.Function.bind(this.stateChanged, this, layer));
        layer.legend.currentRange = null;
        layer.registerForEvent(Fusion.Event.LAYER_PROPERTY_CHANGED, OpenLayers.Function.bind(this.layerPropertyChanged, this));
    },
   
    layerPropertyChanged: function(eventID, layer) {
        layer.legend.checkBox.checked = layer.isVisible();
    },

    update: function() {
        if (this.bIsDrawn) {
            window.setTimeout(OpenLayers.Function.bind(this._update, this), 1);
        }
    },
   
    /**
     * update the tree when the map scale changes
     */
    _update: function() {
        var map = this.getMap();
        var currentScale = map.getScale();
        for (var i=0; i<map.layerRoot.groups.length; i++) {
            this.updateGroupLayers(map.layerRoot.groups[i], currentScale);
        }
        for (var i=0; i<map.layerRoot.layers.length; i++) {
            this.updateLayer(map.layerRoot.layers[i], currentScale);
        }
    },
   
    /**
     * remove the dom objects representing the legend layers and groups
     */
    clear: function() {
        while (this.oRoot.nodes.length > 0) {
            this.oRoot.remove(this.oRoot.nodes[0]);
        }
    },
    selectionChanged: function(o) {
        if (this.currentNode) {
            Element.removeClassName(this.currentNode.domObj.childNodes[3], 'jxTreeSelectedNode');
        }
        this.currentNode = o;
        Element.addClassName(this.currentNode.domObj.childNodes[3], 'jxTreeSelectedNode');
       
        if (o.data instanceof Fusion.Widget.Map.Group) {
            this.getMap().setActiveLayer(null);
        } else {
            this.getMap().setActiveLayer(o.data);
        }
    },
    updateGroupLayers: function(group, fScale) {
        for (var i=0; i<group.groups.length; i++) {
            this.updateGroupLayers(group.groups[i], fScale);
        }
        for (var i=0; i<group.layers.length; i++) {
            this.updateLayer(group.layers[i], fScale);
        }   
    },
    updateLayer: function(layer, fScale) {
        if (!layer.displayInLegend) {
            return;
        }
        var range = layer.getScaleRange(fScale);
        if (range == layer.legend.currentRange && layer.legend.treeItem) {
            return;
        }
       
        layer.legend.currentRange = range;
        if (range != null) {
            if (range.styles.length > 0) {
              layer.legend.checkBox.disabled = false;
            } else {
              layer.legend.checkBox.disabled = true;
            }
            if (range.styles.length > 1) {
                //tree item needs to be a folder
                if (!layer.legend.treeItem) {
                    layer.legend.treeItem = this.createFolderItem(layer);
                    layer.parentGroup.legend.treeItem.append(layer.legend.treeItem);
                } else if (layer.legend.treeItem instanceof Jx.TreeItem) {
                    this.clearTreeItem(layer);
                    layer.legend.treeItem = this.createFolderItem(layer);
                    layer.parentGroup.legend.treeItem.append(layer.legend.treeItem);
                } else {
                    while(layer.legend.treeItem.nodes.length > 0) {
                        layer.legend.treeItem.remove(layer.legend.treeItem.nodes[0]);
                    }
                }
                for (var i=0; i<range.styles.length; i++) {
                    var item = this.createTreeItem(layer,
                                               range.styles[i], fScale, false);
                    layer.legend.treeItem.append(item);
                }
            } else {
               
                var style = range.styles[0];
                if (!layer.legend.treeItem) {
                    layer.legend.treeItem = this.createTreeItem(layer, style, fScale, this.bIncludeVisToggle);
                    layer.parentGroup.legend.treeItem.append(layer.legend.treeItem);                   
                } else if (layer.legend.treeItem instanceof Jx.TreeFolder) {
                    this.clearTreeItem(layer);
                    layer.legend.treeItem = this.createTreeItem(layer, style, fScale, this.bIncludeVisToggle);
                    layer.parentGroup.legend.treeItem.append(layer.legend.treeItem);
                } else {
                    if (range.styles.length > 0) {
                        Jx.addToImgQueue({
                            domElement:layer.legend.treeItem.domObj.childNodes[2], 
                            src: range.styles[0].getLegendImageURL(fScale, layer, this.getMap())
                        });
                        Element.removeClassName(layer.legend.treeItem.domObj, 'jxDisabled');
                    } else {
                        Element.addClassName(layer.legend.treeItem.domObj, 'jxDisabled');
                    }
                }               
            }
           
        } else {
            if (this.hideInvisibleLayers) {
                if (layer.legend.treeItem) {
                    layer.parentGroup.legend.treeItem.remove(layer.legend.treeItem);
                    layer.legend.treeItem = null;
                }
            } else {
                layer.legend.checkBox.disabled = true;
                //this.clearTreeItem(layer);
                var newTreeItem = this.createTreeItem(layer, null, null, this.bIncludeVisToggle);
                if (layer.legend.treeItem) {
                    layer.parentGroup.legend.treeItem.replace(newTreeItem, layer.legend.treeItem);
                    layer.legend.treeItem.finalize();
                } else {
                    layer.parentGroup.legend.treeItem.append(newTreeItem);
                }
                layer.legend.treeItem = newTreeItem;
            }
        }
        layer.legend.checkBox.checked = layer.visible?true:false;
    },
    
    createFolderItem: function(layer) {
        var opt = {};
        opt.label = layer.legendLabel == '' ? '&nbsp;' : layer.legendLabel;
        opt.data = layer;
        opt.isOpen = layer.expandInLegend;
        opt.contextMenu = this.contextMenu;
        opt.imgTreeFolderOpen = this.imgLayerThemeIcon;
        opt.imgTreeFolder = this.imgLayerThemeIcon;
        var folder = new Jx.TreeFolder(opt);
        folder.domObj.insertBefore(layer.legend.checkBox, folder.domObj.childNodes[1]);
        var layerInfo = layer.oMap.getLayerInfoUrl(layer.layerName);
        if (layerInfo) {
            var a = document.createElement('a');
            a.href = layerInfo;
            if (layerInfo.indexOf('javascript:') < 0) {
              a.target = '_blank';
            }
            var img = document.createElement('img');
            Jx.addToImgQueue({domElement:img, src:this.imgLayerInfoIcon});
            img.border = 0;
            a.appendChild(img);
            folder.domObj.insertBefore(a, folder.domObj.childNodes[4]);
        }
        folder.addSelectionListener(this);
        Event.observe(folder.domObj, 'mouseover', OpenLayers.Function.bind(this.setFolder, this));
       
        return folder;
    },
    createTreeItem: function(layer, style, scale, bCheckBox) {
        var opt = {};
        if (bCheckBox) {
            opt.label = layer.legendLabel == '' ? '&nbsp;' : layer.legendLabel;
        } else {
            opt.label = style.legendLabel == '' ? '&nbsp;' : style.legendLabel;
        }
        opt.data = layer;
        opt.contextMenu = this.contextMenu;
        if (!style) {
            opt.imgIcon = this.imgDisabledLayerIcon;
            opt.enabled = false;
        } else {
          if (style.staticIcon) {
            if (style.staticIcon == Fusion.Constant.LAYER_DWF_TYPE) {
              opt.imgIcon = this.imgLayerDWFIcon;
            } else {
              opt.imgIcon = this.imgLayerRasterIcon;
            }
          } else {
            opt.imgIcon = style.getLegendImageURL(scale, layer);
          }
        }
       
        var item = new Jx.TreeItem(opt);
        if (bCheckBox) {
            item.domObj.insertBefore(layer.legend.checkBox, item.domObj.childNodes[1]);
            /* only need to add layer info if it has a check box too */
            var layerInfo = layer.oMap.getLayerInfoUrl(layer.layerName);
            if (layerInfo) {
                var a = document.createElement('a');
                a.href = layerInfo;
                if (layerInfo.indexOf('javascript:') < 0) {
                  a.target = '_blank';
                }
                var img = document.createElement('img');
                Jx.addToImgQueue({domElement:img, src: this.imgLayerInfoIcon});
                img.border = 0;
                a.appendChild(img);
                item.domObj.insertBefore(a, item.domObj.childNodes[4]);
            }
        }

        item.addSelectionListener(this);
       
        return item;
    },
    clearTreeItem: function(layer) {
        if (layer.legend.treeItem && layer.legend.treeItem.parent) {
            layer.legend.treeItem.parent.remove(layer.legend.treeItem);
            layer.legend.treeItem.finalize();
            layer.legend.treeItem = null;
        }
    },
    stateChanged: function(obj) {
        if (obj.legend && obj.legend.checkBox) {
            if (obj.legend.checkBox.checked) {
                obj.show();
            } else {
                obj.hide();
            }
        }
    }

});
/**
 * Fusion.Widget.LinkToView
 *
 * $Id: LinkToView.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.LinkToView
 *
 * A widget that displays a link to the currently displayedd map view.
 * **********************************************************************/


Fusion.Widget.LinkToView = OpenLayers.Class(Fusion.Widget,  {
    initialize : function(widgetTag) {
        //console.log('LinkToView.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        
        var json = widgetTag.extension;
        this.baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?';

        //remove any existing extent param
        var queryParams = Fusion.parseQueryString();
        var join = '';
        for (var param in queryParams) {
          if (typeof queryParams[param] == 'function') {
              continue;
          }
          if (param == 'extent') {
              continue;
          }
          this.baseUrl += join + param + '=' + queryParams[param];
          join = '&';
        }

        this.anchorLabel = json.Label ? json.Label[0] : (this.domObj.innerHTML ? this.domObj.innerHTML : 'Link to View');

        this.anchor = document.createElement('a');
        this.anchor.className = 'anchorLinkToView';
        this.anchor.href = this.baseUrl;
        this.anchor.innerHTML = this.anchorLabel;
        this.anchor.title = json.Tooltip ? json.Tooltip[0] : 'Right-click to copy or bookmark link to current view';
        this.domObj.innerHTML = '';
        this.domObj.appendChild(this.anchor);

        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.updateLink, this));
        this.enable();                   
    },
    
    updateLink : function() {
        var sBbox = this.getMap().getCurrentExtents().toBBOX();
        var join = (this.baseUrl.indexOf('?')==this.baseUrl.length-1)?'':'&';
        this.anchor.href = this.baseUrl + join +'extent=' + sBbox;
    }
});
/**
 * Fusion.Widget.MapMenu
 *
 * $Id: MapMenu.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /****************************************************************************
 * Class: Fusion.Widget.MapMenu
 *
 * A widget that displays a selection of maps that can be loaded into the 
 * application.  The list of maps is configured in the ApplicationDefinition.
 * **********************************************************************/

Fusion.Widget.MapMenu = OpenLayers.Class(Fusion.Widget,  Fusion.Tool.MenuBase,
{
    domObj: null,
    oMenu: null,
    mapGroupData: null,
    sRootFolder: '',
    aMenus : null,
    initialize : function(widgetTag)
    {
        //console.log('MapMenu.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.MenuBase.prototype.initialize.apply(this, []);

        this.enable();
        
        var json = widgetTag.extension;
        
        //If no folder is specified for enumeration, build a menu
        //from the mapgroup alone. Folders are only supported with MapGuide.
        //Otherwise, create a hash of mapgroup resourceId to mapGroup data
        //to be used to assign mapgroup extensions to enumerated maps.
        
        var mapGroups = Fusion.applicationDefinition.mapGroups;
        this.mapGroupData = {};
        for (var i=0; i<mapGroups.length; i++) {
            var mapGroup = mapGroups[i];
            if (json.Folder) {
                this.mapGroupData[mapGroup.maps[0].resourceId] = mapGroup; 
            } else {
                var opt = {};
                opt.label = mapGroup.mapId;
                var data = mapGroup;
                var action = new Jx.Action(this.switchMap.bind(this, data));
                var menuItem = new Jx.MenuItem(action,opt);
                this.oMenu.add(menuItem);
            }
        }
        
        //get the mapdefinitions as xml if there  is a folder specified
        //in the widget tag. All subfolders will be enumerated.
        //FIXME: this should be platform agnostic, Library:// isn't!
        //FIXME: use JSON rather than XML        
        this.arch = this.getMap().getAllMaps()[0].arch;
        if (this.arch == 'MapGuide' && json.Folder) {
            this.sRootFolder = json.Folder ? json.Folder[0] : 'Library://';
            var s =       this.arch + '/' + Fusion.getScriptLanguage() +
                          '/MapMenu.' + Fusion.getScriptLanguage();
            var params =  {parameters: {'folder': this.sRootFolder},
                          onComplete: OpenLayers.Function.bind(this.processMapMenu, this)};
            Fusion.ajaxRequest(s, params);
        };

    },

    processMapMenu: function(r) {
        if (r.responseXML) {
            this.aMenus = {};
            var node = new DomNode(r.responseXML);
            var mapNode = node.findFirstNode('MapDefinition');
            while (mapNode) {
                
                var sId = mapNode.getNodeText('ResourceId');
                var sPath = sId.replace(this.sRootFolder, '');
                if (sPath.lastIndexOf('/') > -1) {
                    sPath = sPath.slice(0, sPath.lastIndexOf('/'));
                    this.createFolders(sPath);
                } else {
                    sPath = '';
                }
                var opt = {};
                opt.label = mapNode.getNodeText('Name');
                
                // check for mapgroup data and if there is none,
                // create a maptag that will be passed to the map
                // widget constructor 
                var data = null;
                if (this.mapGroupData[mapNode.getNodeText('ResourceId')]) {
                    data = this.mapGroupData[mapNode.getNodeText('ResourceId')];
                } else {
                    data = {maps:[{'resourceId':mapNode.getNodeText('ResourceId'),
                            'singleTile':true,
                            'type': this.arch,
                            'extension':{'ResourceId': [mapNode.getNodeText('ResourceId')]}
                           }]};
                    //set up needed accessor
                    data.getInitialView = function() {
                        return this.initialView;
                    };
                }
                var action = new Jx.Action(this.switchMap.bind(this, data));
                var menuItem = new Jx.MenuItem(action,opt);
                
                if (sPath == '') {
                    this.oMenu.add(menuItem);
                }else {
                    this.aMenus[sPath].add(menuItem);
                }
                
                mapNode = node.findNextNode('MapDefinition');
            }
        }
    },
    
    createFolders: function(sId) {
        var aPath = sId.split('/');
        //loop through folders, creating them if they don't exist
        var sParent = '';
        var sSep = '';
        for (var i=0; i < aPath.length; i++) {
            if (!this.aMenus[sParent + sSep + aPath[i]]){
                var opt = {label:aPath[i]};
                var menu = new Jx.SubMenu(opt);
                if (sParent == '') {
                    this.oMenu.add(menu);
                } else {
                    this.aMenus[sParent].add(menu);
                }
                this.aMenus[sParent + sSep + aPath[i]] = menu;
            }
            sParent = sParent + sSep + aPath[i];
            sSep = '/';
        };
    },
    
    //action to perform when the button is clicked
    activateTool: function() {
        this.oMenu.show();
    },
        
    //change the map, preserving current extents
    switchMap: function(data) {
        var ce = this.getMap().getCurrentExtents();
        data.initialView = {minX:ce.left,
                            minY:ce.bottom,
                            maxX:ce.right,
                            maxY:ce.top
                            };        
        this.getMap().loadMapGroup(data);
    }
});
/**
 * Fusion.Widget.Maptip
 *
 * $Id: Maptip.js 1617 2008-10-27 19:26:24Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Maptip
 *
 * Displays tooltips over the map when the mouse is hovered for some 
 * time.  You must configure tooltips for each layer using Studio
 * or Web Studio by editing the LayerDefinition Settings and
 * specifying an expression for the tooltip.
 *
 *
 * Delay (optional)
 *
 * This is the delay, in milliseconds, that the user must keep the mouse
 * in the same position in order for the maptip to appear.  The default,
 * if not specified, is 350 milliseconds.
 *
 * Layer (optional, multiple)
 *
 * This is the name of a layer from the MapDefinition to get the tooltip
 * from.  If no Layer elements are specified, then all layers will be
 * queried and the top-most one will be displayed.  Multiple Layer tags
 * can be added, allowing tooltips to come from different layers.
 *
 * **********************************************************************/


Fusion.Widget.Maptip = OpenLayers.Class(Fusion.Widget,
{
    oCurrentPosition: null,
    oMapTipPosition: null,
    nTimer: null,
    delay: null,
    aLayers: null,
    bOverTip: false,
    sWinFeatures: 'menubar=no,location=no,resizable=no,status=no',
    offset: new OpenLayers.Pixel(2,2),
    
    initialize : function(widgetTag)
    {
      //console.log('Maptip.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        var json = widgetTag.extension;
        
        this.sTarget = json.Target ? json.Target[0] : "MaptipWindow";
        if (json.WinFeatures) {
          this.sWinFeatures = json.WinFeatures[0];
        }
        this.delay = json.Delay ? parseInt(json.Delay[0]) : 350;
        this.nTolerance = json.Tolerance ? parseInt(json.Tolerance[0]) : 2;
        
        this.aLayers = [];
        if (json.Layer) {
            for (var i=0; i<json.Layer.length; i++) {
                this.aLayers.push(json.Layer[i]);
            }
        }
        
        //prepare the container div for the maptips
        Fusion.addWidgetStyleSheet(widgetTag.location + 'Maptip/Maptip.css');
        if (this.domObj) {
          this.domObj.parentNode.removeChild(this.domObj);
        } else {
          this.domObj = document.createElement('div');
        }
        this.domObj.className = 'maptipContainer';
        this.domObj.style.display = 'none';
        this.domObj.style.top = '0px';
        this.domObj.style.left = '0px';
        
        //create an iframe to stick behind the maptip to prevent clicks being passed through to the map
        this.iframe = document.createElement('iframe');
        this.iframe.className = 'maptipShim';
        this.iframe.scrolling = 'no';
        this.iframe.frameborder = 0;
        
        Event.observe(this.domObj, 'mouseover', OpenLayers.Function.bind(this.mouseOverTip, this));
        Event.observe(this.domObj, 'mouseout', OpenLayers.Function.bind(this.mouseOutTip, this));
        
        var oDomElem =  this.getMap().getDomObj();
        document.getElementsByTagName('BODY')[0].appendChild(this.domObj);
        
        this.getMap().observeEvent('mousemove', OpenLayers.Function.bind(this.mouseMove, this));
        this.getMap().observeEvent('mouseout', OpenLayers.Function.bind(this.mouseOut, this));
        
    },
    
    mouseOut: function(e) {
      //console.log('maptip mouseOut:'+this.nTimer+':'+this.nHideTimer);
        if (this.nTimer) {
            window.clearTimeout(this.nTimer);
            if (!this.nHideTimer) {
                /*console.log('mouseOut: set hide timer');*/
                this.nHideTimer = window.setTimeout(OpenLayers.Function.bind(this.hideMaptip, this), 250);
            }
        }
    },
    
    mouseMove: function(e) {
      //console.log('map tip mouseMove');
        if (this.bOverTip) {
            return;
        }
        var p = this.getMap().getEventPosition(e);
        this.oCurrentPosition = p;
        this.oMapTipPosition = {x:Event.pointerX(e), y:Event.pointerY(e)};
        if (this.oCurrentPosition) {
            window.clearTimeout(this.nTimer);
            this.nTimer = null;
        }
        this.nTimer = window.setTimeout(OpenLayers.Function.bind(this.showMaptip, this), this.delay);
        //Event.stop(e);
    },
    
    showMaptip: function(r) {
      //console.log('showMaptip');
        var map = this.getMap();
        if (map == null) {
          return;
        }

        var oBroker = Fusion.oBroker;
        var x = this.oCurrentPosition.x;
        var y = this.oCurrentPosition.y;
        var min = map.pixToGeo(x-this.nTolerance, y-this.nTolerance);
        var max = map.pixToGeo(x+this.nTolerance, y+this.nTolerance);
        //this can fail if no map is loaded
        if (!min) {
            return;
        }
        var sGeometry = 'POLYGON(('+ min.x + ' ' +  min.y + ', ' +  min.x + ' ' +  max.y + ', ' + max.x + ' ' +  max.y + ', ' + max.x + ' ' +  min.y + ', ' + min.x + ' ' +  min.y + '))';

        //var sGeometry = 'POINT('+ min.x + ' ' +  min.y + ')';

        var maxFeatures = 1;
        var persist = 0;
        var selection = 'INTERSECTS';
        // only select visible layers with maptips defined (1+4)
        var layerAttributeFilter = 5;
        var maps = this.getMap().getAllMaps();
        //TODO: possibly make the layer names configurable?
        var layerNames = this.aLayers.toString();
        var r = new Fusion.Lib.MGRequest.MGQueryMapFeatures(maps[0].getSessionID(),
                                        maps[0]._sMapname,
                                        sGeometry,
                                        maxFeatures, persist, selection, layerNames,
                                        layerAttributeFilter);
        oBroker.dispatchRequest(r, 
            OpenLayers.Function.bind(Fusion.xml2json, this, 
                  OpenLayers.Function.bind(this.requestCB, this)));
    },
    
    requestCB: function(xhr) {
        var o;
        eval("o="+xhr.responseText);
        this._display(o);
        if (this.nHideTimer) {
          window.clearTimeout(this.nHideTimer);
          this.nHideTimer = null;
        }
    },
    
    _display: function(tooltip) {
      //console.log('maptip _display');
            this.domObj.innerHTML = '&nbsp;';
            var contentDiv = document.createElement('div');
            contentDiv.className = 'maptipContent';
            this.domObj.appendChild(contentDiv);
            
            var empty = true;
            this.bIsVisible = true;
            var t = tooltip['FeatureInformation']['Tooltip'];
            if (t) {
              contentDiv.innerHTML = t[0].replace(/\n/g, "<br>");
              empty = false;
            }
            var h = tooltip['FeatureInformation']['Hyperlink'];
            if (h) {
              var a, linkURL;
              var linkDiv = document.createElement('div');
              if (h[0].indexOf('href=') > 0) {   //MGOS allows complete anchor tags as the hyperlink
                linkDiv.innerHTML = h[0];
                a = linkDiv.firstChild;
                linkURL = a.href;
              } else {
                a = document.createElement('a');
                a.innerHTML = h[0];
                linkURL = h[0];
                linkDiv.appendChild(a);
              }
              a.href = 'javascript:void(0)';
              var openLink = OpenLayers.Function.bind(this.openLink, this, linkURL);
              a.onclick = OpenLayers.Function.bindAsEventListener(openLink, this);
              contentDiv.appendChild(linkDiv);
              empty = false;
            }
            if (!empty) {
                var mapSize = this.getMap().getSize();
                var size = Element.getDimensions(this.domObj);
                if (this.oCurrentPosition.x < mapSize.w/2) {
                  this.domObj.style.left = (this.oMapTipPosition.x + this.offset.x) + 'px';
                } else {
                  this.domObj.style.left = (this.oMapTipPosition.x - (size.width+this.offset.x)) + 'px';
                }
                if (this.oCurrentPosition.y < mapSize.h/2) {
                  this.domObj.style.top = (this.oMapTipPosition.y + this.offset.y) + 'px';
                } else {
                  this.domObj.style.top = (this.oMapTipPosition.y - (size.height+this.offset.y)) + 'px';
                }
                this.domObj.style.visibility = 'hidden';
                this.domObj.style.display = 'block';
                
                if (!window.opera) {
                    contentDiv.appendChild(this.iframe);
                    var size = Element.getContentBoxSize(this.domObj);
                    this.iframe.style.width = size.width + "px";
                    this.iframe.style.height = size.height + "px";
                }
                
                this.domObj.style.visibility = 'visible';
            } else {
                this.hideMaptip();
            }
    },
    
    hideMaptip: function() {
      //console.log('hideMaptip');
        this.bIsVisible = false;
        this.hideTimer = window.setTimeout(OpenLayers.Function.bind(this._hide, this),10);
    },
    
    _hide: function() {
      //console.log('maptip _hide');
        this.hideTimer = null;
        this.domObj.style.display = 'none';
        //this.oMapTipPosition = null;
    },
    
    mouseOverTip: function() {
      //console.log('mouseOverTip');
        window.clearTimeout(this.nHideTimer);
        this.nHideTimer = null;
        this.bOverTip = true;
    },
    
    mouseOutTip: function() {
      //console.log('mouseOutTip');
        this.nHideTimer = window.setTimeout(OpenLayers.Function.bind(this.hideMaptip, this), 250);
        this.bOverTip = false;
    },
    
    openLink: function(url, evt) {
        var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            var pageElement = $(this.sTarget);
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                window.open(url, this.sTarget, this.sWinFeatures);
            }
        }
        OpenLayers.Event.stop(evt, true);
        return false;
    }
});
/**
 * Fusion.Widget.Measure
 *
 * $Id: Measure.js 1378 2008-04-16 19:49:10Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /* ********************************************************************
 * Class: Fusion.Widget.Measure
 *
 * The Measure widget allows the user to measure distances or areas on the map 
 * in one or more segments. Area is positive if measured clockwise.
 * 
 * **********************************************************************/

Fusion.Constant.MEASURE_TYPE_DISTANCE = 0;
Fusion.Constant.MEASURE_TYPE_AREA = 1;
Fusion.Constant.MEASURE_TYPE_BOTH = 2;

Fusion.Event.MEASURE_SEGMENT_UPDATE = Fusion.Event.lastEventId++;
Fusion.Event.MEASURE_CLEAR = Fusion.Event.lastEventId++;
Fusion.Event.MEASURE_COMPLETE = Fusion.Event.lastEventId++;

Fusion.Widget.Measure = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, Fusion.Tool.Canvas,
{
    isDigitizing: false,
    //distance of each segment
    distances: null,
    distanceMarkers: null,
    
    //Array of points used to compute area
    aAreaFirstPoint: null,
    //cumulativeDistance
    cumulativeDistance: 0,
    lastDistance: 0,
    //for areas
    //cumulativeArea
    cumulativeArea: 0,
    lastArea: 0,
    
    /* the units to display distances in */
    units: Fusion.UNKNOWN,

    /* Type of measure: values = disance, area or both, default: both*/
    mType: null,

    /* Precision of the distance displayed */
    distPrecision: 4,
    
    /* Precision of the area displayed */
    areaPrecision: 4,
    
    /* Style for the distance line used for distance draw */   
    distanceNormalStyle: null,

    /* Style for the polygon used for area draw */   
    fillStyle: null,

    /* Style for the polygon line used for area draw */    
    areaStyle: null,
    
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        Fusion.Tool.Canvas.prototype.initialize.apply(this, []);
        
        this.asCursor = ['crosshair'];
        var json = widgetTag.extension;
        this.units = (json.Units && (json.Units[0] != '')) ?  Fusion.unitFromName(json.Units[0]): this.units;
        this.distPrecision = json.DistancePrecision ? parseInt(json.DistancePrecision[0]) : 4;
        this.areaPrecision = json.AreaPrecision ? parseInt(json.AreaPrecision[0]) : 4;  
        
        this.sTarget = json.Target ? json.Target[0] : "";
        this.sBaseUrl = Fusion.getFusionURL() + 'widgets/Measure/Measure.php';
        
              
        //init measure type
        this.measureType = Fusion.Constant.MEASURE_TYPE_BOTH;
        if (json.Type) {
            switch(json.Type[0].toLowerCase()) {
                case 'distance':
                    this.measureType = Fusion.Constant.MEASURE_TYPE_DISTANCE;
                    break;
                case 'area':
                    this.measureType = Fusion.Constant.MEASURE_TYPE_AREA;
                    break;
            }
        }
        //we don't support area yet.
        this.measureType = Fusion.Constant.MEASURE_TYPE_DISTANCE;
        
        //Here are the canvas style definition
        var fillStyle = json.FillStyle ? json.FillStyle[0] : 'rgba(0,0,255, 0.3)';
        var lineStyleWidth = json.LineStyleWidth ? json.LineStyleWidth[0] : 2;
        var lineStyleColor = json.LineStyleColor ? json.LineStyleColor[0] : 'rgba(0,0,255,0.3)';     
        this.fillStyle = new Fusion.Tool.Canvas.Style({fillStyle:fillStyle});
        this.lineStyle = new Fusion.Tool.Canvas.Style({lineWidth:lineStyleWidth,strokeStyle:lineStyleColor});  	
        this.distanceMarkers = [];
        this.distances = [];
        
        this.registerEventID(Fusion.Event.MEASURE_SEGMENT_UPDATE);
        this.registerEventID(Fusion.Event.MEASURE_CLEAR);
        this.registerEventID(Fusion.Event.MEASURE_COMPLETE);
        
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.resetCanvas, this));
        this.keyHandler = OpenLayers.Function.bind(this.onKeyPress, this);
        Fusion.addWidgetStyleSheet(widgetTag.location + 'Measure/Measure.css');

        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setUnits, this, this.units));
        this.registerParameter('Units');
    },
    
    onKeyPress: function(e) {
        //console.log('Rule::onKeyPress');
        var charCode = (e.charCode ) ? e.charCode : ((e.keyCode) ? e.keyCode : e.which);
        //console.log(charCode);
        if (charCode == Event.KEY_ESC) {
            this.resetCanvas();
        } 
    },
    
    /**
     * (public) activate()
     *
     * activate the measure tool
     */
    activateTool: function() {
        this.getMap().activateWidget(this);
        this._oButton.activateTool();
    },

    /**
     * (public) initVars()
     *
     * reset area and/or distance vars
     */    
    initVars: function() {
        this.cumulativeDistance = 0;
        this.lastDistance = 0;
        this.cumulativeArea = 0;
        this.lastArea = 0;
        this.aAreaFirstPoint = null;
    },
    
    activate: function() {
        this.activateCanvas();
        this.initVars();
        this.triggerEvent(Fusion.Event.MEASURE_CLEAR, this);
        Event.observe(document,"keypress",this.keyHandler);
        this.loadDisplayPanel();
    },
    
    loadDisplayPanel : function() {
        if (this.sTarget) {
            var url = this.sBaseUrl;
            var queryStr = 'locale='+Fusion.locale;
            if (url.indexOf('?') < 0) {
                url += '?';
            } else if (url.slice(-1) != '&') {
                url += '&';
            }
            url += queryStr;
            
            var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
            var outputWin = window;
            if ( taskPaneTarget ) {
                taskPaneTarget.setContent(url);
                outputWin = taskPaneTarget.iframe.contentWindow;
            } else {
                outputWin = window.open(url, this.sTarget, this.sWinFeatures);
            }
            this.registerForEvent(Fusion.Event.MEASURE_CLEAR, OpenLayers.Function.bind(this.clearDisplay, this, outputWin));  
            this.registerForEvent(Fusion.Event.MEASURE_SEGMENT_UPDATE, OpenLayers.Function.bind(this.updateDisplay, this, outputWin));
            this.registerForEvent(Fusion.Event.MEASURE_COMPLETE, OpenLayers.Function.bind(this.updateDisplay, this, outputWin));
        } else {
            this.totalDistanceMarker = new Fusion.Widget.Measure.DistanceMarker(this.units, this.distPrecision, 'Total:');
            var oDomElem =  this.getMap().getDomObj();
            if (!this.totalDistanceMarker.domObj.parentNode || 
                this.totalDistanceMarker.domObj.parentNode != oDomElem) {
                oDomElem.appendChild(this.totalDistanceMarker.domObj);
            }
            Element.addClassName(this.totalDistanceMarker.domObj, 'divMeasureTotal');
            this.totalDistanceMarker.domObj.style.display = 'none';
            this.registerForEvent(Fusion.Event.MEASURE_CLEAR, OpenLayers.Function.bind(this.clearTotalDistance, this));  
            this.registerForEvent(Fusion.Event.MEASURE_SEGMENT_UPDATE, OpenLayers.Function.bind(this.updateTotalDistance, this));
            this.registerForEvent(Fusion.Event.MEASURE_COMPLETE, OpenLayers.Function.bind(this.updateTotalDistance, this));
        }
    },    
    
    /**
     * (public) deactivate()
     *
     * deactivate the ruler tool
     */
    deactivate: function() {
        //console.log('Ruler.deactivate');
        Event.stopObserving(document, 'keypress', this.keyHandler);           
        this._oButton.deactivateTool();
        this.deactivateCanvas();
        this.resetCanvas();
    },
    
    resetCanvas: function() {
        if (this.isDigitizing) {
            this.isDigitizing = false;
        }
        this.clearContext();
        this.initVars();
        for (var i=0; i<this.distanceMarkers.length; i++)  {
            this.distanceMarkers[i].destroy();
        }
        this.distanceMarkers = [];
        this.triggerEvent(Fusion.Event.MEASURE_CLEAR, this);
    },
      
    /**
     * (public) mouseDown(e)
     *
     * handle the mouse down event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseDown: function(e) {  	
        if (Event.isLeftClick(e)) {
            var map = this.getMap();
            var p = map.getEventPosition(e);
            var gp = map.pixToGeo(p.x, p.y);
            
            if (!this.isDigitizing) {
                this.resetCanvas();
                var from = new Fusion.Tool.Canvas.Node(gp.x,gp.y, map);
                var to = new Fusion.Tool.Canvas.Node(gp.x,gp.y, map);
                var lastSegment = new Fusion.Tool.Canvas.Segment(from,to);
                if (this.measureType == Fusion.Constant.MEASURE_TYPE_DISTANCE) {
                    this.feature = new Fusion.Tool.Canvas.Line(map);
                    this.feature.lineStyle = this.lineStyle;
                } else {
                    this.feature = new Fusion.Tool.Canvas.Polygon(map);
                    this.feature.fillStyle = this.fillStyle;
                    this.feature.lineStyle = this.lineStyle;
                }
                this.feature.addSegment(lastSegment);
                this.aAreaFirstPoint = new Fusion.Tool.Canvas.Node(gp.x,gp.y, map);
                this.isDigitizing = true;                                  
            } else {
                //if digitizing
                var lastSegment = this.feature.lastSegment();
                lastSegment.to.set(gp.x,gp.y);
                if (lastSegment.from.x == lastSegment.to.x && 
                    lastSegment.from.y == lastSegment.to.y) {
                    this.dblClick(e);
                    return;
                }
                this.feature.extendLine();
                this.updateMarker(this.lastMarker, lastSegment, e);
            }
            //create a new marker
            this.lastMarker = new Fusion.Widget.Measure.DistanceMarker(this.units, this.distPrecision);
            this.distanceMarkers.push(this.lastMarker);
            this.clearContext();
            this.feature.draw(this.context);
        }
    },

    /**
     * (public) mouseMove(e)
     *
     * handle the mouse move event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseMove: function(e) {
        if (!this.isDigitizing) {
            return;
        }
        var offset = {x:0,y:0};
        var oElement = this.getMap().getDomObj();
        //var target = e.target || e.srcElement;
        if (this.delayUpdateTimer) {
            window.clearTimeout(this.delayUpdateTimer);
        }
        var map = this.getMap();
        var p = map.getEventPosition(e);
        var gp = map.pixToGeo(p.x, p.y);
        
        var lastSegment = this.feature.lastSegment();
        lastSegment.to.set(gp.x,gp.y);
        this.clearContext();
        this.feature.draw(this.context);
        this.lastMarker.setCalculating();
        this.delayUpdateTimer = window.setTimeout(OpenLayers.Function.bind(this.delayUpdate, this, lastSegment, e), 100);
        
        this.positionMarker(this.lastMarker, lastSegment);
        if (this.totalDistanceMarker) {
          var size = this.totalDistanceMarker.getSize();
          this.totalDistanceMarker.domObj.style.top = (p.y - size.height) + 'px';
          this.totalDistanceMarker.domObj.style.left = p.x + 'px';
        }
    },
    
    delayUpdate: function(lastSegment, e) {
        this.delayUpdateTimer = null;
        this.updateMarker(this.lastMarker, lastSegment, e);
    },
   
    /**
     * (public) dblClick(e)
     *
     * handle the mouse dblclick event
     *
     * @param e Event the event that happened on the mapObj
     */
    dblClick: function(e) {
        //console.log('Digitizer.dblClick');
        if (!this.isDigitizing) {
            return;
        }
        var p = this.getMap().getEventPosition(e);
        var gp = this.getMap().pixToGeo(p.x, p.y);   
        var seg = this.feature.lastSegment();
        seg.to.set(gp.x,gp.y);
        this.clearContext();
        this.feature.draw(this.context);
        
        if (this.measureType == Fusion.Constant.MEASURE_TYPE_AREA || this.measureType == Fusion.Constant.MEASURE_TYPE_BOTH) {
            
        }
        if (this.measureType == Fusion.Constant.MEASURE_TYPE_DISTANCE || this.measureType == Fusion.Constant.MEASURE_TYPE_BOTH) {
        }  

        this.isDigitizing = false;
        
        //mousedown creates a new segment before dblClick so remove the last one
        var lastMarker = this.distanceMarkers.pop();
        lastMarker.destroy();
        this.triggerEvent(Fusion.Event.MEASURE_COMPLETE);                    
    },
    
    positionMarker: function(marker, segment) {
        var oDomElem =  this.getMap().getDomObj();
        if (!marker.domObj.parentNode || 
            marker.domObj.parentNode != oDomElem) {
            oDomElem.appendChild(marker.domObj);
        }
        var size = marker.getSize();
        var t = (segment.from.py + segment.to.py - size.height)/2 ;
        var l = (segment.from.px + segment.to.px - size.width)/2;
        marker.domObj.style.top = t + 'px';
        marker.domObj.style.left = l + 'px';
    },
    
    updateMarker: function(marker, segment, e) {
        if (!marker) {
            return;
        }
        this.measureSegment(segment, marker);
        this.positionMarker(marker, segment);
    },
    
    measureSegment: function(segment, marker) {
        var aMaps = this.getMap().getAllMaps();
        var s = aMaps[0].arch + '/' + Fusion.getScriptLanguage() + "/Measure." + Fusion.getScriptLanguage() ;
        var options = {
            parameters: {
                'session': aMaps[0].getSessionID(),
                'locale': Fusion.locale,
                'mapname': this.getMap().getMapName(),
                'x1': segment.from.x,
                'y1': segment.from.y,
                'x2': segment.to.x,
                'y2': segment.to.y
            },
            'onComplete': OpenLayers.Function.bind(this.measureCompleted, this, segment, marker)
        };
        Fusion.ajaxRequest(s, options);
    },
    
    measureCompleted: function(segment, marker, r) {
        if (r.status == 200) {
            var o;
            eval('o='+r.responseText);
            if (o.distance) {
              /* distance returned is always in meters*/
              //var mapUnits = Fusion.unitFromName(this.getMap().getUnits());
              //if (mapUnits == Fusion.DEGREES || Fusion.DECIMALDEGREES)
              mapUnits = Fusion.METERS;

              if (mapUnits != this.units) {
                o.distance = Fusion.convert(mapUnits, this.units, o.distance);
              }
              
              marker.setDistance(o.distance);
              this.positionMarker(marker, segment);
              this.triggerEvent(Fusion.Event.MEASURE_SEGMENT_UPDATE);                    
            }
        }
    },
    
  /*
      * updates the summary display if it is loaded in a window somewhere
      */
    updateDisplay: function(outputWin) {
        var outputDoc = outputWin.document;
        var tbody = outputDoc.getElementById('segmentTBody');
        var value;
        if (tbody) {
            this.clearDisplay(outputWin);
            var totalDistance = 0;
            var units = Fusion.unitAbbr(this.units);
            for (var i=0; i<this.distanceMarkers.length; i++) {
                var distance = this.distanceMarkers[i].getDistance();
                totalDistance += distance;
            
                var tr = outputDoc.createElement('tr');
                var td = outputDoc.createElement('td');
                td.innerHTML = OpenLayers.i18n('segment',{'seg':i+1});
                tr.appendChild(td);
                td = outputDoc.createElement('td');
                if (this.distPrecision == 0) {
                  value = Math.floor(distance);
                }
                else {
                  value = distance.toPrecision(this.distPrecision);
                }
                td.innerHTML = value + ' ' + units;
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            var tDist = outputDoc.getElementById('totalDistance');
            if (this.distPrecision == 0) {
                  value = Math.floor(totalDistance);
            }
            else {
              value = totalDistance.toPrecision(this.distPrecision);
            }
            tDist.innerHTML = value + ' ' + units;
        }
    },
    
  /*
      * updates the summary display if it is loaded in a window somewhere
      */
    updateTotalDistance: function() {
      if (this.distanceMarkers.length > 1) {
        var totalDistance = 0;
        var units = Fusion.unitAbbr(this.units);
        for (var i=0; i<this.distanceMarkers.length; i++) {
            var distance = this.distanceMarkers[i].getDistance();
            totalDistance += distance;
        }
        this.totalDistanceMarker.domObj.style.display = 'block';
        this.totalDistanceMarker.setDistance(totalDistance);
      }
    },
    
  /*
      *clears the summary display if it is loaded in a window somewhere
      */
    clearDisplay: function(outputWin) {
        var outputDoc = outputWin.document;
        var tbody = outputDoc.getElementById('segmentTBody');
        if (tbody) {
          while(tbody.firstChild) {
              tbody.firstChild.marker = null;
              tbody.removeChild(tbody.firstChild);
          }
          var tDist = outputDoc.getElementById('totalDistance');
          tDist.innerHTML = '';
        }
    },
    
  /*
      *clears the summary display if it is loaded in a window somewhere
      */
    clearTotalDistance: function() {
      this.totalDistanceMarker.domObj.style.display = 'none';
    },
    
  /*
     * Callback method for the MAP_LOADED event
     * Set the units to whatever is specified in the AppDef, or the mapUnits if not specified
     * Subsequent calls from a ViewOptions widget would override the value specified.
     */
    setUnits: function(units) {
      units = (units == Fusion.UNKNOWN)?Fusion.unitFromName(this.getMap().getUnits()):units;
      this.setParameter('Units', Fusion.unitName(units));
    },

    setParameter: function(param, value) {
      //console.log('setParameter: ' + param + ' = ' + value);
        if (param == 'Units') {
            this.units = Fusion.unitFromName(value);
            for (var i=0; i<this.distanceMarkers.length; i++) {
                this.distanceMarkers[i].setUnits(this.units);
            }
            if (this.totalDistanceMarker) {
              this.totalDistanceMarker.setUnits(this.units);
            }
        }
    }
});

/*
* A class for handling the 'tooltip' for the distance measurement.  Markers also hold the distance
values and all markers are held in an array in the Measure widget for access.
*/
//Fusion.Widget.Measure.DistanceMarker = Class.create();
//Fusion.Widget.Measure.DistanceMarker.prototype = {
Fusion.Widget.Measure.DistanceMarker = OpenLayers.Class(
{
    calculatingImg: null,
    distance: 0,
    initialize: function(units, precision, label) {
        this.precision = precision;
        this.label = label ? label:'';
        this.domObj = document.createElement('div');
        this.domObj.className = 'divMeasureMarker';
        this.calculatingImg = document.createElement('img');
        this.calculatingImg.src = Fusion.getFusionURL() + 'widgets/Measure/MeasurePending.gif';
        this.calculatingImg.width = 19;
        this.calculatingImg.height = 4;
        this.setUnits(units);
        this.setCalculating();
    },
    
    destroy: function() {
      if (this.domObj.parentNode) {
          this.domObj.parentNode.removeChild(this.domObj);
      }
    },
    
    setUnits: function(units) {
        this.unit = units;
        this.unitAbbr = Fusion.unitAbbr(units);
    },
    
    getDistance: function() {
        return this.distance;
    },
    
    getDistanceLabel: function() {
      var value;
      if (this.precision == 0) {
        value = Math.floor(this.distance);
      }
      else {
          value = this.distance.toPrecision(this.precision);
      }

      return this.label + ' ' + value + ' ' + this.unitAbbr;  
    },
    
    setDistance: function(distance) {
        if (this.calculatingImg.parentNode) {
            this.calculatingImg.parentNode.removeChild(this.calculatingImg);
        }
        this.distance = distance;
        this.domObj.innerHTML = this.getDistanceLabel();
    },
    
    setCalculating: function() {
        if (!this.calculatingImg.parentNode) {
            this.domObj.innerHTML = '';
            this.domObj.appendChild(this.calculatingImg);
        }
    },
    
    getSize: function() {
        var size =  Element.getDimensions(this.domObj);
        var imgSize = {width:19, height:4};
        if (size.width < imgSize.width) {
            size.width += imgSize.width;
        }
        if (size.height < imgSize.height) {
            size.height += imgSize.height;
        }
        return size;
    }
});
/**
 * Fusion.Widget.Navigator
 *
 * $Id: Navigator.js 1411 2008-05-26 18:50:35Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Navigator
 *
 * A widget that immplements an in-map navigation control with zoom and pan.
 * **********************************************************************/

Fusion.Widget.Navigator = OpenLayers.Class(Fusion.Widget,
{
    bInternalChange: false,
    zoomInFactor: 4,
    zoomOutFactor: 2,
    panAmount: 50,
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        var m = document.createElement('map');
        m.name = 'Navigator_ImageMap';
        m.id = 'Navigator_ImageMap';

        var a = document.createElement('area');
        a.shape = 'poly';
        a.alt = OpenLayers.i18n('panEast');
        a.title = OpenLayers.i18n('panEast');
        a.coords = '27,176, 27,177, 40,190, 44,182, 44,159';
        var panEast = OpenLayers.Function.bind(this.pan, this, this.panAmount/100, 0);
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(panEast, this));
        m.appendChild(a);

        var a = document.createElement('area');
        a.shape = 'poly';
        a.alt = OpenLayers.i18n('panWest');
        a.title = OpenLayers.i18n('panWest');
        a.coords = '24,177, 24,176, 7,159, 7,182, 11,190';
        var panWest = OpenLayers.Function.bind(this.pan, this, -this.panAmount/100, 0);
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(panWest, this) );
        m.appendChild(a);

        var a = document.createElement('area');
        a.shape = 'poly';
        a.alt = OpenLayers.i18n('panSouth');
        a.title = OpenLayers.i18n('panSouth');
        a.coords = '25,178, 12,191, 21,197, 30,197, 39,191, 26,178';
        var panSouth = OpenLayers.Function.bind(this.pan, this, 0, -this.panAmount/100 );
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(panSouth, this) );
        m.appendChild(a);

        var a = document.createElement('area');
        a.shape = 'poly';
        a.alt = OpenLayers.i18n('panNorth');
        a.title = OpenLayers.i18n('panNorth');
        a.coords = '26,175, 43,158, 8,158, 25,175';
        var panNorth = OpenLayers.Function.bind(this.pan, this, 0, this.panAmount/100 );
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(panNorth, this) );
        m.appendChild(a);

        var a = document.createElement('area');
        a.shape = 'circle';
        a.alt = OpenLayers.i18n('zoomOut');
        a.title = OpenLayers.i18n('zoomOut');
        a.coords = '25,142,8';
        var zoomOut = OpenLayers.Function.bind(this.zoom, this, 1/this.zoomOutFactor);
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(zoomOut, this) );
        m.appendChild(a);

        var a = document.createElement('area');
        a.shape = 'circle';
        a.alt = OpenLayers.i18n('zoomIn');
        a.title = OpenLayers.i18n('zoomIn');
        a.coords = '25,34,8';
        var zoomIn = OpenLayers.Function.bind(this.zoom, this, this.zoomInFactor);
        Event.observe(a, 'mouseup', OpenLayers.Function.bindAsEventListener(zoomIn, this) );
        m.appendChild(a);

        this.domObj.appendChild(m);

        var sliderBg = document.createElement('img');
        sliderBg.src = Fusion.getFusionURL() + widgetTag.location + 'Navigator/sliderscale.png';
        sliderBg.className = 'png24';
        sliderBg.width = 51;
        sliderBg.height = 201;
        sliderBg.style.position = 'absolute';
        sliderBg.style.left = '0px';
        sliderBg.style.top = '0px';
        sliderBg.useMap = '#Navigator_ImageMap';
        this.domObj.appendChild(sliderBg);

        var handleDiv = document.createElement('div');
        handleDiv.style.position = 'absolute';
        handleDiv.style.top = '6px';
        handleDiv.style.left = '6px';
        handleDiv.style.width = '39px';
        handleDiv.style.height = '16px';
        this.domObj.appendChild(handleDiv);

        var sliderDiv = document.createElement('div');
        sliderDiv.style.position = 'absolute';
        sliderDiv.style.top = '44px';
        sliderDiv.style.left = '0px';
        sliderDiv.style.width = '51px';
        sliderDiv.style.height = '88px';
        this.domObj.appendChild(sliderDiv);

        var sliderHandle = document.createElement('img');
        sliderHandle.src = Fusion.getFusionURL() + widgetTag.location + 'Navigator/slider.png';
        sliderHandle.className = 'png24';
        sliderHandle.width = 29;
        sliderHandle.height = 12;
        sliderHandle.style.position = 'absolute';
        sliderHandle.style.left = '11px';
        sliderHandle.style.top = '49px';
        sliderDiv.appendChild(sliderHandle);
        
        this.activityIndicator = document.createElement('img');
        this.activityIndicator.src = Fusion.getFusionURL() + widgetTag.location + 'Navigator/spinner.gif';
        this.activityIndicator.width = 18;
        this.activityIndicator.height = 6;
        this.activityIndicator.style.position = 'absolute';
        this.activityIndicator.style.top = '3px';
        this.activityIndicator.style.right = '4px';
        handleDiv.appendChild(this.activityIndicator);

        this.domObj.style.position = 'absolute';
        this.domObj.style.zIndex = 1000;
        this.domObj.style.width = '51px';
        this.domObj.style.height = '204px';
        this.domObj.style.cursor = 'pointer';

        var checkPosition = OpenLayers.Function.bind(this.checkPosition, this);

        //set up the navigator as draggable
        new Draggable(this.domObj, {handle: handleDiv, starteffect: false, endeffect: false});
        //this observer pins the navigator to the top right after a drag so
        //that it moves if the window is resized
        var observer = {
            element: this.domObj,
            onStart: function() { },
            onEnd: checkPosition
        };
        //this should position the nav tool by the right rather than the left,
        //but it is broken in IE
        Draggables.addObserver(observer);

        var options = {};
        options.axis = 'vertical';
        options.range = $R(1, 91);
        options.sliderValue = 91;
        options.onChange = OpenLayers.Function.bind(this.scaleChanged, this);
        this.slider = new Control.Slider(sliderHandle,sliderDiv, options);
        this.slider.setDisabled();
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.updateSlider, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_RESIZED, OpenLayers.Function.bind(this.checkPosition, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.updateValue, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_BUSY_CHANGED, OpenLayers.Function.bind(this.busyChanged, this));
    },

    scaleChanged: function(value) {
        var map = this.getMap();
        var activeWidget = null;
        if (map.oActiveWidget) {
          activeWidget = map.oActiveWidget;
          map.deactivateWidget(map.oActiveWidget);
        }
        if (!this.bInternalChange) {
            var map = this.getMap();
            var center = map.getCurrentCenter();
            var size = map.getSize();
            var w_deg = size.w * value;
            var h_deg = size.h * value;
            map.setExtents(new OpenLayers.Bounds(center.x - w_deg / 2,
                                               center.y - h_deg / 2,
                                               center.x + w_deg / 2,
                                               center.y + h_deg / 2));
        }
        //Event.stop(e);
        if (activeWidget) {
          map.activateWidget(activeWidget);
        }
        return false;
    },

    checkPosition: function() {
        var nav = this.domObj;
        var pDim = Element.getDimensions(nav.parentNode);
        var nLeft, nTop;
        nLeft = parseInt(nav.style.left);
        nTop = parseInt(nav.style.top);
        if (nLeft + nav.getWidth() > pDim.width) {
            nLeft = pDim.width - nav.getWidth();
            nav.style.left = nLeft + 'px';
        }
        if (nTop + nav.getHeight() > pDim.height) {
            nTop = pDim.height - nav.getHeight();
            nav.style.top = nTop + 'px';
        }
        if (nLeft < 0) {
            nav.style.left = '0px';
        }
        if (nTop < 0) {
            nav.style.top = '0px';
        }
    },

    updateSlider: function() {
        var olMap = this.getMap().oMapOL;
        if (olMap.baseLayer.singleTile) {
            this.slider.values = [];
            this.slider.range = $R(olMap.baseLayer.minResolution,olMap.baseLayer.maxResolution);
            this.bInternalChange = true;
            this.slider.setValue(olMap.getResolution());
            this.bInternalChange = false;
        } else {
            var res = olMap.baseLayer.resolutions;
            var n = res.length;
            var max = res[0];
            var min = res[n-1];
            this.slider.values = [];
            this.slider.range = $R(1,91);
            for (var i=0; i<n; i++) {
                var r = res[i];
                this.slider.values.push(parseInt((r/max)*91));
            }
        }
        this.slider.setEnabled();
    },

    updateValue: function() {
        var olMap = this.getMap().oMapOL;
        this.bInternalChange = true;
        this.slider.setValue(olMap.getResolution());
        this.bInternalChange = false;
    },

    pan: function(x,y,e) {
        //console.log('pan by : ' + x + ', ' + y);
        var map = this.getMap();
        var activeWidget = null;
        if (map.oActiveWidget) {
          activeWidget = map.oActiveWidget;
          map.deactivateWidget(map.oActiveWidget);
        }
        var center = map.getCurrentCenter();
        var res = map.oMapOL.getResolution();
        var size = map.oMapOL.getSize();
        map.zoom(center.x + (x * size.w * res), center.y + (y * size.h * res), 1);
        Event.stop(e);
        if (activeWidget) {
          map.activateWidget(activeWidget);
        }
        
        return false;
    },

    zoom: function(factor, e) {
        //console.log('zoom by factor: ' + factor);
        var map = this.getMap();
        var activeWidget = null;
        if (map.oActiveWidget) {
          activeWidget = map.oActiveWidget;
          map.deactivateWidget(map.oActiveWidget);
        }
        var center = map.getCurrentCenter();
        map.zoom(center.x, center.y, factor);
        Event.stop(e);
        if (activeWidget) {
          map.activateWidget(activeWidget);
        }
        return false;
    },
    
    busyChanged: function() {
        this.activityIndicator.style.visibility = this.getMap().isBusy() ? 'visible' : 'hidden';
    }
    

});
/**
 * Fusion.Widget.OverviewMap
 *
 * $Id: OverviewMap.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.OverviewMap
 *
 * A widget that displays an overview map showing the current view of the 
 * primary map.
 * **********************************************************************/

Fusion.Widget.OverviewMap = OpenLayers.Class(Fusion.Widget,
{
    oSize: null,
    nMinRatio : 4,
    nMaxRatio : 32,
    bDisplayed : false,
  
    initialize : function(widgetTag) {
        //console.log('OverviewMap.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        
        var json = widgetTag.extension;
        if (json.MinRatio) {
            this.nMinRatio = json.MinRatio[0];
        }
        if (json.MaxRatio) {
            this.nMaxRatio = json.MaxRatio[0];
        }

        var mapTag = null;
        if (json.MapId) {
          this.sMapGroupId = json.MapId;
          var mapGroup = Fusion.applicationDefinition.getMapGroup(this.sMapGroupId);
          mapTag = mapGroup.maps[0];    //TODO: always use the baselayer Map in the group?
        } else {
          var mainMap = this.getMap();
          mapTag = mainMap.mapGroup.maps[0];    //TODO: always use the baselayer Map in the group?
        }
        this.mapObject = eval("new Fusion.Maps."+mapTag.type+"(this.getMap(),mapTag,false)");
        this.mapObject.registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.loadOverview, this));

        //first set the size to the size of the DOM element if available
        if (this.domObj) {
              this.domObj.style.overflow = 'hidden';
              if (this.domObj.jxLayout) {
                  this.domObj.jxLayout.addSizeChangeListener(this);
              } else {
                  this.domObj.resize = OpenLayers.Function.bind(this.sizeChanged, this);
              }
        }
        
        this.oMapOptions = {};  //TODO: allow setting some mapOptions in AppDef

        //this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.mapWidgetLoaded, this));
    },
    
    mapWidgetLoaded: function() 
    {
        var mapWidget = this.getMap();
        if (this.sMapGroupId && (mapWidget.projection == this.mapObject.projection) ) {
          this.loadOverview([this.mapObject.oLayerOL]);
        } else {
          //just use the base map layer
          var extent = this.oMap._oCurrentExtents;
          this.loadOverview([this.getMap().oMapOL.baseLayer.clone()]);
        }
    },

    keymapLoaded: function() 
    {
        this.mapObject.oLayerOL.isBaseLayer = true;  
    },

    loadOverview: function() 
    {
        if (this.control) {
          this.control.destroy();
        }
        
        var size = Element.getContentBoxSize(this.domObj);
        this.oSize = new OpenLayers.Size(size.width, size.height);
        
        this.mapObject.oLayerOL.isBaseLayer = true;  
        if (this.mapObject.oLayerOL.singleTile) {
          this.oMapOptions.numZoomLevels = 3;  //TODO: make this configurable?
        }

        this.mapObject.oLayerOL.ratio = 1.0;
        var mapOpts = {
          div: this.domObj,
          size: this.oSize,
          minRatio: this.nMinRatio,
          maxRatio: this.nMaxRatio,
          mapOptions: this.oMapOptions,
          layers: [this.mapObject.oLayerOL]
        };

        this.control = new OpenLayers.Control.OverviewMap(mapOpts);
        if (size.width == 0 || size.height == 0) {
          return;   //don't try to load if the container is not visible
        } else {
          this.getMap().oMapOL.addControl(this.control);
          this.bDisplayed = true;
        }
        //console.log('OverviewMap mapLoaded');
    },
    
    sizeChanged: function() {
        var size = Element.getContentBoxSize(this.domObj);
        this.oSize = new OpenLayers.Size(size.width, size.height);
        if (size.width == 0 || size.height == 0) {
          return;   //don't try to load if the container is not visible
        } 
        if (!this.bDisplayed && this.control) {
          this.getMap().oMapOL.addControl(this.control);
          this.bDisplayed = true;
        }
        if (this.control) {
            this.control.size = new OpenLayers.Size(size.width, size.height);
            this.control.mapDiv.style.width = this.oSize.w + 'px';
            this.control.mapDiv.style.height = this.oSize.h + 'px';
            this.control.ovmap.updateSize();
            this.control.update();
        }
    }

});
      
/**
 * Fusion.Widget.Pan
 *
 * $Id: Pan.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Pan
 *
 * A widget that allows for naviagtion by panning
 * **********************************************************************/

Fusion.Widget.Pan = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    initialize : function(widgetTag) {
        //console.log('Pan.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        this.control = new OpenLayers.Control.DragPan();
        this.getMap().oMapOL.addControl(this.control);
        this.control.handler.keyMask = 0;
        
        this.cursorNormal = ["url('images/grab.cur'),move", 'grab', '-moz-grab', 'move'];
        this.cursorDrag = ["url('images/grabbing.cur'),move", 'grabbing', '-moz-grabbing', 'move'];
    },

    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    activateTool : function() {
        /*console.log('Pan.activateTool');*/
        this.getMap().activateWidget(this);
    },
    
    activate : function() {
        this.control.activate();
        this.getMap().setCursor(this.cursorNormal);
        /*button*/
        this._oButton.activateTool();
    },
    
    deactivate: function() {
        /*console.log('Pan.deactivate');*/
        this.control.deactivate();
        this.getMap().setCursor('auto');
        /*icon button*/
        this._oButton.deactivateTool();
    }
});
/**
 * Fusion.Widget.PanOnClick
 *
 * $Id: PanOnClick.js 1382 2008-04-23 14:29:40Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.PanOnClick
 *
 * Pans the map a fixed amount in a particular direction
 * 
 * **********************************************************************/


Fusion.Widget.PanOnClick = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, 
{
    fPercent: null,
    nDeltaX: null,
    nDeltaY: null,
    initialize : function(widgetTag)
    {
        //console.log('FitToWindow.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        
        var percent = json.Percentage ? json.Percentage[0] : 75;
        this.fPercent = parseFloat(percent)/100;
        
        var direction = json.Direction ? json.Direction[0] : '';
        switch (direction) {
            case 'north':
                this.nDeltaX = 0;
                this.nDeltaY = 1;
                break;
            case 'south':
                this.nDeltaX = 0;
                this.nDeltaY = -1;
                break;
            case 'east':
                this.nDeltaX = 1;
                this.nDeltaY = 0;
                break;
            case 'west':
                this.nDeltaX = -1;
                this.nDeltaY = 0;
                break;
            default:
                this.nDeltaX = 0;
                this.nDeltaY = 0;
        }
        
    },

    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    execute : function()
    {
        var extents = this.getMap().getCurrentExtents();
        var center = this.getMap().getCurrentCenter();
        var fX, fY;
        fX = center.x + this.nDeltaX * (extents[2] - extents[0]) * this.fPercent;
        fY = center.y + this.nDeltaY * (extents[3] - extents[1]) * this.fPercent;
        this.getMap().zoom(fX, fY, 1);
    }
});/**
 * Fusion.Widget.PanQuery
 *
 * $Id: PanQuery.js 1461 2008-08-13 19:26:39Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.PanQuery
 *
 * A widget that combines pan and query functionality.  If the mouse is moved
 * before being released, a pan is performedd, otherwise a query is executed.
 * 
 * **********************************************************************/

//Fusion.require('widgets/Pan.js');

Fusion.Widget.PanQuery = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    selectionType: 'INTERSECTS',
    nTolerance: 3,
    bActiveOnly: false,
    initialize : function(widgetTag) {
        //console.log('PanQuery.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        //OpenLayers.Util.extend(this, Fusion.Widget.Pan.prototype);
        //Fusion.Widget.Pan.prototype.initialize.apply(this, [widgetTag]);

        this.control = new OpenLayers.Control.DragPan();
        this.getMap().oMapOL.addControl(this.control);
        //TODO figure out how to set the mouseup via handlerOptions
        this.control.handler.up = OpenLayers.Function.bind(this.mouseUp, this);
        
        var json = widgetTag.extension;
        
        this.nTolerance = json.Tolerance ? Math.abs(parseInt(json.Tolerance)) : 3;
        this.bComputeMetadata = (json.ComputeMetadata &&
                           (json.ComputeMetadata[0] == 'true' ||
                            json.ComputeMetadata[0] == '1')) ? true : false;
        

        var activeOnly = json.QueryActiveLayer ? json.QueryActiveLayer[0] : 'false';
        this.bActiveOnly = (activeOnly == 'true' || activeOnly == '1') ? true : false;
        
        this.cursorNormal = ['auto'];
        this.cursorDrag = ["url('images/grabbing.cur'),move", 'grabbing', '-moz-grabbing', 'move'];
    },

    /**
     * (private) gPan.MouseUp(e)
     *
     * handle mouseup events on the mapObj
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseUp: function(e) {
        //this.getMap().setCursor(this.cursorNormal);
        var handler = this.control.handler;
        
        var p = {x:Event.pointerX(e), y:Event.pointerY(e)};    

        var dx = handler.start.x - handler.last.x;
        var dy = handler.start.y - handler.last.y;
        
        if (Math.abs(dx) < this.nTolerance && Math.abs(dy) < this.nTolerance) {
            //execute query
            var pos = this.getMap().pixToGeo(handler.last.x, handler.last.y);
            var options = {};
            var dfGeoTolerance = this.getMap().pixToGeoMeasure(this.nTolerance);
            var minx = pos.x-dfGeoTolerance; 
            var miny = pos.y-dfGeoTolerance; 
            var maxx = pos.x+dfGeoTolerance; 
            var maxy = pos.y+dfGeoTolerance;
            options.geometry = 'POLYGON(('+ minx + ' ' + miny + ', ' + maxx + ' ' + miny + ', ' + maxx + ' ' + maxy + ', ' + minx + ' ' + maxy + ', ' + minx + ' ' + miny + '))';
            options.selectionType = "INTERSECTS";
            options.computed = this.bComputeMetadata;

            if (this.bActiveOnly) {
                var layer = this.getMap().getActiveLayer();
                if (layer) {
                    options.layers = layer.layerName;
                } else {
                    return;
                }
            }

            if (e.shiftKey) {
                options.extendSelection = true;
            }

            this.getMap().aMaps[0].query(options);
        }
        Event.stop(e);
    },    
    
    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    activateTool : function() {
        /*console.log('Pan.activateTool');*/
        this.getMap().activateWidget(this);
    },
    
    activate : function() {
        this.control.activate();
        this.getMap().setCursor(this.cursorNormal);
        /*button*/
        this._oButton.activateTool();
    },
    
    deactivate: function() {
        /*console.log('Pan.deactivate');*/
        this.control.deactivate();
        this.getMap().setCursor('auto');
        /*icon button*/
        this._oButton.deactivateTool();
    },
    
    setParameter : function(param, value) {
        if (param == "Tolerance" && value > 0) {
            this.nTolerance = value;
        }
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    }
});/**
 * Fusion.Widget.Print
 *
 * $Id: Print.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Print
 *
 * Print the current map.
 *
 * **********************************************************************/

Fusion.Widget.Print = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        var json = widgetTag.extension;
        
        var showPrintUI = json.ShowPrintUI ? json.ShowPrintUI[0] : 'false';
        this.showPrintUI = (showPrintUI.toLowerCase() == 'true' || showPrintUI == '1');
        
        var showTitle = json.ShowTitle ? json.ShowTitle[0] : 'false';
        this.showTitle = (showTitle.toLowerCase() == 'true' || showTitle == '1');

        this.pageTitle = json.PageTitle ? json.PageTitle[0] : '';
        
        this.resultsLayer = json.ResultsLayer ? json.ResultsLayer[0] : null;

        var showLegend = json.ShowLegend ? json.ShowLegend[0] : 'false';
        this.showLegend = (showLegend.toLowerCase() == 'true' || showLegend == '1');
        
        var showNorthArrow =json.ShowNorthArrow ? json.ShowNorthArrow[0] : 'false';
        this.showNorthArrow = (showNorthArrow.toLowerCase() == 'true' || showNorthArrow == '1');
        
        this.imageBaseUrl = json.ImageBaseUrl ? json.ImageBaseUrl[0] : null;
        
        this.dialogContentURL = Fusion.getFusionURL() + widgetTag.location + 'Print/Print.html';
        this.printablePageURL = Fusion.getFusionURL() + widgetTag.location + 'Print/printablepage.php';
        Fusion.addWidgetStyleSheet(widgetTag.location + 'Print/Print.css');
        
        /*
         * TODO: this is bad, why did we do this?
         this.getMap().registerForEvent(Fusion.Event.SELECTION_COMPLETE, OpenLayers.Function.bind(this.getSelection, this));
         */
        
    },
    /**
     * load an interface that builds a printable version of
     * the current map view
     */
    execute : function() {
        if (this.showPrintUI) {
            this.openPrintUI();
        } else {
            this.openPrintable();
        }
    },
    
    openPrintUI: function() {
        if (!this.dialog) {

            var size = Element.getPageDimensions();
            var o = {
                title: OpenLayers.i18n('printTitle'),
                id: 'printablePage',
                contentURL : this.dialogContentURL,
                onContentLoaded: OpenLayers.Function.bind(this.contentLoaded, this),
                imageBaseUrl: this.imageBaseUrl,
                width: 350,
                height: 250,
                resizeable: true,
                top: (size.height-250)/2,
                left: (size.width-350)/2,
                buttons: ['generate', 'cancel'],
                handler: OpenLayers.Function.bind(this.handler, this)
            };
            this.dialog = new Jx.Dialog(o);
            
        }
        this.dialog.open();
    },
    
    setParameter: function(param, value) {
        switch (param) {
            case 'Print_ShowTitle':
            this.showTitle = value;
            break;
            case 'Print_Title':
            this.pageTitle = value;
            break;
            case 'Print_ShowLegend':
            this.showLegend = value;
            break;
            case 'Print_ShowNorthArrow':
            this.showNorthArrow = value;
            break;
        }
    },
    
    contentLoaded: function(dialog) {
        dialog.registerIds(['dialogPrintShowtitle', 
                                 'dialogPrintTitle',
                                 'dialogPrintShowlegend',
                                 'dialogPrintShowNorthArrow'], dialog.content);
        dialog.getObj('dialogPrintShowtitle').checked = this.showTitle;
        dialog.getObj('dialogPrintTitle').value = this.pageTitle;
        dialog.getObj('dialogPrintTitle').disabled = !this.showTitle;
        dialog.getObj('dialogPrintShowlegend').checked = this.showLegend;
        dialog.getObj('dialogPrintShowNorthArrow').checked = this.showNorthArrow;
        
        Event.observe(dialog.getObj('dialogPrintShowtitle'), 'click', OpenLayers.Function.bind(this.controlTitle, this));
    },
    
    controlTitle: function() {
        this.dialog.getObj('dialogPrintTitle').disabled = !this.dialog.getObj('dialogPrintShowtitle').checked;
        
    },
    
    handler: function(button) {
        if (button == 'generate') {
            this.showTitle = this.dialog.getObj('dialogPrintShowtitle').checked;
            this.pageTitle = this.dialog.getObj('dialogPrintTitle').value;
            this.showLegend = this.dialog.getObj('dialogPrintShowlegend').checked;
            this.showNorthArrow = this.dialog.getObj('dialogPrintShowNorthArrow').checked;
            this.openPrintable();
            
        }
        this.dialog.close();
    },
    
    openPrintable: function() {
        var mainMap = this.getMap();
        var url = this.printablePageURL+'?';
        var extents = mainMap.getCurrentExtents();
        var centerX = (extents.left + extents.right)/ 2;
        var centerY = (extents.top + extents.bottom)/ 2;
        var dpi = mainMap._nDpi;
        var scale = mainMap.getScale();
        var maps = mainMap.getAllMaps();
        url = url + 'MAPNAME=' + mainMap.getMapName();
        url = url + '&SESSION=' + maps[0].getSessionID();
        url = url + '&CENTERX='+centerX;
        url = url + '&CENTERY='+centerY;
        url = url + '&DPI='+dpi;
        url = url + '&SCALE='+scale;
        url = url + '&ISTITLE=' + (this.showTitle != '' ? '1' : '0');
        url = url + '&ISLEGEND=' + (this.showLegend ? '1' : '0');
        url = url + '&ISARROW=' + (this.showNorthArrow ? '1' : '0');
        if (this.pageTitle != '') {
            url = url + '&TITLE='+this.pageTitle;
        }
        
        window.open(url, 'printablepage', '');
        
    }
});
/**
 * Fusion.Widget.RefreshMap
 *
 * $Id: RefreshMap.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.RefreshMap
 *
 * Refreshes the current map view without changing zoom or center.
 *
 * **********************************************************************/


Fusion.Widget.RefreshMap = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    initialize : function(widgetTag) {
        //console.log('RefreshMap.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
    },

    /**
     * 
     */
    execute : function() {
        var map = this.getMap();
        map.redraw();
    }
});
/**
 * Fusion.Widget.SaveMap
 *
 * $Id: SaveMap.js 1443 2008-07-25 16:07:30Z zjames $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SaveMap
 *
 * Save the current map image on the client's computer
 *
 * usage:
 * DWF format support requires a structure like this in the application
 * definition's widget tag extension:
 *    <Extension>
 *      <Format></Format>
 *      <ResourceId></ResourceId>
 *      <Scale></Scale>
 *    </Extension>
 * **********************************************************************/

Fusion.Widget.SaveMap = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    iframe : null,
    printLayout : null,
    printScale : null,
    imageWidth : null,
    imageHeight : null,
    initialize : function(widgetTag) {

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.format = (json.Format && json.Format[0] != '')?
                       json.Format[0] : 'png';
        
        //for DWF, parse printLayouts and build menu
        if (this.format == 'DWF' && json.PrintLayout.length) {
            Object.inheritFrom(this, Fusion.Tool.MenuBase.prototype, []);
            
            var layouts = json.PrintLayout;
            for (var i = 0; i < layouts.length; i++) {
                var layout = layouts[i];
                var opt = {};
                opt.label = layout.Name[0];
                var data = {rid:layout.ResourceId[0]};
                if (layout.PageHeight) {
                    data.pageHeight = layout.PageHeight[0];
                };
                if (layout.PageWidth) {
                    data.pageWidth = layout.PageWidth[0];
                };
                if (layout.Margins) {
                    data.margins = [layout.Margins[0].Top[0],
                                    layout.Margins[0].Left[0],
                                    layout.Margins[0].Right[0],
                                    layout.Margins[0].Bottom[0]];
                };
                var menuItem = null;
                if (layout.Scale) {
                    //create entries for weblayout specified scales
                    menuItem = new Jx.SubMenu(opt);
                    data.scales = [];
                    for (var j=0; j < layout.Scale.length; j++) {
                        data.scales.push(layout.Scale[j]);
                        var scaleAction = new Jx.Action(this.setLayout.bind(this, data, j));
                        var subMenuItem = new Jx.MenuItem(scaleAction,{label:layout.Scale[j]});
                        menuItem.add(subMenuItem);
                    }
                    //add an entry for current scale
                    var currentScaleAction = new Jx.Action(this.setLayout.bind(this, data));
                    var currentScaleItem = new Jx.MenuItem(currentScaleAction,
                                                         {label:'Current Scale'});
                    menuItem.add(currentScaleItem);
                } else {
                    //if there are no scales, the layout is used with current scale
                    var action = new Jx.Action(this.setLayout.bind(this, data));
                    menuItem = new Jx.MenuItem(action,opt);
                };
                this.oMenu.add(menuItem);
            }
        } else {
            Object.inheritFrom(this, Fusion.Tool.ButtonBase.prototype, []);
            if (json.Width && json.Width[0] != '') {
                this.imageWidth = json.Width[0];
            }
            if (json.Height && json.Height[0] != '') {
                this.imageHeight = json.Height[0];
            }
        }

        this.enable = Fusion.Widget.SaveMap.prototype.enable;
    },
    
    enable: function() {
        Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
    },
    
    setLayout: function(data) {
        this.printLayout = data.rid;
        this.pageHeight = data.pageHeight;
        this.pageWidth = data.pageWidth;
        this.pageMargins = data.margins;
        //when the selected item has a scale, the index into the scales array
        //is passed, otherwise value is reset and current scale is used.
        if (arguments.length == 3){
            this.printScale = parseFloat(data.scales[arguments[1]]);
        } else {
            this.printScale = null;
        }

        this.activateTool();
    },

    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     * prompts user to save the map.
     */
    activateTool : function() {
        if (!this.iframe) {
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'w';
            this.iframe.style.visibility = 'hidden';
            document.body.appendChild(this.iframe);
        }
        var szLayout = '';
        var szScale = '';
        var szPageHeight = '';
        var szPageWidth = '';
        var szPageMargins = '';
        if (this.format === 'DWF') {
            if (this.printLayout) {
                szLayout = '&layout=' + this.printLayout;                
            } else {
                alert('DWF Save is not properly configured.');
                return;
            }
            if (this.printScale) {
                szScale = '&scale=' + this.printScale;
            }            
            if (this.pageHeight) {
                szPageHeight = '&pageheight=' + this.pageHeight;
            }
            if (this.pageWidth) {
                szPageWidth = '&pagewidth=' + this.pageWidth;
            }
            if (this.pageMargins) {
                szPageMargins = '&margins=' + this.pageMargins.join(',');
            }
        }
        var szHeight = '';
        if (this.imageHeight) {
            szHeight = '&height=' + this.imageHeight;
        }
        var szWidth = '';
        if (this.imageWidth) {
            szWidth = '&width=' + this.imageWidth;
        }
        var m = this.getMap().aMaps[0];
        if(navigator.appVersion.match(/\bMSIE\b/)) {
            var url = Fusion.fusionURL + '/' + m.arch + '/' + Fusion.getScriptLanguage() + "/SaveMapFrame." + Fusion.getScriptLanguage() + '?session='+m.getSessionID() + '&mapname=' + m.getMapName() + '&format=' + this.format + szLayout + szScale + szWidth + szHeight + szPageHeight + szPageWidth + szPageMargins;
            w = open(url, "Save", 'menubar=no,height=200,width=300');
        } else {
            var s = Fusion.fusionURL + '/' + m.arch + '/' + Fusion.getScriptLanguage() + "/SaveMap." + Fusion.getScriptLanguage() + '?session='+m.getSessionID() + '&mapname=' + m.getMapName() + '&format=' + this.format + szLayout + szScale + szWidth + szHeight + szPageHeight + szPageWidth + szPageMargins;
            
            this.iframe.src = s;
        }
    }
});
/**
 * Fusion.Widget.Scalebar
 *
 * $Id: Scalebar.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Scalebar
 *
 * A dynamically generated cartographic scalebar 
 *
 * uses JavaScript Scale Bar for MapServer 
 * (http://mapserver.commenspace.org/tools/scalebar/
 * **********************************************************************/


if (typeof(ScaleBarTool)=='undefined') {
    Fusion.require('widgets/scalebar/scalebartool.js');
}

Fusion.Widget.Scalebar = OpenLayers.Class(Fusion.Widget,
{
    style: 'thin',
    displaySystem: 'metric',
    minWidth: 100,
    maxWidth: 200,
    divisions: 2,
    subdivisions: 2,
    showMinorMeasures: true,
    abbreviateLabel: true,
    singleLine: false,
    initialize : function(widgetTag) {
        //console.log('Scalebar.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);

        var json = widgetTag.extension;
        this.style = json.Style ? json.Style[0].toLowerCase() : this.style;
        if (this.style != 'fancy' && 
            this.style != 'fat' && 
            this.style != 'thin' && 
            this.style != 'thinner') {
            this.style = 'thin';
        }
        
        this.displaySystem = json.DisplaySystem ? json.DisplaySystem[0] : this.displaySystem;
        this.minWidth = json.MinWidth ? json.MinWidth[0] : this.minWidth;
        this.maxWidth = json.MaxWidth ? json.MaxWidth[0] : this.maxWidth;
        this.divisions = json.Divisions ? json.Divisions[0] : this.divisions;
        this.subdivisions = json.SubDivisions ? json.SubDivisions[0] : this.subdivisions;
        this.showMinorMeasures = (json.ShowMinorMeasures && json.ShowMinorMeasures[0]) == 'false' ? false : true;
        this.abbreviateLabel = (json.AbbreviateLabel && json.AbbreviateLabel[0]) == 'true' ? true : false;
        this.singleLine = (json.SingleLine && json.SingleLine[0]) == 'true' ? true : false;
        
        
        if (document.styleSheets) {
            if (document.styleSheets[0]) {
                var url = Fusion.getFusionURL() + 'widgets/scalebar/scalebar-'+this.style+'.css';
                //console.log(url);
                if (document.styleSheets[0].addImport) {
                    document.styleSheets[0].addImport(url);
                } else {
                    document.styleSheets[0].insertRule('@import url('+url+');',0);
                }
            }
        }

        this.oScaleBar = new ScaleBarTool(1);
        this.oScaleBar.displaySystem = this.displaySystem;
        this.oScaleBar.minWidth = this.minWidth;
        this.oScaleBar.maxWidth = this.maxWidth;
        this.oScaleBar.divisions = this.divisions;
        this.oScaleBar.subdivisions = this.subdivisions;
        this.oScaleBar.showMinorMeasures = this.showMinorMeasures;
        this.oScaleBar.abbreviateLabel = this.abbreviateLabel;
        this.oScaleBar.singleLine = this.singleLine;
        
        //FireFox gives the following error when just calling place
        //but putting it in a timeout seems to fix the problem.  When
        //debugging using firebug, the problem doesn't occur.
        //this.oScaleBar.place(widgetTag.name);
        //A parameter or an operation is not supported by the underlying object"  code: "15
        window.setTimeout(OpenLayers.Function.bind(this.oScaleBar, widgetTag.name), 1);

        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.extentsChangedCB, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.extentsChangedCB, this));
    },

    extentsChangedCB : function() {
        this.oScaleBar.update(this.getMap().getScale());
    }
});
/**
 * Fusion.Widget.ScalebarDual
 *
 * $Id: ScalebarDual.js 1422 2008-06-25 18:41:23Z pagameba $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ScalebarDual
 *
 * A dynamically generated cartographic scalebar that looks like the Google scalebar
 *
 * **********************************************************************/

Fusion.Widget.ScalebarDual = OpenLayers.Class(Fusion.Widget, {
    initialize : function(widgetTag) {
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag]);
        var json = widgetTag.extension;
        var maxWidth = json.MaxWidth ? parseInt(json.MaxWidth[0]) : 300;
        var topInUnits = json.TopInUnits ? json.TopInUnits[0] : 'ft';
        var topOutUnits = json.TopOutUnits ? json.TopOutUnits[0] : 'mi';
        var bottomInUnits = json.BottomInUnits ? json.BottomInUnits[0] : 'm';
        var bottomOutUnits = json.BottomOutUnits ? json.BottomOutUnits[0] : 'km';
        var options = {   //set these from widgetTag extension
            maxWidth:  maxWidth,
            topInUnits: topInUnits,
            topOutUnits: topOutUnits,
            bottomInUnits: bottomInUnits,
            bottomOutUnits: bottomOutUnits
        };
        this.addControl(new OpenLayers.Control.ScaleLine(options));
    }
});
/**
 * Fusion.Widget.Search
 *
 * $Id: Search.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Search
 *
 * A widget that displays a pre-configured search form to the user and then
 * runs the search.  Searches are done on the attributes of specifiedd layers.
 *
 * uses JavaScript Scale Bar for MapServer 
 * (http://mapserver.commenspace.org/tools/scalebar/
 * **********************************************************************/

Fusion.Widget.Search = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    sFeatures : 'menubar=no,location=no,status=no,scrollbars=yes',

    initialize : function(widgetTag) {
        //console.log('Search.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.sTarget = json.Target ? json.Target[0] : "SearchWindow";
        this.sBaseUrl = Fusion.getFusionURL() + 'widgets/Search/SearchPrompt.php';
        this.prompt = json.Prompt ? json.Prompt[0] : "";
        this.layer = json.Layer ? json.Layer[0] : "";
        this.filter = json.Filter ? json.Filter[0] : "";
        this.limit = json.MatchLimit ? json.MatchLimit[0] : 100;
        this.resultColumns = json.ResultColumns ? json.ResultColumns[0].Column : [];
        this.title = json.Title ? json.Title[0] : widgetTag.label;
    },

    execute : function() {
        var url = this.sBaseUrl;
        //add in other parameters to the url here
        
        var map = this.getMap();
        var mapLayers = map.getAllMaps();
        var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
        var pageElement = $(this.sTarget);

        var params = [];
        params.push('locale='+Fusion.locale);
        params.push('session='+mapLayers[0].getSessionID());
        params.push('mapname='+mapLayers[0].getMapName());
        if (taskPaneTarget || pageElement) {
          params.push('popup=false');
        } else {
          params.push('popup=true');
        }
        params.push('widgetname='+this.id);  

        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url.slice(-1) != '&') {
            url += '&';
        }
        url += params.join('&');
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                window.open(url, this.sTarget, this.sWinFeatures);
            }
        }
    }
});
/**
 * Fusion.Widget.Select
 *
 * $Id: Select.js 1456 2008-08-12 19:58:27Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Select
 *
 * perform a selection on map features
 * 
 * **********************************************************************/


Fusion.Widget.Select = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    selectionType: 'INTERSECTS',
    nTolerance : 3,     //default pixel tolernace for a point click
    bActiveOnly: false, //only select feature(s) on the active layer?
    maxFeatures: 0,     //deafult of 0 selects all features (i.e. no maximum)
    
    initialize : function(widgetTag) {
        //console.log('Select.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        this.asCursor = ['auto'];
        
        this.enable = Fusion.Widget.Select.prototype.enable;

        var json = widgetTag.extension;
        
        this.selectionType = json.SelectionType ? json.SelectionType[0] : 'INTERSECTS';
        
        if (json.Tolerance && (parseInt(json.Tolerance[0]) > 0)) {
            nTolerance = parseInt(json.Tolerance[0]);
        }

        if (json.MaxFeatures) {
            this.maxFeatures = parseInt(json.MaxFeatures[0]);
        }
        
        this.bActiveOnly = (json.QueryActiveLayer &&
                           (json.QueryActiveLayer[0] == 'true' ||
                            json.QueryActiveLayer[0] == '1')) ? true : false;
        
        this.bComputeMetadata = (json.ComputeMetadata &&
                           (json.ComputeMetadata[0] == 'true' ||
                            json.ComputeMetadata[0] == '1')) ? true : false;
        
        if (this.bActiveOnly) {
            this.getMap().registerForEvent(Fusion.Event.MAP_ACTIVE_LAYER_CHANGED, OpenLayers.Function.bind(this.enable, this));
        }
        
        this.map = this.getMap().oMapOL;
        this.handler = new OpenLayers.Handler.Box(this,{done: this.execute},{keyMask:0});
        this.shiftHandler = new OpenLayers.Handler.Box(this,{done: this.extend},
                                        {keyMask:OpenLayers.Handler.MOD_SHIFT});
    },
    
    enable: function() {
        if (this.bActiveOnly) {
            var layer = this.getMap().getActiveLayer();
            if (layer && layer.selectable) { 
                Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
            } else {
                this.disable();
            }
        } else {
            Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
        }
    },
    
    /**
       * called when the button is clicked by the ButtonBase widget
       */
    activateTool : function() {
        this.getMap().activateWidget(this);
     },

    /**
       * activate the widget (listen to mouse events and change cursor)
       * This function should be defined for all functions that register
       * as a widget in the map
       */
    activate : function() {
        this.handler.activate();
        this.shiftHandler.activate();
        this.getMap().setCursor(this.asCursor);
        /*icon button*/
        this._oButton.activateTool();
    },

    /**
       * deactivate the widget (listen to mouse events and change cursor)
       * This function should be defined for all functions that register
       * as a widget in the map
       **/
    deactivate : function() {
        this.handler.deactivate();
        this.shiftHandler.deactivate();
        this.getMap().setCursor('auto');
        /*icon button*/
        this._oButton.deactivateTool();
    },

    /**
       *  set the extants of the map based on the pixel coordinates
       * passed
       * 
       * Parameters:
        *   position will be either an instance of OpenLayers.Bounds when the mouse has
        *   moved, or an OpenLayers.Pixel for click without dragging on the map
        **/
    execute : function(position, extend) {
        //ctrl click is used to launch a URL defined on the feature. See ClickCTRL widget
        if (this.keyModifiers & OpenLayers.Handler.MOD_CTRL) {
          //return;
        }
        
        var nRight, nTop;
        var nLeft = position.left;
        var nBottom = position.bottom;
        if (position instanceof OpenLayers.Bounds) {
          nRight = position.right;
          nTop = position.top;
        } else { // it's a pixel
          nRight = nLeft = position.x;
          nTop = nBottom = position.y;
        }

        var sMin = this.getMap().pixToGeo(nLeft,nBottom);
        var sMax = this.getMap().pixToGeo(nRight,nTop);
        var nXDelta = Math.abs(nLeft-nRight);
        var nYDelta = Math.abs(nBottom- nTop);
        
        var options = {};
        if (nXDelta <=this.nTolerance && nYDelta <=this.nTolerance) {
            var dfGeoTolerance = this.getMap().pixToGeoMeasure(this.nTolerance);
            sMin.x = sMin.x-dfGeoTolerance;
            sMin.y = sMin.y-dfGeoTolerance;
            sMax.x = sMax.x+dfGeoTolerance;
            sMax.y = sMax.y+dfGeoTolerance;
        }
        
        options.geometry = 'POLYGON(('+ sMin.x + ' ' +  sMin.y + ', ' +  sMax.x + ' ' +  sMin.y + ', ' + sMax.x + ' ' +  sMax.y + ', ' + sMin.x + ' ' +  sMax.y + ', ' + sMin.x + ' ' +  sMin.y + '))';
        options.selectionType = this.selectionType;
        options.maxFeatures = this.maxFeatures;
        options.computed = this.bComputeMetadata;

        if (this.bActiveOnly) {
            var layer = this.getMap().getActiveLayer();
            if (layer) {
                options.layers = layer.layerName;
            } else {
                return;
            }
        }
        
        if (extend) {
            options.extendSelection = true;
        }
        
        this.getMap().query(options);
    },

    /**
        * handler for extending the selection when the shift key is pressed
        *
        * Parameters:
        * evt - the OpenLayers.Event object that is being responded to
        */
    extend: function(position) {
        this.execute(position, true);
    },
    
    /**
        * calculate the keyboard modifier mask for this event 
        *
        * Parameters:
        * evt - the OpenLayers.Event object that is being responded to
        */
    setModifiers: function(evt) {
        this.keyModifiers =
            (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? OpenLayers.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? OpenLayers.Handler.MOD_ALT   : 0);
    },
    
    /**
        * clears the keyboard modifier mask for this event 
        *
        * Parameters:
        * evt - the OpenLayers.Event object that is being responded to
        */
    clearModifiers: function(evt) {
      this.keyModifiers = 0;
    },

    /**
        * allows run-time setting of widget parameters 
        *
        * Parameters:
        * param - the widget parameter name to set; for the Select widget these may be:
        *               'Tolerance' and 'SelectionType'
        * value - the value to sue for the parameter
        */
    setParameter : function(param, value) {
        if (param == "Tolerance" && value > 0) {
            this.nTolerance = value;
        }
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    }
});
/**
 * Fusion.Widget.SelectPolygon
 *
 * $Id: SelectPolygon.js 1462 2008-08-21 13:57:06Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectPolygon
 *
 * perform a selection using a polygon
 * 
 * **********************************************************************/


Fusion.Widget.SelectPolygon = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, Fusion.Tool.ButtonBase, Fusion.Tool.Canvas,
{
    selectionType: 'INTERSECTS',
    nTolerance : 3, //default pixel tolernace for a point click
    initialize : function(widgetTag) {
        //console.log('Select.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        Fusion.Tool.Canvas.prototype.initialize.apply(this, []);
        
        this.asCursor = ['auto'];

        var json = widgetTag.extension;
        
        this.selectionType = json.SelectionType ? json.SelectionType[0] : 'INTERSECTS';
        if (json.Tolerance && (parseInt(json.Tolerance[0]) > 0)) {
            nTolerance = parseInt(json.Tolerance[0]);
        }
        this.bComputeMetadata = (json.ComputeMetadata &&
                           (json.ComputeMetadata[0] == 'true' ||
                            json.ComputeMetadata[0] == '1')) ? true : false;
        
        this.polygon = new Fusion.Tool.Canvas.Polygon();
    },
    
    /**
     * called when the button is clicked by the ButtonBase widget
     */
    activateTool : function()
    {
        this.getMap().activateWidget(this);
        //this.activate();
    },

    /**
     * activate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     */
    activate : function()
    {
        this.activateCanvas();
        this.getMap().setCursor(this.asCursor);
        /*icon button*/
        this._oButton.activateTool();
        this.polygon = new Fusion.Tool.Canvas.Polygon(this.getMap());
    },

    /**
     * deactivate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     **/
    deactivate : function()
    {
         this.deactivateCanvas();
         this.getMap().setCursor('auto');
         /*icon button*/
         this._oButton.deactivateTool();
    },
    
    /**
     * (public) mouseDown(e)
     *
     * handle the mouse down event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseDown: function(e) {
        //console.log('SelectRadius.mouseDown');
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);

            if (!this.isDigitizing) {
                this.polygon = new Fusion.Tool.Canvas.Polygon(this.getMap());
                var point = this.getMap().pixToGeo(p.x, p.y);
                var from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var seg = new Fusion.Tool.Canvas.Segment(from,to);
                seg.setEditing(true);
                this.polygon.addSegment(seg);
                this.clearContext();
                this.polygon.draw(this.context);     

                this.isDigitizing = true;
            } else {
                var seg = this.polygon.lastSegment();
                seg.setEditing(false);
                seg = this.polygon.extendLine();
                seg.setEditing(true);
                this.clearContext();
                this.polygon.draw(this.context);
            }
        }
    },

    /**
     * (public) mouseMove(e)
     *
     * handle the mouse move event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove');
        if (!this.isDigitizing) {
            return;
        }
    
        var p = this.getMap().getEventPosition(e);
        var seg = this.polygon.lastSegment();
        seg.to.setPx(p.x,p.y);
        seg.to.updateGeo();
        this.clearContext();
        this.polygon.draw(this.context);
    },
    
    /**
     * (public) dblClick(e)
     *
     * handle the mouse dblclick event
     *
     * @param e Event the event that happened on the mapObj
     */
    dblClick: function(e) {
        //console.log('Digitizer.dblClick');
        if (!this.isDigitizing) {
            return;
        }
        this.event = e;
        var p = this.getMap().getEventPosition(e);
        var point = this.getMap().pixToGeo(p.x, p.y);
        var seg = this.polygon.lastSegment();
        seg.setEditing(false);
        seg.to.set(point.x,point.y);
        this.clearContext();
        this.isDigitizing = false;
        this.execute();
    },

    /**
     *  
     **/
    execute : function() {
        var wkt = 'POLYGON((';
        var nodes = this.polygon.getNodes();
        var sep = '';
        for (var i=0; i<nodes.length; i++) {
            wkt = wkt + sep + nodes[i].x + ' ' + nodes[i].y;
            sep = ',';
        }
        wkt = wkt + sep + nodes[0].x + ' ' + nodes[0].y + '))';
        
        var options = {};
        options.geometry = wkt;
        options.selectionType = this.selectionType;
        options.computed = this.bComputeMetadata;

        if (this.bActiveOnly) {
            var layer = this.getMap().getActiveLayer();
            if (layer) {
                options.layers = layer.layerName;
            } else {
                return;
            }
        }
        
        if (this.event.shiftKey) {
            options.extendSelection = true;
        }
        
        this.getMap().query(options);
    },
    
    setParameter : function(param, value) {
        if (param == "Tolerance" && value > 0) {
            this.nTolerance = value;
        }
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    }
});
/**
 * Fusion.Widget.SelectRadius
 *
 * $Id: SelectRadius.js 1456 2008-08-12 19:58:27Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectRadius
 *
 * perform a selection by radius from a point
 * 
 * **********************************************************************/
Fusion.Event.RADIUS_WIDGET_ACTIVATED = Fusion.Event.lastEventId++;


Fusion.Widget.SelectRadius = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase, Fusion.Tool.Canvas,
{
    selectionType: 'INTERSECTS',
    nTolerance : 3, //default pixel tolernace for a point click
    defaultRadius: 20,    //this is in map units
    initialize : function(widgetTag) {
        //console.log('Select.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        Fusion.Tool.Canvas.prototype.initialize.apply(this, []);

        this.asCursor = ['auto'];
        this.isDigitizing = false;

        var json = widgetTag.extension;
        this.selectionType = json.SelectionType ? json.SelectionType[0] : 'INTERSECTS';

        if (json.Tolerance && (parseInt(json.Tolerance[0]) > 0)) {
            nTolerance = parseInt(json.Tolerance[0]);
        }

        this.defaultRadius = json.DefaultRadius ? parseInt(json.DefaultRadius[0]) : this.defaultRadius;
        this.bComputeMetadata = (json.ComputeMetadata &&
                           (json.ComputeMetadata[0] == 'true' ||
                            json.ComputeMetadata[0] == '1')) ? true : false;
        
        
        var container = json.RadiusTooltipContainer ? json.RadiusTooltipContainer[0] : '';
        if (container != '') {
            this.radiusTip = $(container);
        }
        
        if (this.radiusTip) {
            this.radiusTipType = json.RadiusTooltipType ?
                                 json.RadiusTooltipType[0].toLowerCase() : 'dynamic';
            if (this.radiusTipType == 'dynamic') {
                var oDomElem =  this.getMap().getDomObj();
                oDomElem.appendChild(this.radiusTip);
                this.radiusTip.style.position = 'absolute';
                this.radiusTip.style.display = 'none';
                this.radiusTip.style.top = '0px';
                this.radiusTip.style.left = '0px';
                this.radiusTip.style.zIndex = 101;
            }
        }
        
        this.registerEventID(Fusion.Event.RADIUS_WIDGET_ACTIVATED);
    },
    
    setRadius: function(r) {
        this.defaultRadius = r;
    },
    
    getRadius: function() {
        if (this.circle) {
            return this.circle.radius;
        } else {
            return this.defaultRadius;
        }
    },
    
    /**
     * called when the button is clicked by the ButtonBase widget
     */
    activateTool : function() {
        this.getMap().activateWidget(this);
        //this.activate();
    },

    /**
     * activate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     */
    activate : function() {
        this.activateCanvas();
        this.getMap().setCursor(this.asCursor);
        /*icon button*/
        this._oButton.activateTool();
        if (!this.circle) {
            this.circle = new Fusion.Tool.Canvas.Circle(this.getMap());
        }
        /*map units for tool tip*/
        this.units = this.getMap().getAllMaps()[0].units;
        this.triggerEvent(Fusion.Event.RADIUS_WIDGET_ACTIVATED, true);
    },

    /**
     * deactivate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     **/
    deactivate : function() {
        this.deactivateCanvas();
        this.getMap().setCursor('auto');
        /*icon button*/
        this._oButton.deactivateTool();
        this.triggerEvent(Fusion.Event.RADIUS_WIDGET_ACTIVATED, false);
    },
    
    /**
     * (public) mouseDown(e)
     *
     * handle the mouse down event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseDown: function(e) {
        //console.log('SelectRadius.mouseDown'+this.isDigitizing);
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);
            var point = this.getMap().pixToGeo(p.x, p.y);
            var radius = this.defaultRadius;
            
            if (!this.isDigitizing) {
                this.circle.setCenter(point.x, point.y);
                this.circle.setRadius(radius);
                this.clearContext();
                this.circle.draw(this.context);     
                this.isDigitizing = true;
            }
        }
        if (this.radiusTip && this.radiusTipType == 'dynamic') {
            this.radiusTip.style.display = 'block';
            var size = Element.getDimensions(this.radiusTip);
            this.radiusTip.style.top = (p.y - size.height*2) + 'px';
            this.radiusTip.style.left = p.x + 'px';
            var r = this.circle.radius;
            if (this.units == 'm' || this.units == 'ft') {
                r = Math.round(r * 100)/100;
            }
            this.radiusTip.innerHTML = r + this.units;
        }
    },

    /**
     * (public) mouseMove(e)
     *
     * handle the mouse move event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove'+this.isDigitizing);
        if (!this.isDigitizing) {
            return;
        }
    
        var map = this.getMap();
        var p = map.getEventPosition(e);
        var point = map.pixToGeo(p.x, p.y);
        var center = this.circle.center;
        
        var radius = Math.sqrt(Math.pow(center.x-point.x,2) + Math.pow(center.y-point.y,2));
        if (radius > this.nTolerance) {
            this.circle.setRadius(radius);
        }
        this.clearContext();
        this.circle.draw(this.context);
        
        if (this.radiusTip && this.radiusTipType == 'dynamic') {
            this.radiusTip.style.display = 'block';
            var size = Element.getDimensions(this.radiusTip);
            this.radiusTip.style.top = (p.y - size.height*2) + 'px';
            this.radiusTip.style.left = p.x + 'px';
            var r = this.circle.radius;
            if (this.units == 'm' || this.units == 'ft') {
                r = Math.round(r * 100)/100;
            }
            this.radiusTip.innerHTML = r + this.units;
        }
        
    },
    
    mouseUp: function(e) {
        //console.log('SelectRadius.mouseUp'+this.isDigitizing);
        if (this.isDigitizing) {
            this.event = e;
            this.clearContext();
            this.isDigitizing = false;
            var center = this.circle.center;
            var radius = this.circle.radius;
            this.execute(center, radius);
        }
        
        if (this.radiusTip && this.radiusTipType == 'dynamic') {
            this.radiusTip.style.display = 'none';
            this.radiusTip.innerHTML = '';
        }
        
    },

    /**
     *  set the extants of the map based on the pixel coordinates
     * passed
     * 
     * @param center
     * @param radius
     **/
    execute : function(center, radius) {
        var wkt = 'POLYGON((';
        var nPoints = 16;
        var angle = 2 * Math.PI / nPoints;
        var sep = '';
        var first;
        for (var i=0; i<nPoints; i++) {
            var x = center.x + radius * Math.cos(i*angle);
            var y = center.y + radius * Math.sin(i*angle);
            if (i==0) {
                first = x + ' ' + y;
            }
            wkt = wkt + sep + x + ' ' + y;
            sep = ',';
        }
        wkt = wkt + sep + first + '))';
        
        var options = {};
        options.geometry = wkt;
        options.selectionType = this.selectionType;
        options.computed = this.bComputeMetadata;

        if (this.bActiveOnly) {
            var layer = this.getMap().getActiveLayer();
            if (layer) {
                options.layers = layer.layerName;
            } else {
                return;
            }
        }
        
        if (this.event.shiftKey) {
            options.extendSelection = true;
        }
        
        this.getMap().query(options);
    },
    
    setParameter : function(param, value) {
        if (param == "Tolerance" && value > 0) {
            this.nTolerance = value;
        }
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    }
});
/**
 * Fusion.Widget.SelectRadiusValue
 *
 * $Id: SelectRadiusValue.js 1581 2008-10-03 13:03:21Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectRadiusValue
 *
 * A widget to allow the user to specify the radius to use for a 
 * SelectRadius widget.
 *
 * **********************************************************************/

Fusion.Widget.SelectRadiusValue = OpenLayers.Class(Fusion.Widget, 
{
    radiusWidgetName: null,
    label: '',
    className: '',
    domLabel: null,
    initialize : function(widgetTag) {
    
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        
        /* parse widget properties */
        var json = widgetTag.extension;
        
        this.radiusWidgetName = json.RadiusName ? json.RadiusName[0] : null;
        this.label = json.Label ? json.Label[0] : '';
        this.className = json.ClassName ? json.ClassName[0] : '';
        
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.mapLoaded, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.mapExtentsChanged, this));
    },
    
    draw: function() {
        /* put in the label */
        var units = this.getMap().getAllMaps()[0].units;
        this.domLabel = document.createElement('span');
        this.domLabel.className = this.className;
        this.domLabel.innerHTML = this.label + '(' + units + ')';
        
        /* put in the input */
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.domLabel.appendChild(this.input);
        
        /* put into page */
        this.domObj.appendChild(this.domLabel);
        Event.observe(this.input, 'blur', OpenLayers.Function.bind(this.onBlur, this));
    },
    
    mapLoaded: function() {
        this.draw();
        this.input.disabled = true;
        var widgets = Fusion.getWidgetsByType('SelectRadius');
        for (var i=0; i<widgets.length; i++) {
            if (widgets[i].widgetTag.name == this.radiusWidgetName) {
                this.widget = widgets[i];
                this.widget.registerForEvent(Fusion.Event.RADIUS_WIDGET_ACTIVATED, this.dependantEnable.bind(this));
                break;
            }
        }
        this.updateFromWidgetValue();
    },
    
    dependantEnable: function(eventId, active) {
        if (this.widget) {
            if (active) {
                this.input.disabled = false;
            } else {
                this.input.disabled = true;
            }
        }
    },
    
    mapExtentsChanged: function() {
        this.updateWidgetValue();
    },
    
    onBlur: function() {
        this.updateWidgetValue();
    },
    
    updateWidgetValue: function() {
        if (this.widget) {
            var radius = this.input.getValue();
            this.widget.setRadius(radius);
        }
    },
    
    updateFromWidgetValue: function() {
        if (this.widget) {
            this.input.value = this.widget.getRadius();
        }
    }
});
/**
 * Fusion.Widget.SelectWithin
 *
 * $Id: SelectWithin.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectWithin
 *
 * A widget to perform a selection within a currently selected set of features.
 *
 * **********************************************************************/


Fusion.Widget.SelectWithin = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    sFeatures : 'menubar=no,location=no,resizable=no,status=no',

    initialize : function(widgetTag) {
        //console.log('SelectWithin.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.sTarget = json.Target ? json.Target[0] : "SelectWithinWindow";
        this.sBaseUrl = Fusion.getFusionURL() + 'widgets/SelectWithin/SelectWithinPanel.php';
        
        this.bSelectionOnly = (json.DisableIfSelectionEmpty &&
                           (json.DisableIfSelectionEmpty[0] == 'true' ||
                            json.DisableIfSelectionEmpty[0] == '1')) ? true : false;
                            
        this.additionalParameters = [];
        if (json.AdditionalParameter) {
            for (var i=0; i<json.AdditionalParameter.length; i++) {
                var p = json.AdditionalParameter[i];
                var k = p.Key[0];
                var v = p.Value[0];
                this.additionalParameters.push(k+'='+encodeURIComponent(v));
            }
        }
        
        this.enable = Fusion.Widget.SelectWithin.prototype.enable;
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.enable, this));
        this.disable();
    },

    enable: function() {
        var map = this.getMap();
        if (this.bSelectionOnly || !map) {
            if (map && map.hasSelection()) {
                if (this.action) {
                    this.action.setEnabled(true);
                } else {
                    Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
                }
            } else {
                if (this.action) {
                    this.action.setEnabled(false);
                } else {
                    this.disable();
                }
            }
        } else {
            if (this.action) {
                this.action.setEnabled(true);
            } else {
                Fusion.Tool.ButtonBase.prototype.enable.apply(this,[]);
            }
        }
    },
    
    execute : function() {
        var url = this.sBaseUrl;
        //add in other parameters to the url here
        
        var map = this.getMap();
        var mapLayers = map.getAllMaps();
        var taskPaneTarget = Fusion.getWidgetById(this.sTarget);
        var pageElement = $(this.sTarget);

        var params = [];
        params.push('locale='+Fusion.locale);
        params.push('session='+mapLayers[0].getSessionID());
        params.push('mapname='+mapLayers[0].getMapName());
        if (taskPaneTarget || pageElement) {
          params.push('popup=false');
        } else {
          params.push('popup=true');
        }
        params = params.concat(this.additionalParameters);

        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url.slice(-1) != '&') {
            url += '&';
        }
        url += params.join('&');
        if ( taskPaneTarget ) {
            taskPaneTarget.setContent(url);
        } else {
            if ( pageElement ) {
                pageElement.src = url;
            } else {
                window.open(url, this.sTarget, this.sWinFeatures);
            }
        }
    }
});
/**
 * Fusion.Widget.SelectionInfo
 *
 * $Id: SelectionInfo.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectionInfo
 *
 * Displays the number of features and number of layers in the current
 * selection.
 *
 * Template (string, optional) 
 *
 * The format of the output string.  Use {layers} and {features} as 
 * placeholders for the number of layers and features in the current
 * selection.
 *
 * You can embed HTML in the template, but you must escape any characters
 * that result in illegal HTML.  This would include:
 *
 * < is &lt;
 * > is &gt;
 * & is &amp;
 * **********************************************************************/

Fusion.Widget.SelectionInfo = OpenLayers.Class(Fusion.Widget,
{
    defaultTemplate: 'selectionInfo',
    domSpan: null,
    
    initialize : function(widgetTag) {
        //console.log('SelectionInfo.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        
        var json = widgetTag.extension;
        
        this.emptyText = json.EmptyText ? json.EmptyText[0] : this.domObj.innerHTML;
        this.template = json.Template ? json.Template[0] : null;
        
        this.domSpan = document.createElement('span');
        this.domSpan.className = 'spanSelectionInfo';
        this.domSpan.innerHTML = OpenLayers.i18n(this.emptyText);
        this.domObj.innerHTML = '';
        this.domObj.appendChild(this.domSpan);

        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.update, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.update, this));
    },
    
    update: function() {
        var olMap = this.getMap();
        var aMaps = olMap.getAllMaps();
        var map = aMaps[0];
        if (map.hasSelection()) {
            var layers = map.getSelectedLayers();
            var nLayers = layers.length;
            var nFeatures = map.getSelectedFeatureCount();
            if (this.template) {
              this.domSpan.innerHTML = this.template.replace('{0}',nFeatures).replace('{1}',nLayers);
            } else {
              this.domSpan.innerHTML = OpenLayers.i18n(this.defaultTemplate,{'features':nFeatures,'layers':nLayers});
            }
        } else {
            this.domSpan.innerHTML = OpenLayers.i18n(this.emptyText);
        }
    }
});
/**
 * Fusion.Widget.SelectionPanel
 *
 * $Id: SelectionPanel.js 1466 2008-08-22 15:10:15Z aboudreault $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.SelectionPanel
 *
 * A widget to display information about the currently selected set of features.
 *
 * **********************************************************************/

Fusion.Widget.SelectionPanel = OpenLayers.Class(Fusion.Widget,
{
    /**
     * Property: previousIcon
     * {String} The default image for Previous page button.
     */
    previousIcon: 'images/icon_back.gif',

    /**
     * Property: nextIcon
     * {String} The default image for Previous page button.
     */    
    nextIcon: 'images/icon_forward.gif',
    
    initialize : function(widgetTag) {
        //console.log('SelectionPanel.initialize');
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);


        var json = widgetTag.extension;
        if (json.PreviousImageUrl) this.previousIcon = json.PreviousImageUrl;
        if (json.NextImageUrl) this.nextIcon = json.NextImageUrl;
        this.iResultsPerPage = json.ResultsPerPage ? json.ResultsPerPage[0] : 0;
        this.iResultsPerPage = parseInt(this.iResultsPerPage);
        if (isNaN(this.iResultsPerPage) || (this.iResultsPerPage < 0))
            this.iResultsPerPage = 0;

        if (json.SelectionRenderer)
        {
            var renderer = eval(json.SelectionRenderer[0]);
            if (renderer && renderer.prototype.CLASS_NAME && renderer.prototype.CLASS_NAME == "Fusion.Widget.SelectionPanel.SelectionRenderer") {
                this.renderer = new renderer(this);
            } else if (typeof renderer == "function") {
                var renderFunction = renderer;
                this.renderer = new Fusion.Widget.SelectionPanel.SelectionRenderer(this);
                this.renderer.updateSelection = function() {
                    this.getMap().getSelection(
                        OpenLayers.Function.bind(renderFunction));
                };
                this.renderer.clearSelection = false;
            } else {
                this.renderer = new Fusion.Widget.SelectionPanel.SelectionRendererDefault(this);
            }
        } else {
            this.renderer = new Fusion.Widget.SelectionPanel.SelectionRendererDefault(this);
        }
        this.iResultsPerPage = null; // handled by the renderer
        
        if (this.renderer.updateSelection) {
            this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON,
                                           OpenLayers.Function.bind(this.renderer.updateSelection, this.renderer));
        }
        
        if (this.renderer.clearSelection) {
            this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF,
                                           OpenLayers.Function.bind(this.renderer.clearSelection, this.renderer));
        }
    }
});

/* Class: Fusion.Widget.SelectionPanel.SelectionRenderer
 * This is a class designed to help users to create their own renderer
 * for customize display results. 
 */
Fusion.Widget.SelectionPanel.SelectionRenderer = OpenLayers.Class(
{
    /**
     * Property: oSelectionPanel
     * {<Fusion.Widget.SelectionPanel>} The parent widget that uses
     *                                  the renderer.
     */
    oSelection: null,

    /**
     * Property: aiCurrentIndex
     * {Array(int)} The index of the current position for pagination.
     *
     */
    aiCurrentIndex: null,
    
    /**
     * Property: iResultsPerPage
     * {int} The number of results per page for pagination.
     */
    iResultsPerPage: 0,

    /* Constructor: Fusion.Widget.SelectionPanel.SelectionRenderer
     * Constructor for a new <Fusion.Widget.SelectionPanel.SelectionRenderer> instance.
     * 
     * Parameters:
     * selectionPanel - {<Fusion.Widget.SelectionPanel>} The parent widget that uses 
     *                                                   the renderer.
     */   
    initialize: function(selectionPanel) {
        this.oSelectionPanel = selectionPanel;
        this.iResultsPerPage = selectionPanel.iResultsPerPage;
        this.aiCurrentIndex = new Array();
    },
    
    /**
     * Method: updateSelectionObject
     * Helper method to update the aiCurrentIndex array for pagination.
     *
     */
    updatePageIndexes: function() {
        var nLayers = this.oSelection.getNumLayers();
        for (var i=0; i<nLayers; i++) {
            this.aiCurrentIndex[this.oSelection.getLayer(i).getName()] = 0;
        }
    },

    /**
     * Method: getNextPage
     * Get the next batches of features. Wrapper of the getPage() method.
     * This method calcul the startIndex/endIndex of the next batch.
     *
     * Parameters:
     * selectionLayer - {<Fusion.SelectionObject.Layer>} The layer that contains 
     *                                                   the set of features.
     *
     * Returns:
     * {Array(Array)} An array of all features with their properties.
     */
    getNextPage: function(selectionLayer) {
        if (selectionLayer && (this.iResultsPerPage != 0)) {
            var layerName = selectionLayer.getName();
            if (this.aiCurrentIndex[layerName] >= selectionLayer.getNumElements()) {
                this.aiCurrentIndex[layerName] = this.aiCurrentIndex[layerName] - this.iResultsPerPage;
            }
            var iTotalElement = selectionLayer.getNumElements();
            var startIndex = this.aiCurrentIndex[layerName];
            var endIndex = startIndex + this.iResultsPerPage;
            if (endIndex >= iTotalElement) {
                endIndex = iTotalElement;
            }
      
            if (startIndex < 0) {
                startIndex = 0;
            }
            this.aiCurrentIndex[layerName] = endIndex;
            
            // if the last page doesn't contains "iResultsPerPage" elements. Fix the current index for the next getPreviousPage() call.
            var diff = (endIndex - startIndex); 
            if ( diff != this.iResultsPerPage) {
                this.aiCurrentIndex[layerName] = this.aiCurrentIndex[layerName] + (this.iResultsPerPage - diff);
            }
            
            return this.getPage(selectionLayer, startIndex, endIndex);
        }
        return this.getPage(selectionLayer);
    },

    /**
     * Method: getPreviousPage
     * Get the previous batches of features. Wrapper of the getPage() method.
     * This method calcul the startIndex/endIndex of the previous batch.
     *
     * Parameters:
     * selectionLayer - {<Fusion.SelectionObject.Layer>} The layer that contains 
     *                                                   the set of features.
     *
     * Returns:
     * {Array(Array)} An array of all features with their properties.
     */
    getPreviousPage: function(selectionLayer) {
        var layerName = selectionLayer.getName();
        if (selectionLayer && (this.aiCurrentIndex[layerName] != 0) && (this.iResultsPerPage != 0)) {
            
            var iTotalElement = selectionLayer.getNumElements();
            var startIndex = this.aiCurrentIndex[layerName] - (this.iResultsPerPage * 2);
            var endIndex = this.aiCurrentIndex[layerName]  - this.iResultsPerPage;
            if (startIndex < 0) {
                startIndex = 0;
                endIndex = (iTotalElement < this.iResultsPerPage) ? iTotalElement : this.iResultsPerPage;
            }
            
            this.aiCurrentIndex[layerName] = endIndex;
            return this.getPage(selectionLayer, startIndex, endIndex);
        }
        return this.getPage(selectionLayer);
    },

    /**
     * Method: getMap
     * Helper method to obtains the map.
     *
     * Returns:
     * {<Fusion.Maps>} The map that uses the SelectionPanel Widget.
     */
    getMap: function() {
        return this.oSelectionPanel.getMap();
    },

    /**
     * Method: getPage
     * Get a batches of features in a selection.
     *
     * Parameters:
     * selectionLayer - {<Fusion.SelectionObject.Layer>} The layer that contains 
     *                                                   the set of features.
     * startIndex - {int} The index of the first element.
     * endIndex   - {int} The index of the last element.
     *
     * Returns:
     * {Array(Array)} An array of all features with their properties.
     */
    getPage: function(selectionLayer, startIndex, endIndex) {
        var page = false;
        if (selectionLayer) {
            page = new Array();
            startIndex = startIndex ? startIndex : 0;
            endIndex = endIndex ? endIndex : selectionLayer.getNumElements();
            var propNames = selectionLayer.getPropertyNames();
            var index =0;
            for (var i=startIndex; i<endIndex; i++, index++) {
                page[index] = new Array();
                for (var j=0; j<propNames.length; j++) {
                    page[index][j] = selectionLayer.getElementValue(i, j);
                }
            }
        }
        return page;
    },

    /**
     * Method: updateSelection
     * Abstract method that handle the event: Fusion.Event.MAP_SELECTION_ON. This method
     *     should be implemented by all concrete class.
     */
    updateSelection: function() {},
    
    /**
     * Method: clearSelection
     * Abstract method that handle the event: Fusion.Event.MAP_SELECTION_OFF. This method
     *     should be implemented by all concrete class.
     */
    clearSelection: function() {},

    CLASS_NAME: "Fusion.Widget.SelectionPanel.SelectionRenderer"
});

/* Class: Fusion.Widget.SelectionPanel.SelectionRendererDefault
 * This class provide a default behavior for the selection panel.
 * 
 */
Fusion.Widget.SelectionPanel.SelectionRendererDefault = OpenLayers.Class(Fusion.Widget.SelectionPanel.SelectionRenderer,
{
    initialize : function(selectionPanel) {
        Fusion.Widget.SelectionPanel.SelectionRenderer.prototype.initialize.apply(this, [selectionPanel]);

        var d = document.createElement('div');

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'selectionPanelToolbar';

        this.layerList = document.createElement('select');
        this.layerList.className = 'layerSelector';
        this.toolbar.appendChild(this.layerList);
        Event.observe(this.layerList, 'change',
                      OpenLayers.Function.bind(this.renderSelectionFeatures, this));

        this.featureList = document.createElement('select');
        this.featureList.className = 'featureSelector';
        this.toolbar.appendChild(this.featureList);
        Event.observe(this.featureList, 'change',
                      OpenLayers.Function.bind(this.renderFeature, this));

        this.featureDiv = document.createElement('div');
        this.featureDiv.className = 'selectionPanelContent';
        this.clearSelection();

        d.appendChild(this.toolbar);
        d.appendChild(this.featureDiv);
        
        Fusion.addWidgetStyleSheet(this.oSelectionPanel.getLocation() + 'SelectionPanel/SelectionPanel.css');
        this.oSelectionPanel.domObj.appendChild(d);
    },

    updateSelection: function() {
        this.getMap().getSelection(
            OpenLayers.Function.bind(this.renderSelectionLayers, this));
    },

    clearSelection: function() {
        this.layerList.options.length = 0;
        this.featureList.options.length = 0;
        this.oSelection = null;
        Element.addClassName(this.featureDiv, 'noSelection');
        this.featureDiv.innerHTML = OpenLayers.i18n('noSelection');
    },

    renderSelectionLayers: function(oSelection) {
        //TODO: this just gets the first map, we need them all
        this.oSelection = null;
        for (var mapName in oSelection) {
            this.oSelection = oSelection[mapName];
            break;
        }
        
        if (!this.oSelection) {
            return;
        }
 
        //clear the layer list select box of any previous selections
        Element.removeClassName(this.featureDiv, 'noSelection');
        while (this.layerList.length>0) {
          this.layerList.remove(this.layerList.options[0]);
        }
        var nLayers = this.oSelection.getNumLayers();
        for (var i=0; i<nLayers; i++) {
            var layerObj = this.oSelection.getLayer(i);
            //find the legend label from the Map layer objects
            var mapLayers = this.getMap().aMaps[0].aLayers; //TODO: allow multiple maps
            var labelName = layerObj.getName();
            for (var j=0; j<mapLayers.length; ++j) {
              if (mapLayers[j].layerName == labelName) {
                labelName = mapLayers[j].legendLabel;
                break;
              }
            }
            var opt = new Option(labelName, i);
            this.layerList.options[i] = opt;
        }
        this.layerList.selectedIndex = 0;
        this.renderSelectionFeatures();
    },

    renderSelectionFeatures: function() {
        var layerIdx = this.layerList.selectedIndex;
        var layerObj = this.oSelection.getLayer(layerIdx);

        //clear the feature list select box of any previous selections
        while (this.featureList.length>0) {
          this.featureList.remove(this.featureList.options[0]);
        }

        var nElements = layerObj.getNumElements();
        for (var i=0; i<nElements; i++) {
            var opt = new Option(i+1, i);
            this.featureList.options[i] = opt;
        }
        this.featureList.selectedIndex = 0;
        this.renderFeature();
    },

    renderFeature: function() {
        var layerIdx = this.layerList.selectedIndex;
        var featureIdx = this.featureList.selectedIndex;
        var layerObj = this.oSelection.getLayer(layerIdx);
        var nProperties = layerObj.getNumProperties();
        var aNames = layerObj.getPropertyNames();

        var table = document.createElement('table');

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        th.innerHTML = OpenLayers.i18n('attribute');
        tr.appendChild(th);
        var th = document.createElement('th');
        th.innerHTML = OpenLayers.i18n('value');
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        for (var i=0; i<nProperties; i++) {
            var tr = document.createElement('tr');
            if (i%2) {
                Element.addClassName(tr, 'oddRow');
            }
            var th = document.createElement('th');
            th.innerHTML = aNames[i];
            var td = document.createElement('td');
            td.innerHTML = layerObj.getElementValue(featureIdx, i);
            tr.appendChild(th);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        this.featureDiv.innerHTML = '';
        this.featureDiv.appendChild(table);
    }
});



// This could be removed from this file if we want to keep only ONE default renderer.

/* Class: Fusion.Widget.SelectionPanel.SelectionRendererHorizontal
 * This class provide a alternate behavior for the selection panel.
 * Generate a table which have one feature per row.
 * 
 */
Fusion.Widget.SelectionPanel.SelectionRendererHorizontal = OpenLayers.Class(Fusion.Widget.SelectionPanel.SelectionRenderer,
{
    initialize : function(selectionPanel) {
        Fusion.Widget.SelectionPanel.SelectionRenderer.prototype.initialize.apply(this, [selectionPanel]);
        
        var d = document.createElement('div');
        this.featureDiv = document.createElement('div');
        this.featureDiv.innerHTML = 'No Selection';
        Element.addClassName(this.featureDiv, 'noSelection');
        d.appendChild(this.featureDiv);

        if (this.iResultsPerPage != 0) {
            this.previousButton = document.createElement('img');
            this.previousButton.src = this.oSelectionPanel.previousIcon;
            this.previousButton.style.position = "absolute";
            this.previousButton.style.left = "0px";
            this.previousButton.style.padding = "3px";
            Event.observe(this.previousButton, 'click',
                          OpenLayers.Function.bind(this.renderLayers, this, 'prev'));
            this.nextButton = document.createElement('img');
            this.nextButton.src = this.oSelectionPanel.nextIcon;
            this.nextButton.style.position = "absolute";
            this.nextButton.style.right = "0px";
            this.nextButton.style.padding = "3px";
            Event.observe(this.nextButton, 'click',
                          OpenLayers.Function.bind(this.renderLayers, this, 'next'));
            
            d.appendChild(this.previousButton);
            d.appendChild(this.nextButton);
        }

        Element.addClassName(this.featureDiv, 'selectionPanelContent');
        Fusion.addWidgetStyleSheet(this.oSelectionPanel.getLocation() + 'SelectionPanel/SelectionPanel.css');
        this.oSelectionPanel.domObj.appendChild(d);
    },

    updateSelection: function() {
        this.getMap().getSelection(
            OpenLayers.Function.bind(this.renderSelection, this));
    },

    clearSelection: function() {
        this.oSelection = null;
        Element.addClassName(this.featureDiv, 'noSelection');
        this.featureDiv.innerHTML = OpenLayers.i18n('noSelection');
    },
    
    renderSelection: function(oSelection) {
        //TODO: this just gets the first map, we need them all
        this.oSelection = null;
        for (var mapName in oSelection) {
            this.oSelection = oSelection[mapName];
            break;
        }
        this.updatePageIndexes();
        this.renderLayers("next");
    },
    
    renderLayers: function(renderingPage) {
        if (!this.oSelection) {
            return;
        }
        
        Element.removeClassName(this.featureDiv, 'noSelection');
        this.featureDiv.innerHTML = '';
        
        var nLayers = this.oSelection.getNumLayers();
        for (var i=0; i<nLayers; i++) {
            var table = document.createElement('table');
            table.style.borderLeft = "1px solid #CCCCCC";
            table.style.marginBottom = "10px";
            var layerObj = this.oSelection.getLayer(i);
            var aNames = layerObj.getPropertyNames();
            //find the legend label from the Map layer objects
            var mapLayers = this.getMap().aMaps[0].aLayers; //TODO: allow multiple maps
            var labelName = layerObj.getName();
            for (var j=0; j<mapLayers.length; ++j) {
                if (mapLayers[j].layerName == labelName) {
                    labelName = mapLayers[j].legendLabel;
                    break;
                }
            }
            
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            var th = document.createElement('th');
            th.innerHTML = labelName;
            th.colSpan=aNames.length;
            th.style.textAlign = "center";
            tr.appendChild(th);
            thead.appendChild(tr);
            tr = document.createElement('tr');
            for (var j=0; j<aNames.length; j++) {
                th = document.createElement('th');
                th.innerHTML = aNames[j];
                th.style.textAlign = "center";
                tr.appendChild(th);
            }
            thead.appendChild(tr);
            table.appendChild(thead);
            var tbody = document.createElement('tbody');
            var page = (renderingPage == 'next') ? this.getNextPage(layerObj): this.getPreviousPage(layerObj);
            this.renderFeatures(page,tbody);
            table.appendChild(tbody);
            this.featureDiv.appendChild(table);
        }

    },

    renderFeatures: function(page, dom) {
        if (!page)
            return;

        for (var i=0; i<page.length; i++) {
            var tr = document.createElement('tr');
            if (i%2) {
                Element.addClassName(tr, 'oddRow');
            }
            for (var j=0; j<page[i].length; j++) {
                var td = document.createElement('td');
                td.innerHTML = page[i][j];
                tr.appendChild(td);
            }
            dom.appendChild(tr);            
        }
    }
});
/**
 * Fusion.Widget.TaskPane
 *
 * $Id: TaskPane.js 1591 2008-10-10 15:24:02Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /*****************************************************************************
 * Class: Fusion.Widget.TaskPane
 *
 * A utility widget that holds output from other widgets.
 ****************************************************************************/


Fusion.Widget.TaskPane = OpenLayers.Class(Fusion.Widget,
{
    aExecutedTasks: null,   //array of URLs for tasks execcuted in the TaskPane
    nCurrentTask: 0,
    nTasks: 0,
    homeAction: null,
    prevAction: null,
    nextAction: null,
    
    initialize : function(widgetTag)
    {
        //console.log('TaskPane.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        
        this.aExecutedTasks = [];
        this.defHomeIcon = 'images/icon_home.png';
        this.defPrevTaskIcon = 'images/icon_back.png';
        this.defNextTaskIcon = 'images/icon_forward.png';
        this.defTaskListIcon = 'images/icon_tasks.png';
        this.defInitialTask = widgetTag.location + 'TaskPane/TaskPane.html';
              
        var json = widgetTag.extension;
       
        
        if (json.InitialTask) {
            this.initialTask = taskURL = json.InitialTask[0];
        } else {
            this.initialTask = Fusion.getFusionURL() + this.defInitialTask;
        }
        
        if (json.MenuContainer) {
            this.menuName = json.MenuContainer[0];
        }
        
        var divName = 'TaskNav';
        var tmpDiv = document.createElement('div');
        tmpDiv.setAttribute('id', divName);
        this.toolbar = new Jx.Toolbar(tmpDiv,{left:0});

        this.homeAction = new Jx.Action(OpenLayers.Function.bind(this.goHome, this));
        this.toolbar.add(new Jx.Button(this.homeAction, 
            {
            image: this.defHomeIcon, 
            tooltip: OpenLayers.i18n('taskHome')
            }
        ));

        this.prevAction = new Jx.Action(OpenLayers.Function.bind(this.gotoPrevTask, this));
        this.toolbar.add(new Jx.Button(this.prevAction, 
            {
            image: this.defPrevTaskIcon, 
            tooltip: OpenLayers.i18n('prevTask')
            }
        ));

        this.nextAction = new Jx.Action(OpenLayers.Function.bind(this.gotoNextTask, this));
        this.toolbar.add(new Jx.Button(this.nextAction, 
            {
            image: this.defNextTaskIcon, 
            tooltip: OpenLayers.i18n('nextTask')
            }
        ));

        this.taskMenu = new Jx.Menu({image: this.defTaskListIcon, 
                    label: OpenLayers.i18n('taskList'), 
                    right:0});
        Element.addClassName(this.taskMenu.domObj, 'taskMenu');
        Element.addClassName(this.taskMenu.button.domObj, 'jxButtonContentLeft');
        this.toolbar.add(this.taskMenu);
        
        var iframeName = this.sName+'_IFRAME';
        this.iframe = document.createElement('iframe');
        new Jx.Layout(this.iframe);
        this.iframe.setAttribute('name', iframeName);
        this.iframe.setAttribute('id', iframeName);
        this.iframe.setAttribute('frameborder', 0);
        this.iframe.style.border = '0px solid #fff';
        this.oTaskPane = new Jx.Panel({toolbar: tmpDiv, 
                      label: OpenLayers.i18n('taskPane'), 
                      content: this.iframe
        });
        Element.addClassName(this.domObj, 'taskPanePanel');
        Fusion.addWidgetStyleSheet(widgetTag.location + 'TaskPane/TaskPane.css');
        
        this.domObj.appendChild(this.oTaskPane.domObj);
        //we need to trigger an initial resize after the panel
        //is added to the DOM
        this.oTaskPane.domObj.resize();
        
        Fusion.registerForEvent(Fusion.Event.FUSION_INITIALIZED, OpenLayers.Function.bind(this.setTaskMenu, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setContent, this,this.initialTask));
    },
    
    updateButtons: function() {
        this.prevAction.setEnabled(this.nCurrentTask > 0);
        this.nextAction.setEnabled(this.nCurrentTask < this.aExecutedTasks.length - 1);
    },
    
    gotoPrevTask: function() {
        this.nCurrentTask = this.nCurrentTask>0 ? --this.nCurrentTask : 0;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    gotoNextTask: function() {
        this.nCurrentTask = this.nCurrentTask<this.aExecutedTasks.length-1 ? 
                          ++this.nCurrentTask : this.aExecutedTasks.length-1;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    goHome: function() {
        this.nCurrentTask = 0;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    setContent: function(url) {
        if (this.nCurrentTask < this.aExecutedTasks.length) {
            this.aExecutedTasks.splice(this.nCurrentTask, this.aExecutedTasks.length - this.nCurrentTask);
        }
        
        this.aExecutedTasks.push(url);
        ++this.nCurrentTask;
        this.iframe.src = url;
        this.iframe.taskPaneId = this.widgetTag.name;
        this.updateButtons();
    },

    /**
     * Creates a list of tasks to be included in the task menu, once all widgets 
     * have been created.
     *
     */
    setTaskMenu : function() {
        if (this.menuName) {
            var container = this.getMap().widgetSet.getContainerByName(this.menuName);
            if (container) {
                container.createWidgets(this.getMap().widgetSet, this.taskMenu);
            }
        }
    }
   
});
/**
 * Fusion.Widget.ViewOptions
 *
 * $Id: ViewOptions.js 1450 2008-08-06 13:44:51Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /*****************************************************************************
 * Class: Fusion.Widget.ViewOptions
 *
 * A widget to allow selection of the display units for various widgets
 ****************************************************************************/

Fusion.Widget.ViewOptions = OpenLayers.Class(Fusion.Widget, Fusion.Tool.MenuBase,
{
    displayUnits: false,
    options : {
        'imperial': 'Miles', 
        'metric': 'Meters',
        'deg': 'Degrees'
    },

    initialize : function(widgetTag) {
        //console.log('ViewOptions.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.MenuBase.prototype.initialize.apply(this, []);
        
        //this.enable();
        
        var json = widgetTag.extension;
        
        //set up the root menu
        
        for (var key in this.options) {
          var action = new Jx.Action(OpenLayers.Function.bind(this.setViewOptions, this, this.options[key]));
          var menuItem = new Jx.MenuItem(action, {label: OpenLayers.i18n(key)} );
          this.oMenu.add(menuItem);
        }

        this.displayUnits = json.DisplayUnits ? json.DisplayUnits[0] : false;
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setMapUnits, this));
    },
    
    //action to perform when the button is clicked
    activateTool: function(e) {
        this.oMenu.show(e);
    },

    setViewOptions: function(units) {
      this.getMap().setViewOptions(units);
    },
    
    setMapUnits: function() {
      var units = this.displayUnits ? this.displayUnits : this.getMap().getUnits();
      this.setViewOptions(units);
    }
});
/**
 * Fusion.Widget.ViewSize
 *
 * $Id: ViewSize.js 1388 2008-05-06 14:46:04Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /*****************************************************************************
 * Class: Fusion.Widget.ViewSize
 *
 * Display the size of the current view in user-definable units
 ****************************************************************************/


Fusion.Widget.ViewSize = OpenLayers.Class(Fusion.Widget,
{
    defaultTemplate: 'x: {x}, y: {y}',
    domSpan: null,
    
    /* the units to display distances in */
    units: Fusion.UNKNOWN,

    initialize : function(widgetTag) {
        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
             
        this.emptyText = this.domObj.innerHTML;
        
        var json = widgetTag.extension;
        
        this.template = json.Template ? json.Template[0] : this.defaultTemplate;
        this.precision = json.Precision ? parseInt(json.Precision[0]) : -1;
        this.units = json.Units ? Fusion.unitFromName(json.Units[0]) : Fusion.UNKOWN;

        this.domSpan = document.createElement('span');
        this.domSpan.className = 'spanViewSize';
        this.domSpan.innerHTML = this.emptyText;
        this.domObj.innerHTML = '';
        this.domObj.appendChild(this.domSpan);
        
        this.getMap().registerForEvent(Fusion.Event.MAP_RESIZED, OpenLayers.Function.bind(this.updateViewSize, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setUnits, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED, OpenLayers.Function.bind(this.updateViewSize, this));
        this.registerParameter('Units');
    },
    
    updateViewSize: function(e) {
        var map = this.getMap();
        var p = map.getSize();
        if (this.units != Fusion.PIXELS) {
            var gw = map.pixToGeoMeasure(p.w);
            var gh = map.pixToGeoMeasure(p.h);
            if (this.units != Fusion.UNKNOWN) {
                var convFactor = map.getMetersPerUnit();
                gw = Fusion.fromMeter(this.units, gw * convFactor);
                gh = Fusion.fromMeter(this.units, gh * convFactor);
            }
            if (this.precision >= 0) {
                var factor = Math.pow(10,this.precision);
                gw = Math.round(gw * factor)/factor;
                gh = Math.round(gh * factor)/factor;
            }
        }
        var unitAbbr = Fusion.unitAbbr(this.units);
        this.domSpan.innerHTML = this.template.replace('{w}',gw).replace('{h}',gh).replace('{units}', unitAbbr).replace('{units}', unitAbbr);
    },

    setUnits: function() {
      if (this.units == Fusion.UNKNOWN) {
        this.setParameter('Units',this.getMap().getUnits());
      }
      this.updateViewSize();
    },

    setParameter: function(param, value) {
        if (param == 'Units') {
            this.units = Fusion.unitFromName(value);
            this.updateViewSize();
        }
    }
});
/**
 * Fusion.Widget.Zoom
 *
 * $Id: Zoom.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.Zoom
 *
 * A widget that will zoom the map in or out.
 * 
 * **********************************************************************/


Fusion.Widget.Zoom = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    nTolerance : 5,
    nFactor : 2,
    zoomIn: true,
    
    initialize : function(widgetTag)
    {
        //console.log('Zoom.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        this.asCursor = ["url('images/zoomin.cur'),auto",'-moz-zoom-in', 'auto'];
        var json = widgetTag.extension;
        this.nTolerance = json.Tolerance ? json.Tolerance[0] : this.nTolerance;
        this.nFactor = json.Factor ? json.Factor[0] : this.nFactor;
        this.zoomIn = (json.Direction && json.Direction[0] == 'out') ? false : true;
        this.zoomInCursor = ["url('images/zoomin.cur'),auto",'-moz-zoom-in', 'auto'];
        this.zoomOutCursor = ["url('images/zoomout.cur'),auto",'-moz-zoom-out', 'auto'];
        
        this.keypressWatcher = OpenLayers.Function.bind(this.keypressHandler, this);
        
        this.map = this.getMap().oMapOL;
        this.handler = new OpenLayers.Handler.Box(this, {done: this.execute}, {keyMask:0});
        this.shiftHandler = new OpenLayers.Handler.Box(this, {done: this.altZoom}, 
                                        {keyMask:OpenLayers.Handler.MOD_SHIFT});
    },

   /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    activateTool : function()
    {
        //console.log('Zoom.activateTool');
        this.getMap().activateWidget(this);
        Event.observe(document, 'keypress', this.keypressWatcher);
        
    },

    /**
     * activate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     */
    activate : function()
    {
        //console.log('Zoom.activate');
        this.handler.activate();
        this.shiftHandler.activate();
        /*cursor*/
        if (this.zoomIn) {
            this.getMap().setCursor(this.zoomInCursor);
        } else {
            this.getMap().setCursor(this.zoomOutCursor);
        }
        /*icon button*/
        this._oButton.activateTool();
    },

    /**
     * deactivate the widget (listen to mouse events and change cursor)
     * This function should be defined for all functions that register
     * as a widget in the map
     **/
    deactivate : function()
    {
        //console.log('Zoom.deactivate');
        this.handler.deactivate();
        this.shiftHandler.deactivate();
        this.getMap().setCursor('auto');
        /*icon button*/
        this._oButton.deactivateTool();
        Event.stopObserving(document, 'keypress', this.keypressWatcher);
        
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    execute: function (position, altZoom) {
        /* if the last event had a shift modifier, swap the sense of this
                tool - zoom in becomes out and zoom out becomes in */
        var zoomIn = this.zoomIn;
        if (altZoom) {
            zoomIn = !zoomIn;
        }
        if (position instanceof OpenLayers.Bounds) {
            var minXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.left, position.bottom));
            var maxXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.right, position.top));
            var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                            maxXY.lon, maxXY.lat);
            if (zoomIn) {
                this.getMap().setExtents(bounds);
            } else {
                var newWidth = bounds.getWidth();
                var newHeight = bounds.getHeight();
                var currentExtents = this.getMap().getCurrentExtents();
                var currentWidth = currentExtents.getWidth();
                var currentHeight = currentExtents.getHeight();
                var factor = Math.min(newWidth/currentWidth, newHeight/currentHeight);
                var center = bounds.getCenterLonLat();
                this.getMap().zoom(center.lon, center.lat, factor);
            }
        } else { // it's a pixel
            var center = this.map.getLonLatFromPixel(position);
            var factor;
            if(!zoomIn && this.nFactor > 1) {
                factor = 1/this.nFactor;
            } else {
                factor = this.nFactor;
            }
            this.getMap().zoom(center.lon, center.lat, factor);
        }
    },

    /**
        * handler for zooming when the shift key is pressed.  This changes it from in to out or vice versa
        *
        * Parameters:
        * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
        */
    altZoom: function(position) {
        this.execute(position, true);
    },
    
    /**
        * allows run-time setting of widget parameters 
        *
        * Parameters:
        * param - the widget parameter name to set; for the Zoom widget these may be:
        *               'Factgor'
        * value - the value to use for the parameter
        */
    setParameter : function(param, value)
    {
        if (param == "Factor" && value > 0)
        {
            this.nFactor = value;
        }
    },
    
    keypressHandler: function(e) {
        var charCode=(e.charCode)?e.charCode:e.keyCode;
        if (charCode == Event.KEY_ESC) {
            this.handler.deactivate();
            this.handler.activate();
        }
    }
});
/**
 * Fusion.Widget.ZoomOnClick
 *
 * $Id: ZoomOnClick.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ZoomOnClick
 *
 * Zoom the map by a fixed amount when a button is clicked
 * 
 * **********************************************************************/


Fusion.Widget.ZoomOnClick = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    nFactor: 4,
    initialize : function(widgetTag)
    {
        //console.log('ZoomOnClick.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
                
        var json = widgetTag.extension;
        this.nFactor = parseFloat(json.Factor ? json.Factor[0] : this.nFactor);
    },

    /**
     * called when the button is clicked by the Fusion.Tool.ButtonBase widget
     */
    execute : function()
    {
        //console.log('ZoomOnClick.activateTool');
        var center = this.getMap().getCurrentCenter();
        this.getMap().zoom(center.x, center.y, this.nFactor);
    },

    setParameter : function(param, value)
    {
        if (param == "Factor" && value > 0)
        {
            this.nFactor = value;
        }
    }
});
/**
 * Fusion.Widget.ZoomToSelection
 *
 * $Id: ZoomToSelection.js 1377 2008-04-16 19:27:32Z madair $
 *
 * Copyright (c) 2007, DM Solutions Group Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

 /********************************************************************
 * Class: Fusion.Widget.ZoomToSelection
 *
 * Zoom to the current selection, if any
 *
 * **********************************************************************/

Fusion.Widget.ZoomToSelection = OpenLayers.Class(Fusion.Widget, Fusion.Tool.ButtonBase,
{
    initialize : function(widgetTag) {
        //console.log('ZoomToSelection.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, false]);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);

        var json = widgetTag.extension;
        this.maxDimension = json.MaximumZoomDimension ? json.MaximumZoomDimension[0] : -1;
        this.zoomFactor = json.ZoomFactor ? json.ZoomFactor[0] : 2;
 
        this.enable = Fusion.Widget.ZoomToSelection.prototype.enable;
        
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_ON, OpenLayers.Function.bind(this.enable, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_SELECTION_OFF, OpenLayers.Function.bind(this.disable, this));
    },

    /**
     * get the selection from the map (which may not be loaded yet).
     * zoomToSelection is called when the selection is ready.
     */
    execute : function() {
        this.getMap().getSelection(OpenLayers.Function.bind(this.zoomToSelection, this));
    },

    /**
     * set the extents of the map based on the pixel coordinates
     * passed
     * 
     * @param selection the active selection, or null if there is none
     */
    zoomToSelection : function(selection) {
        var map = this.oMap.aMaps[0]; //TODO: allow selection on multple maps
        var ll = selection[map.getMapName()].getLowerLeftCoord();
        var ur = selection[map.getMapName()].getUpperRightCoord();
        //??var zoom_size = Math.min( this.maxDimension, this.zoomFactor * Math.max( Math.abs(ur.x - ll.x), Math.abs(ur.y - ll.y))) / 2;
        var zoom_size = this.zoomFactor * Math.max( Math.abs(ur.x - ll.x), Math.abs(ur.y - ll.y)) / 2;
        var cX = (ur.x + ll.x)/2;
        var cY = (ur.y + ll.y)/2;
        ll.x = cX - zoom_size;
        ur.x = cX + zoom_size;
        ll.y = cY - zoom_size;
        ur.y = cY + zoom_size;
        this.getMap().setExtents(new OpenLayers.Bounds(ll.x,ll.y,ur.x,ur.y));
    },
    
    enable: function() {
        if (this.oMap && this.oMap.hasSelection()) {
            Fusion.Tool.ButtonBase.prototype.enable.apply(this, []);
        } else {
            this.disable();
        }
    }

});
/*
JavaScript ScaleBarTool for MapServer (scalebar.js)

Copyright (c) 2005 Tim Schaub of CommEn Space (http://www.commenspace.org)

This is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the
Free Software Foundation; either version 2.1 of the License, or (at
your option) any later version.

This software is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this software; if not, write to the Free Software Foundation,
Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

v1.3.1 - removed a typo that affected .sbBar with borders (thanks jlivni)
       - scalebar is now centered on .sbWrapper div by default, more css control
       - reduced likelihood of displaying very large numbers
       - added condition to deal with @import styles (thanks dokai)

*/

function ScaleBarTool(scaleDenominator) {
    // default properties
    // may be modified after construction
    // if modified after ScaleBarTool.place(), use ScaleBarTool.update()
    this.scaleDenominator = (scaleDenominator == null) ? 1 : scaleDenominator;
    this.displaySystem = 'metric'; // metric or english supported
    this.minWidth = 100; // pixels
    this.maxWidth = 200; // pixels
    this.divisions = 2;
    this.subdivisions = 2;
    this.showMinorMeasures = false;
    this.abbreviateLabel = false;
    this.singleLine = false;
    this.resolution = 72; // dpi
    this.align = 'center'; // left, center, or right supported
    // create ScaleBarTool elements
    this.container = document.createElement('div');
    this.container.className = 'sbWrapper';
    this.labelContainer = document.createElement('div');
    this.labelContainer.className = 'sbUnitsContainer';
    this.labelContainer.style.position = 'absolute';
    this.graphicsContainer = document.createElement('div');
    this.graphicsContainer.style.position = 'absolute';
    this.graphicsContainer.className = 'sbGraphicsContainer';
    this.numbersContainer = document.createElement('div');
    this.numbersContainer.style.position = 'absolute';
    this.numbersContainer.className = 'sbNumbersContainer';
    // private functions
    // put in some markers and bar pieces so style attributes can be grabbed
    // this is a solution for Safari support
    var markerMajor = document.createElement('div');
    markerMajor.className = 'sbMarkerMajor';
    this.graphicsContainer.appendChild(markerMajor);
    var markerMinor = document.createElement('div');
    markerMinor.className = 'sbMarkerMinor';
    this.graphicsContainer.appendChild(markerMinor);
    var barPiece = document.createElement('div');
    barPiece.className = 'sbBar';
    this.graphicsContainer.appendChild(barPiece);
    var barPieceAlt = document.createElement('div');
    barPieceAlt.className = 'sbBarAlt';
    this.graphicsContainer.appendChild(barPieceAlt);
}
ScaleBarTool.prototype.update = function(scaleDenominator) {
    if(scaleDenominator != null) {
        this.scaleDenominator = scaleDenominator;
    };
    // local functions (and object constructors)
    function HandsomeNumber(smallUglyNumber, bigUglyNumber, sigFigs) {
        var sigFigs = (sigFigs == null) ? 10 : sigFigs;
        var bestScore = Number.POSITIVE_INFINITY;
        var bestTieBreaker = Number.POSITIVE_INFINITY;
        // if all else fails, return a small ugly number
        var handsomeValue = smallUglyNumber;
        var handsomeNumDec = 3;
        // try the first three comely multiplicands (in order of comliness)
        for(var halvingExp = 0; halvingExp < 3; ++halvingExp) {
            var comelyMultiplicand = Math.pow(2, (-1 * halvingExp));
            var maxTensExp = Math.floor(Math.log(bigUglyNumber / comelyMultiplicand) / Math.LN10);
            for(var tensExp = maxTensExp; tensExp > (maxTensExp - sigFigs + 1); --tensExp) {
                var numDec = Math.max(halvingExp - tensExp, 0);
                var testMultiplicand = comelyMultiplicand * Math.pow(10, tensExp);
                // check if there is an integer multiple of testMultiplicand between smallUglyNumber and bigUglyNumber
                if((testMultiplicand * Math.floor(bigUglyNumber / testMultiplicand)) >= smallUglyNumber) {
                    // check if smallUglyNumber is an integer multiple of testMultiplicand
                    if(smallUglyNumber % testMultiplicand == 0) {
                        var testMultiplier = smallUglyNumber / testMultiplicand;
                    }
                    // otherwise go for the smallest integer multiple between small and big
                    else {
                        var testMultiplier = Math.floor(smallUglyNumber / testMultiplicand) + 1;
                    }
                    // test against the best (lower == better)
                    var testScore = testMultiplier + (2 * halvingExp);
                    var testTieBreaker = (tensExp < 0) ? (Math.abs(tensExp) + 1) : tensExp;
                    if((testScore < bestScore) || ((testScore == bestScore) && (testTieBreaker < bestTieBreaker))) {
                        bestScore = testScore;
                        bestTieBreaker = testTieBreaker;
                        handsomeValue = (testMultiplicand * testMultiplier).toFixed(numDec);
                        handsomeNumDec = numDec;
                    }
                }
            }
        }
        this.value = handsomeValue;
        this.score = bestScore;
        this.tieBreaker = bestTieBreaker;
        this.numDec = handsomeNumDec;
    };
    HandsomeNumber.prototype.toString = function() {
        return this.value.toString();
    };
    HandsomeNumber.prototype.valueOf = function() {
        return this.value;
    };
    function styleValue(aSelector, styleKey) {
        // returns an integer value associated with a particular selector and key
        // given a stylesheet with .someSelector {border: 2px solid red}
        // styleValue('.someSelector', 'borderWidth') returns 2
        var aValue = 0;
        if(document.styleSheets) {
            for(var sheetIndex = document.styleSheets.length - 1; sheetIndex >= 0; --sheetIndex) {
                var aSheet = document.styleSheets[sheetIndex];
                if(!aSheet.disabled) {
                    var allRules;
                    if(typeof(aSheet.cssRules) == 'undefined') {
                        if(typeof(aSheet.rules) == 'undefined') {
                            // can't get rules, assume zero
                            return 0;
                        }
                        else {
                            allRules = aSheet.rules;
                        }
                    }
                    else {
                        allRules = aSheet.cssRules;
                    }
                    for(var ruleIndex = 0; ruleIndex < allRules.length; ++ruleIndex) {
                        var aRule = allRules[ruleIndex];
                        if(aRule.selectorText && (aRule.selectorText.toLowerCase() == aSelector.toLowerCase())) {
                            if(aRule.style[styleKey] != '') {
                                aValue = parseInt(aRule.style[styleKey]);
                            }
                        }
                    }
                }
            }
        }
        // if the styleKey was not found, the equivalent value is zero
        return aValue ? aValue : 0;
    };
    function formatNumber(aNumber, numDecimals) {
        numDecimals = (numDecimals) ? numDecimals : 0;
        var formattedInteger = '' + Math.round(aNumber);
        var thousandsPattern = /(-?[0-9]+)([0-9]{3})/;
        while(thousandsPattern.test(formattedInteger)) {
            formattedInteger = formattedInteger.replace(thousandsPattern, '$1,$2');
        }
        if(numDecimals > 0) {
            var formattedDecimal = Math.floor(Math.pow(10, numDecimals) * (aNumber - Math.round(aNumber)));
            if(formattedDecimal == 0) {
                return formattedInteger;
            }
            else {
                return formattedInteger + '.' + formattedDecimal;
            }
        }
        else {
            return formattedInteger;
        }
    };
    // update the container title (for displaying scale as a tooltip)
    this.container.title = 'scale 1:' + formatNumber(this.scaleDenominator);
    // measurementProperties holds display units, abbreviations,
    // and conversion to inches (since we're using dpi) - per measurement sytem
    var measurementProperties = new Object();
    measurementProperties.english = {
        units: ['miles', 'feet', 'inches'],
        abbr: ['mi', 'ft', 'in'],
        inches: [63360, 12, 1]
    };
    measurementProperties.metric = {
        units: ['kilometers', 'meters', 'centimeters'],
        abbr: ['km', 'm', 'cm'],
        inches: [39370.07874, 39.370079, 0.393701]
    };
    // check each measurement unit in the display system
    var comparisonArray = new Array();
    for(var unitIndex = 0; unitIndex < measurementProperties[this.displaySystem].units.length; ++unitIndex) {
        comparisonArray[unitIndex] = new Object();
        var pixelsPerDisplayUnit = this.resolution * measurementProperties[this.displaySystem].inches[unitIndex] / this.scaleDenominator;
        var minSDDisplayLength = (this.minWidth / pixelsPerDisplayUnit) / (this.divisions * this.subdivisions);
        var maxSDDisplayLength = (this.maxWidth / pixelsPerDisplayUnit) / (this.divisions * this.subdivisions);
        // add up scores for each marker (even if numbers aren't displayed)
        for(var valueIndex = 0; valueIndex < (this.divisions * this.subdivisions); ++valueIndex) {
            var minNumber = minSDDisplayLength * (valueIndex + 1);
            var maxNumber = maxSDDisplayLength * (valueIndex + 1);
            var niceNumber = new HandsomeNumber(minNumber, maxNumber);
            comparisonArray[unitIndex][valueIndex] = {value: (niceNumber.value / (valueIndex + 1)), score: 0, tieBreaker: 0, numDec: 0, displayed: 0};
            // now tally up scores for all values given this subdivision length
            for(var valueIndex2 = 0; valueIndex2 < (this.divisions * this.subdivisions); ++valueIndex2) {
                displayedValuePosition = niceNumber.value * (valueIndex2 + 1) / (valueIndex + 1);
                niceNumber2 = new HandsomeNumber(displayedValuePosition, displayedValuePosition);
                var isMajorMeasurement = ((valueIndex2 + 1) % this.subdivisions == 0);
                var isLastMeasurement = ((valueIndex2 + 1) == (this.divisions * this.subdivisions));
                if((this.singleLine && isLastMeasurement) || (!this.singleLine && (isMajorMeasurement || this.showMinorMeasures))) {
                    // count scores for displayed marker measurements
                    comparisonArray[unitIndex][valueIndex].score += niceNumber2.score;
                    comparisonArray[unitIndex][valueIndex].tieBreaker += niceNumber2.tieBreaker;
                    comparisonArray[unitIndex][valueIndex].numDec = Math.max(comparisonArray[unitIndex][valueIndex].numDec, niceNumber2.numDec);
                    comparisonArray[unitIndex][valueIndex].displayed += 1;
                }
                else {
                    // count scores for non-displayed marker measurements
                    comparisonArray[unitIndex][valueIndex].score += niceNumber2.score / this.subdivisions;
                    comparisonArray[unitIndex][valueIndex].tieBreaker += niceNumber2.tieBreaker / this.subdivisions;
                }
            }
            // adjust scores so numbers closer to 1 are preferred for display
            var scoreAdjustment = (unitIndex + 1) * comparisonArray[unitIndex][valueIndex].tieBreaker / comparisonArray[unitIndex][valueIndex].displayed;
            comparisonArray[unitIndex][valueIndex].score *= scoreAdjustment;
        }
    }
    // get the value (subdivision length) with the lowest cumulative score
    var subdivisionDisplayLength = null;
    var displayUnits = null;
    var displayUnitsAbbr = null;
    var subdivisionPixelLength = null;
    var bestScore = Number.POSITIVE_INFINITY;
    var bestTieBreaker = Number.POSITIVE_INFINITY;
    var numDec = 0;
    for(var unitIndex = 0; unitIndex < comparisonArray.length; ++unitIndex) {
        for(valueIndex in comparisonArray[unitIndex]) {
            if((comparisonArray[unitIndex][valueIndex].score < bestScore) || ((comparisonArray[unitIndex][valueIndex].score == bestScore) && (comparisonArray[unitIndex][valueIndex].tieBreaker < bestTieBreaker))) {
                bestScore = comparisonArray[unitIndex][valueIndex].score;
                bestTieBreaker = comparisonArray[unitIndex][valueIndex].tieBreaker;
                subdivisionDisplayLength = comparisonArray[unitIndex][valueIndex].value;
                numDec = comparisonArray[unitIndex][valueIndex].numDec;
                displayUnits = measurementProperties[this.displaySystem].units[unitIndex];
                displayUnitsAbbr = measurementProperties[this.displaySystem].abbr[unitIndex];
                pixelsPerDisplayUnit = this.resolution * measurementProperties[this.displaySystem].inches[unitIndex] / this.scaleDenominator;
                subdivisionPixelLength = pixelsPerDisplayUnit * subdivisionDisplayLength; // round before use in style
            }
        }
    }
    // determine offsets for graphic elements
    var xOffsetMarkerMajor = (styleValue('.sbMarkerMajor', 'borderLeftWidth') + styleValue('.sbMarkerMajor', 'width') + styleValue('.sbMarkerMajor', 'borderRightWidth')) / 2;
    var xOffsetMarkerMinor = (styleValue('.sbMarkerMinor', 'borderLeftWidth') + styleValue('.sbMarkerMinor', 'width') + styleValue('.sbMarkerMinor', 'borderRightWidth')) / 2;
    var xOffsetBar = (styleValue('.sbBar', 'borderLeftWidth') + styleValue('.sbBar', 'borderRightWidth')) / 2;
    var xOffsetBarAlt = (styleValue('.sbBarAlt', 'borderLeftWidth') + styleValue('.sbBarAlt', 'borderRightWidth')) / 2;
    // support for browsers without the Document.styleSheets property (Opera)
    if(!document.styleSheets) {
        // this is a two part hack, one for the offsets here and one for the css below
        xOffsetMarkerMajor = 0.5;
        xOffsetMarkerMinor = 0.5;
    }
    // clean out any old content from containers
    while(this.labelContainer.hasChildNodes()) {
        this.labelContainer.removeChild(this.labelContainer.firstChild);
    }
    while(this.graphicsContainer.hasChildNodes()) {
        this.graphicsContainer.removeChild(this.graphicsContainer.firstChild);
    }
    while(this.numbersContainer.hasChildNodes()) {
        this.numbersContainer.removeChild(this.numbersContainer.firstChild);
    }
    // create all divisions
    var aMarker, aBarPiece, numbersBox, xOffset;
    var alignmentOffset = {
        left: 0,
        center: (-1 * this.divisions * this.subdivisions * subdivisionPixelLength / 2),
        right: (-1 * this.divisions * this.subdivisions * subdivisionPixelLength)
    };
    var xPosition = 0 + alignmentOffset[this.align];
    var markerMeasure = 0;
    for(var divisionIndex = 0; divisionIndex < this.divisions; ++divisionIndex) {
        // set xPosition and markerMeasure to start of division
        xPosition = divisionIndex * this.subdivisions * subdivisionPixelLength;
        xPosition += alignmentOffset[this.align];
        markerMeasure = (divisionIndex == 0) ? 0 : ((divisionIndex * this.subdivisions) * subdivisionDisplayLength).toFixed(numDec);
        // add major marker
        aMarker = document.createElement('div');
        aMarker.className = 'sbMarkerMajor';
        aMarker.style.position = 'absolute';
        aMarker.style.overflow = 'hidden';
        aMarker.style.left = Math.round(xPosition - xOffsetMarkerMajor) + 'px';
        aMarker.appendChild(document.createTextNode(' '));
        this.graphicsContainer.appendChild(aMarker);
        // add initial measure
        if(!this.singleLine) {
            numbersBox = document.createElement('div');
            numbersBox.className = 'sbNumbersBox';
            numbersBox.style.position = 'absolute';
            numbersBox.style.overflow = 'hidden';
            numbersBox.style.textAlign = 'center';
            if(this.showMinorMeasures) {
                numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
                numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
            }
            else {
                numbersBox.style.width = Math.round(this.subdivisions * subdivisionPixelLength * 2) + 'px';
                numbersBox.style.left = Math.round(xPosition - (this.subdivisions * subdivisionPixelLength)) + 'px';
            }
            numbersBox.appendChild(document.createTextNode(markerMeasure));
            this.numbersContainer.appendChild(numbersBox);
        }
        // create all subdivisions
        for(var subdivisionIndex = 0; subdivisionIndex < this.subdivisions; ++subdivisionIndex) {
            aBarPiece = document.createElement('div');
            aBarPiece.style.position = 'absolute';
            aBarPiece.style.overflow = 'hidden';
            aBarPiece.style.width = Math.round(subdivisionPixelLength) + 'px';
            if((subdivisionIndex % 2) == 0) {
                aBarPiece.className = 'sbBar';
                aBarPiece.style.left = Math.round(xPosition - xOffsetBar) + 'px';
            }
            else {
                aBarPiece.className = 'sbBarAlt';
                aBarPiece.style.left = Math.round(xPosition - xOffsetBarAlt) + 'px';
            }
            aBarPiece.appendChild(document.createTextNode(' '));
            this.graphicsContainer.appendChild(aBarPiece);
            // add minor marker if not the last subdivision
            if(subdivisionIndex < (this.subdivisions - 1)) {
                // set xPosition and markerMeasure to end of subdivision
                xPosition = ((divisionIndex * this.subdivisions) + (subdivisionIndex + 1)) * subdivisionPixelLength;
                xPosition += alignmentOffset[this.align];
                markerMeasure = (divisionIndex * this.subdivisions + subdivisionIndex + 1) * subdivisionDisplayLength;
                aMarker = document.createElement('div');
                aMarker.className = 'sbMarkerMinor';
                aMarker.style.position = 'absolute';
                aMarker.style.overflow = 'hidden';
                aMarker.style.left = Math.round(xPosition - xOffsetMarkerMinor) + 'px';
                aMarker.appendChild(document.createTextNode(' '));
                this.graphicsContainer.appendChild(aMarker);
                if(this.showMinorMeasures && !this.singleLine) {
                    // add corresponding measure
                    numbersBox = document.createElement('div');
                    numbersBox.className = 'sbNumbersBox';
                    numbersBox.style.position = 'absolute';
                    numbersBox.style.overflow = 'hidden';
                    numbersBox.style.textAlign = 'center';
                    numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
                    numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
                    numbersBox.appendChild(document.createTextNode(markerMeasure));
                    this.numbersContainer.appendChild(numbersBox);
                }
            }
        }
    }
    // set xPosition and markerMeasure to end of divisions
    xPosition = (this.divisions * this.subdivisions) * subdivisionPixelLength;
    xPosition += alignmentOffset[this.align];
    markerMeasure = ((this.divisions * this.subdivisions) * subdivisionDisplayLength).toFixed(numDec);
    // add the final major marker
    aMarker = document.createElement('div');
    aMarker.className = 'sbMarkerMajor';
    aMarker.style.position = 'absolute';
    aMarker.style.overflow = 'hidden';
    aMarker.style.left = Math.round(xPosition - xOffsetMarkerMajor) + 'px';
    aMarker.appendChild(document.createTextNode(' '));
    this.graphicsContainer.appendChild(aMarker);
    // add final measure
    if(!this.singleLine) {
        numbersBox = document.createElement('div');
        numbersBox.className = 'sbNumbersBox';
        numbersBox.style.position = 'absolute';
        numbersBox.style.overflow = 'hidden';
        numbersBox.style.textAlign = 'center';
        if(this.showMinorMeasures) {
            numbersBox.style.width = Math.round(subdivisionPixelLength * 2) + 'px';
            numbersBox.style.left = Math.round(xPosition - subdivisionPixelLength) + 'px';
        }
        else {
            numbersBox.style.width = Math.round(this.subdivisions * subdivisionPixelLength * 2) + 'px';
            numbersBox.style.left = Math.round(xPosition - (this.subdivisions * subdivisionPixelLength)) + 'px';
        }
        numbersBox.appendChild(document.createTextNode(markerMeasure));
        this.numbersContainer.appendChild(numbersBox);
    }
    // add content to the label container
    var labelBox = document.createElement('div');
    labelBox.style.position = 'absolute';
    var labelText;
    if(this.singleLine) {
        labelText = markerMeasure;
        labelBox.className = 'sbLabelBoxSingleLine';
        labelBox.style.top = '-0.6em';
        labelBox.style.left = (xPosition + 10) + 'px';
    }
    else {
        labelText = '';
        labelBox.className = 'sbLabelBox';
        labelBox.style.textAlign = 'center';
        labelBox.style.width = Math.round(this.divisions * this.subdivisions * subdivisionPixelLength) + 'px';
        labelBox.style.left = Math.round(alignmentOffset[this.align]) + 'px';
        labelBox.style.overflow = 'hidden';
    }
    if(this.abbreviateLabel) {
        labelText += ' ' + displayUnitsAbbr;
    }
    else {
        labelText += ' ' + displayUnits;
    }
    labelBox.appendChild(document.createTextNode(labelText));
    this.labelContainer.appendChild(labelBox);
    // support for browsers without the Document.styleSheets property (Opera)
    if(!document.styleSheets) {
        // override custom css with default
        var defaultStyle = document.createElement('style');
        defaultStyle.type = 'text/css';
        var styleText = '.sbBar {top: 0px; background: #666666; height: 1px; border: 0;}';
        styleText += '.sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}';
        styleText += '.sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}';
        styleText += '.sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}';
        styleText += '.sbLabelBox {top: -16px;}';
        styleText += '.sbNumbersBox {top: 7px;}';
        defaultStyle.appendChild(document.createTextNode(styleText));
        document.getElementsByTagName('head').item(0).appendChild(defaultStyle);
    }
    // append the child containers to the parent container
    this.container.appendChild(this.graphicsContainer);
    this.container.appendChild(this.labelContainer);
    this.container.appendChild(this.numbersContainer);
};
ScaleBarTool.prototype.place = function(elementId) {
    if(elementId == null) {
        document.body.appendChild(this.container);
    }
    else {
        var anElement = document.getElementById(elementId);
        if(anElement != null) {
            anElement.appendChild(this.container);
        }
    }
    this.update();
};
