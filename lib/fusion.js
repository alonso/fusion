/**
 * Fusion
 *
 * $Id: fusion.js 1619 2008-10-27 19:35:59Z madair $
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

/**
 * declare global namespace object for Jx library to use
 */
var Jx = {};

/**
 * reverse inheritance logic to allow for delayed loading of dependencies.
 * Under normal circumstances, Object.extend from Prototype would be used,
 * but in Fusion, widget code is loaded before base class code and the
 * extend function won't work until all the base class code is available.
 * DEPRECATED
 */
Object.inheritFrom = function(destination, source, args) {
    var parent;
    if(typeof source == "function") {
        // get the prototype of the superclass
        parent = source.prototype;
    } else {
        // in this case we're extending with the prototype
        parent = source;
    }
    for (property in parent) {
        if (typeof destination[property] == 'undefined') {
            destination[property] = parent[property];
        }
    }
    parent.initialize.apply(destination, args);
};

(function() {
    /**
     * Before creating the OpenLayers namespace, check to see if
     * OpenLayers.singleFile is true.  This occurs if the
     * OpenLayers/SingleFile.js script is included before this one - as is the
     * case with single file builds.
     */
    var singleFile = (typeof Fusion == "object" && Fusion.singleFile);
    
    /* set to true if you want to use the compressed version of the core files,
     * currently this saves about 100kb and quite a few HTTP connections so it is
     * faster, but less convenient if you want to debug one of the core files
     */
    var useCompressed = false;

    /**
     * Namespace: Fusion
     * declare global namespace object for Fusion library to use
     */
    window.Fusion = {
        
/***************************************************************************
* Class: Fusion.Tools
* 
* A set of utility classes that provide common tools for applications
***************************************************************************/
    Tool: {},

/***************************************************************************
* Class: Fusion.Widget
* 
* A set of classes that implement the functionlity required for applications
***************************************************************************/
    Widget: {},

/***************************************************************************
* Class: Fusion.Event
* 
* A class to provide for event handling at application runtime
***************************************************************************/
    Event: {lastEventId: 1},

/***************************************************************************
* Class: Fusion.Lib
* 
* A set of classes to provide core funtionality
***************************************************************************/
    Lib: {},

/***************************************************************************
* Class: Fusion.Maps
* 
* A set of classes that implement mapping functionality for various server 
* technologies.
***************************************************************************/
    Maps: {},

/***************************************************************************
* Class: Fusion.Constant
* 
* Application scope constants
***************************************************************************/
    Constant: {},
    
    applicationDefinition: null,
    
    /**
     * URL to the configuration file to use for this application.  The
     * configuration file must be located on the same domain as the
     * application template.
     */
    sConfigFileURL : "",
    
    sWebAgentURL : "",
    sWebTierURL : "",
    sRedirectScript : "",  
    bForceRedirect : false,
    sScriptLang : "",
    locale : 'en',
    Strings: {},    //locale specific strings
    
    /** URL to the directory from which fusion.js was loaded */
    fusionURL: null,
    
    /** 
     * configuration object that holds the server configuration as
     * loaded from fusion/config.xml
     */
    configuration: null,
    
    /* broker instance for communicating with the mapagent */
    oBroker: null,
    
    /** An array of scripts that are queued to be loaded */
    aScripts : [],
    /** An array of scripts that are currently being loaded */
    aLoadingScripts: [],
    /** The current state during initialization of the application */
    loadState: null,
 
    /** API loading has not begun */
    UNLOADED: 0,
    /** Load the configuration file for the application */
    LOAD_CONFIG: 1,
    /** Load the widget files required by the application */
    LOAD_WIDGETS: 2,
    /** Loading is complete */
    LOAD_COMPLETE: 3,
    
    /** unit related stuff */
    UNKNOWN: 0,
    INCHES: 1,
    FEET: 2,
    YARDS: 3,
    MILES: 4,
    NAUTICALMILES: 5,
    MILLIMETERS: 6,
    CENTIMETERS: 7,
    METERS: 8,
    KILOMETERS: 9,
    DEGREES: 10,
    DECIMALDEGREES: 11,
    DMS: 12,
    PIXELS: 13,
    aUnitPerMeter: [1.0, /* 0 - UNKNOWN */
                    39.37, /* 1 - INCHES */
                    3.2808, /* 2 - FEET */
                    1.0936133, /* 3 - YARDS */
                    0.00062137, /* 4 - MILES */
                    0.000539956803, /* 5 - NAUTICAL MILES */
                    1000.0, /* 6 - MILLIMETERS */
                    100.0, /* 7 - CENTIMETERS */
                    1.0, /* 8- METERS */
                    0.001, /* 9 - KILOMETERS */
                    0.000009044, /* 10 - DEGREES */
                    0.000009044, /* 11 - DECIMALDEGREES */
                    0.000009044, /* 12 - DMS */
                    1.0 /* 13 - PIXELS */
                    ],
    aMeterPerUnit: [1.0, /* 0 - UNKNOWN */
                    0.0254, /* 1 - INCHES */
                    0.3048, /* 2 - FEET */
                    0.9144, /* 3 - YARDS */
                    1609.344, /* 4 - MILES */
                    1852, /* 5 - NAUTICAL MILES */
                    0.001, /* 6 - MILLIMETERS */
                    0.01, /* 7 - CENTIMETERS */
                    1.0, /* 8- METERS */
                    1000.0, /* 9 - KILOMETERS */
                    111061.75033, /* 10 - DEGREES */
                    111061.75033, /* 11 - DECIMALDEGREES */
                    111061.75033, /* 12 - DMS */
                    1.0 /* 13 - PIXELS */],
    aUnitNames: ['Unknown','Inches', 'Feet', 'Yards', 'Miles', 'Nautical Miles',
                 'Millimeters', 'Centimeters', 'Meters', 'Kilometers', 
                 'Degrees', 'Decimal Degrees', 'Degrees Minutes Seconds', 'Pixels'],
    aUnitAbbr: ['unk', 'in', 'ft', 'yd', 'mi', 'nm', 
                'mm', 'cm', 'm', 'km', 
                '&deg;', '&deg;', '&deg;', 'px'],
    
    /**
     * Function: initialize
     *
     * Initialize the Fusion application.
     *
     * @param {Object} options
     *
     * Optional paramters that can be passed to initialize are:
     *
     * {String} applicationDefinition - a URL or resource ID 
     *          for an ApplicationDefinition file
     * {String} sessionId - a session id to start the application
     *          with.  Normally, applications are started without
     *          a session id and create one.  However, sometimes
     *          it is desirable to use an existing session.
     */
    initialize : function(options) {
        options = options || {};
        var sessionIdParam = this.getQueryParam('Session');
        this.sessionId = sessionIdParam || (options.sessionId || null);
        
        if (options.applicationDefinitionURL) {
            this.applicationDefinitionURL = options.applicationDefinitionURL;            
        } else {
            var queryAppDef = this.getQueryParam('ApplicationDefinition');
            if (queryAppDef) {
                this.applicationDefinitionURL = queryAppDef.split('+').join(' ');
                this.appDefJson = null;   //wipe out any preloaded AppDef in a single file build
            } else {
                this.applicationDefinitionURL = 'ApplicationDefinition.xml';
            }
        }
        if (Fusion._singleFile) {
            //override this method since OL is loaded in the fusion file
            OpenLayers._getScriptLocation = function() {
                return Fusion.fusionURL + 'lib/OpenLayers/';
            }
        }
        this.initializeLocale();

        this.sWebagentURL = "";
        this.sScriptLang = "";

        /*
                 * if the application has been loaded from the same host as
                 * fusion is installed in, then technically we don't need to
                 * use the redirect script because we conform to the 
                 * Same Origin Policy for XmlHttpRequest to work.
                 */
        var test = window.location.protocol+'//'+window.location.host;
        var configUrl = 'config.json';
        if ( ( ((this.fusionURL.indexOf("http://") < 0) && (this.fusionURL.indexOf("https://") < 0)) ||
              (this.fusionURL.indexOf(test,0) == 0) ) && !(this.bForceRedirect)) {
            this.sRedirectScript = '';
        } else {
            this.sRedirectScript = 'redirect.php';
            configUrl += '&method=get';
        }
        
        /*script language*/
        this.sScriptLang = 'php';
        
        if (Fusion.configuration) {
            //config.json loaded via single file build
            this.serverSet();
        } else {
            var options = {
                onSuccess: OpenLayers.Function.bind(this.getConfigCB, this),
                onFailure: OpenLayers.Function.bind(this.serverFailed, this),
                method: 'get'
            };
            this.ajaxRequest(configUrl, options);
        }
    },
    
    initializeLocale: function(locale) {
      //provide compatibility between OL2.6 and older patched version
      OpenLayers.String.translate = OpenLayers.i18n;
      
      this.locale = locale ? locale : window._FusionLocale;
      OpenLayers.Lang.setCode(this.locale);
      
      //check if strings are defined for specified locale, if not, set them to the default locale
      if (!OpenLayers.Lang[this.locale]) {
        OpenLayers.Lang[this.locale] = OpenLayers.Lang[OpenLayers.String.defaultLangCode];
      }
      if (!Fusion.Strings[this.locale]) {
        Fusion.Strings[this.locale] = Fusion.Strings[OpenLayers.String.defaultLangCode];
      }
      OpenLayers.Util.extend(OpenLayers.Lang[this.locale], Fusion.Strings[this.locale]);
    },
    
    /**
     * Function: setLoadState
     *
     * set the current initialization state of the application.
     * Depending on the state, this will cause various scripts
     * to be loaded.
     *
     * Parameter {Integer} state
     *
     * the new loading state
     */
    setLoadState: function(state) {
        //console.log('setLoadState: ' + state);
        this.loadState = state;
        switch(state) {
            case this.LOAD_CONFIG:
                //console.log('load config');
                this.loadConfig();
                break;
            case this.LOAD_WIDGETS:
                //console.log('load widgets');
                this.loadQueuedScripts();
                break;
            case this.LOAD_COMPLETE:
                //console.log('load complete');
                this.applicationDefinition.create();
                this.triggerEvent(Fusion.Event.FUSION_INITIALIZED);
                break;
        }
    },
    /**
     * Function: loadQueuedScripts
     *
     * load any scripts that have been queued for loading.  As the
     * scripts load, they are removed.  When all queued scripts have
     * been loaded, the load state is advanced.  If any of the loaded
     * scripts require other scripts (for inheritance), they will be
     * queued and loaded before the load state is advanced.
     */
    loadQueuedScripts: function() {
        //with the compressed version, all scripts are already laoded so just 
        //increment the load state
        if (this.aScripts.length == 0) {
            this.setLoadState(this.loadState+1);
            return;
        }

        this.aLoadingScripts = [];
        //make a separate array of what is actually being loaded to keep track
        //of them (require adds to aScripts so we can't use that array
        //directly).
        for (var i=0; i<this.aScripts.length; i++) {
            this.aLoadingScripts[i] = this.aScripts[i];
        }
        this.aScripts = [];
        //add the script elements to the DOM to cause them to load.
        for (var i=0; i<this.aLoadingScripts.length; i++) {
            document.getElementsByTagName('head')[0].appendChild(this.aLoadingScripts[i]);
        }
        
        //if IE or Safari
        this.checkLoadInterval = window.setInterval(
                OpenLayers.Function.bind(this.checkLoadingScripts, this), 500);
    },
    
    /**
     * Function: queueScript
     *
     * Insert a new script into the loading queue.  The URL should be relative
     * to the Fusion base url.  The script will not actually be loaded until
     * loadQueuedScripts is called.
     *
     * Parameter: {String} url 
     *
     * The url of the script.
     */
    queueScript : function(url) {
        if(!document.getElementById(url) && !this.aScripts[url]) {
            var script = document.createElement('script');
            script.defer = false;
            script.type = "text/javascript";
            //TODO: test url to see if it needs to come from fusion
            script.id = url;
            script.src = this.getFusionURL() + url;
            script.onload = OpenLayers.Function.bind(this.scriptLoaded, this, url);
            script.onerror = OpenLayers.Function.bind(this.scriptFailed, this, script.src);
            this.aScripts[url] = script;
            this.aScripts.push(script);
        }
    },
    /**
     * Function: scriptFailed
     *
     * Called when a script fails to load for some reason.
     *
     * Parameter: url 
     *
     * {String} the url that failed to load
     *
     * TODO: the application probably won't work if a script fails to load
     * so we need to decide how to inform the user and fail gracefully.
     */
    scriptFailed: function(url) {
        Fusion.reportError(new Fusion.Error(Fusion.Error.FATAL, 
                          OpenLayers.i18n('scriptFailed',{'script':url})));
    },
    
    /**
     * Function: scriptLoaded
     *
     * a script has loaded.  It is removed from the various tracking
     * arrays.  When all requested scripts have been loaded, we check
     * to see if any scripts where required by the ones just loaded.
     * If yes, then we loadQueuedScripts again, otherwise we advance
     * the load state.
     *
     * Parameter: url 
     *
     * {String} the url of the script that was loaded.
     */
    scriptLoaded: function(url) {
        for (var i=0; i<this.aLoadingScripts.length;i++) {
            if (this.aLoadingScripts[i].id == url) {
                this.aLoadingScripts.splice(i,1);
            }
        }
        if (this.aLoadingScripts.length == 0) {
            window.clearInterval(this.checkLoadInterval);
            if (this.aScripts.length > 0) {
                this.loadQueuedScripts();
            } else {
                this.setLoadState(this.loadState+1);
            }
        }
    },
    /**
     * Function: checkLoadingScripts
     *
     * check if scripts have loaded.  In IE, scripts don't seem to fire the onload
     * event.  Safari also seems to have some problems.
     */
    checkLoadingScripts: function() {
        var agt=navigator.userAgent.toLowerCase();
        for (var i=this.aLoadingScripts.length-1; i>=0; i--) {
            var s = this.aLoadingScripts[i];
            if (agt.indexOf('safari') != -1) {
                var widgetName = s.id.substring(s.id.lastIndexOf('/')+1, s.id.indexOf('.js'));
                var b;
                eval ('b = typeof Fusion.Widget.'+widgetName+' == "function";');
                if (b) {
                    this.scriptLoaded(s.id);
                }
            } else if (s.readyState == 'loaded' ||
                s.readyState == 'complete') {
                this.scriptLoaded(s.id);
            }
        }
    },
    /**
     * Function: loadConfig
     *
     * asynchronously load the application definition through the broker and config
     * manager.
     */
    loadConfig : function() {
        var mapAgentUrl = this.getConfigurationItem('mapguide', 'mapAgentUrl');
        if (mapAgentUrl) {
            this.oBroker = new Fusion.Lib.MGBroker();
            var url = mapAgentUrl;
            if (this.sRedirectScript) {
                url = this.sRedirectScript + '?s=' + url;
                this.oBroker.method = 'post';
            } else {
                this.oBroker.method = 'get';
            }
            this.oBroker.setSiteURL(url, "Anonymous", "");
        }
        this.applicationDefinition = new Fusion.Lib.ApplicationDefinition(this.sessionId);
        if (Fusion.appDefJson) {
            Fusion.setLoadState(Fusion.LOAD_WIDGETS);
        }
    },
    
    /**
     * Function: getConfigCB
     *
     * the server has returned the application configuration file that
     * contains enough information to bootstrap the application.
     *
     * Parameter {Object} r 
     * an XMLHttpRequest object
     */
    getConfigCB : function(r) {
        if (r.responseText) {  
            eval("this.configuration="+r.responseText);
            this.serverSet();
        } else {
            //console.log('Error parsing configuration file, it is not valid somehow?');
            alert(OpenLayers.i18n('configParseError'));
        }
    },
    
    /**
     * Function: serverSet
     *
     * the server has returned the application configuration file that
     * contains enough information to bootstrap the application.
     *
     * Parameter {Object} r 
     * an XMLHttpRequest object
     */
    serverSet : function() {
        var s = this.configuration.mapguide.webTierUrl;
        /* if it is set, use it ... otherwise assume fusion is installed in
                  * the default location and compute the web tier url from that
                  */
        if (s) {
            var nLength = s.length;
            var slastChar =  s.charAt((nLength-1));
            if (slastChar != '/') {
                s = s + "/";
            }
        } else {
            var idx = this.fusionURL.lastIndexOf('fusion');
            if (idx == -1) {
              s = this.fusionURL + "../";   //loaded relatively from within fusion directory
            } else {
              s = this.fusionURL.substring(0, idx);
            }
        }
        this.configuration.mapguide.webTierUrl = s;
        this.configuration.mapguide.mapAgentUrl = s + 'mapagent/mapagent.fcgi';
        
        //trigger loading stuff ...
        this.setLoadState(this.LOAD_CONFIG);
    },
    
    /**
     * Function: serverFailed
     *
     * the application failed to load the application configuration file.
     * Not much point in continuing, but we can inform the user why this
     * happened.
     *
     * Parameter: {Object} r
     *  
     * the XMLHttpRequest object
     *
     * TODO: do something more useful in here?
     */
    serverFailed: function(r) {
        //console.log('error loading server configuration file');
        alert(OpenLayers.i18n('configLoadError')); 
    },
    
    /**
     * Function: ajaxRequest
     *
     * convenience function to issue an XmlHttpRequest to the server relative
     * to the Fusion installation.
     *
     * Parameter: {String} scriptURL
     * 
     * the URL (relative to Fusion) to request
     *
     * Parameter: {Object} options
     *
     * optional parameters to send with the request, passed directly to
     * Prototype's Ajax.Request function
     */
    ajaxRequest: function(scriptURL, options) {
        //console.log('options.parameters='+options.parameters);
        var r = this.getRedirectScript();
        if (r != '') {
            r = r + '?s=';
        }
        var url = r + this.getFusionURL() + scriptURL;
        if (!options.onException) {
            options.onException = OpenLayers.Function.bind(this.ajaxException, this);
        }
        if (!options.contentType) {
          options.contentType = 'application/x-www-form-urlencoded';
        }
        if (options.parameters && typeof options.parameters == 'string') {
          if (options.parameters.indexOf('?') < 0) {
              options.parameters = '?' + options.parameters;
          }
        }
        new OpenLayers.Ajax.Request( url, options);
    },
    
    /**
     * Function: ajaxException
     *
     * trap exceptions produced in handling an ajax response.
     *
     * Parameter: {XmlHttpRequest} r
     *
     * Parameter: {Exception} e
     */
    ajaxException: function(r, e) {
        this.reportError(new Fusion.Error(Fusion.Error.WARNING, 
            OpenLayers.i18n('ajaxError', {'exception':e.message, 
                                          'filename':e.fileName, 
                                          'line':e.lineNumber,
                                          'response': r.transport.responseText
                                          })));
    },
    
     /**
     * Function: convertXML
     *
     * Optionally convert XML to JSON using a server-side script
     * for requests that aren't available in JSON.
     *
     * Parameter: {XmlHttpRequest} r
     *
     * the XmlHttpRequest object
     *
     * Parameter: json
     *
     * boolean indicator if the content is JSON or not.
     *
     * Parameter: callback
     *
     * callback method to be executed on success and will be passed a parsed json object
    */
    getXmlAsJson: function(url, callback) {
        var options = {
            method: 'get',
            onSuccess: OpenLayers.Function.bind(this.xml2json, this, callback),
            onFailure: OpenLayers.Function.bind(this.ajaxException, this)
        };
        new OpenLayers.Ajax.Request(url, options);
    },
    
    xml2json: function(callback, r, json) {
      if (json) {
        var o;
        eval("o="+r.responseText);
        callback(o);
      } else {
        if (r.status >= 400) {
            Fusion.reportError(new Fusion.Error(Fusion.Error.FATAL, 
              'xml2json: invalid XML document: ' + r.statusText  + " : " + r.request.url));
            return;
        }
          
        var options = {
          onSuccess: callback,
          method: 'post',
          parameters: {'xml': encodeURIComponent(r.responseText)}
        };
        var sl = Fusion.getScriptLanguage();
        Fusion.ajaxRequest('common/'+sl+'/Xml2JSON.'+sl, options);
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
        if (this.applicationDefinition) {
            map = this.applicationDefinition.getMapByName(name);
        }
        return map;
    },
    
    /**
     * Function: getMapById
     *
     * return a map widget that is associated with the given dom element
     * by id.
     *
     * Parameter: {String} id
     *
     * The map id to return
     *
     * Returns: {Object} a map object or null if not found.
     */
    getMapById : function(id) {
        var map = null;
        if (this.applicationDefinition) {
            map = this.applicationDefinition.getMapById(id);
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
        if (this.applicationDefinition) {
            map = this.applicationDefinition.getMapByIndice(indice);
        }
        return map;
    },
    
    /**
     * Function: getWidgetById
     *
     * return a reference to a widget by the id of the DOM
     * Element that it was created in.
     *
     * Parameter: {String} id
     *
     * the DOM id to get the widget for
     *
     * Returns: {<Fusion.Widget>} the widget or null
     */
    getWidgetById: function(id) {
        /*
        var widget = null;
        if (this.applicationDefinition) {
            widget = this.applicationDefinition.getWidgetById(id);
        }
        return widget;
        */
        var d = $(id);
        if (d && d.widget) {
            return d.widget;
        } else {
            return null;
        }
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
        if (this.applicationDefinition) {
            widgets = this.applicationDefinition.getWidgetsByType(type);
        }
        return widgets;
    },
    
    getSearchDefinitions: function() {
        if (this.applicationDefinition) {
            return this.applicationDefinition.searchDefinitions;
        } else {
            return {};
        }
    },
    
    getSearchCategories: function() {
        if (this.applicationDefinition) {
            return this.applicationDefinition.searchCategories;
        } else {
            return {};
        }
    },
    
    getApplicationDefinitionURL: function() { return this.applicationDefinitionURL; },

  /**
     * Function: getApplicationURL
     *
     * returns the applicaiton's absolute URL minus the filename.html part
     */
    getApplicationURL: function() { 
      var path = window.location.pathname;
      var idx = path.lastIndexOf('/');
      if (idx>=0) {
        path = path.substr(0,idx+1);
      }
      return window.location.protocol + "//" + window.location.host + path;
    },
    
    getFusionURL: function() {return this.fusionURL;},
    
    getConfigurationItem: function(arch, key) { 
        if (this.configuration[arch] && this.configuration[arch][key]) { 
            return this.configuration[arch][key]; 
        } 
        return null; 
    },
    
    getScriptLanguage: function() { return this.configuration.general.scriptLanguage; },
    
    getRedirectScript: function() { return this.sRedirectScript; },
    
    getBroker: function() { return this.oBroker; },
    
    require: function(url) { this.queueScript(url); },
    
    reportError: function(o) { this.triggerEvent(Fusion.Event.FUSION_ERROR, o); },
    
    unitFromName: function(unit) {
        switch(unit.toLowerCase()) {
            case 'unknown':
                return Fusion.UNKNOWN;
            case 'inches':
            case 'inch':
            case 'in':
                return Fusion.INCHES;
            case 'feet':
            case 'ft':
                return Fusion.FEET;
            case 'yards':
            case 'yard':
            case 'yd':
                return Fusion.YARDS;
            case 'miles':
            case 'mile':
            case 'mi':
                return Fusion.MILES;
            case 'nautical miles':
            case 'nautical mile':
            case 'nm':
                return Fusion.NAUTICALMILES;
            case 'millimeters':
            case 'millimeter':
            case 'mm':
                return Fusion.MILLIMETERS;
            case 'centimeters':
            case 'centimeter':
            case 'cm':
                return Fusion.CENTIMETERS;
            case 'meters':
            case 'meter':
            case 'm':
                return Fusion.METERS;
            case 'kilometers':
            case 'kilometer':
            case 'km':
                return Fusion.KILOMETERS;
                break;
            case 'degrees':
            case 'degree':
            case 'deg':
                return Fusion.DEGREES;
            case 'decimal degrees':
            case 'dd':
                return Fusion.DECIMALDEGREES;
            case 'degrees minutes seconds':
            case 'dms':
                return Fusion.DMS;
            case 'pixels':
            case 'pixel':
            case 'px':
                return Fusion.PIXELS;
            default:
                Fusion.UNKNOWN;
        }
    },
    
    unitName: function(unit) {
        if (unit >= Fusion.UNKNOWN && unit <= Fusion.PIXELS) {
          return (Fusion.aUnitNames[unit]);
        }
        return 'Unknown';
    },
    unitAbbr: function(unit) {
        if (unit >= Fusion.UNKNOWN && unit <= Fusion.PIXELS) {
          return (Fusion.aUnitAbbr[unit]);
        }
        return 'Unk';
    },

    toMeter: function(unit, value) {
        if (unit == Fusion.UNKNOWN) {
            return value;
        }
        if (unit > Fusion.UNKNOWN && unit < Fusion.PIXELS) {
          return (Fusion.aMeterPerUnit[unit] * value);
        }
        return false;
    },
    fromMeter: function(unit, value) {
        if (unit == Fusion.UNKNOWN) {
            return value;
        }
        if (unit > Fusion.UNKNOWN && unit < Fusion.PIXELS) {
            return (Fusion.aUnitPerMeter[unit] * value);
        }
        return false;
    },
    convert: function(unitsIn, unitsOut, value) {
        if (unitsIn >= Fusion.UNKNOWN && unitsIn < Fusion.PIXELS && 
            unitsOut >= Fusion.UNKNOWN && unitsOut < Fusion.PIXELS) {
            return Fusion.fromMeter(unitsOut, Fusion.toMeter(unitsIn, value));
        }
        return false;
    },
    
  /**
     * initializes the meters per unit values when a new map is loaded.  Some systems make different 
     * assumptions for the conversion of degrees to meters so this makes sure both Fusion and
     * OpenLayers are using the same value.
     *
     * @param metersPerUnit the value returned by LoadMap.php for meters per unit
     */
    initUnits: function(metersPerUnit) {
        var eps = 1000;
        if (Math.abs(metersPerUnit-Fusion.aMeterPerUnit[Fusion.DEGREES]) < eps){
            Fusion.aMeterPerUnit[Fusion.DEGREES] = metersPerUnit;
            Fusion.aMeterPerUnit[Fusion.DECIMALDEGREES] = metersPerUnit;
            Fusion.aMeterPerUnit[Fusion.DMX] = metersPerUnit;
            var inverse = 1.0/metersPerUnit;
            Fusion.aUnitPerMeter[Fusion.DEGREES] = inverse;
            Fusion.aUnitPerMeter[Fusion.DECIMALDEGREES] = inverse;
            Fusion.aUnitPerMeter[Fusion.DMX] = inverse;
            
            var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * metersPerUnit;
            OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
            OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
        }
    },
    
  /**
     * find the OpenLayers units identifier given the Fusion metersPerUnit value
     *
     * @param metersPerUnit the value returned by LoadMap.php for meters per unit
     */
    getClosestUnits: function(metersPerUnit) {
        var units = "degrees";
        var minDiff = 100000000;
        for (var key in OpenLayers.INCHES_PER_UNIT) {
            var newDiff = Math.abs((metersPerUnit * 39.3701) - OpenLayers.INCHES_PER_UNIT[key]);
            if(newDiff < minDiff)
            {
                minDiff = newDiff;
                units = key;
            }
        }
        return units;
    },

    addWidgetStyleSheet: function(url) {
        var lnk = document.createElement('link');
        var hd = document.getElementsByTagName('HEAD')[0];
        hd.insertBefore(lnk, Fusion._scriptObject);
        lnk.type = 'text/css';
        lnk.rel='stylesheet';
        lnk.href = Fusion.getFusionURL()+url;
    },

    parseQueryString: function() {
        this.queryParams = [];
        var s=window.location.search;
        if (s!='') {
            s=s.substring( 1 );
            var p=s.split('&');
            for (var i=0;i<p.length;i++) {
                var q=p[i].split('=');
                this.queryParams[q[0].toLowerCase()]=decodeURIComponent(q[1]);
            }
        }
        return this.queryParams;
    },

    getQueryParam: function(p) {
        if (!this.queryParams) {
            this.parseQueryString();
        }
        p = p.toLowerCase();
        if (this.queryParams[p]) {
            return this.queryParams[p];
        } else {
            return '';
        }
    },
    
            /**
         * Property: _scriptName
         * {String} Relative path of this script.
         */
    _scriptName: "lib/fusion",

        /**
         * Function: _getScriptLocation
         * Return the path to this script.
         *
         * Returns:
         * {String} Path to this script
         */
        _getScriptLocation: function () {
            Fusion.fusionURL = null;
            var scriptName = Fusion._scriptName;
         
            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                    var index = src.lastIndexOf(scriptName); 
                    if (index > -1) {
                        Fusion.fusionURL = src.slice(0, index);
                        Fusion._scriptObject = scripts[i];
                        
                if ( (Fusion.fusionURL.indexOf("http://")<0) && 
                     (Fusion.fusionURL.indexOf("https://")<0) ) {
                  if (Fusion.fusionURL.slice(0,1) == "/") {
                    Fusion.fusionURL = window.location.protocol + "//" + window.location.host + Fusion.fusionURL;
                  } else {
                    var newLoc = window.location.href;
                    if (newLoc.slice(-1) != "/") {
                      newLoc = newLoc.slice(0,newLoc.lastIndexOf("?"));
                      newLoc = newLoc.slice(0,newLoc.lastIndexOf("/")+1);
                    }
                    Fusion.fusionURL = newLoc + Fusion.fusionURL;
                  }
                } 
                        break;
                    }
                }
            }
            if (!this.fusionURL) {
                alert('failed to determine fusionURL.  Initialization aborted');
                return;
            }
            return Fusion.fusionURL;
        }
    };

    /*********************************************************************************/
    /* actual bootstrap execution code follows */
    
    Fusion._singleFile = singleFile;
    var host = Fusion._getScriptLocation();    
    Jx.baseURL = host + 'jx/';
    Jx.COMBINED_CSS = true;
    
    //determine the language to use and add resource bundles to be loaded to the core scripts
    var locale = navigator.language ?
                  navigator.language.substring(0,2):    //e.g. en-CA becomes just en                  
                  navigator.userLanguage.substring(0,2);//only use the prefix part for now, 
    var s = window.location.search.toLowerCase();
    var idx = s.indexOf('locale=');
    if (idx>0) {
      locale = s.substring(idx+7,idx+9);
    }
    window._FusionLocale = locale;
    
    if (!Fusion._singleFile) {
        if (useCompressed) {
            var coreScripts = ['lib/OpenLayers/OpenLayers.js',
                                'jx/lib/jx_compressed.js',
                                'lib/fusion-compressed.js',
                                'lib/excanvas/excanvas-compressed.js'];
        } else {
            var coreScripts = ['lib/OpenLayers/OpenLayers.js',
                                'jx/lib/jx_combined.js',
                                'lib/excanvas/excanvas-compressed.js',
                                'lib/EventMgr.js',
                                'lib/Error.js',
                                'lib/ApplicationDefinition.js',
                                'lib/MGBroker.js',
                                'lib/Widget.js',
                                'lib/ButtonBase.js',
                                'lib/MenuBase.js',
                                'lib/ButtonTool.js',
                                'lib/CanvasTool.js',
                                'lib/ClickTool.js',
                                'lib/RectTool.js',
                                'lib/Map.js',
                                'lib/Search.js',
                                'text/en/strings.json'];
        }
        
        if (locale != 'en') {
            coreScripts.push('lib/OpenLayers/Lang/'+locale+'.js');
            coreScripts.push('text/'+locale+'/strings.json');
        }
        
        var agent = navigator.userAgent;
        var docWrite = (agent.match("MSIE") || agent.match("Safari"));
        if (docWrite) {
            var allScriptTags = new Array(coreScripts.length);
        }
        for (var i = 0; i < coreScripts.length; i++) {
            if (docWrite) {
                allScriptTags[i] = "<script src='" + host + coreScripts[i] +
                                   "'></script>"; 
            } else {
                var s = document.createElement("script");
                s.src = host + coreScripts[i];
                var h = document.getElementsByTagName("head").length ? 
                           document.getElementsByTagName("head")[0] : 
                           document.body;
                h.appendChild(s);
            }
        }
        if (docWrite) {
            document.write(allScriptTags.join(""));
        }
    }
})();


