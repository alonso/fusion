/*

  OpenLayers.js -- OpenLayers Map Viewer Library

  Copyright 2005-2008 MetaCarta, Inc., released under the Clear BSD license.
  Please see http://svn.openlayers.org/trunk/openlayers/license.txt
  for the full text of the license.

  Includes compressed code under the following licenses:

  (For uncompressed versions of the code used please see the
  OpenLayers SVN repository: <http://openlayers.org/>)

*/

/* Contains portions of Prototype.js:
 *
 * Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
 *--------------------------------------------------------------------------*/

/**  
*  
*  Contains portions of Rico <http://openrico.org/>
* 
*  Copyright 2005 Sabre Airline Solutions  
*  
*  Licensed under the Apache License, Version 2.0 (the "License"); you
*  may not use this file except in compliance with the License. You
*  may obtain a copy of the License at
*  
*         http://www.apache.org/licenses/LICENSE-2.0  
*  
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
*  implied. See the License for the specific language governing
*  permissions and limitations under the License. 
*
**/

/* ======================================================================
    OpenLayers/SingleFile.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

var OpenLayers = {
    singleFile: true
};


/* ======================================================================
    OpenLayers.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/* 
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Lang/en.js
 */ 

(function() {
    /**
     * Before creating the OpenLayers namespace, check to see if
     * OpenLayers.singleFile is true.  This occurs if the
     * OpenLayers/SingleFile.js script is included before this one - as is the
     * case with single file builds.
     */
    var singleFile = (typeof OpenLayers == "object" && OpenLayers.singleFile);
    
    /**
     * Namespace: OpenLayers
     * The OpenLayers object provides a namespace for all things OpenLayers
     */
    window.OpenLayers = {
        
        /**
         * Property: _scriptName
         * {String} Relative path of this script.
         */
        _scriptName: (!singleFile) ? "lib/OpenLayers.js" : "OpenLayers.js",

        /**
         * Function: _getScriptLocation
         * Return the path to this script.
         *
         * Returns:
         * {String} Path to this script
         */
        _getScriptLocation: function () {
            var scriptLocation = "";
            var scriptName = OpenLayers._scriptName;
         
            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                    var index = src.lastIndexOf(scriptName); 
                    // set path length for src up to a query string
                    var pathLength = src.lastIndexOf('?');
                    if (pathLength < 0) {
                        pathLength = src.length;
                    }
                    // is it found, at the end of the URL?
                    if ((index > -1) && (index + scriptName.length == pathLength)) {
                        scriptLocation = src.slice(0, pathLength - scriptName.length);
                        break;
                    }
                }
            }
            return scriptLocation;
         }
    };
    /**
     * OpenLayers.singleFile is a flag indicating this file is being included
     * in a Single File Library build of the OpenLayers Library.
     * 
     * When we are *not* part of a SFL build we dynamically include the
     * OpenLayers library code.
     * 
     * When we *are* part of a SFL build we do not dynamically include the 
     * OpenLayers library code as it will be appended at the end of this file.
      */
    if(!singleFile) {
        var jsfiles = new Array(
            "OpenLayers/Util.js",
            "OpenLayers/BaseTypes.js",
            "OpenLayers/BaseTypes/Class.js",
            "OpenLayers/BaseTypes/Bounds.js",
            "OpenLayers/BaseTypes/Element.js",
            "OpenLayers/BaseTypes/LonLat.js",
            "OpenLayers/BaseTypes/Pixel.js",
            "OpenLayers/BaseTypes/Size.js",
            "OpenLayers/Console.js",
            "OpenLayers/Tween.js",
            "Rico/Corner.js",
            "Rico/Color.js",
            "OpenLayers/Ajax.js",
            "OpenLayers/Events.js",
            "OpenLayers/Projection.js",
            "OpenLayers/Map.js",
            "OpenLayers/Layer.js",
            "OpenLayers/Icon.js",
            "OpenLayers/Marker.js",
            "OpenLayers/Marker/Box.js",
            "OpenLayers/Popup.js",
            "OpenLayers/Tile.js",
            "OpenLayers/Tile/Image.js",
            "OpenLayers/Tile/WFS.js",
            "OpenLayers/Layer/Image.js",
            "OpenLayers/Layer/SphericalMercator.js",
            "OpenLayers/Layer/EventPane.js",
            "OpenLayers/Layer/FixedZoomLevels.js",
            "OpenLayers/Layer/Google.js",
            "OpenLayers/Layer/VirtualEarth.js",
            "OpenLayers/Layer/Yahoo.js",
            "OpenLayers/Layer/HTTPRequest.js",
            "OpenLayers/Layer/Grid.js",
            "OpenLayers/Layer/MapGuide.js",
            "OpenLayers/Layer/MapServer.js",
            "OpenLayers/Layer/MapServer/Untiled.js",
            "OpenLayers/Layer/KaMap.js",
            "OpenLayers/Layer/MultiMap.js",
            "OpenLayers/Layer/Markers.js",
            "OpenLayers/Layer/Text.js",
            "OpenLayers/Layer/WorldWind.js",
            "OpenLayers/Layer/WMS.js",
            "OpenLayers/Layer/WMS/Untiled.js",
            "OpenLayers/Layer/GeoRSS.js",
            "OpenLayers/Layer/Boxes.js",
            "OpenLayers/Layer/TMS.js",
            "OpenLayers/Layer/TileCache.js",
            "OpenLayers/Popup/Anchored.js",
            "OpenLayers/Popup/AnchoredBubble.js",
            "OpenLayers/Popup/Framed.js",
            "OpenLayers/Popup/FramedCloud.js",
            "OpenLayers/Feature.js",
            "OpenLayers/Feature/Vector.js",
            "OpenLayers/Feature/WFS.js",
            "OpenLayers/Handler.js",
            "OpenLayers/Handler/Click.js",
            "OpenLayers/Handler/Hover.js",
            "OpenLayers/Handler/Point.js",
            "OpenLayers/Handler/Path.js",
            "OpenLayers/Handler/Polygon.js",
            "OpenLayers/Handler/Feature.js",
            "OpenLayers/Handler/Drag.js",
            "OpenLayers/Handler/RegularPolygon.js",
            "OpenLayers/Handler/Box.js",
            "OpenLayers/Handler/MouseWheel.js",
            "OpenLayers/Handler/Keyboard.js",
            "OpenLayers/Control.js",
            "OpenLayers/Control/Attribution.js",
            "OpenLayers/Control/Button.js",
            "OpenLayers/Control/ZoomBox.js",
            "OpenLayers/Control/ZoomToMaxExtent.js",
            "OpenLayers/Control/DragPan.js",
            "OpenLayers/Control/Navigation.js",
            "OpenLayers/Control/MouseDefaults.js",
            "OpenLayers/Control/MousePosition.js",
            "OpenLayers/Control/OverviewMap.js",
            "OpenLayers/Control/KeyboardDefaults.js",
            "OpenLayers/Control/PanZoom.js",
            "OpenLayers/Control/PanZoomBar.js",
            "OpenLayers/Control/ArgParser.js",
            "OpenLayers/Control/Permalink.js",
            "OpenLayers/Control/Scale.js",
            "OpenLayers/Control/ScaleLine.js",
            "OpenLayers/Control/LayerSwitcher.js",
            "OpenLayers/Control/DrawFeature.js",
            "OpenLayers/Control/DragFeature.js",
            "OpenLayers/Control/ModifyFeature.js",
            "OpenLayers/Control/Panel.js",
            "OpenLayers/Control/SelectFeature.js",
            "OpenLayers/Control/NavigationHistory.js",
            "OpenLayers/Geometry.js",
            "OpenLayers/Geometry/Rectangle.js",
            "OpenLayers/Geometry/Collection.js",
            "OpenLayers/Geometry/Point.js",
            "OpenLayers/Geometry/MultiPoint.js",
            "OpenLayers/Geometry/Curve.js",
            "OpenLayers/Geometry/LineString.js",
            "OpenLayers/Geometry/LinearRing.js",        
            "OpenLayers/Geometry/Polygon.js",
            "OpenLayers/Geometry/MultiLineString.js",
            "OpenLayers/Geometry/MultiPolygon.js",
            "OpenLayers/Geometry/Surface.js",
            "OpenLayers/Renderer.js",
            "OpenLayers/Renderer/Elements.js",
            "OpenLayers/Renderer/SVG.js",
            "OpenLayers/Renderer/VML.js",
            "OpenLayers/Layer/Vector.js",
            "OpenLayers/Layer/PointTrack.js",
            "OpenLayers/Layer/GML.js",
            "OpenLayers/Style.js",
            "OpenLayers/StyleMap.js",
            "OpenLayers/Rule.js",
            "OpenLayers/Filter.js",
            "OpenLayers/Filter/FeatureId.js",
            "OpenLayers/Filter/Logical.js",
            "OpenLayers/Filter/Comparison.js",
            "OpenLayers/Format.js",
            "OpenLayers/Format/XML.js",
            "OpenLayers/Format/GML.js",
            "OpenLayers/Format/KML.js",
            "OpenLayers/Format/GeoRSS.js",
            "OpenLayers/Format/WFS.js",
            "OpenLayers/Format/WKT.js",
            "OpenLayers/Format/OSM.js",
            "OpenLayers/Format/SLD.js",
            "OpenLayers/Format/SLD/v1.js",
            "OpenLayers/Format/SLD/v1_0_0.js",
            "OpenLayers/Format/Text.js",
            "OpenLayers/Format/JSON.js",
            "OpenLayers/Format/GeoJSON.js",
            "OpenLayers/Format/WMC.js",
            "OpenLayers/Format/WMC/v1.js",
            "OpenLayers/Format/WMC/v1_0_0.js",
            "OpenLayers/Format/WMC/v1_1_0.js",
            "OpenLayers/Layer/WFS.js",
            "OpenLayers/Control/MouseToolbar.js",
            "OpenLayers/Control/NavToolbar.js",
            "OpenLayers/Control/EditingToolbar.js",
            "OpenLayers/Lang.js",
            "OpenLayers/Lang/en.js"
        ); // etc.

        var agent = navigator.userAgent;
        var docWrite = (agent.match("MSIE") || agent.match("Safari"));
        if(docWrite) {
            var allScriptTags = new Array(jsfiles.length);
        }
        var host = OpenLayers._getScriptLocation() + "lib/";    
        for (var i = 0; i < jsfiles.length; i++) {
            if (docWrite) {
                allScriptTags[i] = "<script src='" + host + jsfiles[i] +
                                   "'></script>"; 
            } else {
                var s = document.createElement("script");
                s.src = host + jsfiles[i];
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

/**
 * Constant: VERSION_NUMBER
 */
OpenLayers.VERSION_NUMBER="$Revision: 6819 $";
/* ======================================================================
    OpenLayers/BaseTypes.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 * @requires OpenLayers/BaseTypes/LonLat.js
 * @requires OpenLayers/BaseTypes/Size.js
 * @requires OpenLayers/BaseTypes/Pixel.js
 * @requires OpenLayers/BaseTypes/Bounds.js
 * @requires OpenLayers/BaseTypes/Element.js
 * @requires OpenLayers/Lang/en.js
 */
 
/** 
 * Header: OpenLayers Base Types
 * OpenLayers custom string, number and function functions are described here.
 */

/**
 * Namespace: OpenLayers.String
 * Contains convenience functions for string manipulation.
 */
OpenLayers.String = {

    /**
     * APIFunction: startsWith
     * Test whether a string starts with another string. 
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {Sring} The substring to look for.
     *  
     * Returns:
     * {Boolean} The first string starts with the second.
     */
    startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * Test whether a string contains another string.
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     * 
     * Returns:
     * {Boolean} The first string contains the second.
     */
    contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },
    
    /**
     * APIFunction: trim
     * Removes leading and trailing whitespace characters from a string.
     * 
     * Parameters:
     * str - {String} The (potentially) space padded string.  This string is not
     *     modified.
     * 
     * Returns:
     * {String} A trimmed version of the string with all leading and 
     *     trailing spaces removed.
     */
    trim: function(str) {
        return str.replace(/^\s*(.*?)\s*$/, "$1");    
    },
    
    /**
     * APIFunction: camelize
     * Camel-case a hyphenated string. 
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} The string to be camelized.  The original is not modified.
     * 
     * Returns:
     * {String} The string, camelized
     */
    camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i = 1; i < oStringList.length; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    
    /**
     * APIFunction: format
     * Given a string with tokens in the form ${token}, return a string
     *     with tokens replaced with properties from the given context
     *     object.  Represent a literal "${" by doubling it, e.g. "${${".
     *
     * Parameters:
     * template - {String} A string with tokens to be replaced.  A template
     *     has the form "literal ${token}" where the token will be replaced
     *     by the value of context["token"].
     * context - {Object} An optional object with properties corresponding
     *     to the tokens in the format string.  If no context is sent, the
     *     window object will be used.
     * args - {Array} Optional arguments to pass to any functions found in
     *     the context.  If a context property is a function, the token
     *     will be replaced by the return from the function called with
     *     these arguments.
     *
     * Returns:
     * {String} A string with tokens replaced from the context object.
     */
    format: function(template, context, args) {
        if(!context) {
            context = window;
        }
        var tokens = template.split("${");
        var item, last, replacement;
        for(var i=1; i<tokens.length; i++) {
            item = tokens[i];
            last = item.indexOf("}"); 
            if(last > 0) {
                replacement = context[item.substring(0, last)];
                if(typeof replacement == "function") {
                    replacement = args ?
                        replacement.apply(null, args) :
                        replacement();
                }
                tokens[i] = replacement + item.substring(++last); 
            } else {
                tokens[i] = "${" + item;
            }
        }
        return tokens.join("");
    }

};

if (!String.prototype.startsWith) {
    /**
     * APIMethod: String.startsWith
     * *Deprecated*. Whether or not a string starts with another string. 
     * 
     * Parameters:
     * sStart - {Sring} The string we're testing for.
     *  
     * Returns:
     * {Boolean} Whether or not this string starts with the string passed in.
     */
    String.prototype.startsWith = function(sStart) {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                                {'newMethod':'OpenLayers.String.startsWith'}));
        return OpenLayers.String.startsWith(this, sStart);
    };
}

if (!String.prototype.contains) {
    /**
     * APIMethod: String.contains
     * *Deprecated*. Whether or not a string contains another string.
     * 
     * Parameters:
     * str - {String} The string that we're testing for.
     * 
     * Returns:
     * {Boolean} Whether or not this string contains with the string passed in.
     */
    String.prototype.contains = function(str) {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                                  {'newMethod':'OpenLayers.String.contains'}));
        return OpenLayers.String.contains(this, str);
    };
}

if (!String.prototype.trim) {
    /**
     * APIMethod: String.trim
     * *Deprecated*. Removes leading and trailing whitespace characters from a string.
     * 
     * Returns:
     * {String} A trimmed version of the string - all leading and 
     *          trailing spaces removed
     */
    String.prototype.trim = function() {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                                      {'newMethod':'OpenLayers.String.trim'}));
        return OpenLayers.String.trim(this);
    };
}

if (!String.prototype.camelize) {
    /**
     * APIMethod: String.camelize
     * *Deprecated*. Camel-case a hyphenated string. 
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     * 
     * Returns:
     * {String} The string, camelized
     */
    String.prototype.camelize = function() {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                                  {'newMethod':'OpenLayers.String.camelize'}));
        return OpenLayers.String.camelize(this);
    };
}

/**
 * Namespace: OpenLayers.Number
 * Contains convenience functions for manipulating numbers.
 */
OpenLayers.Number = {

    /**
     * Property: decimalSeparator
     * Decimal separator to use when formatting numbers.
     */
    decimalSeparator: ".",
    
    /**
     * Property: thousandsSeparator
     * Thousands separator to use when formatting numbers.
     */
    thousandsSeparator: ",",
    
    /**
     * APIFunction: limitSigDigs
     * Limit the number of significant digits on a float.
     * 
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     * 
     * Returns:
     * {Float} The number, rounded to the specified number of significant
     *     digits.
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    
    /**
     * APIFunction: format
     * Formats a number for output.
     * 
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} Number of decimal places to round to.
     *        Defaults to 0. Set to null to leave decimal places unchanged.
     * tsep - {String} Thousands separator.
     *        Default is ",".
     * dsep - {String} Decimal separator.
     *        Default is ".".
     *
     * Returns:
     * {String} A string representing the formatted number.
     */
    format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0; 
        tsep = (typeof tsep != "undefined") ? tsep :
            OpenLayers.Number.thousandsSeparator; 
        dsep = (typeof dsep != "undefined") ? dsep :
            OpenLayers.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }
        
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/; 
            while(thousands.test(integer)) { 
                integer = integer.replace(thousands, "$1" + tsep + "$2"); 
            }
        }
        
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    }
};

if (!Number.prototype.limitSigDigs) {
    /**
     * APIMethod: Number.limitSigDigs
     * *Deprecated*. Limit the number of significant digits on an integer. Does *not*
     *     work with floats!
     * 
     * Parameters:
     * sig - {Integer}
     * 
     * Returns:
     * {Integer} The number, rounded to the specified number of significant digits.
     *           If null, 0, or negative value passed in, returns 0
     */
    Number.prototype.limitSigDigs = function(sig) {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                              {'newMethod':'OpenLayers.String.limitSigDigs'}));
        return OpenLayers.Number.limitSigDigs(this, sig);
    };
}

/**
 * Namespace: OpenLayers.Function
 * Contains convenience functions for function manipulation.
 */
OpenLayers.Function = {
    /**
     * APIFunction: bind
     * Bind a function to an object.  Method to easily create closures with
     *     'this' altered.
     * 
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     * 
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
    /**
     * APIFunction: bindAsEventListener
     * Bind a function to an object, and configure it to receive the event
     *     object as first parameter when called. 
     * 
     * Parameters:
     * func - {Function} Input function to serve as an event listener.
     * object - {Object} A reference to this.
     * 
     * Returns:
     * {Function}
     */
    bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    }
};

if (!Function.prototype.bind) {
    /**
     * APIMethod: Function.bind
     * *Deprecated*. Bind a function to an object. 
     * Method to easily create closures with 'this' altered.
     * 
     * Parameters:
     * object - {Object} the this parameter
     * 
     * Returns:
     * {Function} A closure with 'this' altered to the first
     *            argument.
     */
    Function.prototype.bind = function() {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                                {'newMethod':'OpenLayers.String.bind'}));
        // new function takes the same arguments with this function up front
        Array.prototype.unshift.apply(arguments, [this]);
        return OpenLayers.Function.bind.apply(null, arguments);
    };
}

if (!Function.prototype.bindAsEventListener) {
    /**
     * APIMethod: Function.bindAsEventListener
     * *Deprecated*. Bind a function to an object, and configure it to receive the
     *     event object as first parameter when called. 
     * 
     * Parameters:
     * object - {Object} A reference to this.
     * 
     * Returns:
     * {Function}
     */
    Function.prototype.bindAsEventListener = function(object) {
        OpenLayers.Console.warn(OpenLayers.i18n("methodDeprecated",
                        {'newMethod':'OpenLayers.String.bindAsEventListener'}));
        return OpenLayers.Function.bindAsEventListener(this, object);
    };
}

/**
 * Namespace: OpenLayers.Array
 * Contains convenience functions for array manipulation.
 */
OpenLayers.Array = {

    /**
     * APIMethod: filter
     * Filter an array.  Provides the functionality of the
     *     Array.prototype.filter extension to the ECMA-262 standard.  Where
     *     available, Array.prototype.filter will be used.
     *
     * Based on well known example from http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
     *
     * Parameters:
     * array - {Array} The array to be filtered.  This array is not mutated.
     *     Elements added to this array by the callback will not be visited.
     * callback - {Function} A function that is called for each element in
     *     the array.  If this function returns true, the element will be
     *     included in the return.  The function will be called with three
     *     arguments: the element in the array, the index of that element, and
     *     the array itself.  If the optional caller parameter is specified
     *     the callback will be called with this set to caller.
     * caller - {Object} Optional object to be set as this when the callback
     *     is called.
     *
     * Returns:
     * {Array} An array of elements from the passed in array for which the
     *     callback returns true.
     */
    filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for(var i=0; i<len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }        
        }
        return selected;
    }
    
};
/* ======================================================================
    OpenLayers/BaseTypes/Class.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 *     
 * This constructor is new in OpenLayers 2.5.  At OpenLayers 3.0, the old 
 *     syntax for creating classes and dealing with inheritance 
 *     will be removed.
 * 
 * To create a new OpenLayers-style class, use the following syntax:
 * > var MyClass = OpenLayers.Class(prototype);
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * > var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 *
 */
OpenLayers.Class = function() {
    var Class = function() {
        /**
         * This following condition can be removed at 3.0 - this is only for
         * backwards compatibility while the Class.inherit method is still
         * in use.  So at 3.0, the following three lines would be replaced with
         * simply:
         * this.initialize.apply(this, arguments);
         */
        if (arguments && arguments[0] != OpenLayers.Class.isPrototype) {
            this.initialize.apply(this, arguments);
        }
    };
    var extended = {};
    var parent;
    for(var i=0; i<arguments.length; ++i) {
        if(typeof arguments[i] == "function") {
            // get the prototype of the superclass
            parent = arguments[i].prototype;
        } else {
            // in this case we're extending with the prototype
            parent = arguments[i];
        }
        OpenLayers.Util.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};

/**
 * Property: isPrototype
 * *Deprecated*.  This is no longer needed and will be removed at 3.0.
 */
OpenLayers.Class.isPrototype = function () {};

/**
 * APIFunction: OpenLayers.create
 * *Deprecated*.  Old method to create an OpenLayers style class.  Use the
 *     <OpenLayers.Class> constructor instead.
 *
 * Returns:
 * An OpenLayers class
 */
OpenLayers.Class.create = function() {
    return function() {
        if (arguments && arguments[0] != OpenLayers.Class.isPrototype) {
            this.initialize.apply(this, arguments);
        }
    };
};


/**
 * APIFunction: inherit
 * *Deprecated*.  Old method to inherit from one or more OpenLayers style
 *     classes.  Use the <OpenLayers.Class> constructor instead.
 *
 * Parameters:
 * class - One or more classes can be provided as arguments
 *
 * Returns:
 * An object prototype
 */
OpenLayers.Class.inherit = function () {
    var superClass = arguments[0];
    var proto = new superClass(OpenLayers.Class.isPrototype);
    for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] == "function") {
            var mixin = arguments[i];
            arguments[i] = new mixin(OpenLayers.Class.isPrototype);
        }
        OpenLayers.Util.extend(proto, arguments[i]);
    }
    return proto;
};
/* ======================================================================
    OpenLayers/Util.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * Namespace: Util
 */
OpenLayers.Util = {};

/** 
 * Function: getElement
 * This is the old $() from prototype
 */
OpenLayers.Util.getElement = function() {
    var elements = [];

    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

/** 
 * Maintain $() from prototype
 */
if ($ == null) {
    var $ = OpenLayers.Util.getElement;
}

/**
 * APIFunction: extend
 * Copy all properties of a source object to a destination object.  Modifies
 *     the passed in destination object.  Any properties on the source object
 *     that are set to undefined will not be (re)set on the destination object.
 *
 * Parameters:
 * destination - {Object} The object that will be modified
 * source - {Object} The object with properties to be set on the destination
 *
 * Returns:
 * {Object} The destination object.
 */
OpenLayers.Util.extend = function(destination, source) {
    if(destination && source) {
        for(var property in source) {
            var value = source[property];
            if(value !== undefined) {
                destination[property] = value;
            }
        }

        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */

        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object
         * is an instance of window.Event.
         */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if(!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty('toString')) {
            destination.toString = source.toString;
        }
    }
    return destination;
};


/** 
 * Function: removeItem
 * Remove an object from an array. Iterates through the array
 *     to find the item, then removes it.
 *
 * Parameters:
 * array - {Array}
 * item - {Object}
 * 
 * Return
 * {Array} A reference to the array
 */
OpenLayers.Util.removeItem = function(array, item) {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] == item) {
            array.splice(i,1);
            //break;more than once??
        }
    }
    return array;
};

/**
 * Function: clearArray
 * *Deprecated*. This function will disappear in 3.0.
 * Please use "array.length = 0" instead.
 * 
 * Parameters:
 * array - {Array}
 */
OpenLayers.Util.clearArray = function(array) {
    OpenLayers.Console.warn(
        OpenLayers.i18n(
            "methodDeprecated", {'newMethod': 'array = []'}
        )
    );
    array.length = 0;
};

/** 
 * Function: indexOf
 * Seems to exist already in FF, but not in MOZ.
 * 
 * Parameters:
 * array - {Array}
 * obj - {Object}
 * 
 * Returns:
 * {Integer} The index at, which the object was found in the array.
 *           If not found, returns -1.
 */
OpenLayers.Util.indexOf = function(array, obj) {

    for(var i=0; i < array.length; i++) {
        if (array[i] == obj) {
            return i;
        }
    }
    return -1;   
};



/**
 * Function: modifyDOMElement
 * 
 * Modifies many properties of a DOM element all at once.  Passing in 
 * null to an individual parameter will avoid setting the attribute.
 *
 * Parameters:
 * id - {String} The element id attribute to set.
 * px - {<OpenLayers.Pixel>} The left and top style position.
 * sz - {<OpenLayers.Size>}  The width and height style attributes.
 * position - {String}       The position attribute.  eg: absolute, 
 *                           relative, etc.
 * border - {String}         The style.border attribute.  eg:
 *                           solid black 2px
 * overflow - {String}       The style.overview attribute.  
 * opacity - {Float}         Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position, 
                                            border, overflow, opacity) {

    if (id) {
        element.id = id;
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};

/** 
 * Function: createDiv
 * Creates a new div and optionally set some standard attributes.
 * Null may be passed to each parameter if you do not wish to
 * set a particular attribute.d
 * 
 * Note: zIndex is NOT set
 * 
 * Parameters:
 * id - {String} An identifier for this element.  If no id is
 *               passed an identifier will be created 
 *               automatically.
 * px - {<OpenLayers.Pixel>} The element left and top position. 
 * sz - {<OpenLayers.Size>} The element width and height.
 * imgURL - {String} A url pointing to an image to use as a 
 *                   background image.
 * position - {String} The style.position value. eg: absolute,
 *                     relative etc.
 * border - {String} The the style.border value. 
 *                   eg: 2px solid black
 * overflow - {String} The style.overflow value. Eg. hidden
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * 
 * Returns: 
 * {DOMElement} A DOM Div created with the specified attributes.
 */
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position, 
                                     border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, 
                                     border, overflow, opacity);

    return dom;
};

/**
 * Function: createImage
 * Creates an img element with specific attribute values.
 *  
 * Parameters:
 * id - {String} The id field for the img.  If none assigned one will be
 *               automatically generated.
 * px - {<OpenLayers.Pixel>} The left and top positions.
 * sz - {<OpenLayers.Size>} The style.width and style.height values.
 * imgURL - {String} The url to use as the image source.
 * position - {String} The style.position value.
 * border - {String} The border to place around the image.
 * delayDisplay - {Boolean} If true waits until the image has been
 *                          loaded.
 * opacity - {Float} Fractional value (0.0 - 1.0)
 * 
 * Returns:
 * {DOMElement} A DOM Image created with the specified attributes.
 */
OpenLayers.Util.createImage = function(id, px, sz, imgURL, position, border,
                                       opacity, delayDisplay) {

    var image = document.createElement("img");

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position, 
                                     border, null, opacity);

    if(delayDisplay) {
        image.style.display = "none";
        OpenLayers.Event.observe(image, "load", 
            OpenLayers.Function.bind(OpenLayers.Util.onImageLoad, image));
        OpenLayers.Event.observe(image, "error", 
            OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError, image));
        
    }
    
    //set special properties
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }


        
    return image;
};

/**
 * Function: setOpacity
 * *Deprecated*.  This function has been deprecated. Instead, please use 
 *     <OpenLayers.Util.modifyDOMElement> 
 *     or 
 *     <OpenLayers.Util.modifyAlphaImageDiv>
 * 
 * Set the opacity of a DOM Element
 *     Note that for this function to work in IE, elements must "have layout"
 *     according to:
 *     http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/haslayout.asp
 *
 * Parameters:
 * element - {DOMElement} Set the opacity on this DOM element
 * opacity - {Float} Opacity value (0.0 - 1.0)
 */
OpenLayers.Util.setOpacity = function(element, opacity) {
    OpenLayers.Util.modifyDOMElement(element, null, null, null,
                                     null, null, null, opacity);
};

/**
 * Function: onImageLoad
 * Bound to image load events.  For all images created with <createImage> or
 *     <createAlphaImageDiv>, this function will be bound to the load event.
 */
OpenLayers.Util.onImageLoad = function() {
    // The complex check here is to solve issues described in #480.
    // Every time a map view changes, it increments the 'viewRequestID' 
    // property. As the requests for the images for the new map view are sent
    // out, they are tagged with this unique viewRequestID. 
    // 
    // If an image has no viewRequestID property set, we display it regardless, 
    // but if it does have a viewRequestID property, we check that it matches 
    // the viewRequestID set on the map.
    // 
    // If the viewRequestID on the map has changed, that means that the user
    // has changed the map view since this specific request was sent out, and
    // therefore this tile does not need to be displayed (so we do not execute
    // this code that turns its display on).
    //
    if (!this.viewRequestID ||
        (this.map && this.viewRequestID == this.map.viewRequestID)) { 
        this.style.backgroundColor = null;
        this.style.display = "";  
    }
};

/**
 * Property: onImageLoadErrorColor
 * {String} The color tiles with load errors will turn.
 *          Default is "pink"
 */
OpenLayers.Util.onImageLoadErrorColor = "pink";

/**
 * Property: IMAGE_RELOAD_ATTEMPTS
 * {Integer} How many times should we try to reload an image before giving up?
 *           Default is 0
 */
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;

/**
 * Function: onImageLoadError 
 */
OpenLayers.Util.onImageLoadError = function() {
    this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
    if(this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
        this.src = this.src;
    } else {
        this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
    }
    this.style.display = "";
};

/**
 * Function: alphaHack
 * Checks whether it's necessary (and possible) to use the png alpha
 * hack which allows alpha transparency for png images under Internet
 * Explorer.
 * 
 * Returns:
 * {Boolean} true if alpha has is necessary and possible, false otherwise.
 */
OpenLayers.Util.alphaHack = function() {
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    var filter = false;
    
    // IEs4Lin dies when trying to access document.body.filters, because 
    // the property is there, but requires a DLL that can't be provided. This
    // means that we need to wrap this in a try/catch so that this can
    // continue.
    
    try { 
        filter = !!(document.body.filters);
    } catch (e) {
    }    
    
    return ( filter &&
                      (version >= 5.5) && (version < 7) );
};

/** 
 * Function: modifyAlphaImageDiv
 * 
 * div - {DOMElement} Div containing Alpha-adjusted Image
 * id - {String}
 * px - {<OpenLayers.Pixel>}
 * sz - {<OpenLayers.Size>}
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing {String} 'crop', 'scale', or 'image'. Default is "scale"
 * opacity - {Float} Fractional value (0.0 - 1.0)
 */ 
OpenLayers.Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz, 
                                     null, null, null, opacity);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz, 
                                     "relative", border);
    
    if (OpenLayers.Util.alphaHack()) {

        div.style.display = "inline-block";
        if (sizing == null) {
            sizing = "scale";
        }
        
        div.style.filter = "progid:DXImageTransform.Microsoft" +
                           ".AlphaImageLoader(src='" + img.src + "', " +
                           "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 && 
            parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "alpha(opacity=0)";
    }
};

/** 
 * Function: createAlphaImageDiv
 * 
 * id - {String}
 * px - {<OpenLayers.Pixel>}
 * sz - {<OpenLayers.Size>}
 * imgURL - {String}
 * position - {String}
 * border - {String}
 * sizing {String} 'crop', 'scale', or 'image'. Default is "scale"
 * delayDisplay{Boolean}
 * 
 * Returns:
 * {DOMElement} A DOM Div created with a DOM Image inside it. If the hack is 
 *              needed for transparency in IE, it is added.
 */ 
OpenLayers.Util.createAlphaImageDiv = function(id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity, delayDisplay) {
    
    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null, 
                                          null, false);
    div.appendChild(img);

    if (delayDisplay) {
        img.style.display = "none";
        OpenLayers.Event.observe(img, "load",
            OpenLayers.Function.bind(OpenLayers.Util.onImageLoad, div));
        OpenLayers.Event.observe(img, "error",
            OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError, div));
    }

    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, 
                                        border, sizing, opacity);
    
    return div;
};


/** 
 * Function: upperCaseObject
 * Creates a new hashtable and copies over all the keys from the 
 *     passed-in object, but storing them under an uppercased
 *     version of the key at which they were stored.
 * 
 * Parameters: 
 * object - {Object}
 * 
 * Returns: 
 * {Object} A new Object with all the same keys but uppercased
 */
OpenLayers.Util.upperCaseObject = function (object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

/** 
 * Function: applyDefaults
 * Takes an object and copies any properties that don't exist from
 *     another properties, by analogy with OpenLayers.Util.extend() from
 *     Prototype.js.
 * 
 * Parameters:
 * to - {Object} The destination object.
 * from - {Object} The source object.  Any properties of this object that
 *     are undefined in the to object will be set on the to object.
 *
 * Returns:
 * {Object} A reference to the to object.  Note that the to argument is modified
 *     in place and returned by this function.
 */
OpenLayers.Util.applyDefaults = function (to, from) {

    /*
     * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
     * prototype object" when calling hawOwnProperty if the source object is an
     * instance of window.Event.
     */
    var fromIsEvt = typeof window.Event == "function"
                    && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty
             && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    /**
     * IE doesn't include the toString property when iterating over an object's
     * properties with the for(property in object) syntax.  Explicitly check if
     * the source has its own toString property.
     */
    if(!fromIsEvt && from.hasOwnProperty
       && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    
    return to;
};

/**
 * Function: getParameterString
 * 
 * Parameters:
 * params - {Object}
 * 
 * Returns:
 * {String} A concatenation of the properties of an object in 
 *          http parameter notation. 
 *          (ex. <i>"key1=value1&key2=value2&key3=value3"</i>)
 *          If a parameter is actually a list, that parameter will then
 *          be set to a comma-seperated list of values (foo,bar) instead
 *          of being URL escaped (foo%3Abar). 
 */
OpenLayers.Util.getParameterString = function(params) {
    var paramsArray = [];
    
    for (var key in params) {
      var value = params[key];
      if ((value != null) && (typeof value != 'function')) {
        var encodedValue;
        if (typeof value == 'object' && value.constructor == Array) {
          /* value is an array; encode items and separate with "," */
          var encodedItemArray = [];
          for (var itemIndex=0; itemIndex<value.length; itemIndex++) {
            encodedItemArray.push(encodeURIComponent(value[itemIndex]));
          }
          encodedValue = encodedItemArray.join(",");
        }
        else {
          /* value is a string; simply encode */
          encodedValue = encodeURIComponent(value);
        }
        paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
      }
    }
    
    return paramsArray.join("&");
};

/**
 * Property: ImgPath
 * {String} Default is ''.
 */
OpenLayers.ImgPath = '';

/** 
 * Function: getImagesLocation
 * 
 * Returns:
 * {String} The fully formatted image location string
 */
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};


/** 
 * Function: Try
 * Execute functions until one of them doesn't throw an error. 
 *     Capitalized because "try" is a reserved word in JavaScript.
 *     Taken directly from OpenLayers.Util.Try()
 * 
 * Parameters:
 * [*] - {Function} Any number of parameters may be passed to Try()
 *    It will attempt to execute each of them until one of them 
 *    successfully executes. 
 *    If none executes successfully, returns null.
 * 
 * Returns:
 * {*} The value returned by the first successfully executed function.
 */
OpenLayers.Util.Try = function() {
    var returnValue = null;

    for (var i = 0; i < arguments.length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
};


/** 
 * Function: getNodes
 * 
 * These could/should be made namespace aware?
 * 
 * Parameters:
 * p - {}
 * tagName - {String}
 * 
 * Returns:
 * {Array}
 */
OpenLayers.Util.getNodes=function(p, tagName) {
    var nodes = OpenLayers.Util.Try(
        function () {
            return OpenLayers.Util._getNodes(p.documentElement.childNodes,
                                            tagName);
        },
        function () {
            return OpenLayers.Util._getNodes(p.childNodes, tagName);
        }
    );
    return nodes;
};

/**
 * Function: _getNodes
 * 
 * Parameters:
 * nodes - {Array}
 * tagName - {String}
 * 
 * Returns:
 * {Array}
 */
OpenLayers.Util._getNodes=function(nodes, tagName) {
    var retArray = [];
    for (var i=0;i<nodes.length;i++) {
        if (nodes[i].nodeName==tagName) {
            retArray.push(nodes[i]);
        }
    }

    return retArray;
};



/**
 * Function: getTagText
 * 
 * Parameters:
 * parent - {}
 * item - {String}
 * index - {Integer}
 * 
 * Returns:
 * {String}
 */
OpenLayers.Util.getTagText = function (parent, item, index) {
    var result = OpenLayers.Util.getNodes(parent, item);
    if (result && (result.length > 0))
    {
        if (!index) {
            index=0;
        }
        if (result[index].childNodes.length > 1) {
            return result.childNodes[1].nodeValue; 
        }
        else if (result[index].childNodes.length == 1) {
            return result[index].firstChild.nodeValue; 
        }
    } else { 
        return ""; 
    }
};

/**
 * Function: getXmlNodeValue
 * 
 * Parameters:
 * node - {XMLNode}
 * 
 * Returns:
 * {String} The text value of the given node, without breaking in firefox or IE
 */
OpenLayers.Util.getXmlNodeValue = function(node) {
    var val = null;
    OpenLayers.Util.Try( 
        function() {
            val = node.text;
            if (!val) {
                val = node.textContent;
            }
            if (!val) {
                val = node.firstChild.nodeValue;
            }
        }, 
        function() {
            val = node.textContent;
        }); 
    return val;
};

/** 
 * Function: mouseLeft
 * 
 * Parameters:
 * evt - {Event}
 * div - {HTMLDivElement}
 * 
 * Returns:
 * {Boolean}
 */
OpenLayers.Util.mouseLeft = function (evt, div) {
    // start with the element to which the mouse has moved
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    // walk up the DOM tree.
    while (target != div && target != null) {
        target = target.parentNode;
    }
    // if the target we stop at isn't the div, then we've left the div.
    return (target != div);
};

/**
 * Function: rad
 * 
 * Parameters:
 * x - {Float}
 * 
 * Returns:
 * {Float}
 */
OpenLayers.Util.rad = function(x) {return x*Math.PI/180;};

/**
 * Function: distVincenty
 * 
 * Parameters:
 * p1 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 * p2 - {<OpenLayers.LonLat>} (or any object with both .lat, .lon properties)
 * 
 * Returns:
 * {Float}
 */
OpenLayers.Util.distVincenty=function(p1, p2) {
    var a = 6378137, b = 6356752.3142,  f = 1/298.257223563;
    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    var lambda = L, lambdaP = 2*Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0) {
        var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
        (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
        if (sinSigma==0) {
            return 0;  // co-incident points
        }
        var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
        var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1-C) * f * Math.sin(alpha) *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
    }
    if (iterLimit==0) {
        return NaN;  // formula failed to converge
    }
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
    var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
        B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
    var s = b*A*(sigma-deltaSigma);
    var d = s.toFixed(3)/1000; // round to 1mm precision
    return d;
};

/**
 * Function: getParameters
 * Parse the parameters from a URL or from the current page itself into a 
 *     JavaScript Object. Note that parameter values with commas are separated
 *     out into an Array.
 * 
 * Parameters:
 * url - {String} Optional url used to extract the query string.
 *                If null, query string is taken from page location.
 * 
 * Returns:
 * {Object} An object of key/value pairs from the query string.
 */
OpenLayers.Util.getParameters = function(url) {
    // if no url specified, take it from the location bar
    url = url || window.location.href;

    //parse out parameters portion of url string
    var paramsString = "";
    if (OpenLayers.String.contains(url, '?')) {
        var start = url.indexOf('?') + 1;
        var end = OpenLayers.String.contains(url, "#") ?
                    url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }
        
    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for(var i = 0; i < pairs.length; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {
            var key = decodeURIComponent(keyValue[0]);
            var value = keyValue[1] || ''; //empty string if no value

            //decode individual values
            value = value.split(",");
            for(var j=0; j < value.length; j++) {
                value[j] = decodeURIComponent(value[j]);
            }

            //if there's only one value, do not return as array                    
            if (value.length == 1) {
                value = value[0];
            }                
            
            parameters[key] = value;
         }
     }
    return parameters;
};

/**
 * Function: getArgs
 * *Deprecated*.  Will be removed in 3.0.  Please use instead
 *     <OpenLayers.Util.getParameters>
 * 
 * Parameters:
 * url - {String} Optional url used to extract the query string.
 *                If null, query string is taken from page location.
 * 
 * Returns:
 * {Object} An object of key/value pairs from the query string.
 */
OpenLayers.Util.getArgs = function(url) {
    OpenLayers.Console.warn(
        OpenLayers.i18n(
            "methodDeprecated", {'newMethod': 'OpenLayers.Util.getParameters'}
        )
    );
    return OpenLayers.Util.getParameters(url);
};

/**
 * Property: lastSeqID
 * {Integer} The ever-incrementing count variable.
 *           Used for generating unique ids.
 */
OpenLayers.Util.lastSeqID = 0;

/**
 * Function: createUniqueID
 * Create a unique identifier for this session.  Each time this function
 *     is called, a counter is incremented.  The return will be the optional
 *     prefix (defaults to "id_") appended with the counter value.
 * 
 * Parameters:
 * prefix {String} Optionsal string to prefix unique id. Default is "id_".
 * 
 * Returns:
 * {String} A unique id string, built on the passed in prefix.
 */
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    OpenLayers.Util.lastSeqID += 1; 
    return prefix + OpenLayers.Util.lastSeqID;        
};

/**
 * Constant: INCHES_PER_UNIT
 * {Object} Constant inches per unit -- borrowed from MapServer mapscale.c
 * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
 */
OpenLayers.INCHES_PER_UNIT = { 
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.3701,
    'km': 39370.1,
    'dd': 4374754,
    'yd': 36
};
OpenLayers.INCHES_PER_UNIT["in"]= OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"] = 1852 * OpenLayers.INCHES_PER_UNIT.m;

/** 
 * Constant: DOTS_PER_INCH
 * {Integer} 72 (A sensible default)
 */
OpenLayers.DOTS_PER_INCH = 72;

/**
 * Function: normalzeScale
 * 
 * Parameters:
 * scale - {float}
 * 
 * Returns:
 * {Float} A normalized scale value, in 1 / X format. 
 *         This means that if a value less than one ( already 1/x) is passed
 *         in, it just returns scale directly. Otherwise, it returns 
 *         1 / scale
 */
OpenLayers.Util.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) 
                                  : scale;
    return normScale;
};

/**
 * Function: getResolutionFromScale
 * 
 * Parameters:
 * scale - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding resolution given passed-in scale and unit 
 *         parameters.
 */
OpenLayers.Util.getResolutionFromScale = function (scale, units) {

    if (units == null) {
        units = "degrees";
    }

    var normScale = OpenLayers.Util.normalizeScale(scale);

    var resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units]
                                    * OpenLayers.DOTS_PER_INCH);
    return resolution;
};

/**
 * Function: getScaleFromResolution
 * 
 * Parameters:
 * resolution - {Float}
 * units - {String} Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                  Default is degrees
 * 
 * Returns:
 * {Float} The corresponding scale given passed-in resolution and unit 
 *         parameters.
 */
OpenLayers.Util.getScaleFromResolution = function (resolution, units) {

    if (units == null) {
        units = "degrees";
    }

    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] *
                    OpenLayers.DOTS_PER_INCH;
    return scale;
};

/**
 * Function: safeStopPropagation
 * *Deprecated*. This function has been deprecated. Please use directly 
 *     <OpenLayers.Event.stop> passing 'true' as the 2nd 
 *     argument (preventDefault)
 * 
 * Safely stop the propagation of an event *without* preventing
 *   the default browser action from occurring.
 * 
 * Parameter:
 * evt - {Event}
 */
OpenLayers.Util.safeStopPropagation = function(evt) {
    OpenLayers.Event.stop(evt, true);
};

/**
 * Function: pagePositon
 * Calculates the position of an element on the page. 
 *
 * Parameters:
 * forElement - {DOMElement}
 * 
 * Returns:
 * {Array} two item array, L value then T value.
 */
OpenLayers.Util.pagePosition = function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    var child = forElement;
    while(element) {

        if(element == document.body) {
            // FIXME: IE, when passed 'window' as the forElement, treats it as
            // equal to document.body, but window.style fails, so getStyle
            // fails, so we are paranoid and check this here. This check should
            // probably move into element.getStyle in 2.6.
            if(child && child.style && 
               OpenLayers.Element.getStyle(child, 'position') == 'absolute') {
                break;
            }
        }
        
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;

        child = element;
        try {
            // wrapping this in a try/catch because IE chokes on the offsetParent
            element = element.offsetParent;
        } catch(e) {
            OpenLayers.Console.error(OpenLayers.i18n(
                                  "pagePositionFailed",{'elemId':element.id}));
            break;
        }
    }

    element = forElement;
    while(element) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
        element = element.parentNode;
    }
    
    return [valueL, valueT];
};


/** 
 * Function: isEquivalentUrl
 * Test two URLs for equivalence. 
 * 
 * Setting 'ignoreCase' allows for case-independent comparison.
 * 
 * Comparison is based on: 
 *  - Protocol
 *  - Host (evaluated without the port)
 *  - Port (set 'ignorePort80' to ignore "80" values)
 *  - Hash ( set 'ignoreHash' to disable)
 *  - Pathname (for relative <-> absolute comparison) 
 *  - Arguments (so they can be out of order)
 *  
 * Parameters:
 * url1 - {String}
 * url2 - {String}
 * options - {Object} Allows for customization of comparison:
 *                    'ignoreCase' - Default is True
 *                    'ignorePort80' - Default is True
 *                    'ignoreHash' - Default is True
 *
 * Returns:
 * {Boolean} Whether or not the two URLs are equivalent
 */
OpenLayers.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || {};

    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true
    });

    var urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    var urlObj2 = OpenLayers.Util.createUrlObject(url2, options);

    //compare all keys (host, port, etc)
    for(var key in urlObj1) {
        if (options.test) {
            alert(key + "\n1:" + urlObj1[key] + "\n2:" + urlObj2[key]);
        }
        var val1 = urlObj1[key];
        var val2 = urlObj2[key];
        
        switch(key) {
            case "args":
                //do nothing, they'll be treated below
                break;
            case "host":
            case "port":
            case "protocol":
                if ((val1 == "") || (val2 == "")) {
                    //these will be blank for relative urls, so no need to 
                    // compare them here -- call break. 
                    // 
                    break;
                } 
                // otherwise continue with default compare
                //
            default: 
                if ( (key != "args") && (urlObj1[key] != urlObj2[key]) ) {
                    return false;
                }
                break;
        }
        
    }

    // compare search args - irrespective of order
    for(var key in urlObj1.args) {
        if(urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    // urlObj2 shouldn't have any args left
    for(var key in urlObj2.args) {
        return false;
    }
    
    return true;
};

/**
 * Function: createUrlObject
 * 
 * Parameters:
 * url - {String}
 * options - {Object} A hash of options.  Can be one of:
 *            ignoreCase: lowercase url,
 *            ignorePort80: don't include explicit port if port is 80,
 *            ignoreHash: Don't include part of url after the hash (#).
 * 
 * Returns:
 * {Object} An object with separate url, a, port, host, and args parsed out 
 *          and ready for comparison
 */
OpenLayers.Util.createUrlObject = function(url, options) {
    options = options || {};

    var urlObject = {};
  
    if (options.ignoreCase) {
        url = url.toLowerCase(); 
    }

    var a = document.createElement('a');
    a.href = url;
    
  //host (without port)
    urlObject.host = a.host;
    var port = a.port;
    if (port.length <= 0) {
        var newHostLength = urlObject.host.length - (port.length);
        urlObject.host = urlObject.host.substring(0, newHostLength); 
    }

  //protocol
    urlObject.protocol = a.protocol;  

  //port
    urlObject.port = ((port == "80") && (options.ignorePort80)) ? "" : port;
                                                                     
  //hash
    urlObject.hash = (options.ignoreHash) ? "" : a.hash;  
    
  //args
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getParameters(queryString);


  //pathname (this part allows for relative <-> absolute comparison)
    if ( ((urlObject.protocol == "file:") && (url.indexOf("file:") != -1)) || 
         ((urlObject.protocol != "file:") && (urlObject.host != "")) ) {

        urlObject.pathname = a.pathname;  

        //Test to see if the pathname includes the arguments (Opera)
        var qIndex = urlObject.pathname.indexOf("?");
        if (qIndex != -1) {
            urlObject.pathname = urlObject.pathname.substring(0, qIndex);
        }

    } else {
        var relStr = OpenLayers.Util.removeTail(url);

        var backs = 0;
        do {
            var index = relStr.indexOf("../");

            if (index == 0) {
                backs++;
                relStr = relStr.substr(3);
            } else if (index >= 0) {
                var prevChunk = relStr.substr(0,index - 1);
                
                var slash = prevChunk.indexOf("/");
                prevChunk = (slash != -1) ? prevChunk.substr(0, slash +1)
                                          : "";
                
                var postChunk = relStr.substr(index + 3);                
                relStr = prevChunk + postChunk;
            }
        } while(index != -1)

        var windowAnchor = document.createElement("a");
        var windowUrl = window.location.href;
        if (options.ignoreCase) {
            windowUrl = windowUrl.toLowerCase();
        }
        windowAnchor.href = windowUrl;

      //set protocol of window
        urlObject.protocol = windowAnchor.protocol;

        var splitter = (windowAnchor.pathname.indexOf("/") != -1) ? "/" : "\\";
        var dirs = windowAnchor.pathname.split(splitter);
        dirs.pop(); //remove filename
        while ((backs > 0) && (dirs.length > 0)) {
            dirs.pop();
            backs--;
        }
        relStr = dirs.join("/") + "/"+ relStr;
        urlObject.pathname = relStr;
    }
    
    if ((urlObject.protocol == "file:") || (urlObject.protocol == "")) {
        urlObject.host = "localhost";
    }

    return urlObject; 
};
 
/**
 * Function: removeTail
 * Takes a url and removes everything after the ? and #
 * 
 * Parameters:
 * url - {String} The url to process
 * 
 * Returns:
 * {String} The string with all queryString and Hash removed
 */
OpenLayers.Util.removeTail = function(url) {
    var head = null;
    
    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");

    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0,hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0,Math.min(qMark, hashMark)) 
                                  : url.substr(0, qMark);
    }
    return head;
};


/**
 * Function: getBrowserName
 * 
 * Returns:
 * {String} A string which specifies which is the current 
 *          browser in which we are running. 
 * 
 *          Currently-supported browser detection and codes:
 *           * 'opera' -- Opera
 *           * 'msie'  -- Internet Explorer
 *           * 'safari' -- Safari
 *           * 'firefox' -- FireFox
 *           * 'mozilla' -- Mozilla
 * 
 *          If we are unable to property identify the browser, we 
 *           return an empty string.
 */
OpenLayers.Util.getBrowserName = function() {
    var browserName = "";
    
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.indexOf( "opera" ) != -1 ) {
        browserName = "opera";
    } else if ( ua.indexOf( "msie" ) != -1 ) {
        browserName = "msie";
    } else if ( ua.indexOf( "safari" ) != -1 ) {
        browserName = "safari";
    } else if ( ua.indexOf( "mozilla" ) != -1 ) {
        if ( ua.indexOf( "firefox" ) != -1 ) {
            browserName = "firefox";
        } else {
            browserName = "mozilla";
        }
    }
    
    return browserName;
};



    
/**
 * Method: getRenderedDimensions
 * Renders the contentHTML offscreen to determine actual dimensions for
 *     popup sizing. As we need layout to determine dimensions the content
 *     is rendered -9999px to the left and absolute to ensure the 
 *     scrollbars do not flicker
 *     
 * Parameters:
 * size - {<OpenLayers.Size>} If either the 'w' or 'h' properties is 
 *     specified, we fix that dimension of the div to be measured. This is 
 *     useful in the case where we have a limit in one dimension and must 
 *     therefore meaure the flow in the other dimension.
 * 
 * Returns:
 * {OpenLayers.Size}
 */
OpenLayers.Util.getRenderedDimensions = function(contentHTML, size) {
    
    var w = h = null;
    
    // create temp container div with restricted size
    var container = document.createElement("div");
    container.style.overflow= "";
    container.style.position = "absolute";
    container.style.left = "-9999px";
        
    //fix a dimension, if specified.
    if (size) {
        if (size.w) {
            w = container.style.width = size.w;
        } else if (size.h) {
            h = container.style.height = size.h;
        }
    }
    
    // create temp content div and assign content
    var content = document.createElement("div");
    content.innerHTML = contentHTML;
    
    // add content to restricted container 
    container.appendChild(content);
    
    // append container to body for rendering
    document.body.appendChild(container);
    
    // calculate scroll width of content and add corners and shadow width
    if (!w) {
        w = parseInt(content.scrollWidth);
    
        // update container width to allow height to adjust
        container.style.width = w + "px";
    }        
    // capture height and add shadow and corner image widths
    if (!h) {
        h = parseInt(content.scrollHeight);
    }

    // remove elements
    container.removeChild(content);
    document.body.removeChild(container);
    
    return new OpenLayers.Size(w, h);
};

/**
 * APIFunction: getScrollbarWidth
 * This function has been modified by the OpenLayers from the original version,
 *     written by Matthew Eernisse and released under the Apache 2 
 *     license here:
 * 
 *     http://www.fleegix.org/articles/2006/05/30/getting-the-scrollbar-width-in-pixels
 * 
 *     It has been modified simply to cache its value, since it is physically 
 *     impossible that this code could ever run in more than one browser at 
 *     once. 
 * 
 * Returns:
 * {Integer}
 */
OpenLayers.Util.getScrollbarWidth = function() {
    
    var scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    
    if (scrollbarWidth == null) {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;
    
        // Outer scrolling div
        scr = document.createElement('div');
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        // Start with no scrollbar
        scr.style.overflow = 'hidden';
    
        // Inner content div
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';
    
        // Put the inner div in the scrolling div
        scr.appendChild(inn);
        // Append the scrolling div to the doc
        document.body.appendChild(scr);
    
        // Width of the inner div sans scrollbar
        wNoScroll = inn.offsetWidth;
    
        // Add the scrollbar
        scr.style.overflow = 'scroll';
        // Width of the inner div width scrollbar
        wScroll = inn.offsetWidth;
    
        // Remove the scrolling div from the doc
        document.body.removeChild(document.body.lastChild);
    
        // Pixel width of the scroller
        OpenLayers.Util._scrollbarWidth = (wNoScroll - wScroll);
        scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    }

    return scrollbarWidth;
};
/* ======================================================================
    OpenLayers/Ajax.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


OpenLayers.ProxyHost = "";
//OpenLayers.ProxyHost = "examples/proxy.cgi?url=";

/**
 * Ajax reader for OpenLayers
 *
 *  @uri url to do remote XML http get
 *  @param {String} 'get' format params (x=y&a=b...)
 *  @who object to handle callbacks for this request
 *  @complete  the function to be called on success 
 *  @failure  the function to be called on failure
 *  
 *   example usage from a caller:
 *  
 *     caps: function(request) {
 *      -blah-  
 *     },
 *  
 *     OpenLayers.loadURL(url,params,this,caps);
 *
 * Notice the above example does not provide an error handler; a default empty
 * handler is provided which merely logs the error if a failure handler is not 
 * supplied
 *
 */


/** 
* @param {} request
*/
OpenLayers.nullHandler = function(request) {
    alert(OpenLayers.i18n("unhandledRequest", {'statusText':request.statusText}));
};

/** 
 * Function: loadURL
 * Background load a document.
 *
 * Parameters:
 * uri - {String} URI of source doc
 * params - {String} Params on get (doesnt seem to work)
 * caller - {Object} object which gets callbacks
 * onComplete - {Function} Optional callback for success.  The callback
 *     will be called with this set to caller and will receive the request
 *     object as an argument.
 * onFailure - {Function} Optional callback for failure.  In the event of
 *     a failure, the callback will be called with this set to caller and will
 *     receive the request object as an argument.
 *
 * Returns:
 * {XMLHttpRequest}  The request object.  To abort loading, call
 *     request.abort().
 */
OpenLayers.loadURL = function(uri, params, caller,
                                  onComplete, onFailure) {

    var success = (onComplete) ? OpenLayers.Function.bind(onComplete, caller)
                                : OpenLayers.nullHandler;

    var failure = (onFailure) ? OpenLayers.Function.bind(onFailure, caller)
                           : OpenLayers.nullHandler;

    // from prototype.js
    var request = new OpenLayers.Ajax.Request(
        uri, 
        {
            method: 'get', 
            parameters: params,
            onComplete: success, 
            onFailure: failure
        }
    );
    return request.transport;
};

/** 
 * Function: parseXMLString
 * Parse XML into a doc structure
 * 
 * Parameters:
 * text - {String} 
 * 
 * Returns:
 * {?} Parsed AJAX Responsev
 */
OpenLayers.parseXMLString = function(text) {

    //MS sucks, if the server is bad it dies
    var index = text.indexOf('<');
    if (index > 0) {
        text = text.substring(index);
    }

    var ajaxResponse = OpenLayers.Util.Try(
        function() {
            var xmldom = new ActiveXObject('Microsoft.XMLDOM');
            xmldom.loadXML(text);
            return xmldom;
        },
        function() {
            return new DOMParser().parseFromString(text, 'text/xml');
        },
        function() {
            var req = new XMLHttpRequest();
            req.open("GET", "data:" + "text/xml" +
                     ";charset=utf-8," + encodeURIComponent(text), false);
            if (req.overrideMimeType) {
                req.overrideMimeType("text/xml");
            }
            req.send(null);
            return req.responseXML;
        }
    );

    return ajaxResponse;
};


/**
 * Namespace: OpenLayers.Ajax
 */
OpenLayers.Ajax = {

    /**
     * Method: emptyFunction
     */
    emptyFunction: function () {},

    /**
     * Method: getTransport
     * 
     * Returns: 
     * {Object} Transport mechanism for whichever browser we're in, or false if
     *          none available.
     */
    getTransport: function() {
        return OpenLayers.Util.Try(
            function() {return new XMLHttpRequest();},
            function() {return new ActiveXObject('Msxml2.XMLHTTP');},
            function() {return new ActiveXObject('Microsoft.XMLHTTP');}
        ) || false;
    },

    /**
     * Property: activeRequestCount
     * {Integer}
     */
    activeRequestCount: 0
};

/**
 * Namespace: OpenLayers.Ajax.Responders
 * {Object}
 */
OpenLayers.Ajax.Responders = {
  
    /**
     * Property: responders
     * {Array}
     */
    responders: [],

    /**
     * Method: register
     *  
     * Parameters:
     * responderToAdd - {?}
     */
    register: function(responderToAdd) {
        for (var i = 0; i < this.responders.length; i++){
            if (responderToAdd == this.responders[i]){
                return;
            }
        }
        this.responders.push(responderToAdd);
    },

    /**
     * Method: unregister
     *  
     * Parameters:
     * responderToRemove - {?}
     */
    unregister: function(responderToRemove) {
        OpenLayers.Util.removeItem(this.reponders, responderToRemove);
    },

    /**
     * Method: dispatch
     * 
     * Parameters:
     * callback - {?}
     * request - {?}
     * transport - {?}
     */
    dispatch: function(callback, request, transport) {
        var responder;
        for (var i = 0; i < this.responders.length; i++) {
            responder = this.responders[i];
     
            if (responder[callback] && 
                typeof responder[callback] == 'function') {
                try {
                    responder[callback].apply(responder, 
                                              [request, transport]);
                } catch (e) {}
            }
        }
    }
};

OpenLayers.Ajax.Responders.register({
    /** 
     * Function: onCreate
     */
    onCreate: function() {
        OpenLayers.Ajax.activeRequestCount++;
    },

    /**
     * Function: onComplete
     */
     onComplete: function() {
         OpenLayers.Ajax.activeRequestCount--;
     }
});

/**
 * Class: OpenLayers.Ajax.Base
 */
OpenLayers.Ajax.Base = OpenLayers.Class({
      
    /**
     * Constructor: OpenLayers.Ajax.Base
     * 
     * Parameters: 
     * options - {Object}
     */
    initialize: function(options) {
        this.options = {
            method:       'post',
            asynchronous: true,
            contentType:  'application/xml',
            parameters:   ''
        };
        OpenLayers.Util.extend(this.options, options || {});
        
        this.options.method = this.options.method.toLowerCase();
        
        if (typeof this.options.parameters == 'string') {
            this.options.parameters = 
                OpenLayers.Util.getParameters(this.options.parameters);
        }
    }
});

/**
 * Class: OpenLayers.Ajax.Request
 *
 * Inherit:
 *  - <OpenLayers.Ajax.Base>
 */
OpenLayers.Ajax.Request = OpenLayers.Class(OpenLayers.Ajax.Base, {

    /**
     * Property: _complete
     *
     * {Boolean}
     */
    _complete: false,
      
    /**
     * Constructor: OpenLayers.Ajax.Request
     * 
     * Parameters: 
     * url - {String}
     * options - {Object}
     */
    initialize: function(url, options) {
        OpenLayers.Ajax.Base.prototype.initialize.apply(this, [options]);
        
        if (OpenLayers.ProxyHost && OpenLayers.String.startsWith(url, "http")) {
            url = OpenLayers.ProxyHost + encodeURIComponent(url);
        }
        
        this.transport = OpenLayers.Ajax.getTransport();
        this.request(url);
    },

    /**
     * Method: request
     * 
     * Parameters:
     * url - {String}
     */
    request: function(url) {
        this.url = url;
        this.method = this.options.method;
        var params = OpenLayers.Util.extend({}, this.options.parameters);
        
        if (this.method != 'get' && this.method != 'post') {
            // simulate other verbs over post
            params['_method'] = this.method;
            this.method = 'post';
        }

        this.parameters = params;        
        
        if (params = OpenLayers.Util.getParameterString(params)) {
            // when GET, append parameters to URL
            if (this.method == 'get') {
                this.url += ((this.url.indexOf('?') > -1) ? '&' : '?') + params;
            } else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                params += '&_=';
            }
        }
        try {
            var response = new OpenLayers.Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(response);
            }
            
            OpenLayers.Ajax.Responders.dispatch('onCreate', 
                                                this, 
                                                response);
    
            this.transport.open(this.method.toUpperCase(), 
                                this.url,
                                this.options.asynchronous);
    
            if (this.options.asynchronous) {
                window.setTimeout(
                    OpenLayers.Function.bind(this.respondToReadyState, this, 1),
                    10);
            }
            
            this.transport.onreadystatechange = 
                OpenLayers.Function.bind(this.onStateChange, this);    
            this.setRequestHeaders();
    
            this.body =  this.method == 'post' ?
                (this.options.postBody || params) : null;
            this.transport.send(this.body);
    
            // Force Firefox to handle ready state 4 for synchronous requests
            if (!this.options.asynchronous && 
                this.transport.overrideMimeType) {
                this.onStateChange();
            }
        } catch (e) {
            this.dispatchException(e);
        }
    },

    /**
     * Method: onStateChange
     */
    onStateChange: function() {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState);
        }
    },
     
    /**
     * Method: setRequestHeaders
     */
    setRequestHeaders: function() {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
            'OpenLayers': true
        };

        if (this.method == 'post') {
            headers['Content-type'] = this.options.contentType +
                (this.options.encoding ? '; charset=' + this.options.encoding : '');
    
            /* Force "Connection: close" for older Mozilla browsers to work
             * around a bug where XMLHttpRequest sends an incorrect
             * Content-length header. See Mozilla Bugzilla #246651.
             */
            if (this.transport.overrideMimeType &&
                (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005) {
                headers['Connection'] = 'close';
            }
        }
        // user-defined headers
        if (typeof this.options.requestHeaders == 'object') {    
            var extras = this.options.requestHeaders;
            
            if (typeof extras.push == 'function') {
                for (var i = 0, length = extras.length; i < length; i += 2) {
                    headers[extras[i]] = extras[i+1];
                }
            } else {
                for (var i in extras) {
                    headers[i] = pair[i];
                }
            }
        }
        
        for (var name in headers) {
            this.transport.setRequestHeader(name, headers[name]);
        }
    },
    
    /**
     * Method: success
     *
     * Returns:
     * {Boolean} - 
     */
    success: function() {
        var status = this.getStatus();
        return !status || (status >=200 && status < 300);
    },
    
    /**
     * Method: getStatus
     *
     * Returns:
     * {Integer} - Status
     */
    getStatus: function() {
        try {
            return this.transport.status || 0;
        } catch (e) {
            return 0;
        }
    },

    /**
     * Method: respondToReadyState
     *
     * Parameters:
     * readyState - {?}
     */
    respondToReadyState: function(readyState) {
        var state = OpenLayers.Ajax.Request.Events[readyState];
        var response = new OpenLayers.Ajax.Response(this);
    
        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] ||
                    this.options['on' + (this.success() ? 'Success' : 'Failure')] ||
                    OpenLayers.Ajax.emptyFunction)(response);
            } catch (e) {
                this.dispatchException(e);
            }
    
            var contentType = response.getHeader('Content-type');
        }
    
        try {
            (this.options['on' + state] || 
             OpenLayers.Ajax.emptyFunction)(response);
             OpenLayers.Ajax.Responders.dispatch('on' + state, 
                                                 this, 
                                                 response);
        } catch (e) {
            this.dispatchException(e);
        }
    
        if (state == 'Complete') {
            // avoid memory leak in MSIE: clean up
            this.transport.onreadystatechange = OpenLayers.Ajax.emptyFunction;
        }
    },
    
    /**
     * Method: getHeader
     * 
     * Parameters:
     * name - {String} Header name
     *
     * Returns:
     * {?} - response header for the given name
     */
    getHeader: function(name) {
        try {
            return this.transport.getResponseHeader(name);
        } catch (e) {
            return null;
        }
    },

    /**
     * Method: dispatchException
     * If the optional onException function is set, execute it
     * and then dispatch the call to any other listener registered
     * for onException.
     * 
     * If no optional onException function is set, we suspect that
     * the user may have also not used
     * OpenLayers.Ajax.Responders.register to register a listener
     * for the onException call.  To make sure that something
     * gets done with this exception, only dispatch the call if there
     * are listeners.
     *
     * If you explicitly want to swallow exceptions, set
     * request.options.onException to an empty function (function(){})
     * or register an empty function with <OpenLayers.Ajax.Responders>
     * for onException.
     * 
     * Parameters:
     * exception - {?}
     */
    dispatchException: function(exception) {
        var handler = this.options.onException;
        if(handler) {
            // call options.onException and alert any other listeners
            handler(this, exception);
            OpenLayers.Ajax.Responders.dispatch('onException', this, exception);
        } else {
            // check if there are any other listeners
            var listener = false;
            var responders = OpenLayers.Ajax.Responders.responders;
            for (var i = 0; i < responders.length; i++) {
                if(responders[i].onException) {
                    listener = true;
                    break;
                }
            }
            if(listener) {
                // call all listeners
                OpenLayers.Ajax.Responders.dispatch('onException', this, exception);
            } else {
                // let the exception through
                throw exception;
            }
        }
    }
});

/** 
 * Property: Events
 * {Array(String)}
 */
OpenLayers.Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

/**
 * Class: OpenLayers.Ajax.Response
 */
OpenLayers.Ajax.Response = OpenLayers.Class({

    /**
     * Property: status
     *
     * {Integer}
     */
    status: 0,
    

    /**
     * Property: statusText
     *
     * {String}
     */
    statusText: '',
      
    /**
     * Constructor: OpenLayers.Ajax.Response
     * 
     * Parameters: 
     * request - {Object}
     */
    initialize: function(request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;
        
        if ((readyState > 2 &&
            !(!!(window.attachEvent && !window.opera))) ||
            readyState == 4) {
            this.status       = this.getStatus();
            this.statusText   = this.getStatusText();
            this.responseText = transport.responseText == null ?
                '' : String(transport.responseText);
        }
        
        if(readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML  = xml === undefined ? null : xml;
        }
    },
    
    /**
     * Method: getStatus
     */
    getStatus: OpenLayers.Ajax.Request.prototype.getStatus,
    
    /**
     * Method: getStatustext
     *
     * Returns:
     * {String} - statusText
     */
    getStatusText: function() {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return '';
        }
    },
    
    /**
     * Method: getHeader
     */
    getHeader: OpenLayers.Ajax.Request.prototype.getHeader,
    
    /** 
     * Method: getResponseHeader
     *
     * Returns:
     * {?} - response header for given name
     */
    getResponseHeader: function(name) {
        return this.transport.getResponseHeader(name);
    }
});


/**
 * Function: getElementsByTagNameNS
 * 
 * Parameters:
 * parentnode - {?}
 * nsuri - {?}
 * nsprefix - {?}
 * tagname - {?}
 * 
 * Returns:
 * {?}
 */
OpenLayers.Ajax.getElementsByTagNameNS  = function(parentnode, nsuri, 
                                                   nsprefix, tagname) {
    var elem = null;
    if (parentnode.getElementsByTagNameNS) {
        elem = parentnode.getElementsByTagNameNS(nsuri, tagname);
    } else {
        elem = parentnode.getElementsByTagName(nsprefix + ':' + tagname);
    }
    return elem;
};


/**
 * Function: serializeXMLToString
 * Wrapper function around XMLSerializer, which doesn't exist/work in
 *     IE/Safari. We need to come up with a way to serialize in those browser:
 *     for now, these browsers will just fail. #535, #536
 *
 * Parameters: 
 * xmldom {XMLNode} xml dom to serialize
 * 
 * Returns:
 * {?}
 */
OpenLayers.Ajax.serializeXMLToString = function(xmldom) {
    var serializer = new XMLSerializer();
    var data = serializer.serializeToString(xmldom);
    return data;
};
/* ======================================================================
    OpenLayers/Console.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Namespace: OpenLayers.Console
 * The OpenLayers.Console namespace is used for debugging and error logging.
 * If the Firebug Lite (../Firebug/firebug.js) is included before this script,
 * calls to OpenLayers.Console methods will get redirected to window.console.
 * This makes use of the Firebug extension where available and allows for
 * cross-browser debugging Firebug style.
 *
 * Note:
 * Note that behavior will differ with the Firebug extention and Firebug Lite.
 * Most notably, the Firebug Lite console does not currently allow for
 * hyperlinks to code or for clicking on object to explore their properties.
 * 
 */
OpenLayers.Console = {
    /**
     * Create empty functions for all console methods.  The real value of these
     * properties will be set if Firebug Lite (../Firebug/firebug.js script) is
     * included.  We explicitly require the Firebug Lite script to trigger
     * functionality of the OpenLayers.Console methods.
     */
    
    /**
     * APIFunction: log
     * Log an object in the console.  The Firebug Lite console logs string
     * representation of objects.  Given multiple arguments, they will
     * be cast to strings and logged with a space delimiter.  If the first
     * argument is a string with printf-like formatting, subsequent arguments
     * will be used in string substitution.  Any additional arguments (beyond
     * the number substituted in a format string) will be appended in a space-
     * delimited line.
     * 
     * Parameters:
     * object - {Object}
     */
    log: function() {},

    /**
     * APIFunction: debug
     * Writes a message to the console, including a hyperlink to the line
     * where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    debug: function() {},

    /**
     * APIFunction: info
     * Writes a message to the console with the visual "info" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    info: function() {},

    /**
     * APIFunction: warn
     * Writes a message to the console with the visual "warning" icon and
     * color coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    warn: function() {},

    /**
     * APIFunction: error
     * Writes a message to the console with the visual "error" icon and color
     * coding and a hyperlink to the line where it was called.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    error: function() {},

    /**
     * APIFunction: assert
     * Tests that an expression is true. If not, it will write a message to
     * the console and throw an exception.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    assert: function() {},

    /**
     * APIFunction: dir
     * Prints an interactive listing of all properties of the object. This
     * looks identical to the view that you would see in the DOM tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dir: function() {},

    /**
     * APIFunction: dirxml
     * Prints the XML source tree of an HTML or XML element. This looks
     * identical to the view that you would see in the HTML tab. You can click
     * on any node to inspect it in the HTML tab.
     * 
     * Parameters:
     * object - {Object}
     */
    dirxml: function() {},

    /**
     * APIFunction: trace
     * Prints an interactive stack trace of JavaScript execution at the point
     * where it is called.  The stack trace details the functions on the stack,
     * as well as the values that were passed as arguments to each function.
     * You can click each function to take you to its source in the Script tab,
     * and click each argument value to inspect it in the DOM or HTML tabs.
     * 
     */
    trace: function() {},

    /**
     * APIFunction: group
     * Writes a message to the console and opens a nested block to indent all
     * future messages sent to the console. Call OpenLayers.Console.groupEnd()
     * to close the block.
     *
     * May be called with multiple arguments as with OpenLayers.Console.log().
     * 
     * Parameters:
     * object - {Object}
     */
    group: function() {},

    /**
     * APIFunction: groupEnd
     * Closes the most recently opened block created by a call to
     * OpenLayers.Console.group
     */
    groupEnd: function() {},
    
    /**
     * APIFunction: time
     * Creates a new timer under the given name. Call
     * OpenLayers.Console.timeEnd(name)
     * with the same name to stop the timer and print the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    time: function() {},

    /**
     * APIFunction: timeEnd
     * Stops a timer created by a call to OpenLayers.Console.time(name) and
     * writes the time elapsed.
     *
     * Parameters:
     * name - {String}
     */
    timeEnd: function() {},

    /**
     * APIFunction: profile
     * Turns on the JavaScript profiler. The optional argument title would
     * contain the text to be printed in the header of the profile report.
     *
     * This function is not currently implemented in Firebug Lite.
     * 
     * Parameters:
     * title - {String} Optional title for the profiler
     */
    profile: function() {},

    /**
     * APIFunction: profileEnd
     * Turns off the JavaScript profiler and prints its report.
     * 
     * This function is not currently implemented in Firebug Lite.
     */
    profileEnd: function() {},

    /**
     * APIFunction: count
     * Writes the number of times that the line of code where count was called
     * was executed. The optional argument title will print a message in
     * addition to the number of the count.
     *
     * This function is not currently implemented in Firebug Lite.
     *
     * Parameters:
     * title - {String} Optional title to be printed with count
     */
    count: function() {},

    CLASS_NAME: "OpenLayers.Console"
};

/**
 * Execute an anonymous function to extend the OpenLayers.Console namespace
 * if the firebug.js script is included.  This closure is used so that the
 * "scripts" and "i" variables don't pollute the global namespace.
 */
(function() {
    /**
     * If Firebug Lite is included (before this script), re-route all
     * OpenLayers.Console calls to the console object.
     */
    if(window.console) {
        var scripts = document.getElementsByTagName("script");
        for(var i=0; i<scripts.length; ++i) {
            if(scripts[i].src.indexOf("firebug.js") != -1) {
                OpenLayers.Util.extend(OpenLayers.Console, console);
                break;
            }
        }
    }
})();
/* ======================================================================
    OpenLayers/BaseTypes/Size.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.Size
 * Instances of this class represent a width/height pair
 */
OpenLayers.Size = OpenLayers.Class({

    /**
     * APIProperty: w
     * {Number} width
     */
    w: 0.0,
    
    /**
     * APIProperty: h
     * {Number} height
     */
    h: 0.0,


    /**
     * Constructor: OpenLayers.Size
     * Create an instance of OpenLayers.Size
     *
     * Parameters:
     * w - {Number} width
     * h - {Number} height
     */
    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

    /**
     * Method: toString
     * Return the string representation of a size object
     *
     * Returns:
     * {String} The string representation of OpenLayers.Size object. 
     * (ex. <i>"w=55,h=66"</i>)
     */
    toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    /**
     * APIMethod: clone
     * Create a clone of this size object
     *
     * Returns:
     * {<OpenLayers.Size>} A new OpenLayers.Size object with the same w and h
     * values
     */
    clone:function() {
        return new OpenLayers.Size(this.w, this.h);
    },

    /**
     *
     * APIMethod: equals
     * Determine where this size is equal to another
     *
     * Parameters:
     * sz - {<OpenLayers.Size>}
     *
     * Returns: 
     * {Boolean} The passed in size has the same h and w properties as this one.
     * Note that if sz passed in is null, returns false.
     *
     */
    equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "OpenLayers.Size"
});
/* ======================================================================
    OpenLayers/BaseTypes/Bounds.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.Bounds
 * Instances of this class represent bounding boxes.  Data stored as left,
 * bottom, right, top floats. All values are initialized to null, however,
 * you should make sure you set them before using the bounds for anything.
 * 
 * Possible use case:
 * > bounds = new OpenLayers.Bounds();
 * > bounds.extend(new OpenLayers.LonLat(4,5));
 * > bounds.extend(new OpenLayers.LonLat(5,6));
 * > bounds.toBBOX(); // returns 4,5,5,6
 */
OpenLayers.Bounds = OpenLayers.Class({

    /**
     * Property: left
     * {Number} Minimum horizontal coordinate.
     */
    left: null,

    /**
     * Property: bottom
     * {Number} Minimum vertical coordinate.
     */
    bottom: null,

    /**
     * Property: right
     * {Number} Maximum horizontal coordinate.
     */
    right: null,

    /**
     * Property: top
     * {Number} Maximum vertical coordinate.
     */
    top: null,    

    /**
     * Constructor: OpenLayers.Bounds
     * Construct a new bounds object.
     *
     * Parameters:
     * left - {Number} The left bounds of the box.  Note that for width
     *        calculations, this is assumed to be less than the right value.
     * bottom - {Number} The bottom bounds of the box.  Note that for height
     *          calculations, this is assumed to be more than the top value.
     * right - {Number} The right bounds.
     * top - {Number} The top bounds.
     */
    initialize: function(left, bottom, right, top) {
        if (left != null) {
            this.left = parseFloat(left);
        }
        if (bottom != null) {
            this.bottom = parseFloat(bottom);
        }
        if (right != null) {
            this.right = parseFloat(right);
        }
        if (top != null) {
            this.top = parseFloat(top);
        }
    },

    /**
     * Method: clone
     * Create a cloned instance of this bounds.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A fresh copy of the bounds
     */
    clone:function() {
        return new OpenLayers.Bounds(this.left, this.bottom, 
                                     this.right, this.top);
    },

    /**
     * Method: equals
     * Test a two bounds for equivalence.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {Boolean} The passed-in bounds object has the same left,
     *           right, top, bottom components as this.  Note that if bounds 
     *           passed in is null, returns false.
     */
    equals:function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    },

    /** 
     * APIMethod: toString
     * 
     * Returns:
     * {String} String representation of bounds object. 
     *          (ex.<i>"left-bottom=(5,42) right-top=(10,45)"</i>)
     */
    toString:function() {
        return ( "left-bottom=(" + this.left + "," + this.bottom + ")"
                 + " right-top=(" + this.right + "," + this.top + ")" );
    },

    /**
     * APIMethod: toArray
     *
     * Returns:
     * {Array} array of left, bottom, right, top
     */
    toArray: function() {
        return [this.left, this.bottom, this.right, this.top];
    },    

    /** 
     * APIMethod: toBBOX
     * 
     * Parameters:
     * decimal - {Integer} How many significant digits in the bbox coords?
     *                     Default is 6
     * 
     * Returns:
     * {String} Simple String representation of bounds object.
     *          (ex. <i>"5,42,10,45"</i>)
     */
    toBBOX:function(decimal) {
        if (decimal== null) {
            decimal = 6; 
        }
        var mult = Math.pow(10, decimal);
        var bbox = Math.round(this.left * mult) / mult + "," + 
                   Math.round(this.bottom * mult) / mult + "," + 
                   Math.round(this.right * mult) / mult + "," + 
                   Math.round(this.top * mult) / mult;

        return bbox;
    },
    
    /**
     * APIMethod: toGeometry
     * Create a new polygon geometry based on this bounds.
     *
     * Returns:
     * {<OpenLayers.Geometry.Polygon>} A new polygon with the coordinates
     *     of this bounds.
     */
    toGeometry: function() {
        return new OpenLayers.Geometry.Polygon([
            new OpenLayers.Geometry.LinearRing([
                new OpenLayers.Geometry.Point(this.left, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.bottom),
                new OpenLayers.Geometry.Point(this.right, this.top),
                new OpenLayers.Geometry.Point(this.left, this.top)
            ])
        ]);
    },
    
    /**
     * APIMethod: getWidth
     * 
     * Returns:
     * {Float} The width of the bounds
     */
    getWidth:function() {
        return (this.right - this.left);
    },

    /**
     * APIMethod: getHeight
     * 
     * Returns:
     * {Float} The height of the bounds (top minus bottom).
     */
    getHeight:function() {
        return (this.top - this.bottom);
    },

    /**
     * APIMethod: getSize
     * 
     * Returns:
     * {<OpenLayers.Size>} The size of the box.
     */
    getSize:function() {
        return new OpenLayers.Size(this.getWidth(), this.getHeight());
    },

    /**
     * APIMethod: getCenterPixel
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The center of the bounds in pixel space.
     */
    getCenterPixel:function() {
        return new OpenLayers.Pixel( (this.left + this.right) / 2,
                                     (this.bottom + this.top) / 2);
    },

    /**
     * APIMethod: getCenterLonLat
     * 
     * Returns:
     * {<OpenLayers.LonLat>} The center of the bounds in map space.
     */
    getCenterLonLat:function() {
        return new OpenLayers.LonLat( (this.left + this.right) / 2,
                                      (this.bottom + this.top) / 2);
    },

    /**
     * APIMethod: add
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A new bounds whose coordinates are the same as
     *     this, but shifted by the passed-in x and y values.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            var msg = OpenLayers.i18n("boundsAddError");
            OpenLayers.Console.error(msg);
            return null;
        }
        return new OpenLayers.Bounds(this.left + x, this.bottom + y,
                                     this.right + x, this.top + y);
    },
    
    /**
     * APIMethod: extend
     * Extend the bounds to include the point, lonlat, or bounds specified.
     *     Note, this function assumes that left < right and bottom < top.
     * 
     * Parameters: 
     * object - {Object} Can be LonLat, Point, or Bounds
     */
    extend:function(object) {
        var bounds = null;
        if (object) {
            switch(object.CLASS_NAME) {
                case "OpenLayers.LonLat":    
                    bounds = new OpenLayers.Bounds(object.lon, object.lat,
                                                    object.lon, object.lat);
                    break;
                case "OpenLayers.Geometry.Point":
                    bounds = new OpenLayers.Bounds(object.x, object.y,
                                                    object.x, object.y);
                    break;
                    
                case "OpenLayers.Bounds":    
                    bounds = object;
                    break;
            }
    
            if (bounds) {
                if ( (this.left == null) || (bounds.left < this.left)) {
                    this.left = bounds.left;
                }
                if ( (this.bottom == null) || (bounds.bottom < this.bottom) ) {
                    this.bottom = bounds.bottom;
                } 
                if ( (this.right == null) || (bounds.right > this.right) ) {
                    this.right = bounds.right;
                }
                if ( (this.top == null) || (bounds.top > this.top) ) { 
                    this.top = bounds.top;
                }
            }
        }
    },

    /**
     * APIMethod: containsLonLat
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>}
     * inclusive - {Boolean} Whether or not to include the border.
     *     Default is true.
     *
     * Returns:
     * {Boolean} The passed-in lonlat is within this bounds.
     */
    containsLonLat:function(ll, inclusive) {
        return this.contains(ll.lon, ll.lat, inclusive);
    },

    /**
     * APIMethod: containsPixel
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in pixel is within this bounds.
     */
    containsPixel:function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    
    /**
     * APIMethod: contains
     * 
     * Parameters:
     * x - {Float}
     * y - {Float}
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} Whether or not the passed-in coordinates are within this
     *     bounds.
     */
    contains:function(x, y, inclusive) {
    
        //set default
        if (inclusive == null) {
            inclusive = true;
        }
        
        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && 
                        (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && 
                        (y > this.bottom) && (y < this.top));
        }              
        return contains;
    },

    /**
     * APIMethod: intersectsBounds
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * inclusive - {Boolean} Whether or not to include the border.  Default
     *     is true.
     *
     * Returns:
     * {Boolean} The passed-in OpenLayers.Bounds object intersects this bounds.
     *     Simple math just check if either contains the other, allowing for
     *     partial.
     */
    intersectsBounds:function(bounds, inclusive) {

        if (inclusive == null) {
            inclusive = true;
        }
        var inBottom = (bounds.bottom == this.bottom && bounds.top == this.top) ?
                    true : (((bounds.bottom > this.bottom) && (bounds.bottom < this.top)) || 
                           ((this.bottom > bounds.bottom) && (this.bottom < bounds.top))); 
        var inTop = (bounds.bottom == this.bottom && bounds.top == this.top) ?
                    true : (((bounds.top > this.bottom) && (bounds.top < this.top)) ||
                           ((this.top > bounds.bottom) && (this.top < bounds.top))); 
        var inRight = (bounds.right == this.right && bounds.left == this.left) ?
                    true : (((bounds.right > this.left) && (bounds.right < this.right)) ||
                           ((this.right > bounds.left) && (this.right < bounds.right))); 
        var inLeft = (bounds.right == this.right && bounds.left == this.left) ?
                    true : (((bounds.left > this.left) && (bounds.left < this.right)) || 
                           ((this.left > bounds.left) && (this.left < bounds.right))); 

        return (this.containsBounds(bounds, true, inclusive) ||
                bounds.containsBounds(this, true, inclusive) ||
                ((inTop || inBottom ) && (inLeft || inRight )));
    },
    
    /**
     * APIMethod: containsBounds
     * 
     * bounds - {<OpenLayers.Bounds>}
     * partial - {Boolean} If true, only part of passed-in bounds needs be
     *     within this bounds.  If false, the entire passed-in bounds must be
     *     within. Default is false
     * inclusive - {Boolean} Whether or not to include the border. Default is
     *     true.
     *
     * Returns:
     * {Boolean} The passed-in bounds object is contained within this bounds. 
     */
    containsBounds:function(bounds, partial, inclusive) {

        //set defaults
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }

        var inLeft;
        var inTop;
        var inRight;
        var inBottom;
        
        if (inclusive) {
            inLeft = (bounds.left >= this.left) && (bounds.left <= this.right);
            inTop = (bounds.top >= this.bottom) && (bounds.top <= this.top);
            inRight= (bounds.right >= this.left) && (bounds.right <= this.right);
            inBottom = (bounds.bottom >= this.bottom) && (bounds.bottom <= this.top);
        } else {
            inLeft = (bounds.left > this.left) && (bounds.left < this.right);
            inTop = (bounds.top > this.bottom) && (bounds.top < this.top);
            inRight= (bounds.right > this.left) && (bounds.right < this.right);
            inBottom = (bounds.bottom > this.bottom) && (bounds.bottom < this.top);
        }
        
        return (partial) ? (inTop || inBottom ) && (inLeft || inRight ) 
                         : (inTop && inLeft && inBottom && inRight);
    },

    /** 
     * APIMethod: determineQuadrant
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {String} The quadrant ("br" "tr" "tl" "bl") of the bounds in which the
     *     coordinate lies.
     */
    determineQuadrant: function(lonlat) {
    
        var quadrant = "";
        var center = this.getCenterLonLat();
        
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
    
        return quadrant; 
    },
    
    /**
     * APIMethod: transform
     * Transform the Bounds object from source to dest. 
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.Bounds>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        var ll = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.bottom}, source, dest);
        var lr = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.bottom}, source, dest);
        var ul = OpenLayers.Projection.transform(
            {'x': this.left, 'y': this.top}, source, dest);
        var ur = OpenLayers.Projection.transform(
            {'x': this.right, 'y': this.top}, source, dest);
        this.left   = Math.min(ll.x, ul.x);
        this.bottom = Math.min(ll.y, lr.y);
        this.right  = Math.max(lr.x, ur.x);
        this.top    = Math.max(ul.y, ur.y);
        return this;
    },

    /**
     * APIMethod: wrapDateLine
     *  
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * options - {Object} Some possible options are:
     *                    leftTolerance - {float} Allow for a margin of error 
     *                                            with the 'left' value of this 
     *                                            bound.
     *                                            Default is 0.
     *                    rightTolerance - {float} Allow for a margin of error 
     *                                             with the 'right' value of 
     *                                             this bound.
     *                                             Default is 0.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A copy of this bounds, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent). Note that this function only returns 
     *                       a different bounds value if this bounds is 
     *                       *entirely* outside of the maxExtent. If this 
     *                       bounds straddles the dateline (is part in/part 
     *                       out of maxExtent), the returned bounds will be 
     *                       merely a copy of this one.
     */
    wrapDateLine: function(maxExtent, options) {    
        options = options || {};
        
        var leftTolerance = options.leftTolerance || 0;
        var rightTolerance = options.rightTolerance || 0;

        var newBounds = this.clone();
    
        if (maxExtent) {

           //shift right?
           while ( newBounds.left < maxExtent.left && 
                   (newBounds.right - rightTolerance) <= maxExtent.left ) { 
                newBounds = newBounds.add(maxExtent.getWidth(), 0);
           }

           //shift left?
           while ( (newBounds.left + leftTolerance) >= maxExtent.right && 
                   newBounds.right > maxExtent.right ) { 
                newBounds = newBounds.add(-maxExtent.getWidth(), 0);
           }
        }
                
        return newBounds;
    },

    CLASS_NAME: "OpenLayers.Bounds"
});

/** 
 * APIFunction: fromString
 * Alternative constructor that builds a new OpenLayers.Bounds from a 
 *     parameter string
 * 
 * Parameters: 
 * str - {String}Comma-separated bounds string. (ex. <i>"5,42,10,45"</i>)
 * 
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the 
 *                       passed-in String.
 */
OpenLayers.Bounds.fromString = function(str) {
    var bounds = str.split(",");
    return OpenLayers.Bounds.fromArray(bounds);
};

/** 
 * APIFunction: fromArray
 * Alternative constructor that builds a new OpenLayers.Bounds
 *     from an array
 * 
 * Parameters:
 * bbox - {Array(Float)} Array of bounds values (ex. <i>[5,42,10,45]</i>)
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in Array.
 */
OpenLayers.Bounds.fromArray = function(bbox) {
    return new OpenLayers.Bounds(parseFloat(bbox[0]),
                                 parseFloat(bbox[1]),
                                 parseFloat(bbox[2]),
                                 parseFloat(bbox[3]));
};

/** 
 * APIFunction: fromSize
 * Alternative constructor that builds a new OpenLayers.Bounds
 *     from a size
 * 
 * Parameters:
 * size - {<OpenLayers.Size>} 
 *
 * Returns:
 * {<OpenLayers.Bounds>} New bounds object built from the passed-in size.
 */
OpenLayers.Bounds.fromSize = function(size) {
    return new OpenLayers.Bounds(0,
                                 size.h,
                                 size.w,
                                 0);
};

/**
 * Function: oppositeQuadrant
 * Get the opposite quadrant for a given quadrant string.
 *
 * Parameters:
 * quadrant - {String} two character quadrant shortstring
 *
 * Returns:
 * {String} The opposing quadrant ("br" "tr" "tl" "bl"). For Example, if 
 *          you pass in "bl" it returns "tr", if you pass in "br" it 
 *          returns "tl", etc.
 */
OpenLayers.Bounds.oppositeQuadrant = function(quadrant) {
    var opp = "";
    
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    
    return opp;
};
/* ======================================================================
    OpenLayers/BaseTypes/Element.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Namespace: OpenLayers.Element
 */
OpenLayers.Element = {

    /**
     * APIFunction: visible
     * 
     * Parameters: 
     * element - {DOMElement}
     * 
     * Returns:
     * {Boolean} Is the element visible?
     */
    visible: function(element) {
        return OpenLayers.Util.getElement(element).style.display != 'none';
    },

    /**
     * APIFunction: toggle
     * Toggle the visibility of element(s) passed in
     * 
     * Parameters:
     * element - {DOMElement} Actually user can pass any number of elements
     */
    toggle: function() {
        for (var i = 0; i < arguments.length; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            var display = OpenLayers.Element.visible(element) ? 'hide' 
                                                              : 'show';
            OpenLayers.Element[display](element);
        }
    },


    /**
     * APIFunction: hide
     * Hide element(s) passed in
     * 
     * Parameters:
     * element - {DOMElement} Actually user can pass any number of elements
     */
    hide: function() {
        for (var i = 0; i < arguments.length; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            element.style.display = 'none';
        }
    },

    /**
     * APIFunction: show
     * Show element(s) passed in
     * 
     * Parameters:
     * element - {DOMElement} Actually user can pass any number of elements
     */
    show: function() {
        for (var i = 0; i < arguments.length; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            element.style.display = '';
        }
    },

    /**
     * APIFunction: remove
     * Remove the specified element from the DOM.
     * 
     * Parameters:
     * element - {DOMElement}
     */
    remove: function(element) {
        element = OpenLayers.Util.getElement(element);
        element.parentNode.removeChild(element);
    },

    /**
     * APIFunction: getHeight
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Integer} The offset height of the element passed in
     */
    getHeight: function(element) {
        element = OpenLayers.Util.getElement(element);
        return element.offsetHeight;
    },

    /**
     * APIFunction: getDimensions
     *  
     * Parameters:
     * element - {DOMElement}
     * 
     * Returns:
     * {Object} Object with 'width' and 'height' properties which are the 
     *          dimensions of the element passed in.
     */
    getDimensions: function(element) {
        element = OpenLayers.Util.getElement(element);
        if (OpenLayers.Element.getStyle(element, 'display') != 'none') {
            return {width: element.offsetWidth, height: element.offsetHeight};
        }
    
        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = '';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = 'none';
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return {width: originalWidth, height: originalHeight};
    },

    /**
     * APIFunction: getStyle
     * 
     * Parameters:
     * element - {DOMElement}
     * style - {?}
     * 
     * Returns:
     * {?}
     */
    getStyle: function(element, style) {
        element = OpenLayers.Util.getElement(element);
        var value = element.style[OpenLayers.String.camelize(style)];
        if (!value) {
            if (document.defaultView && 
                document.defaultView.getComputedStyle) {
                
                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(style) : null;
            } else if (element.currentStyle) {
                value = element.currentStyle[OpenLayers.String.camelize(style)];
            }
        }
    
        var positions = ['left', 'top', 'right', 'bottom'];
        if (window.opera &&
            (OpenLayers.Util.indexOf(positions,style) != -1) &&
            (OpenLayers.Element.getStyle(element, 'position') == 'static')) { 
            value = 'auto';
        }
    
        return value == 'auto' ? null : value;
    }

};
/* ======================================================================
    OpenLayers/BaseTypes/LonLat.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.LonLat
 * This class represents a longitude and latitude pair
 */
OpenLayers.LonLat = OpenLayers.Class({

    /** 
     * APIProperty: lon
     * {Float} The x-axis coodinate in map units
     */
    lon: 0.0,
    
    /** 
     * APIProperty: lat
     * {Float} The y-axis coordinate in map units
     */
    lat: 0.0,

    /**
     * Constructor: OpenLayers.LonLat
     * Create a new map location.
     *
     * Parameters:
     * lon - {Number} The x-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Longitude.  Otherwise,
     *     it will be the x coordinate of the map location in your map units.
     * lat - {Number} The y-axis coordinate in map units.  If your map is in
     *     a geographic projection, this will be the Latitude.  Otherwise,
     *     it will be the y coordinate of the map location in your map units.
     */
    initialize: function(lon, lat) {
        this.lon = parseFloat(lon);
        this.lat = parseFloat(lat);
    },
    
    /**
     * Method: toString
     * Return a readable string version of the lonlat
     *
     * Returns:
     * {String} String representation of OpenLayers.LonLat object. 
     *           (ex. <i>"lon=5,lat=42"</i>)
     */
    toString:function() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Returns:
     * {String} Shortened String representation of OpenLayers.LonLat object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.lon + ", " + this.lat);
    },

    /** 
     * APIMethod: clone
     * 
     * Returns:
     * {<OpenLayers.LonLat>} New OpenLayers.LonLat object with the same lon 
     *                       and lat values
     */
    clone:function() {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },

    /** 
     * APIMethod: add
     * 
     * Parameters:
     * lon - {Float}
     * lat - {Float}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A new OpenLayers.LonLat object with the lon and 
     *                       lat passed-in added to this's. 
     */
    add:function(lon, lat) {
        if ( (lon == null) || (lat == null) ) {
            var msg = OpenLayers.i18n("lonlatAddError");
            OpenLayers.Console.error(msg);
            return null;
        }
        return new OpenLayers.LonLat(this.lon + lon, this.lat + lat);
    },

    /** 
     * APIMethod: equals
     * 
     * Parameters:
     * ll - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Boolean} Boolean value indicating whether the passed-in 
     *           <OpenLayers.LonLat> object has the same lon and lat 
     *           components as this.
     *           Note: if ll passed in is null, returns false
     */
    equals:function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) ||
                      (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },

    /**
     * APIMethod: transform
     * Transform the LonLat object from source to dest. 
     *
     * Parameters: 
     * source - {<OpenLayers.Projection>} Source projection. 
     * dest   - {<OpenLayers.Projection>} Destination projection. 
     *
     * Returns:
     * {<OpenLayers.LonLat>} Itself, for use in chaining operations.
     */
    transform: function(source, dest) {
        var point = OpenLayers.Projection.transform(
            {'x': this.lon, 'y': this.lat}, source, dest);
        this.lon = point.x;
        this.lat = point.y;
        return this;
    },
    
    /**
     * APIMethod: wrapDateLine
     * 
     * Parameters:
     * maxExtent - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} A copy of this lonlat, but wrapped around the 
     *                       "dateline" (as specified by the borders of 
     *                       maxExtent)
     */
    wrapDateLine: function(maxExtent) {    

        var newLonLat = this.clone();
    
        if (maxExtent) {
            //shift right?
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon +=  maxExtent.getWidth();
            }    
           
            //shift left?
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }    
        }
                
        return newLonLat;
    },

    CLASS_NAME: "OpenLayers.LonLat"
});

/** 
 * Function: fromString
 * Alternative constructor that builds a new <OpenLayers.LonLat> from a 
 *     parameter string
 * 
 * Parameters:
 * str - {String} Comma-separated Lon,Lat coordinate string. 
 *                 (ex. <i>"5,40"</i>)
 * 
 * Returns:
 * {<OpenLayers.LonLat>} New <OpenLayers.LonLat> object built from the 
 *                       passed-in String.
 */
OpenLayers.LonLat.fromString = function(str) {
    var pair = str.split(",");
    return new OpenLayers.LonLat(parseFloat(pair[0]), 
                                 parseFloat(pair[1]));
};
/* ======================================================================
    OpenLayers/BaseTypes/Pixel.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.Pixel
 * This class represents a screen coordinate, in x and y coordinates
 */
OpenLayers.Pixel = OpenLayers.Class({
    
    /**
     * APIProperty: x
     * {Number} The x coordinate
     */
    x: 0.0,

    /**
     * APIProperty: y
     * {Number} The y coordinate
     */
    y: 0.0,
    
    /**
     * Constructor: OpenLayers.Pixel
     * Create a new OpenLayers.Pixel instance
     *
     * Parameters:
     * x - {Number} The x coordinate
     * y - {Number} The y coordinate
     *
     * Returns:
     * An instance of OpenLayers.Pixel
     */
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
    /**
     * Method: toString
     * Cast this object into a string
     *
     * Returns:
     * {String} The string representation of Pixel. ex: "x=200.4,y=242.2"
     */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /**
     * APIMethod: clone
     * Return a clone of this pixel object
     *
     * Returns:
     * {<OpenLayers.Pixel>} A clone pixel
     */
    clone:function() {
        return new OpenLayers.Pixel(this.x, this.y); 
    },
    
    /**
     * APIMethod: equals
     * Determine whether one pixel is equivalent to another
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {Boolean} The point passed in as parameter is equal to this. Note that
     * if px passed in is null, returns false.
     */
    equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    /**
     * APIMethod: add
     *
     * Parameters:
     * x - {Integer}
     * y - {Integer}
     *
     * Returns:
     * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
     * values passed in.
     */
    add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            var msg = OpenLayers.i18n("pixelAddError");
            OpenLayers.Console.error(msg);
            return null;
        }
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },

    /**
    * APIMethod: offset
    * 
    * Parameters
    * px - {<OpenLayers.Pixel>}
    * 
    * Returns:
    * {<OpenLayers.Pixel>} A new Pixel with this pixel's x&y augmented by the 
    *                      x&y values of the pixel passed in.
    */
    offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "OpenLayers.Pixel"
});
/* ======================================================================
    OpenLayers/Control.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.Control
 * Controls affect the display or behavior of the map. They allow everything
 * from panning and zooming to displaying a scale indicator. Controls by 
 * default are added to the map they are contained within however it is
 * possible to add a control to an external div by passing the div in the
 * options parameter.
 * 
 * Example:
 * The following example shows how to add many of the common controls
 * to a map.
 * 
 * > var map = new OpenLayers.Map('map', { controls: [] });
 * >
 * > map.addControl(new OpenLayers.Control.PanZoomBar());
 * > map.addControl(new OpenLayers.Control.MouseToolbar());
 * > map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
 * > map.addControl(new OpenLayers.Control.Permalink());
 * > map.addControl(new OpenLayers.Control.Permalink('permalink'));
 * > map.addControl(new OpenLayers.Control.MousePosition());
 * > map.addControl(new OpenLayers.Control.OverviewMap());
 * > map.addControl(new OpenLayers.Control.KeyboardDefaults());
 *
 * The next code fragment is a quick example of how to intercept 
 * shift-mouse click to display the extent of the bounding box
 * dragged out by the user.  Usually controls are not created
 * in exactly this manner.  See the source for a more complete 
 * example:
 *
 * > var control = new OpenLayers.Control();
 * > OpenLayers.Util.extend(control, {
 * >     draw: function () {
 * >         // this Handler.Box will intercept the shift-mousedown
 * >         // before Control.MouseDefault gets to see it
 * >         this.box = new OpenLayers.Handler.Box( control, 
 * >             {"done": this.notice},
 * >             {keyMask: OpenLayers.Handler.MOD_SHIFT});
 * >         this.box.activate();
 * >     },
 * >
 * >     notice: function (bounds) {
 * >         alert(bounds);
 * >     }
 * > }); 
 * > map.addControl(control);
 * 
 */
OpenLayers.Control = OpenLayers.Class({

    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    
    /** 
     * Property: map 
     * {<OpenLayers.Map>} this gets set in the addControl() function in
     * OpenLayers.Map 
     */
    map: null,

    /** 
     * Property: div 
     * {DOMElement} 
     */
    div: null,

    /** 
     * Property: type 
     * {OpenLayers.Control.TYPES} Controls can have a 'type'. The type
     * determines the type of interactions which are possible with them when
     * they are placed into a toolbar. 
     */
    type: null, 

    /** 
     * Property: allowSelection
     * {Boolean} By deafault, controls do not allow selection, because
     * it may interfere with map dragging. If this is true, OpenLayers
     * will not prevent selection of the control.
     * Default is false.
     */
    allowSelection: false,  

    /** 
     * Property: displayClass 
     * {string}  This property is used for CSS related to the drawing of the
     * Control. 
     */
    displayClass: "",
    
    /**
    * Property: title  
    * {string}  This property is used for showing a tooltip over the  
    * Control.  
    */ 
    title: "",

    /** 
     * Property: active 
     * {Boolean} The control is active.
     */
    active: null,

    /** 
     * Property: handler 
     * {<OpenLayers.Handler>} null
     */
    handler: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /** 
     * Property: events
     * {<OpenLayers.Events>} Events instance for triggering control specific
     *     events.
     */
    events: null,

    /**
     * Constant: EVENT_TYPES
     * {Array(String)} Supported application event types.  Register a listener
     *     for a particular event with the following syntax:
     * (code)
     * control.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     *  - *object* {Object} A reference to control.events.object (a reference
     *      to the control).
     *  - *element* {DOMElement} A reference to control.events.element (which
     *      will be null unless documented otherwise).
     *
     * Supported map event types:
     *  - *activate* Triggered when activated.
     *  - *deactivate* Triggered when deactivated.
     */
    EVENT_TYPES: ["activate", "deactivate"],

    /**
     * Constructor: OpenLayers.Control
     * Create an OpenLayers Control.  The options passed as a parameter
     * directly extend the control.  For example passing the following:
     * 
     * > var control = new OpenLayers.Control({div: myDiv});
     *
     * Overrides the default div attribute value of null.
     * 
     * Parameters:
     * options - {Object} 
     */
    initialize: function (options) {
        // We do this before the extend so that instances can override
        // className in options.
        this.displayClass = 
            this.CLASS_NAME.replace("OpenLayers.", "ol").replace(/\./g, "");
        
        OpenLayers.Util.extend(this, options);
        
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function () {
        if(this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
            this.events = null;
        }
        this.eventListeners = null;

        // eliminate circular references
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
        if(this.handlers) {
            for(var key in this.handlers) {
                if(this.handlers.hasOwnProperty(key) &&
                   typeof this.handlers[key].destroy == "function") {
                    this.handlers[key].destroy();
                }
            }
            this.handlers = null;
        }
        if (this.map) {
            this.map.removeControl(this);
            this.map = null;
        }
    },

    /** 
     * Method: setMap
     * Set the map property for the control. This is done through an accessor
     * so that subclasses can override this and take special action once 
     * they have their map variable set. 
     *
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        this.map = map;
        if (this.handler) {
            this.handler.setMap(map);
        }
    },
  
    /**
     * Method: draw
     * The draw method is called when the control is ready to be displayed
     * on the page.  If a div has not been created one is created.  Controls
     * with a visual component will almost always want to override this method 
     * to customize the look of control. 
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} The top-left pixel position of the control
     *      or null.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    draw: function (px) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.className = this.displayClass;
            if (!this.allowSelection) {
                this.div.className += " olControlNoSelect";
                this.div.setAttribute("unselectable", "on", 0);
                this.div.onselectstart = function() { return(false); }; 
            }    
            if (this.title != "") {
                this.div.title = this.title;
            }
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);
        return this.div;
    },

    /**
     * Method: moveTo
     * Sets the left and top style attributes to the passed in pixel 
     * coordinates.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     */
    moveTo: function (px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * Method: activate
     * Explicitly activates a control and it's associated
     * handler if one has been set.  Controls can be
     * deactivated by calling the deactivate() method.
     * 
     * Returns:
     * {Boolean}  True if the control was successfully activated or
     *            false if the control was already active.
     */
    activate: function () {
        if (this.active) {
            return false;
        }
        if (this.handler) {
            this.handler.activate();
        }
        this.active = true;
        this.events.triggerEvent("activate");
        return true;
    },
    
    /**
     * Method: deactivate
     * Deactivates a control and it's associated handler if any.  The exact
     * effect of this depends on the control itself.
     * 
     * Returns:
     * {Boolean} True if the control was effectively deactivated or false
     *           if the control was already inactive.
     */
    deactivate: function () {
        if (this.active) {
            if (this.handler) {
                this.handler.deactivate();
            }
            this.active = false;
            this.events.triggerEvent("deactivate");
            return true;
        }
        return false;
    },

    CLASS_NAME: "OpenLayers.Control"
});

OpenLayers.Control.TYPE_BUTTON = 1;
OpenLayers.Control.TYPE_TOGGLE = 2;
OpenLayers.Control.TYPE_TOOL   = 3;
/* ======================================================================
    OpenLayers/Icon.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * Class: OpenLayers.Icon
 * 
 * The icon represents a graphical icon on the screen.  Typically used in
 * conjunction with a <OpenLayers.Marker> to represent markers on a screen.
 *
 * An icon has a url, size and position.  It also contains an offset which 
 * allows the center point to be represented correctly.  This can be
 * provided either as a fixed offset or a function provided to calculate
 * the desired offset. 
 * 
 */
OpenLayers.Icon = OpenLayers.Class({
    
    /** 
     * Property: url 
     * {String}  image url
     */
    url: null,
    
    /** 
     * Property: size 
     * {<OpenLayers.Size>} 
     */
    size: null,

    /** 
     * Property: offset 
     * {<OpenLayers.Pixel>} distance in pixels to offset the image when being rendered
     */
    offset: null,    
    
    /** 
     * Property: calculateOffset 
     * {<OpenLayers.Pixel>} Function to calculate the offset (based on the size) 
     */
    calculateOffset: null,    
    
    /** 
     * Property: imageDiv 
     * {DOMElement} 
     */
    imageDiv: null,

    /** 
     * Property: px 
     * {<OpenLayers.Pixel>} 
     */
    px: null,
    
    /** 
     * Constructor: OpenLayers.Icon
     * Creates an icon, which is an image tag in a div.  
     *
     * url - {String} 
     * size - {<OpenLayers.Size>} 
     * offset - {<OpenLayers.Pixel>}
     * calculateOffset - {Function} 
     */
    initialize: function(url, size, offset, calculateOffset) {
        this.url = url;
        this.size = (size) ? size : new OpenLayers.Size(20,20);
        this.offset = offset ? offset : new OpenLayers.Pixel(-(this.size.w/2), -(this.size.h/2));
        this.calculateOffset = calculateOffset;

        var id = OpenLayers.Util.createUniqueID("OL_Icon_");
        this.imageDiv = OpenLayers.Util.createAlphaImageDiv(id);
    },
    
    /** 
     * Method: destroy
     * Nullify references and remove event listeners to prevent circular 
     * references and memory leaks
     */
    destroy: function() {
        OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild); 
        this.imageDiv.innerHTML = "";
        this.imageDiv = null;
    },

    /** 
     * Method: clone
     * 
     * Returns:
     * {<OpenLayers.Icon>} A fresh copy of the icon.
     */
    clone: function() {
        return new OpenLayers.Icon(this.url, 
                                   this.size, 
                                   this.offset, 
                                   this.calculateOffset);
    },
    
    /**
     * Method: setSize
     * 
     * Parameters:
     * size - {<OpenLayers.Size>} 
     */
    setSize: function(size) {
        if (size != null) {
            this.size = size;
        }
        this.draw();
    },
    
    /**
     * Method: setUrl
     * 
     * Parameters:
     * url - {String} 
     */
    setUrl: function(url) {
        if (url != null) {
            this.url = url;
        }
        this.draw();
    },

    /** 
     * Method: draw
     * Move the div to the given pixel.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     * 
     * Returns:
     * {DOMElement} A new DOM Image of this icon set at the location passed-in
     */
    draw: function(px) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, 
                                            null, 
                                            null, 
                                            this.size, 
                                            this.url, 
                                            "absolute");
        this.moveTo(px);
        return this.imageDiv;
    }, 

    
    /** 
     * Method: setOpacity
     * Change the icon's opacity
     *
     * Parameters:
     * opacity - {float} 
     */
    setOpacity: function(opacity) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, 
                                            null, null, null, null, opacity);

    },
    
    /**
     * Method: moveTo
     * move icon to passed in px.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     */
    moveTo: function (px) {
        //if no px passed in, use stored location
        if (px != null) {
            this.px = px;
        }

        if (this.imageDiv != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);  
                }
                var offsetPx = this.px.offset(this.offset);
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, offsetPx);
            }
        }
    },
    
    /** 
     * Method: display
     * Hide or show the icon
     *
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.imageDiv.style.display = (display) ? "" : "none"; 
    },

    CLASS_NAME: "OpenLayers.Icon"
});
/* ======================================================================
    OpenLayers/Lang.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * Namespace: OpenLayers.Lang
 * Internationalization namespace.  Contains dictionaries in various languages
 *     and methods to set and get the current language.
 */
OpenLayers.Lang = {
    
    /** 
     * Property: code
     * {String}  Current language code to use in OpenLayers.  Use the
     *     <setCode> method to set this value and the <getCode> method to
     *     retrieve it.
     */
    code: null,

    /** 
     * APIProperty: defaultCode
     * {String} Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultCode: "en",
        
    /**
     * APIFunction: getCode
     * Get the current language code.
     *
     * Returns:
     * The current language code.
     */
    getCode: function() {
        if(!OpenLayers.Lang.code) {
            OpenLayers.Lang.setCode();
        }
        return OpenLayers.Lang.code;
    },
    
    /**
     * APIFunction: setCode
     * Set the language code for string translation.  This code is used by
     *     the <OpenLayers.Lang.translate> method.
     *
     * Parameters-
     * code - {String} These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt.  If no value is set, the
     *     browser's language setting will be tested.  If no <OpenLayers.Lang>
     *     dictionary exists for the code, the <OpenLayers.String.defaultLang>
     *     will be used.
     */
    setCode: function(code) {
        var lang;
        if(!code) {
            code = (OpenLayers.Util.getBrowserName() == "msie") ?
                navigator.userLanguage : navigator.language;
        }
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        if(typeof OpenLayers.Lang[parts[0]] == "object") {
            lang = parts[0];
        }

        // check for regional extensions
        if(parts[1]) {
            var testLang = parts[0] + '-' + parts[1].toUpperCase();
            if(typeof OpenLayers.Lang[testLang] == "object") {
                lang = testLang;
            }
        }
        if(!lang) {
            OpenLayers.Console.warn(
                'Failed to find OpenLayers.Lang.' + parts.join("-") +
                ' dictionary, falling back to default language'
            );
            lang = OpenLayers.Lang.defaultCode;
        }
        
        OpenLayers.Lang.code = lang;
    },

    /**
     * APIMethod: translate
     * Looks up a key from a dictionary based on the current language string.
     *     The value of <getCode> will be used to determine the appropriate
     *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
     *
     * Parameters:
     * key - {String} The key for an i18n string value in the dictionary.
     * context - {Object} Optional context to be used with
     *     <OpenLayers.String.format>.
     * 
     * Returns:
     * {String} A internationalized string.
     */
    translate: function(key, context) {
        var dictionary = OpenLayers.Lang[OpenLayers.Lang.getCode()];
        var message = dictionary[key];
        if(!message) {
            // Message not found, fall back to message key
            message = key;
        }
        if(context) {
            message = OpenLayers.String.format(message, context);
        }
        return message;
    }
    
};


/**
 * APIMethod: OpenLayers.i18n
 * Alias for <OpenLayers.Lang.translate>.  Looks up a key from a dictionary
 *     based on the current language string. The value of
 *     <OpenLayers.Lang.getCode> will be used to determine the appropriate
 *     dictionary.  Dictionaries are stored in <OpenLayers.Lang>.
 *
 * Parameters:
 * key - {String} The key for an i18n string value in the dictionary.
 * context - {Object} Optional context to be used with
 *     <OpenLayers.String.format>.
 * 
 * Returns:
 * {String} A internationalized string.
 */
OpenLayers.i18n = OpenLayers.Lang.translate;
/* ======================================================================
    OpenLayers/Tween.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Namespace: OpenLayers.Tween
 */
OpenLayers.Tween = OpenLayers.Class({
    
    /**
     * Constant: INTERVAL
     * {int} Interval in milliseconds between 2 steps
     */
    INTERVAL: 10,
    
    /**
     * APIProperty: easing
     * {<OpenLayers.Easing>(Function)} Easing equation used for the animation
     *     Defaultly set to OpenLayers.Easing.Expo.easeOut
     */
    easing: null,
    
    /**
     * APIProperty: begin
     * {Object} Values to start the animation with
     */
    begin: null,
    
    /**
     * APIProperty: finish
     * {Object} Values to finish the animation with
     */
    finish: null,
    
    /**
     * APIProperty: duration
     * {int} duration of the tween (number of steps)
     */
    duration: null,
    
    /**
     * APIProperty: callbacks
     * {Object} An object with start, eachStep and done properties whose values
     *     are functions to be call during the animation. They are passed the
     *     current computed value as argument.
     */
    callbacks: null,
    
    /**
     * Property: time
     * {int} Step counter
     */
    time: null,
    
    /**
     * Property: interval
     * {int} Interval id returned by window.setInterval
     */
    interval: null,
    
    /**
     * Property: playing
     * {Boolean} Tells if the easing is currently playing
     */
    playing: false,
    
    /** 
     * Constructor: OpenLayers.Tween
     * Creates a Tween.
     *
     * Parameters:
     * easing - {<OpenLayers.Easing>(Function)} easing function method to use
     */ 
    initialize: function(easing) {
        this.easing = (easing) ? easing : OpenLayers.Easing.Expo.easeOut;
    },
    
    /**
     * APIMethod: start
     * Plays the Tween, and calls the callback method on each step
     * 
     * Parameters:
     * begin - {Object} values to start the animation with
     * finish - {Object} values to finish the animation with
     * duration - {int} duration of the tween (number of steps)
     * options - {Object} hash of options (for example callbacks (start, eachStep, done))
     */
    start: function(begin, finish, duration, options) {
        this.playing = true;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.callbacks = options.callbacks;
        this.time = 0;
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
        if (this.callbacks && this.callbacks.start) {
            this.callbacks.start.call(this, this.begin);
        }
        this.interval = window.setInterval(
            OpenLayers.Function.bind(this.play, this), this.INTERVAL);
    },
    
    /**
     * APIMethod: stop
     * Stops the Tween, and calls the done callback
     *     Doesn't do anything if animation is already finished
     */
    stop: function() {
        if (!this.playing) {
            return;
        }
        
        if (this.callbacks && this.callbacks.done) {
            this.callbacks.done.call(this, this.finish);
        }
        window.clearInterval(this.interval);
        this.interval = null;
        this.playing = false;
    },
    
    /**
     * Method: play
     * Calls the appropriate easing method
     */
    play: function() {
        var value = {};
        for (var i in this.begin) {
            var b = this.begin[i];
            var f = this.finish[i];
            if (b == null || f == null || isNaN(b) || isNaN(f)) {
                OpenLayers.Console.error('invalid value for Tween');
            }
            
            var c = f - b;
            value[i] = this.easing.apply(this, [this.time, b, c, this.duration]);
        }
        this.time++;
        
        if (this.callbacks && this.callbacks.eachStep) {
            this.callbacks.eachStep.call(this, value);
        }
        
        if (this.time > this.duration) {
            if (this.callbacks && this.callbacks.done) {
                this.callbacks.done.call(this, this.finish);
                this.playing = false;
            }
            window.clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Tween"
});

/**
 * Namespace: OpenLayers.Easing
 * 
 * Credits:
 *      Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>
 */
OpenLayers.Easing = {
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Easing"
};

/**
 * Namespace: OpenLayers.Easing.Linear
 */
OpenLayers.Easing.Linear = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeIn: function(t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeOut: function(t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeInOut: function(t, b, c, d) {
        return c*t/d + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Linear"
};

/**
 * Namespace: OpenLayers.Easing.Expo
 */
OpenLayers.Easing.Expo = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeIn: function(t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeOut: function(t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeInOut: function(t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Expo"
};

/**
 * Namespace: OpenLayers.Easing.Quad
 */
OpenLayers.Easing.Quad = {
    
    /**
     * Function: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeIn: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    
    /**
     * Function: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeOut: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Function: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeInOut: function(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Quad"
};
/* ======================================================================
    OpenLayers/Control/ArgParser.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ArgParser
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.ArgParser = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Parameter: center
     * {<OpenLayers.LonLat>}
     */
    center: null,
    
    /**
     * Parameter: zoom
     * {int}
     */
    zoom: null,

    /**
     * Parameter: layers 
     * {Array(<OpenLayers.Layer>)}
     */
    layers: null,
    
    /** 
     * APIProperty: displayProjection
     * {<OpenLayers.Projection>} Requires proj4js support. 
     *     Projection used when reading the coordinates from the URL. This will
     *     reproject the map coordinates from the URL into the map's
     *     projection.
     *
     *     If you are using this functionality, be aware that any permalink
     *     which is added to the map will determine the coordinate type which
     *     is read from the URL, which means you should not add permalinks with
     *     different displayProjections to the same map. 
     */
    displayProjection: null, 

    /**
     * Constructor: OpenLayers.Control.ArgParser
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: setMap
     * Set the map property for the control. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        //make sure we dont already have an arg parser attached
        for(var i=0; i< this.map.controls.length; i++) {
            var control = this.map.controls[i];
            if ( (control != this) &&
                 (control.CLASS_NAME == "OpenLayers.Control.ArgParser") ) {
                
                // If a second argparser is added to the map, then we 
                // override the displayProjection to be the one added to the
                // map. 
                if (control.displayProjection != this.displayProjection) {
                    this.displayProjection = control.displayProjection;
                }    
                
                break;
            }
        }
        if (i == this.map.controls.length) {

            var args = OpenLayers.Util.getParameters();
            // Be careful to set layer first, to not trigger unnecessary layer loads
            if (args.layers) {
                this.layers = args.layers;
    
                // when we add a new layer, set its visibility 
                this.map.events.register('addlayer', this, 
                                         this.configureLayers);
                this.configureLayers();
            }
            if (args.lat && args.lon) {
                this.center = new OpenLayers.LonLat(parseFloat(args.lon),
                                                    parseFloat(args.lat));
                if (args.zoom) {
                    this.zoom = parseInt(args.zoom);
                }
    
                // when we add a new baselayer to see when we can set the center
                this.map.events.register('changebaselayer', this, 
                                         this.setCenter);
                this.setCenter();
            }
        }
    },
   
    /** 
     * Method: setCenter
     * As soon as a baseLayer has been loaded, we center and zoom
     *   ...and remove the handler.
     */
    setCenter: function() {
        
        if (this.map.baseLayer) {
            //dont need to listen for this one anymore
            this.map.events.unregister('changebaselayer', this, 
                                       this.setCenter);
            
            if (this.displayProjection) {
                this.center.transform(this.displayProjection, 
                                      this.map.getProjectionObject()); 
            }      

            this.map.setCenter(this.center, this.zoom);
        }
    },

    /** 
     * Method: configureLayers
     * As soon as all the layers are loaded, cycle through them and 
     *   hide or show them. 
     */
    configureLayers: function() {

        if (this.layers.length == this.map.layers.length) { 
            this.map.events.unregister('addlayer', this, this.configureLayers);

            for(var i=0; i < this.layers.length; i++) {
                
                var layer = this.map.layers[i];
                var c = this.layers.charAt(i);
                
                if (c == "B") {
                    this.map.setBaseLayer(layer);
                } else if ( (c == "T") || (c == "F") ) {
                    layer.setVisibility(c == "T");
                }
            }
        }
    },     

    CLASS_NAME: "OpenLayers.Control.ArgParser"
});
/* ======================================================================
    OpenLayers/Control/MousePosition.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.MousePosition
 */
OpenLayers.Control.MousePosition = OpenLayers.Class(OpenLayers.Control, {
    
    /** 
     * Property: element
     * {DOMElement} 
     */
    element: null,
    
    /** 
     * APIProperty: prefix
     * {String}
     */
    prefix: '',
    
    /** 
     * APIProperty: separator
     * {String}
     */
    separator: ', ',
    
    /** 
     * APIProperty: suffix
     * {String}
     */
    suffix: '',
    
    /** 
     * APIProperty: numDigits
     * {Integer}
     */
    numdigits: 5,
    
    /** 
     * APIProperty: granularity
     * {Integer} 
     */
    granularity: 10,
    
    /** 
     * Property: lastXy
     * {<OpenLayers.LonLat>}
     */
    lastXy: null,

    /**
     * APIProperty: displayProjection
     * {<OpenLayers.Projection>} A projection that the 
     * mousecontrol will display.
     */
    displayProjection: null, 
    
    /**
     * Constructor: OpenLayers.Control.MousePosition
     * 
     * Parameters:
     * options - {DOMElement} Options for control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: destroy
     */
     destroy: function() {
         if (this.map) {
             this.map.events.unregister('mousemove', this, this.redraw);
         }
         OpenLayers.Control.prototype.destroy.apply(this, arguments);
     },

    /**
     * Method: draw
     * {DOMElement}
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.element = this.div;
        }
        
        this.redraw();
        return this.div;
    },
   
    /**
     * Method: redraw  
     */
    redraw: function(evt) {

        var lonLat;

        if (evt == null) {
            lonLat = new OpenLayers.LonLat(0, 0);
        } else {
            if (this.lastXy == null ||
                Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
                Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
            {
                this.lastXy = evt.xy;
                return;
            }

            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) { 
                // map has not yet been properly initialized
                return;
            }    
            if (this.displayProjection) {
                lonLat.transform(this.map.getProjectionObject(), 
                                 this.displayProjection );
            }      
            this.lastXy = evt.xy;
            
        }
        
        var newHtml = this.formatOutput(lonLat);

        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },

    /**
     * Method: formatOutput
     * Override to provide custom display output
     *
     * Parameters:
     * lonLat - {<OpenLayers.LonLat>} Location to display
     */
    formatOutput: function(lonLat) {
        var digits = parseInt(this.numdigits);
        var newHtml =
            this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator + 
            lonLat.lat.toFixed(digits) +
            this.suffix;
        return newHtml;
     },

    /** 
     * Method: setMap
     */
    setMap: function() {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register( 'mousemove', this, this.redraw);
    },     

    CLASS_NAME: "OpenLayers.Control.MousePosition"
});
/* ======================================================================
    OpenLayers/Control/PanZoom.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.PanZoom
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.PanZoom = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * APIProperty: slideFactor
     * {Integer} Number of pixels by which we'll pan the map in any direction 
     *     on clicking the arrow buttons. 
     */
    slideFactor: 50,

    /** 
     * Property: buttons
     * {Array(DOMElement)} Array of Button Divs 
     */
    buttons: null,

    /** 
     * Property: position
     * {<OpenLayers.Pixel>} 
     */
    position: null,

    /**
     * Constructor: OpenLayers.Control.PanZoom
     * 
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X,
                                             OpenLayers.Control.PanZoom.Y);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        while(this.buttons.length) {
            var btn = this.buttons.shift();
            btn.map = null;
            OpenLayers.Event.stopObservingElement(btn);
        }
        this.buttons = null;
        this.position = null;
    },

    /**
     * Method: draw
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     * 
     * Returns:
     * {DOMElement} A reference to the container div for the PanZoom control.
     */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;

        // place the controls
        this.buttons = [];

        var sz = new OpenLayers.Size(18,18);
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);

        this._addButton("panup", "north-mini.png", centered, sz);
        px.y = centered.y+sz.h;
        this._addButton("panleft", "west-mini.png", px, sz);
        this._addButton("panright", "east-mini.png", px.add(sz.w, 0), sz);
        this._addButton("pandown", "south-mini.png", 
                        centered.add(0, sz.h*2), sz);
        this._addButton("zoomin", "zoom-plus-mini.png", 
                        centered.add(0, sz.h*3+5), sz);
        this._addButton("zoomworld", "zoom-world-mini.png", 
                        centered.add(0, sz.h*4+5), sz);
        this._addButton("zoomout", "zoom-minus-mini.png", 
                        centered.add(0, sz.h*5+5), sz);
        return this.div;
    },
    
    /**
     * Method: _addButton
     * 
     * Parameters:
     * id - {String} 
     * img - {String} 
     * xy - {<OpenLayers.Pixel>} 
     * sz - {<OpenLayers.Size>} 
     * 
     * Returns:
     * {DOMElement} A Div (an alphaImageDiv, to be precise) that contains the
     *     image of the button, and has all the proper event handlers set.
     */
    _addButton:function(id, img, xy, sz) {
        var imgLocation = OpenLayers.Util.getImagesLocation() + img;
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_PanZoom_" + id, 
                                    xy, sz, imgLocation, "absolute");

        //we want to add the outer div
        this.div.appendChild(btn);

        OpenLayers.Event.observe(btn, "mousedown", 
            OpenLayers.Function.bindAsEventListener(this.buttonDown, btn));
        OpenLayers.Event.observe(btn, "dblclick", 
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
        OpenLayers.Event.observe(btn, "click", 
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
        btn.action = id;
        btn.map = this.map;
        btn.slideFactor = this.slideFactor;

        //we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },
    
    /**
     * Method: doubleClick
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean}
     */
    doubleClick: function (evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    
    /**
     * Method: buttonDown
     *
     * Parameters:
     * evt - {Event} 
     */
    buttonDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }

        switch (this.action) {
            case "panup": 
                this.map.pan(0, -this.slideFactor);
                break;
            case "pandown": 
                this.map.pan(0, this.slideFactor);
                break;
            case "panleft": 
                this.map.pan(-this.slideFactor, 0);
                break;
            case "panright": 
                this.map.pan(this.slideFactor, 0);
                break;
            case "zoomin": 
                this.map.zoomIn(); 
                break;
            case "zoomout": 
                this.map.zoomOut(); 
                break;
            case "zoomworld": 
                this.map.zoomToMaxExtent(); 
                break;
        }

        OpenLayers.Event.stop(evt);
    },

    CLASS_NAME: "OpenLayers.Control.PanZoom"
});

/**
 * Constant: X
 * {Integer}
 */
OpenLayers.Control.PanZoom.X = 4;

/**
 * Constant: Y
 * {Integer}
 */
OpenLayers.Control.PanZoom.Y = 4;
/* ======================================================================
    OpenLayers/Control/ScaleLine.js
   ====================================================================== */

/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ScaleLine
 * Display a small line indicator representing the current map scale on the map.
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 *  
 * Is a very close copy of:
 *  - <OpenLayers.Control.Scale>
 */
OpenLayers.Control.ScaleLine = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: maxWidth
     * {Integer} Maximum width of the scale line in pixels.  Default is 100.
     */
    maxWidth: 100,

    /**
     * Property: topOutUnits
     * {String} Units for zoomed out on top bar.  Default is km.
     */
    topOutUnits: "km",
    
    /**
     * Property: topInUnits
     * {String} Units for zoomed in on top bar.  Default is m.
     */
    topInUnits: "m",

    /**
     * Property: bottomOutUnits
     * {String} Units for zoomed out on bottom bar.  Default is mi.
     */
    bottomOutUnits: "mi",

    /**
     * Property: bottomInUnits
     * {String} Units for zoomed in on bottom bar.  Default is ft.
     */
    bottomInUnits: "ft",
    
    /**
     * Property: eTop
     * {DOMElement}
     */
    eTop: null,

    /**
     * Property: eBottom
     * {DOMElement}
     */
    eBottom:null,

    /**
     * Constructor: OpenLayers.ScaleLine
     * Create a new scale line control.
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);     
    },

    /**
     * Method: draw
     * 
     * Returns:
     * {DOMElement}
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.eTop) {
            this.div.style.display = "block";
            this.div.style.position = "absolute";
            
            // stick in the top bar
            this.eTop = document.createElement("div");
            this.eTop.className = this.displayClass + "Top";
            var theLen = this.topInUnits.length;
            this.div.appendChild(this.eTop);
            if((this.topOutUnits == "") || (this.topInUnits == "")) {
                this.eTop.style.visibility = "hidden";
            } else {
                this.eTop.style.visibility = "visible";
            }

            // and the bottom bar
            this.eBottom = document.createElement("div");
            this.eBottom.className = this.displayClass + "Bottom";
            this.div.appendChild(this.eBottom);
            if((this.bottomOutUnits == "") || (this.bottomInUnits == "")) {
                this.eBottom.style.visibility = "hidden";
            } else {
                this.eBottom.style.visibility = "visible";
            }
        }
        this.map.events.register('moveend', this, this.update);
        this.update();
        return this.div;
    },

    /** 
     * Method: getBarLen
     * Given a number, round it down to the nearest 1,2,5 times a power of 10.
     * That seems a fairly useful set of number groups to use.
     * 
     * Parameters:
     * maxLen - {float}  the number we're rounding down from
     * 
     * Returns:
     * {Float} the rounded number (less than or equal to maxLen)
     */
    getBarLen: function(maxLen) {
        // nearest power of 10 lower than maxLen
        var digits = parseInt(Math.log(maxLen) / Math.log(10));
        var pow10 = Math.pow(10, digits);
        
        // ok, find first character
        var firstChar = parseInt(maxLen / pow10);

        // right, put it into the correct bracket
        var barLen;
        if(firstChar > 5) {
            barLen = 5;
        } else if(firstChar > 2) {
            barLen = 2;
        } else {
            barLen = 1;
        }

        // scale it up the correct power of 10
        return barLen * pow10;
    },

    /**
     * Method: update
     * Update the size of the bars, and the labels they contain.
     */
    update: function() {
        var res = this.map.getResolution();
        if (!res) {
            return;
        }

        var curMapUnits = this.map.units;
        var inches = OpenLayers.INCHES_PER_UNIT;

        // convert maxWidth to map units
        var maxSizeData = this.maxWidth * res * inches[curMapUnits];  

        // decide whether to use large or small scale units     
        var topUnits;
        var bottomUnits;
        if(maxSizeData > 100000) {
            topUnits = this.topOutUnits;
            bottomUnits = this.bottomOutUnits;
        } else {
            topUnits = this.topInUnits;
            bottomUnits = this.bottomInUnits;
        }

        // and to map units units
        var topMax = maxSizeData / inches[topUnits];
        var bottomMax = maxSizeData / inches[bottomUnits];

        // now trim this down to useful block length
        var topRounded = this.getBarLen(topMax);
        var bottomRounded = this.getBarLen(bottomMax);

        // and back to display units
        topMax = topRounded / inches[curMapUnits] * inches[topUnits];
        bottomMax = bottomRounded / inches[curMapUnits] * inches[bottomUnits];

        // and to pixel units
        var topPx = topMax / res;
        var bottomPx = bottomMax / res;
        
        // now set the pixel widths
        this.eTop.style.width = Math.round(topPx) + "px";
        this.eBottom.style.width = Math.round(bottomPx) + "px"; 
        
        // and the values inside them
        this.eTop.innerHTML = topRounded + " " + topUnits;
        this.eBottom.innerHTML = bottomRounded + " " + bottomUnits ;
    }, 

    CLASS_NAME: "OpenLayers.Control.ScaleLine"
});

/* ======================================================================
    OpenLayers/Events.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Util.js
 */

/**
 * Namespace: OpenLayers.Event
 * Utility functions for event handling.
 */
OpenLayers.Event = {

    /** 
     * Property: observers 
     * {Object} A hashtable cache of the event observers. Keyed by
     * element._eventCacheID 
     */
    observers: false,
    
    /** 
     * Constant: KEY_BACKSPACE 
     * {int} 
     */
    KEY_BACKSPACE: 8,

    /** 
     * Constant: KEY_TAB 
     * {int} 
     */
    KEY_TAB: 9,

    /** 
     * Constant: KEY_RETURN 
     * {int} 
     */
    KEY_RETURN: 13,

    /** 
     * Constant: KEY_ESC 
     * {int} 
     */
    KEY_ESC: 27,

    /** 
     * Constant: KEY_LEFT 
     * {int} 
     */
    KEY_LEFT: 37,

    /** 
     * Constant: KEY_UP 
     * {int} 
     */
    KEY_UP: 38,

    /** 
     * Constant: KEY_RIGHT 
     * {int} 
     */
    KEY_RIGHT: 39,

    /** 
     * Constant: KEY_DOWN 
     * {int} 
     */
    KEY_DOWN: 40,

    /** 
     * Constant: KEY_DELETE 
     * {int} 
     */
    KEY_DELETE: 46,


    /**
     * Method: element
     * Cross browser event element detection.
     * 
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {DOMElement} The element that caused the event 
     */
    element: function(event) {
        return event.target || event.srcElement;
    },

    /**
     * Method: isLeftClick
     * Determine whether event was caused by a left click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

    /**
     * Method: stop
     * Stops an event from propagating. 
     *
     * Parameters: 
     * event - {Event} 
     * allowDefault - {Boolean} If true, we stop the event chain but 
     *                               still allow the default browser 
     *                               behaviour (text selection, radio-button 
     *                               clicking, etc)
     *                               Default false
     */
    stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /** 
     * Method: findElement
     * 
     * Parameters:
     * event - {Event} 
     * tagName - {String} 
     * 
     * Returns:
     * {DOMElement} The first node with the given tagName, starting from the
     * node the event was triggered on and traversing the DOM upwards
     */
    findElement: function(event, tagName) {
        var element = OpenLayers.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

    /** 
     * Method: observe
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     */
    observe: function(elementParam, name, observer, useCapture) {
        var element = OpenLayers.Util.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }

        //if observers cache has not yet been created, create it
        if (!this.observers) {
            this.observers = {};
        }

        //if not already assigned, make a new unique cache ID
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = OpenLayers.Util.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;

        //if there is not yet a hash entry for this element, add one
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }

        //add a new observer to this element's list
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });

        //add the actual browser event listener
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

    /** 
     * Method: stopObservingElement
     * Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * parameters:
     * elementParam - {DOMElement || String} 
     */
    stopObservingElement: function(elementParam) {
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(OpenLayers.Event.observers[cacheID]);
    },

    /**
     * Method: _removeElementObservers
     *
     * Parameters:
     * elementObservers - {Array(Object)} Array of (element, name, 
     *                                         observer, usecapture) objects, 
     *                                         taken directly from hashtable
     */
    _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                var args = new Array(entry.element,
                                     entry.name,
                                     entry.observer,
                                     entry.useCapture);
                var removed = OpenLayers.Event.stopObserving.apply(this, args);
            }
        }
    },

    /**
     * Method: stopObserving
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     *  
     * Returns:
     * {Boolean} Whether or not the event observer was removed
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }

        // find element's entry in this.observers cache and remove it
        var foundEntry = false;
        var elementObservers = OpenLayers.Event.observers[cacheID];
        if (elementObservers) {
    
            // find the specific event type in the element's list
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete OpenLayers.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
    
        //actually remove the event listener from browser
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** 
     * Method: unloadCache
     * Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        // check for OpenLayers.Event before checking for observers, because
        // OpenLayers.Event may be undefined in IE if no map instance was
        // created
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var cacheID in OpenLayers.Event.observers) {
                var elementObservers = OpenLayers.Event.observers[cacheID];
                OpenLayers.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            OpenLayers.Event.observers = false;
        }
    },

    CLASS_NAME: "OpenLayers.Event"
};

/* prevent memory leaks in IE */
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);

// FIXME: Remove this in 3.0. In 3.0, Event.stop will no longer be provided
// by OpenLayers.
if (window.Event) {
    OpenLayers.Util.applyDefaults(window.Event, OpenLayers.Event);
} else {
    var Event = OpenLayers.Event;
}

/**
 * Class: OpenLayers.Events
 */
OpenLayers.Events = OpenLayers.Class({

    /** 
     * Constant: BROWSER_EVENTS
     * {Array(String)} supported events 
     */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick",
        "resize", "focus", "blur"
    ],

    /** 
     * Property: listeners 
     * {Object} Hashtable of Array(Function): events listener functions  
     */
    listeners: null,

    /** 
     * Property: object 
     * {Object}  the code object issuing application events 
     */
    object: null,

    /** 
     * Property: element 
     * {DOMElement}  the DOM element receiving browser events 
     */
    element: null,

    /** 
     * Property: eventTypes 
     * {Array(String)}  list of support application events 
     */
    eventTypes: null,

    /** 
     * Property: eventHandler 
     * {Function}  bound event handler attached to elements 
     */
    eventHandler: null,

    /** 
     * APIProperty: fallThrough 
     * {Boolean} 
     */
    fallThrough: null,

    /**
     * Constructor: OpenLayers.Events
     * Construct an OpenLayers.Events object.
     *
     * Parameters:
     * object - {Object} The js object to which this Events object  is being
     * added element - {DOMElement} A dom element to respond to browser events
     * eventTypes - {Array(String)} Array of custom application events 
     * fallThrough - {Boolean} Allow events to fall through after these have
     *                         been handled?
     */
    initialize: function (object, element, eventTypes, fallThrough) {
        this.object     = object;
        this.element    = element;
        this.eventTypes = eventTypes;
        this.fallThrough = fallThrough;
        this.listeners  = {};

        // keep a bound copy of handleBrowserEvent() so that we can
        // pass the same function to both Event.observe() and .stopObserving()
        this.eventHandler = OpenLayers.Function.bindAsEventListener(
            this.handleBrowserEvent, this
        );

        // if eventTypes is specified, create a listeners list for each 
        // custom application event.
        if (this.eventTypes != null) {
            for (var i = 0; i < this.eventTypes.length; i++) {
                this.addEventType(this.eventTypes[i]);
            }
        }
        
        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (this.element != null) {
            this.attachToElement(element);
        }
    },

    /**
     * APIMethod: destroy
     */
    destroy: function () {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.eventTypes = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
     * APIMethod: addEventType
     * Add a new event type to this events object.
     * If the event type has already been added, do nothing.
     * 
     * Parameters:
     * eventName - {String}
     */
    addEventType: function(eventName) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
    },

    /**
     * Method: attachToElement
     *
     * Parameters:
     * element - {HTMLDOMElement} a DOM element to attach browser events to
     */
    attachToElement: function (element) {
        for (var i = 0; i < this.BROWSER_EVENTS.length; i++) {
            var eventType = this.BROWSER_EVENTS[i];

            // every browser event has a corresponding application event 
            // (whether it's listened for or not).
            this.addEventType(eventType);
            
            // use Prototype to register the event cross-browser
            OpenLayers.Event.observe(element, eventType, this.eventHandler);
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    
    /**
     * Method: on
     * Convenience method for registering listeners with a common scope.
     *
     * Example use:
     * (code)
     * events.on({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     * (end)
     */
    on: function(object) {
        for(var type in object) {
            if(type != "scope") {
                this.register(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: register
     * Register an event on the events object.
     *
     * When the event is triggered, the 'func' function will be called, in the
     * context of 'obj'. Imagine we were to register an event, specifying an 
     * OpenLayers.Bounds Object as 'obj'. When the event is triggered, the 
     * context in the callback function will be our Bounds object. This means
     * that within our callback function, we can access the properties and 
     * methods of the Bounds object through the "this" variable. So our 
     * callback could execute something like: 
     * :    leftStr = "Left: " + this.left;
     *   
     *                   or
     *  
     * :    centerStr = "Center: " + this.getCenterLonLat();
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *                     If no object is specified, default is the Events's 
     *                     'object' property.
     * func - {Function} The callback function. If no callback is 
     *                        specified, this function does nothing.
     * 
     * 
     */
    register: function (type, obj, func) {

        if (func != null && 
            ((this.eventTypes && OpenLayers.Util.indexOf(this.eventTypes, type) != -1) ||
            OpenLayers.Util.indexOf(this.BROWSER_EVENTS, type) != -1)) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (listeners != null) {
                listeners.push( {obj: obj, func: func} );
            }
        }
    },

    /**
     * APIMethod: registerPriority
     * Same as register() but adds the new listener to the *front* of the
     *     events queue instead of to the end.
     *    
     *     TODO: get rid of this in 3.0 - Decide whether listeners should be 
     *     called in the order they were registered or in reverse order.
     *
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback#.
     *                If no object is specified, default is the Events's 
     *                'object' property.
     * func - {Function} The callback function. If no callback is 
     *                   specified, this function does nothing.
     */
    registerPriority: function (type, obj, func) {

        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (listeners != null) {
                listeners.unshift( {obj: obj, func: func} );
            }
        }
    },
    
    /**
     * Method: un
     * Convenience method for unregistering listeners with a common scope.
     *
     * Example use:
     * (code)
     * events.un({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     * (end)
     */
    un: function(object) {
        for(var type in object) {
            if(type != "scope") {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: unregister
     *
     * Parameters:
     * type - {String} 
     * obj - {Object} If none specified, defaults to this.object
     * func - {Function} 
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** 
     * Method: remove
     * Remove all listeners for a given event type. If type is not registered,
     *     does nothing.
     *
     * Parameters:
     * type - {String} 
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

    /**
     * APIMethod: triggerEvent
     * Trigger a specified registered event.  
     * 
     * Parameters:
     * type - {String} 
     * evt - {Event}
     *
     * Returns:
     * {Boolean} The last listener return.  If a listener returns false, the
     *     chain of listeners will stop getting called.
     */
    triggerEvent: function (type, evt) {

        // prep evt object with object & div references
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
    
        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        var listeners = (this.listeners[type]) ?
                            this.listeners[type].slice() : null;
        if ((listeners != null) && (listeners.length > 0)) {
            var continueChain;
            for (var i = 0; i < listeners.length; i++) {
                var callback = listeners[i];
                // bind the context to callback.obj
                continueChain = callback.func.apply(callback.obj, [evt]);
    
                if ((continueChain != undefined) && (continueChain == false)) {
                    // if callback returns false, execute no more callbacks.
                    break;
                }
            }
            // don't fall through to other DOM elements
            if (!this.fallThrough) {           
                OpenLayers.Event.stop(evt, true);
            }
        }
        return continueChain;
    },

    /**
     * Method: handleBrowserEvent
     * Basically just a wrapper to the triggerEvent() function, but takes 
     *     care to set a property 'xy' on the event with the current mouse 
     *     position.
     *
     * Parameters:
     * evt - {Event} 
     */
    handleBrowserEvent: function (evt) {
        evt.xy = this.getMousePosition(evt); 
        this.triggerEvent(evt.type, evt);
    },

    /**
     * Method: getMousePosition
     * 
     * Parameters:
     * evt - {Event} 
     * 
     * Returns:
     * {<OpenLayers.Pixel>} The current xy coordinate of the mouse, adjusted
     *                      for offsets
     */
    getMousePosition: function (evt) {
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
            this.element.offsets[0] += (document.documentElement.scrollLeft
                         || document.body.scrollLeft);
            this.element.offsets[1] += (document.documentElement.scrollTop
                         || document.body.scrollTop);
        }
        return new OpenLayers.Pixel(
            (evt.clientX + (document.documentElement.scrollLeft
                         || document.body.scrollLeft)) - this.element.offsets[0]
                         - (document.documentElement.clientLeft || 0), 
            (evt.clientY + (document.documentElement.scrollTop
                         || document.body.scrollTop)) - this.element.offsets[1]
                         - (document.documentElement.clientTop || 0)
        ); 
    },

    CLASS_NAME: "OpenLayers.Events"
});
/* ======================================================================
    OpenLayers/Lang/en.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Lang.js
 */

/**
 * Namespace: OpenLayers.Lang["en"]
 * Dictionary for English.  Keys for entries are used in calls to
 *     <OpenLayers.Lang.translate>.  Entry bodies are normal strings or
 *     strings formatted for use with <OpenLayers.String.format> calls.
 */
OpenLayers.Lang.en = {

    'unhandledRequest': "Unhandled request return ${statusText}",

    'permalink': "Permalink",

    'overlays': "Overlays",

    'baseLayer': "Base Layer",

    'sameProjection':
        "The overview map only works when it is in the same projection as the main map",

    'readNotImplemented': "Read not implemented.",

    'writeNotImplemented': "Write not implemented.",

    'noFID': "Can't update a feature for which there is no FID.",

    'errorLoadingGML': "Error in loading GML file ${url}",

    'browserNotSupported':
        "Your browser does not support vector rendering. Currently supported renderers are:\n${renderers}",

    'componentShouldBe': "addFeatures : component should be an ${geomType}",

    // console message
    'getFeatureError':
        "getFeatureFromEvent called on layer with no renderer. This usually means you " +
        "destroyed a layer, but not some handler which is associated with it.",

    // console message
    'minZoomLevelError':
        "The minZoomLevel property is only intended for use " +
        "with the FixedZoomLevels-descendent layers. That this " +
        "wfs layer checks for minZoomLevel is a relic of the" +
        "past. We cannot, however, remove it without possibly " +
        "breaking OL based applications that may depend on it." +
        " Therefore we are deprecating it -- the minZoomLevel " +
        "check below will be removed at 3.0. Please instead " +
        "use min/max resolution setting as described here: " +
        "http://trac.openlayers.org/wiki/SettingZoomLevels",

    'commitSuccess': "WFS Transaction: SUCCESS ${response}",

    'commitFailed': "WFS Transaction: FAILED ${response}",

    'googleWarning':
        "The Google Layer was unable to load correctly.<br><br>" +
        "To get rid of this message, select a new BaseLayer " +
        "in the layer switcher in the upper-right corner.<br><br>" +
        "Most likely, this is because the Google Maps library " +
        "script was either not included, or does not contain the " +
        "correct API key for your site.<br><br>" +
        "Developers: For help getting this working correctly, " +
        "<a href='http://trac.openlayers.org/wiki/Google' " +
        "target='_blank'>click here</a>",

    'getLayerWarning':
        "The ${layerType} Layer was unable to load correctly.<br><br>" +
        "To get rid of this message, select a new BaseLayer " +
        "in the layer switcher in the upper-right corner.<br><br>" +
        "Most likely, this is because the ${layerLib} library " +
        "script was either not correctly included.<br><br>" +
        "Developers: For help getting this working correctly, " +
        "<a href='http://trac.openlayers.org/wiki/${layerLib}' " +
        "target='_blank'>click here</a>",

    'scale': "Scale = 1 : ${scaleDenom}",

    // console message
    'layerAlreadyAdded':
        "You tried to add the layer: ${layerName} to the map, but it has already been added",

    // console message
    'reprojectDeprecated':
        "You are using the 'reproject' option " +
        "on the ${layerName} layer. This option is deprecated: " +
        "its use was designed to support displaying data over commercial " + 
        "basemaps, but that functionality should now be achieved by using " +
        "Spherical Mercator support. More information is available from " +
        "http://trac.openlayers.org/wiki/SphericalMercator.",

    // console message
    'methodDeprecated':
        "This method has been deprecated and will be removed in 3.0. " +
        "Please use ${newMethod} instead.",

    // console message
    'boundsAddError': "You must pass both x and y values to the add function.",

    // console message
    'lonlatAddError': "You must pass both lon and lat values to the add function.",

    // console message
    'pixelAddError': "You must pass both x and y values to the add function.",

    // console message
    'unsupportedGeometryType': "Unsupported geometry type: ${geomType}",

    // console message
    'pagePositionFailed':
        "OpenLayers.Util.pagePosition failed: element with id ${elemId} may be misplaced.",
                    
    'end': ''
};
/* ======================================================================
    OpenLayers/Projection.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Util.js
 */

/**
 * Class: OpenLayers.Projection
 * Class for coordinate transforms between coordinate systems.
 *     Depends on the proj4js library. If proj4js is not available, 
 *     then this is just an empty stub.
 */
OpenLayers.Projection = OpenLayers.Class({

    /**
     * Property: proj
     * {Object} Proj4js.Proj instance.
     */
    proj: null,
    
    /**
     * Property: projCode
     * {String}
     */
    projCode: null,

    /**
     * Constructor: OpenLayers.Projection
     * This class offers several methods for interacting with a wrapped 
     *     pro4js projection object. 
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *     format
     *
     * Returns:
     * {<OpenLayers.Projection>} A projection object.
     */
    initialize: function(projCode, options) {
        OpenLayers.Util.extend(this, options);
        this.projCode = projCode;
        if (window.Proj4js) {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    
    /**
     * APIMethod: getCode
     * Get the string SRS code.
     *
     * Returns:
     * {String} The SRS code.
     */
    getCode: function() {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
   
    /**
     * APIMethod: getUnits
     * Get the units string for the projection -- returns null if 
     *     proj4js is not available.
     *
     * Returns:
     * {String} The units abbreviation.
     */
    getUnits: function() {
        return this.proj ? this.proj.units : null;
    },

    /**
     * Method: toString
     * Convert projection to string (getCode wrapper).
     *
     * Returns:
     * {String} The projection code.
     */
    toString: function() {
        return this.getCode();
    },

    /**
     * Method: equals
     * Test equality of two projection instances.  Determines equality based
     *     soley on the projection code.
     *
     * Returns:
     * {Boolean} The two projections are equivalent.
     */
    equals: function(projection) {
        if (projection && projection.getCode) {
            return this.getCode() == projection.getCode();
        } else {
            return false;
        }    
    },

    /* Method: destroy
     * Destroy projection object.
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    },
    
    CLASS_NAME: "OpenLayers.Projection" 
});     

/**
 * Property: transforms
 * Transforms is an object, with from properties, each of which may
 * have a to property. This allows you to define projections without 
 * requiring support for proj4js to be included.
 *
 * This object has keys which correspond to a 'source' projection object.  The
 * keys should be strings, corresponding to the projection.getCode() value.
 * Each source projection object should have a set of destination projection
 * keys included in the object. 
 * 
 * Each value in the destination object should be a transformation function,
 * where the function is expected to be passed an object with a .x and a .y
 * property.  The function should return the object, with the .x and .y
 * transformed according to the transformation function.
 *
 * Note - Properties on this object should not be set directly.  To add a
 *     transform method to this object, use the <addTransform> method.  For an
 *     example of usage, see the OpenLayers.Layer.SphericalMercator file.
 */
OpenLayers.Projection.transforms = {};

/**
 * APIMethod: addTransform
 * Set a custom transform method between two projections.  Use this method in
 *     cases where the proj4js lib is not available or where custom projections
 *     need to be handled.
 *
 * Parameters:
 * from - {String} The code for the source projection
 * to - {String} the code for the destination projection
 * method - {Function} A function that takes a point as an argument and
 *     transforms that point from the source to the destination projection
 *     in place.  The original point should be modified.
 */
OpenLayers.Projection.addTransform = function(from, to, method) {
    if(!OpenLayers.Projection.transforms[from]) {
        OpenLayers.Projection.transforms[from] = {};
    }
    OpenLayers.Projection.transforms[from][to] = method;
};

/**
 * APIMethod: transform
 * Transform a point coordinate from one projection to another.  Note that
 *     the input point is transformed in place.
 * 
 * Parameters:
 * point - {{OpenLayers.Geometry.Point> | Object} An object with x and y
 *     properties representing coordinates in those dimensions.
 * sourceProj - {OpenLayers.Projection} Source map coordinate system
 * destProj - {OpenLayers.Projection} Destination map coordinate system
 *
 * Returns:
 * point - {object} A transformed coordinate.  The original point is modified.
 */
OpenLayers.Projection.transform = function(point, source, dest) {
    if (source.proj && dest.proj) {
        point = Proj4js.transform(source.proj, dest.proj, point);
    } else if (source && dest && 
               OpenLayers.Projection.transforms[source.getCode()] && 
               OpenLayers.Projection.transforms[source.getCode()][dest.getCode()]) {
        OpenLayers.Projection.transforms[source.getCode()][dest.getCode()](point); 
    }
    return point;
};
/* ======================================================================
    OpenLayers/Tile.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/*
 * @requires OpenLayers/Util.js
 */

/*
 * Class: OpenLayers.Tile 
 * This is a class designed to designate a single tile, however
 *     it is explicitly designed to do relatively little. Tiles store 
 *     information about themselves -- such as the URL that they are related
 *     to, and their size - but do not add themselves to the layer div 
 *     automatically, for example. Create a new tile with the 
 *     <OpenLayers.Tile> constructor, or a subclass. 
 * 
 * TBD 3.0 - remove reference to url in above paragraph
 * 
 */
OpenLayers.Tile = OpenLayers.Class({
    
    /** 
     * Constant: EVENT_TYPES
     * {Array(String)} Supported application event types
     */
    EVENT_TYPES: [ "loadstart", "loadend", "reload", "unload"],
    
    /**
     * APIProperty: events
     * {<OpenLayers.Events>} An events object that handles all 
     *                       events on the tile.
     */
    events: null,

    /**
     * Property: id 
     * {String} null
     */
    id: null,
    
    /** 
     * Property: layer 
     * {<OpenLayers.Layer>} layer the tile is attached to 
     */
    layer: null,
    
    /**
     * Property: url
     * {String} url of the request.
     *
     * TBD 3.0 
     * Deprecated. The base tile class does not need an url. This should be 
     * handled in subclasses. Does not belong here.
     */
    url: null,

    /** 
     * APIProperty: bounds 
     * {<OpenLayers.Bounds>} null
     */
    bounds: null,
    
    /** 
     * Property: size 
     * {<OpenLayers.Size>} null
     */
    size: null,
    
    /** 
     * Property: position 
     * {<OpenLayers.Pixel>} Top Left pixel of the tile
     */    
    position: null,

    /**
     * Property: isLoading
     * {Boolean} Is the tile loading?
     */
    isLoading: false,
    
    /**
     * Property: isBackBuffer
     * {Boolean} Is this tile a back buffer tile?
     */
    isBackBuffer: false,
    
    /**
     * Property: lastRatio
     * {Float} Used in transition code only.  This is the previous ratio
     *     of the back buffer tile resolution to the map resolution.  Compared
     *     with the current ratio to determine if zooming occurred.
     */
    lastRatio: 1,

    /**
     * Property: isFirstDraw
     * {Boolean} Is this the first time the tile is being drawn?
     *     This is used to force resetBackBuffer to synchronize
     *     the backBufferTile with the foreground tile the first time
     *     the foreground tile loads so that if the user zooms
     *     before the layer has fully loaded, the backBufferTile for
     *     tiles that have been loaded can be used.
     */
    isFirstDraw: true,
        
    /**
     * Property: backBufferTile
     * {<OpenLayers.Tile>} A clone of the tile used to create transition
     *     effects when the tile is moved or changes resolution.
     */
    backBufferTile: null,
        
    /** TBD 3.0 -- remove 'url' from the list of parameters to the constructor.
     *             there is no need for the base tile class to have a url.
     * 
     * Constructor: OpenLayers.Tile
     * Constructor for a new <OpenLayers.Tile> instance.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} layer that the tile will go in.
     * position - {<OpenLayers.Pixel>}
     * bounds - {<OpenLayers.Bounds>}
     * url - {<String>}
     * size - {<OpenLayers.Size>}
     */   
    initialize: function(layer, position, bounds, url, size) {
        this.layer = layer;
        this.position = position.clone();
        this.bounds = bounds.clone();
        this.url = url;
        this.size = size.clone();

        //give the tile a unique id based on its BBOX.
        this.id = OpenLayers.Util.createUniqueID("Tile_");
        
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
    },

    /**
     * Method: unload
     * Call immediately before destroying if you are listening to tile
     * events, so that counters are properly handled if tile is still
     * loading at destroy-time. Will only fire an event if the tile is
     * still loading.
     */
    unload: function() {
       if (this.isLoading) { 
           this.isLoading = false; 
           this.events.triggerEvent("unload"); 
       }
    },
    
    /** 
     * APIMethod: destroy
     * Nullify references to prevent circular references and memory leaks.
     */
    destroy:function() {
        if (OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, 
                this.layer.transitionEffect) != -1) {
            this.layer.events.unregister("loadend", this, this.resetBackBuffer);
            this.events.unregister('loadend', this, this.resetBackBuffer);            
        } else {
            this.events.unregister('loadend', this, this.showTile);
        }
        this.layer  = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
        
        this.events.destroy();
        this.events = null;
        
        /* clean up the backBufferTile if it exists */
        if (this.backBufferTile) {
            this.backBufferTile.destroy();
            this.backBufferTile = null;
        }
    },
    
    /**
     * Method: clone
     *
     * Parameters:
     * obj - {<OpenLayers.Tile>} The tile to be cloned
     *
     * Returns:
     * {<OpenLayers.Tile>} An exact clone of this <OpenLayers.Tile>
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Tile(this.layer, 
                                      this.position, 
                                      this.bounds, 
                                      this.url, 
                                      this.size);
        } 
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        return obj;
    },

    /**
     * Method: draw
     * Clear whatever is currently in the tile, then return whether or not 
     *     it should actually be re-drawn.
     * 
     * Returns:
     * {Boolean} Whether or not the tile should actually be drawn. Note that 
     *     this is not really the best way of doing things, but such is 
     *     the way the code has been developed. Subclasses call this and
     *     depend on the return to know if they should draw or not.
     */
    draw: function() {
        var maxExtent = this.layer.maxExtent;
        var withinMaxExtent = (maxExtent &&
                               this.bounds.intersectsBounds(maxExtent, false));
 
        // The only case where we *wouldn't* want to draw the tile is if the 
        // tile is outside its layer's maxExtent.
        var drawTile = (withinMaxExtent || this.layer.displayOutsideMaxExtent);

        if (OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, this.layer.transitionEffect) != -1) {
            if (drawTile) {
                //we use a clone of this tile to create a double buffer for visual
                //continuity.  The backBufferTile is used to create transition
                //effects while the tile in the grid is repositioned and redrawn
                if (!this.backBufferTile) {
                    this.backBufferTile = this.clone();
                    this.backBufferTile.hide();
                    // this is important.  It allows the backBuffer to place itself
                    // appropriately in the DOM.  The Image subclass needs to put
                    // the backBufferTile behind the main tile so the tiles can
                    // load over top and display as soon as they are loaded.
                    this.backBufferTile.isBackBuffer = true;
                    
                    // potentially end any transition effects when the tile loads
                    this.events.register('loadend', this, this.resetBackBuffer);
                    
                    // clear transition back buffer tile only after all tiles in
                    // this layer have loaded to avoid visual glitches
                    this.layer.events.register("loadend", this, this.resetBackBuffer);
                }
                // run any transition effects
                this.startTransition();
            } else {
                // if we aren't going to draw the tile, then the backBuffer should
                // be hidden too!
                if (this.backBufferTile) {
                    this.backBufferTile.clear();
                }
            }
        } else {
            if (drawTile && this.isFirstDraw) {
                this.events.register('loadend', this, this.showTile);
                this.isFirstDraw = false;
            }   
        }    
        this.shouldDraw = drawTile;
        
        //clear tile's contents and mark as not drawn
        this.clear();
        
        return drawTile;
    },
    
    /** 
     * Method: moveTo
     * Reposition the tile.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * redraw - {Boolean} Call draw method on tile after moving.
     *     Default is true
     */
    moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }

        this.bounds = bounds.clone();
        this.position = position.clone();
        if (redraw) {
            this.draw();
        }
    },

    /** 
     * Method: clear
     * Clear the tile of any bounds/position-related data so that it can 
     *     be reused in a new location. To be implemented by subclasses.
     */
    clear: function() {
        // to be implemented by subclasses
    },
    
    /**   
     * Method: getBoundsFromBaseLayer
     * Take the pixel locations of the corner of the tile, and pass them to 
     *     the base layer and ask for the location of those pixels, so that 
     *     displaying tiles over Google works fine.
     *
     * Parameters:
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * bounds - {<OpenLayers.Bounds>} 
     */
    getBoundsFromBaseLayer: function(position) {
        var msg = OpenLayers.i18n('reprojectDeprecated',
                                              {'layerName':this.layer.name});
        OpenLayers.Console.warn(msg);
        var topLeft = this.layer.map.getLonLatFromLayerPx(position); 
        var bottomRightPx = position.clone();
        bottomRightPx.x += this.size.w;
        bottomRightPx.y += this.size.h;
        var bottomRight = this.layer.map.getLonLatFromLayerPx(bottomRightPx); 
        // Handle the case where the base layer wraps around the date line.
        // Google does this, and it breaks WMS servers to request bounds in 
        // that fashion.  
        if (topLeft.lon > bottomRight.lon) {
            if (topLeft.lon < 0) {
                topLeft.lon = -180 - (topLeft.lon+180);
            } else {
                bottomRight.lon = 180+bottomRight.lon+180;
            }        
        }
        var bounds = new OpenLayers.Bounds(topLeft.lon, 
                                       bottomRight.lat, 
                                       bottomRight.lon, 
                                       topLeft.lat);  
        return bounds;
    },        
    
    /** 
     * Method: startTransition
     * Prepare the tile for a transition effect.  To be
     *     implemented by subclasses.
     */
    startTransition: function() {},
    
    /** 
     * Method: resetBackBuffer
     * Triggered by two different events, layer loadend, and tile loadend.
     *     In any of these cases, we check to see if we can hide the 
     *     backBufferTile yet and update its parameters to match the 
     *     foreground tile.
     *
     * Basic logic:
     *  - If the backBufferTile hasn't been drawn yet, reset it
     *  - If layer is still loading, show foreground tile but don't hide
     *    the backBufferTile yet
     *  - If layer is done loading, reset backBuffer tile and show 
     *    foreground tile
     */
    resetBackBuffer: function() {
        this.showTile();
        if (this.backBufferTile && 
            (this.isFirstDraw || !this.layer.numLoadingTiles)) {
            this.isFirstDraw = false;
            // check to see if the backBufferTile is within the max extents
            // before rendering it 
            var maxExtent = this.layer.maxExtent;
            var withinMaxExtent = (maxExtent &&
                                   this.bounds.intersectsBounds(maxExtent, false));
            if (withinMaxExtent) {
                this.backBufferTile.position = this.position;
                this.backBufferTile.bounds = this.bounds;
                this.backBufferTile.size = this.size;
                this.backBufferTile.imageSize = this.layer.imageSize || this.size;
                this.backBufferTile.imageOffset = this.layer.imageOffset;
                this.backBufferTile.resolution = this.layer.getResolution();
                this.backBufferTile.renderTile();
            }
        }
    },
        
    /** 
     * Method: showTile
     * Show the tile only if it should be drawn.
     */
    showTile: function() { 
        if (this.shouldDraw) {
            this.show();
        }
    },
    
    /** 
     * Method: show
     * Show the tile.  To be implemented by subclasses.
     */
    show: function() { },
    
    /** 
     * Method: hide
     * Hide the tile.  To be implemented by subclasses.
     */
    hide: function() { },
    
    CLASS_NAME: "OpenLayers.Tile"
});
/* ======================================================================
    OpenLayers/Handler.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Events.js
 */

/**
 * Class: OpenLayers.Handler
 * Base class to construct a higher-level handler for event sequences.  All
 *     handlers have activate and deactivate methods.  In addition, they have
 *     methods named like browser events.  When a handler is activated, any
 *     additional methods named like a browser event is registered as a
 *     listener for the corresponding event.  When a handler is deactivated,
 *     those same methods are unregistered as event listeners.
 *
 * Handlers also typically have a callbacks object with keys named like
 *     the abstracted events or event sequences that they are in charge of
 *     handling.  The controls that wrap handlers define the methods that
 *     correspond to these abstract events - so instead of listening for
 *     individual browser events, they only listen for the abstract events
 *     defined by the handler.
 *     
 * Handlers are created by controls, which ultimately have the responsibility
 *     of making changes to the the state of the application.  Handlers
 *     themselves may make temporary changes, but in general are expected to
 *     return the application in the same state that they found it.
 */
OpenLayers.Handler = OpenLayers.Class({

    /**
     * Property: id
     * {String}
     */
    id: null,
        
    /**
     * APIProperty: control
     * {<OpenLayers.Control>}. The control that initialized this handler.  The
     *     control is assumed to have a valid map property - that map is used
     *     in the handler's own setMap method.
     */
    control: null,

    /**
     * Property: map
     * {<OpenLayers.Map>}
     */
    map: null,

    /**
     * APIProperty: keyMask
     * {Integer} Use bitwise operators and one or more of the OpenLayers.Handler
     *     constants to construct a keyMask.  The keyMask is used by
     *     <checkModifiers>.  If the keyMask matches the combination of keys
     *     down on an event, checkModifiers returns true.
     *
     * Example:
     * (code)
     *     // handler only responds if the Shift key is down
     *     handler.keyMask = OpenLayers.Handler.MOD_SHIFT;
     *
     *     // handler only responds if Ctrl-Shift is down
     *     handler.keyMask = OpenLayers.Handler.MOD_SHIFT |
     *                       OpenLayers.Handler.MOD_CTRL;
     * (end)
     */
    keyMask: null,

    /**
     * Property: active
     * {Boolean}
     */
    active: false,
    
    /**
     * Property: evt
     * {Event} This property references the last event handled by the handler.
     *     Note that this property is not part of the stable API.  Use of the
     *     evt property should be restricted to controls in the library
     *     or other applications that are willing to update with changes to
     *     the OpenLayers code.
     */
    evt: null,

    /**
     * Constructor: OpenLayers.Handler
     * Construct a handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that initialized this
     *     handler.  The control is assumed to have a valid map property; that
     *     map is used in the handler's own setMap method.
     * callbacks - {Object} An object whose properties correspond to abstracted
     *     events or sequences of browser events.  The values for these
     *     properties are functions defined by the control that get called by
     *     the handler.
     * options - {Object} An optional object whose properties will be set on
     *     the handler.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;
        if (control.map) {
            this.setMap(control.map); 
        }

        OpenLayers.Util.extend(this, options);
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    
    /**
     * Method: setMap
     */
    setMap: function (map) {
        this.map = map;
    },

    /**
     * Method: checkModifiers
     * Check the keyMask on the handler.  If no <keyMask> is set, this always
     *     returns true.  If a <keyMask> is set and it matches the combination
     *     of keys down on an event, this returns true.
     *
     * Returns:
     * {Boolean} The keyMask matches the keys down on an event.
     */
    checkModifiers: function (evt) {
        if(this.keyMask == null) {
            return true;
        }
        /* calculate the keyboard modifier mask for this event */
        var keyModifiers =
            (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? OpenLayers.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? OpenLayers.Handler.MOD_ALT   : 0);
    
        /* if it differs from the handler object's key mask,
           bail out of the event handler */
        return (keyModifiers == this.keyMask);
    },

    /**
     * APIMethod: activate
     * Turn on the handler.  Returns false if the handler was already active.
     * 
     * Returns: 
     * {Boolean} The handler was activated.
     */
    activate: function() {
        if(this.active) {
            return false;
        }
        // register for event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0; i < events.length; i++) {
            if (this[events[i]]) {
                this.register(events[i], this[events[i]]); 
            }
        } 
        this.active = true;
        return true;
    },
    
    /**
     * APIMethod: deactivate
     * Turn off the handler.  Returns false if the handler was already inactive.
     * 
     * Returns:
     * {Boolean} The handler was deactivated.
     */
    deactivate: function() {
        if(!this.active) {
            return false;
        }
        // unregister event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0; i < events.length; i++) {
            if (this[events[i]]) {
                this.unregister(events[i], this[events[i]]); 
            }
        } 
        this.active = false;
        return true;
    },

    /**
    * Method: callback
    * Trigger the control's named callback with the given arguments
    *
    * Parameters:
    * name - {String} The key for the callback that is one of the properties
    *     of the handler's callbacks object.
    * args - {Array(*)} An array of arguments (any type) with which to call 
    *     the callback (defined by the control).
    */
    callback: function (name, args) {
        if (name && this.callbacks[name]) {
            this.callbacks[name].apply(this.control, args);
        }
    },

    /**
    * Method: register
    * register an event on the map
    */
    register: function (name, method) {
        // TODO: deal with registerPriority in 3.0
        this.map.events.registerPriority(name, this, method);
        this.map.events.registerPriority(name, this, this.setEvent);
    },

    /**
    * Method: unregister
    * unregister an event from the map
    */
    unregister: function (name, method) {
        this.map.events.unregister(name, this, method);   
        this.map.events.unregister(name, this, this.setEvent);
    },
    
    /**
     * Method: setEvent
     * With each registered browser event, the handler sets its own evt
     *     property.  This property can be accessed by controls if needed
     *     to get more information about the event that the handler is
     *     processing.
     *
     * This allows modifier keys on the event to be checked (alt, shift,
     *     and ctrl cannot be checked with the keyboard handler).  For a
     *     control to determine which modifier keys are associated with the
     *     event that a handler is currently processing, it should access
     *     (code)handler.evt.altKey || handler.evt.shiftKey ||
     *     handler.evt.ctrlKey(end).
     *
     * Parameters:
     * evt - {Event} The browser event.
     */
    setEvent: function(evt) {
        this.evt = evt;
        return true;
    },

    /**
     * Method: destroy
     * Deconstruct the handler.
     */
    destroy: function () {
        // unregister event listeners
        this.deactivate();
        // eliminate circular references
        this.control = this.map = null;        
    },

    CLASS_NAME: "OpenLayers.Handler"
});

/**
 * Constant: OpenLayers.Handler.MOD_NONE
 * If set as the <keyMask>, <checkModifiers> returns false if any key is down.
 */
OpenLayers.Handler.MOD_NONE  = 0;

/**
 * Constant: OpenLayers.Handler.MOD_SHIFT
 * If set as the <keyMask>, <checkModifiers> returns false if Shift is down.
 */
OpenLayers.Handler.MOD_SHIFT = 1;

/**
 * Constant: OpenLayers.Handler.MOD_CTRL
 * If set as the <keyMask>, <checkModifiers> returns false if Ctrl is down.
 */
OpenLayers.Handler.MOD_CTRL  = 2;

/**
 * Constant: OpenLayers.Handler.MOD_ALT
 * If set as the <keyMask>, <checkModifiers> returns false if Alt is down.
 */
OpenLayers.Handler.MOD_ALT   = 4;


/* ======================================================================
    OpenLayers/Map.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/Tween.js
 */

/**
 * Class: OpenLayers.Map
 * Instances of OpenLayers.Map are interactive maps embedded in a web page.
 * Create a new map with the <OpenLayers.Map> constructor.
 * 
 * On their own maps do not provide much functionality.  To extend a map
 * it's necessary to add controls (<OpenLayers.Control>) and 
 * layers (<OpenLayers.Layer>) to the map. 
 */
OpenLayers.Map = OpenLayers.Class({
    
    /**
     * Constant: Z_INDEX_BASE
     * {Object} Base z-indexes for different classes of thing 
     */
    Z_INDEX_BASE: { BaseLayer: 100, Overlay: 325, Popup: 750, Control: 1000 },

    /**
     * Constant: EVENT_TYPES
     * {Array(String)} Supported application event types.  Register a listener
     *     for a particular event with the following syntax:
     * (code)
     * map.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     *  - *object* {Object} A reference to map.events.object.
     *  - *element* {DOMElement} A reference to map.events.element.
     *
     * Browser events have the following additional properties:
     *  - *xy* {<OpenLayers.Pixel>} The pixel location of the event (relative
     *      to the the map viewport).
     *  - other properties that come with browser events
     *
     * Supported map event types:
     *  - *preaddlayer* triggered before a layer has been added.  The event
     *      object will include a *layer* property that references the layer  
     *      to be added.
     *  - *addlayer* triggered after a layer has been added.  The event object
     *      will include a *layer* property that references the added layer.
     *  - *removelayer* triggered after a layer has been removed.  The event
     *      object will include a *layer* property that references the removed
     *      layer.
     *  - *changelayer* triggered after a layer name change, order change, or
     *      visibility change (due to resolution thresholds).  Listeners will
     *      receive an event object with *layer* and *property* properties.  The
     *      *layer* property will be a reference to the changed layer.  The
     *      *property* property will be a key to the changed property (name,
     *      visibility, or order).
     *  - *movestart* triggered after the start of a drag, pan, or zoom
     *  - *move* triggered after each drag, pan, or zoom
     *  - *moveend* triggered after a drag, pan, or zoom completes
     *  - *popupopen* triggered after a popup opens
     *  - *popupclose* triggered after a popup opens
     *  - *addmarker* triggered after a marker has been added
     *  - *removemarker* triggered after a marker has been removed
     *  - *clearmarkers* triggered after markers have been cleared
     *  - *mouseover* triggered after mouseover the map
     *  - *mouseout* triggered after mouseout the map
     *  - *mousemove* triggered after mousemove the map
     *  - *dragstart* triggered after the start of a drag
     *  - *drag* triggered after a drag
     *  - *dragend* triggered after the end of a drag
     *  - *changebaselayer* triggered after the base layer changes
     */
    EVENT_TYPES: [ 
        "preaddlayer", "addlayer", "removelayer", "changelayer", "movestart",
        "move", "moveend", "zoomend", "popupopen", "popupclose",
        "addmarker", "removemarker", "clearmarkers", "mouseover",
        "mouseout", "mousemove", "dragstart", "drag", "dragend",
        "changebaselayer"],

    /**
     * Property: id
     * {String} Unique identifier for the map
     */
    id: null,
    
    /**
     * Property: fractionalZoom
     * {Boolean} For a base layer that supports it, allow the map resolution
     *     to be set to a value between one of the values in the resolutions
     *     array.  Default is false.
     *
     * When fractionalZoom is set to true, it is possible to zoom to
     *     an arbitrary extent.  This requires a base layer from a source
     *     that supports requests for arbitrary extents (i.e. not cached
     *     tiles on a regular lattice).  This means that fractionalZoom
     *     will not work with commercial layers (Google, Yahoo, VE), layers
     *     using TileCache, or any other pre-cached data sources.
     *
     * If you are using fractionalZoom, then you should also use
     *     <getResolutionForZoom> instead of layer.resolutions[zoom] as the
     *     former works for non-integer zoom levels.
     */
    fractionalZoom: false,
    
    /**
     * APIProperty: events
     * {<OpenLayers.Events>} An events object that handles all 
     *                       events on the map
     */
    events: null,

    /**
     * APIProperty: div
     * {DOMElement} The element that contains the map
     */
    div: null,
    
    /**
     * Property: dragging
     * {Boolean} The map is currently being dragged.
     */
    dragging: false,

    /**
     * Property: size
     * {<OpenLayers.Size>} Size of the main div (this.div)
     */
    size: null,
    
    /**
     * Property: viewPortDiv
     * {HTMLDivElement} The element that represents the map viewport
     */
    viewPortDiv: null,

    /**
     * Property: layerContainerOrigin
     * {<OpenLayers.LonLat>} The lonlat at which the later container was
     *                       re-initialized (on-zoom)
     */
    layerContainerOrigin: null,

    /**
     * Property: layerContainerDiv
     * {HTMLDivElement} The element that contains the layers.
     */
    layerContainerDiv: null,

    /**
     * APIProperty: layers
     * {Array(<OpenLayers.Layer>)} Ordered list of layers in the map
     */
    layers: null,

    /**
     * Property: controls
     * {Array(<OpenLayers.Control>)} List of controls associated with the map
     */
    controls: null,

    /**
     * Property: popups
     * {Array(<OpenLayers.Popup>)} List of popups associated with the map
     */
    popups: null,

    /**
     * APIProperty: baseLayer
     * {<OpenLayers.Layer>} The currently selected base layer.  This determines
     * min/max zoom level, projection, etc.
     */
    baseLayer: null,
    
    /**
     * Property: center
     * {<OpenLayers.LonLat>} The current center of the map
     */
    center: null,

    /**
     * Property: resolution
     * {Float} The resolution of the map.
     */
    resolution: null,

    /**
     * Property: zoom
     * {Integer} The current zoom level of the map
     */
    zoom: 0,    

    /**
     * Property: viewRequestID
     * {String} Used to store a unique identifier that changes when the map 
     *          view changes. viewRequestID should be used when adding data 
     *          asynchronously to the map: viewRequestID is incremented when 
     *          you initiate your request (right now during changing of 
     *          baselayers and changing of zooms). It is stored here in the 
     *          map and also in the data that will be coming back 
     *          asynchronously. Before displaying this data on request 
     *          completion, we check that the viewRequestID of the data is 
     *          still the same as that of the map. Fix for #480
     */
    viewRequestID: 0,

  // Options

    /**
     * APIProperty: tileSize
     * {<OpenLayers.Size>} Set in the map options to override the default tile
     *                     size for this map.
     */
    tileSize: null,

    /**
     * APIProperty: projection
     * {String} Set in the map options to override the default projection 
     *          string this map - also set maxExtent, maxResolution, and 
     *          units if appropriate.
     */
    projection: "EPSG:4326",    
        
    /**
     * APIProperty: units
     * {String} The map units.  Defaults to 'degrees'.  Possible values are
     *          'degrees' (or 'dd'), 'm', 'ft', 'km', 'mi', 'inches'.
     */
    units: 'degrees',

    /**
     * APIProperty: resolutions
     * {Array(Float)} A list of map resolutions (map units per pixel) in 
     *     descending order.  If this is not set in the layer constructor, it 
     *     will be set based on other resolution related properties 
     *     (maxExtent, maxResolution, maxScale, etc.).
     */
    resolutions: null,

    /**
     * APIProperty: maxResolution
     * {Float} Default max is 360 deg / 256 px, which corresponds to
     *          zoom level 0 on gmaps.  Specify a different value in the map 
     *          options if you are not using a geographic projection and 
     *          displaying the whole world.
     */
    maxResolution: 1.40625,

    /**
     * APIProperty: minResolution
     * {Float}
     */
    minResolution: null,

    /**
     * APIProperty: maxScale
     * {Float}
     */
    maxScale: null,

    /**
     * APIProperty: minScale
     * {Float}
     */
    minScale: null,

    /**
     * APIProperty: maxExtent
     * {<OpenLayers.Bounds>} The maximum extent for the map.  Defaults to the
     *                       whole world in decimal degrees 
     *                       (-180, -90, 180, 90).  Specify a different
     *                        extent in the map options if you are not using a 
     *                        geographic projection and displaying the whole 
     *                        world.
     */
    maxExtent: null,
    
    /**
     * APIProperty: minExtent
     * {<OpenLayers.Bounds>}
     */
    minExtent: null,
    
    /**
     * APIProperty: restrictedExtent
     * {<OpenLayers.Bounds>} Limit map navigation to this extent where possible.
     *     If a non-null restrictedExtent is set, panning will be restricted
     *     to the given bounds.  In addition, zooming to a resolution that
     *     displays more than the restricted extent will center the map
     *     on the restricted extent.  If you wish to limit the zoom level
     *     or resolution, use maxResolution.
     */
    restrictedExtent: null,

    /**
     * APIProperty: numZoomLevels
     * {Integer} Number of zoom levels for the map.  Defaults to 16.  Set a
     *           different value in the map options if needed.
     */
    numZoomLevels: 16,

    /**
     * APIProperty: theme
     * {String} Relative path to a CSS file from which to load theme styles.
     *          Specify null in the map options (e.g. {theme: null}) if you 
     *          want to get cascading style declarations - by putting links to 
     *          stylesheets or style declarations directly in your page.
     */
    theme: null,
    
    /** 
     * APIProperty: displayProjection
     * {<OpenLayers.Projection>} Requires proj4js support.Projection used by
     *     several controls to display data to user. If this property is set,
     *     it will be set on any control which has a null displayProjection
     *     property at the time the control is added to the map. 
     */
    displayProjection: null,

    /**
     * APIProperty: fallThrough
     * {Boolean} Should OpenLayers allow events on the map to fall through to
     *           other elements on the page, or should it swallow them? (#457)
     *           Default is to fall through.
     */
    fallThrough: true,
    
    /**
     * Property: panTween
     * {OpenLayers.Tween} Animated panning tween object, see panTo()
     */
    panTween: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /**
     * Property: panMethod
     * {Function} The Easing function to be used for tweening.  Default is
     * OpenLayers.Easing.Expo.easeOut. Setting this to 'null' turns off
     * animated panning.
     */
    panMethod: OpenLayers.Easing.Expo.easeOut,
    
    /**
     * Property: paddingForPopups
     * {<OpenLayers.Bounds>} Outside margin of the popup. Used to prevent 
     *     the popup from getting too close to the map border.
     */
    paddingForPopups : null,
    
    /**
     * Constructor: OpenLayers.Map
     * Constructor for a new OpenLayers.Map instance.
     *
     * Parameters:
     * div - {String} Id of an element in your page that will contain the map.
     * options - {Object} Optional object with properties to tag onto the map.
     *
     * Examples:
     * (code)
     * // create a map with default options in an element with the id "map1"
     * var map = new OpenLayers.Map("map1");
     *
     * // create a map with non-default options in an element with id "map2"
     * var options = {
     *     maxExtent: new OpenLayers.Bounds(-200000, -200000, 200000, 200000),
     *     maxResolution: 156543,
     *     units: 'm',
     *     projection: "EPSG:41001"
     * };
     * var map = new OpenLayers.Map("map2", options);
     * (end)
     */    
    initialize: function (div, options) {

        // Simple-type defaults are set in class definition. 
        //  Now set complex-type defaults 
        this.tileSize = new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,
                                            OpenLayers.Map.TILE_HEIGHT);
        
        this.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90);
        
        this.paddingForPopups = new OpenLayers.Bounds(15, 15, 15, 15);

        this.theme = OpenLayers._getScriptLocation() + 
                             'theme/default/style.css'; 

        // now override default options 
        OpenLayers.Util.extend(this, options);

        this.id = OpenLayers.Util.createUniqueID("OpenLayers.Map_");

        this.div = OpenLayers.Util.getElement(div);

        // the viewPortDiv is the outermost div we modify
        var id = this.div.id + "_OpenLayers_ViewPort";
        this.viewPortDiv = OpenLayers.Util.createDiv(id, null, null, null,
                                                     "relative", null,
                                                     "hidden");
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.className = "olMapViewport";
        this.div.appendChild(this.viewPortDiv);

        // the layerContainerDiv is the one that holds all the layers
        id = this.div.id + "_OpenLayers_Container";
        this.layerContainerDiv = OpenLayers.Util.createDiv(id);
        this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE['Popup']-1;
        
        this.viewPortDiv.appendChild(this.layerContainerDiv);

        this.events = new OpenLayers.Events(this, 
                                            this.div, 
                                            this.EVENT_TYPES, 
                                            this.fallThrough);
        this.updateSize();
        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
 
        // update the map size and location before the map moves
        this.events.register("movestart", this, this.updateSize);

        // Because Mozilla does not support the "resize" event for elements 
        // other than "window", we need to put a hack here. 
        if (OpenLayers.String.contains(navigator.appName, "Microsoft")) {
            // If IE, register the resize on the div
            this.events.register("resize", this, this.updateSize);
        } else {
            // Else updateSize on catching the window's resize
            //  Note that this is ok, as updateSize() does nothing if the 
            //  map's size has not actually changed.
            this.updateSizeDestroy = OpenLayers.Function.bind(this.updateSize, 
                this);
            OpenLayers.Event.observe(window, 'resize',
                            this.updateSizeDestroy);
        }
        
        // only append link stylesheet if the theme property is set
        if(this.theme) {
            // check existing links for equivalent url
            var addNode = true;
            var nodes = document.getElementsByTagName('link');
            for(var i=0; i<nodes.length; ++i) {
                if(OpenLayers.Util.isEquivalentUrl(nodes.item(i).href,
                                                   this.theme)) {
                    addNode = false;
                    break;
                }
            }
            // only add a new node if one with an equivalent url hasn't already
            // been added
            if(addNode) {
                var cssNode = document.createElement('link');
                cssNode.setAttribute('rel', 'stylesheet');
                cssNode.setAttribute('type', 'text/css');
                cssNode.setAttribute('href', this.theme);
                document.getElementsByTagName('head')[0].appendChild(cssNode);
            }
        }

        this.layers = [];
        
        if (this.controls == null) {
            if (OpenLayers.Control != null) { // running full or lite?
                this.controls = [ new OpenLayers.Control.Navigation(),
                                  new OpenLayers.Control.PanZoom(),
                                  new OpenLayers.Control.ArgParser(),
                                  new OpenLayers.Control.Attribution()
                                ];
            } else {
                this.controls = [];
            }
        }

        for(var i=0; i < this.controls.length; i++) {
            this.addControlToMap(this.controls[i]);
        }

        this.popups = [];

        this.unloadDestroy = OpenLayers.Function.bind(this.destroy, this);
        

        // always call map.destroy()
        OpenLayers.Event.observe(window, 'unload', this.unloadDestroy);

    },

    /**
     * Method: unloadDestroy
     * Function that is called to destroy the map on page unload. stored here
     *     so that if map is manually destroyed, we can unregister this.
     */
    unloadDestroy: null,
    
    /**
     * Method: updateSizeDestroy
     * When the map is destroyed, we need to stop listening to updateSize
     *    events: this method stores the function we need to unregister in 
     *    non-IE browsers.
     */
    updateSizeDestroy: null,

    /**
     * APIMethod: destroy
     * Destroy this map
     */
    destroy:function() {
        // if unloadDestroy is null, we've already been destroyed
        if (!this.unloadDestroy) {
            return false;
        }

        // map has been destroyed. dont do it again!
        OpenLayers.Event.stopObserving(window, 'unload', this.unloadDestroy);
        this.unloadDestroy = null;

        if (this.updateSizeDestroy) {
            OpenLayers.Event.stopObserving(window, 'resize', 
                                           this.updateSizeDestroy);
        } else {
            this.events.unregister("resize", this, this.updateSize);
        }    
        
        this.paddingForPopups = null;    

        if (this.controls != null) {
            for (var i = this.controls.length - 1; i>=0; --i) {
                this.controls[i].destroy();
            } 
            this.controls = null;
        }
        if (this.layers != null) {
            for (var i = this.layers.length - 1; i>=0; --i) {
                //pass 'false' to destroy so that map wont try to set a new 
                // baselayer after each baselayer is removed
                this.layers[i].destroy(false);
            } 
            this.layers = null;
        }
        if (this.viewPortDiv) {
            this.div.removeChild(this.viewPortDiv);
        }
        this.viewPortDiv = null;

        if(this.eventListeners) {
            this.events.un(this.eventListeners);
            this.eventListeners = null;
        }
        this.events.destroy();
        this.events = null;

    },

    /**
     * APIMethod: setOptions
     * Change the map options
     *
     * Parameters:
     * options - {Object} Hashtable of options to tag to the map
     */
    setOptions: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * APIMethod: getTileSize
     * Get the tile size for the map
     *
     * Returns:
     * {<OpenLayers.Size>}
     */
     getTileSize: function() {
         return this.tileSize;
     },


    /**
     * APIMethod: getBy
     * Get a list of objects given a property and a match item.
     *
     * Parameters:
     * array - {String} A property on the map whose value is an array.
     * property - {String} A property on each item of the given array.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(map[array][i][property]) evaluates to true, the item will
     *     be included in the array returned.  If no items are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array} An array of items where the given property matches the given
     *     criteria.
     */
    getBy: function(array, property, match) {
        var test = (typeof match.test == "function");
        var found = OpenLayers.Array.filter(this[array], function(item) {
            return item[property] == match || (test && match.test(item[property]));
        });
        return found;
    },

    /**
     * APIMethod: getLayersBy
     * Get a list of layers with properties matching the given criteria.
     *
     * Parameter:
     * property - {String} A layer property to be matched.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(layer[property]) evaluates to true, the layer will be
     *     included in the array returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given criteria.
     *     An empty array is returned if no matches are found.
     */
    getLayersBy: function(property, match) {
        return this.getBy("layers", property, match);
    },

    /**
     * APIMethod: getLayersByName
     * Get a list of layers with names matching the given name.
     *
     * Parameter:
     * match - {String | Object} A layer name.  The name can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     name.test(layer.name) evaluates to true, the layer will be included
     *     in the list of layers returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given name.
     *     An empty array is returned if no matches are found.
     */
    getLayersByName: function(match) {
        return this.getLayersBy("name", match);
    },

    /**
     * APIMethod: getLayersByClass
     * Get a list of layers of a given class (CLASS_NAME).
     *
     * Parameter:
     * match - {String | Object} A layer class name.  The match can also be a
     *     regular expression literal or object.  In addition, it can be any
     *     object with a method named test.  For reqular expressions or other,
     *     if type.test(layer.CLASS_NAME) evaluates to true, the layer will
     *     be included in the list of layers returned.  If no layers are
     *     found, an empty array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Layer>)} A list of layers matching the given class.
     *     An empty array is returned if no matches are found.
     */
    getLayersByClass: function(match) {
        return this.getLayersBy("CLASS_NAME", match);
    },

    /**
     * APIMethod: getControlsBy
     * Get a list of controls with properties matching the given criteria.
     *
     * Parameter:
     * property - {String} A control property to be matched.
     * match - {String | Object} A string to match.  Can also be a regular
     *     expression literal or object.  In addition, it can be any object
     *     with a method named test.  For reqular expressions or other, if
     *     match.test(layer[property]) evaluates to true, the layer will be
     *     included in the array returned.  If no layers are found, an empty
     *     array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Control>)} A list of controls matching the given
     *     criteria.  An empty array is returned if no matches are found.
     */
    getControlsBy: function(property, match) {
        return this.getBy("controls", property, match);
    },

    /**
     * APIMethod: getControlsByClass
     * Get a list of controls of a given class (CLASS_NAME).
     *
     * Parameter:
     * match - {String | Object} A control class name.  The match can also be a
     *     regular expression literal or object.  In addition, it can be any
     *     object with a method named test.  For reqular expressions or other,
     *     if type.test(control.CLASS_NAME) evaluates to true, the control will
     *     be included in the list of controls returned.  If no controls are
     *     found, an empty array is returned.
     *
     * Returns:
     * {Array(<OpenLayers.Control>)} A list of controls matching the given class.
     *     An empty array is returned if no matches are found.
     */
    getControlsByClass: function(match) {
        return this.getControlsBy("CLASS_NAME", match);
    },

  /********************************************************/
  /*                                                      */
  /*                  Layer Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Layers to and from the Map           */
  /*                                                      */
  /********************************************************/         

    /**
     * APIMethod: getLayer
     * Get a layer based on its id
     *
     * Parameter:
     * id - {String} A layer id
     *
     * Returns:
     * {<OpenLayers.Layer>} The Layer with the corresponding id from the map's 
     *                      layer collection, or null if not found.
     */
    getLayer: function(id) {
        var foundLayer = null;
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.id == id) {
                foundLayer = layer;
                break;
            }
        }
        return foundLayer;
    },

    /**
    * Method: setLayerZIndex
    * 
    * Parameters:
    * layer - {<OpenLayers.Layer>} 
    * zIdx - {int} 
    */    
    setLayerZIndex: function (layer, zIdx) {
        layer.setZIndex(
            this.Z_INDEX_BASE[layer.isBaseLayer ? 'BaseLayer' : 'Overlay']
            + zIdx * 5 );
    },

    /**
     * Method: resetLayersZIndex
     * Reset each layer's z-index based on layer's array index
     */
    resetLayersZIndex: function() {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            this.setLayerZIndex(layer, i);
        }
    },

    /**
    * APIMethod: addLayer
    *
    * Parameters:
    * layer - {<OpenLayers.Layer>} 
    */    
    addLayer: function (layer) {
        for(var i=0; i < this.layers.length; i++) {
            if (this.layers[i] == layer) {
                var msg = OpenLayers.i18n('layerAlreadyAdded', 
                                                      {'layerName':layer.name});
                OpenLayers.Console.warn(msg);
                return false;
            }
        }    

        this.events.triggerEvent("preaddlayer", {layer: layer});
        
        layer.div.className = "olLayerDiv";
        layer.div.style.overflow = "";
        this.setLayerZIndex(layer, this.layers.length);

        if (layer.isFixed) {
            this.viewPortDiv.appendChild(layer.div);
        } else {
            this.layerContainerDiv.appendChild(layer.div);
        }
        this.layers.push(layer);
        layer.setMap(this);

        if (layer.isBaseLayer)  {
            if (this.baseLayer == null) {
                // set the first baselaye we add as the baselayer
                this.setBaseLayer(layer);
            } else {
                layer.setVisibility(false);
            }
        } else {
            layer.redraw();
        }

        this.events.triggerEvent("addlayer", {layer: layer});
    },

    /**
    * APIMethod: addLayers 
    *
    * Parameters:
    * layers - {Array(<OpenLayers.Layer>)} 
    */    
    addLayers: function (layers) {
        for (var i = 0; i <  layers.length; i++) {
            this.addLayer(layers[i]);
        }
    },

    /** 
     * APIMethod: removeLayer
     * Removes a layer from the map by removing its visual element (the 
     *   layer.div property), then removing it from the map's internal list 
     *   of layers, setting the layer's map property to null. 
     * 
     *   a "removelayer" event is triggered.
     * 
     *   very worthy of mention is that simply removing a layer from a map
     *   will not cause the removal of any popups which may have been created
     *   by the layer. this is due to the fact that it was decided at some
     *   point that popups would not belong to layers. thus there is no way 
     *   for us to know here to which layer the popup belongs.
     *    
     *     A simple solution to this is simply to call destroy() on the layer.
     *     the default OpenLayers.Layer class's destroy() function
     *     automatically takes care to remove itself from whatever map it has
     *     been attached to. 
     * 
     *     The correct solution is for the layer itself to register an 
     *     event-handler on "removelayer" and when it is called, if it 
     *     recognizes itself as the layer being removed, then it cycles through
     *     its own personal list of popups, removing them from the map.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * setNewBaseLayer - {Boolean} Default is true
     */
    removeLayer: function(layer, setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }

        if (layer.isFixed) {
            this.viewPortDiv.removeChild(layer.div);
        } else {
            this.layerContainerDiv.removeChild(layer.div);
        }
        OpenLayers.Util.removeItem(this.layers, layer);
        layer.removeMap(this);
        layer.map = null;

        // if we removed the base layer, need to set a new one
        if(this.baseLayer == layer) {
            this.baseLayer = null;
            if(setNewBaseLayer) {
                for(var i=0; i < this.layers.length; i++) {
                    var iLayer = this.layers[i];
                    if (iLayer.isBaseLayer) {
                        this.setBaseLayer(iLayer);
                        break;
                    }
                }
            }
        }

        this.resetLayersZIndex();

        this.events.triggerEvent("removelayer", {layer: layer});
    },

    /**
     * APIMethod: getNumLayers
     * 
     * Returns:
     * {Int} The number of layers attached to the map.
     */
    getNumLayers: function () {
        return this.layers.length;
    },

    /** 
     * APIMethod: getLayerIndex
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>}
     *
     * Returns:
     * {Integer} The current (zero-based) index of the given layer in the map's
     *           layer stack. Returns -1 if the layer isn't on the map.
     */
    getLayerIndex: function (layer) {
        return OpenLayers.Util.indexOf(this.layers, layer);
    },
    
    /** 
     * APIMethod: setLayerIndex
     * Move the given layer to the specified (zero-based) index in the layer
     *     list, changing its z-index in the map display. Use
     *     map.getLayerIndex() to find out the current index of a layer. Note
     *     that this cannot (or at least should not) be effectively used to
     *     raise base layers above overlays.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * idx - {int} 
     */
    setLayerIndex: function (layer, idx) {
        var base = this.getLayerIndex(layer);
        if (idx < 0) {
            idx = 0;
        } else if (idx > this.layers.length) {
            idx = this.layers.length;
        }
        if (base != idx) {
            this.layers.splice(base, 1);
            this.layers.splice(idx, 0, layer);
            for (var i = 0; i < this.layers.length; i++) {
                this.setLayerZIndex(this.layers[i], i);
            }
            this.events.triggerEvent("changelayer", {
                layer: layer, property: "order"
            });
        }
    },

    /** 
     * APIMethod: raiseLayer
     * Change the index of the given layer by delta. If delta is positive, 
     *     the layer is moved up the map's layer stack; if delta is negative,
     *     the layer is moved down.  Again, note that this cannot (or at least
     *     should not) be effectively used to raise base layers above overlays.
     *
     * Paremeters:
     * layer - {<OpenLayers.Layer>} 
     * idx - {int} 
     */
    raiseLayer: function (layer, delta) {
        var idx = this.getLayerIndex(layer) + delta;
        this.setLayerIndex(layer, idx);
    },
    
    /** 
     * APIMethod: setBaseLayer
     * Allows user to specify one of the currently-loaded layers as the Map's
     *     new base layer.
     * 
     * Parameters:
     * newBaseLayer - {<OpenLayers.Layer>}
     */
    setBaseLayer: function(newBaseLayer) {
        var oldExtent = null;
        if (this.baseLayer) {
            oldExtent = this.baseLayer.getExtent();
        }

        if (newBaseLayer != this.baseLayer) {
          
            // is newBaseLayer an already loaded layer?m
            if (OpenLayers.Util.indexOf(this.layers, newBaseLayer) != -1) {

                // make the old base layer invisible 
                if (this.baseLayer != null) {
                    this.baseLayer.setVisibility(false);
                }

                // set new baselayer
                this.baseLayer = newBaseLayer;
                
                // Increment viewRequestID since the baseLayer is 
                // changing. This is used by tiles to check if they should 
                // draw themselves.
                this.viewRequestID++;
                this.baseLayer.visibility = true;

                //redraw all layers
                var center = this.getCenter();
                if (center != null) {

                    //either get the center from the old Extent or just from
                    // the current center of the map. 
                    var newCenter = (oldExtent) 
                        ? oldExtent.getCenterLonLat()
                        : center;

                    //the new zoom will either come from the old Extent or 
                    // from the current resolution of the map                                                
                    var newZoom = (oldExtent) 
                        ? this.getZoomForExtent(oldExtent, true)
                        : this.getZoomForResolution(this.resolution, true);

                    // zoom and force zoom change
                    this.setCenter(newCenter, newZoom, false, true);
                }

                this.events.triggerEvent("changebaselayer", {
                    layer: this.baseLayer
                });
            }        
        }
    },


  /********************************************************/
  /*                                                      */
  /*                 Control Functions                    */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Controls to and from the Map         */
  /*                                                      */
  /********************************************************/         

    /**
     * APIMethod: addControl
     * 
     * Parameters:
     * control - {<OpenLayers.Control>}
     * px - {<OpenLayers.Pixel>}
     */    
    addControl: function (control, px) {
        this.controls.push(control);
        this.addControlToMap(control, px);
    },

    /**
     * Method: addControlToMap
     * 
     * Parameters:
     * 
     * control - {<OpenLayers.Control>}
     * px - {<OpenLayers.Pixel>}
     */    
    addControlToMap: function (control, px) {
        // If a control doesn't have a div at this point, it belongs in the
        // viewport.
        control.outsideViewport = (control.div != null);
        
        // If the map has a displayProjection, and the control doesn't, set 
        // the display projection.
        if (this.displayProjection && !control.displayProjection) {
            control.displayProjection = this.displayProjection;
        }    
        
        control.setMap(this);
        var div = control.draw(px);
        if (div) {
            if(!control.outsideViewport) {
                div.style.zIndex = this.Z_INDEX_BASE['Control'] +
                                    this.controls.length;
                this.viewPortDiv.appendChild( div );
            }
        }
    },
    
    /**
     * APIMethod: getControl
     * 
     * Parameters:
     * id - {String} ID of the control to return.
     * 
     * Returns:
     * {<OpenLayers.Control>} The control from the map's list of controls 
     *                        which has a matching 'id'. If none found, 
     *                        returns null.
     */    
    getControl: function (id) {
        var returnControl = null;
        for(var i=0; i < this.controls.length; i++) {
            var control = this.controls[i];
            if (control.id == id) {
                returnControl = control;
                break;
            }
        }
        return returnControl;
    },
    
    /** 
     * APIMethod: removeControl
     * Remove a control from the map. Removes the control both from the map 
     *     object's internal array of controls, as well as from the map's 
     *     viewPort (assuming the control was not added outsideViewport)
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control to remove.
     */    
    removeControl: function (control) {
        //make sure control is non-null and actually part of our map
        if ( (control) && (control == this.getControl(control.id)) ) {
            if (control.div && (control.div.parentNode == this.viewPortDiv)) {
                this.viewPortDiv.removeChild(control.div);
            }
            OpenLayers.Util.removeItem(this.controls, control);
        }
    },

  /********************************************************/
  /*                                                      */
  /*                  Popup Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Popups to and from the Map           */
  /*                                                      */
  /********************************************************/         

    /** 
     * APIMethod: addPopup
     * 
     * Parameters:
     * popup - {<OpenLayers.Popup>}
     * exclusive - {Boolean} If true, closes all other popups first
     */
    addPopup: function(popup, exclusive) {

        if (exclusive) {
            //remove all other popups from screen
            for (var i = this.popups.length - 1; i >= 0; --i) {
                this.removePopup(this.popups[i]);
            }
        }

        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        if (popupDiv) {
            popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] +
                                    this.popups.length;
            this.layerContainerDiv.appendChild(popupDiv);
        }
    },
    
    /** 
    * APIMethod: removePopup
    * 
    * Parameters:
    * popup - {<OpenLayers.Popup>}
    */
    removePopup: function(popup) {
        OpenLayers.Util.removeItem(this.popups, popup);
        if (popup.div) {
            try { this.layerContainerDiv.removeChild(popup.div); }
            catch (e) { } // Popups sometimes apparently get disconnected
                      // from the layerContainerDiv, and cause complaints.
        }
        popup.map = null;
    },

  /********************************************************/
  /*                                                      */
  /*              Container Div Functions                 */
  /*                                                      */
  /*   The following functions deal with the access to    */
  /*    and maintenance of the size of the container div  */
  /*                                                      */
  /********************************************************/     

    /**
     * APIMethod: getSize
     * 
     * Returns:
     * {<OpenLayers.Size>} An <OpenLayers.Size> object that represents the 
     *                     size, in pixels, of the div into which OpenLayers 
     *                     has been loaded. 
     *                     Note - A clone() of this locally cached variable is
     *                     returned, so as not to allow users to modify it.
     */
    getSize: function () {
        var size = null;
        if (this.size != null) {
            size = this.size.clone();
        }
        return size;
    },

    /**
     * APIMethod: updateSize
     * This function should be called by any external code which dynamically
     *     changes the size of the map div (because mozilla wont let us catch 
     *     the "onresize" for an element)
     */
    updateSize: function() {
        // the div might have moved on the page, also
        this.events.element.offsets = null;
        var newSize = this.getCurrentSize();
        var oldSize = this.getSize();
        if (oldSize == null) {
            this.size = oldSize = newSize;
        }
        if (!newSize.equals(oldSize)) {
            
            // store the new size
            this.size = newSize;

            //notify layers of mapresize
            for(var i=0; i < this.layers.length; i++) {
                this.layers[i].onMapResize();                
            }

            if (this.baseLayer != null) {
                var center = new OpenLayers.Pixel(newSize.w /2, newSize.h / 2);
                var centerLL = this.getLonLatFromViewPortPx(center);
                var zoom = this.getZoom();
                this.zoom = null;
                this.setCenter(this.getCenter(), zoom);
            }

        }
    },
    
    /**
     * Method: getCurrentSize
     * 
     * Returns:
     * {<OpenLayers.Size>} A new <OpenLayers.Size> object with the dimensions 
     *                     of the map div
     */
    getCurrentSize: function() {

        var size = new OpenLayers.Size(this.div.clientWidth, 
                                       this.div.clientHeight);

        // Workaround for the fact that hidden elements return 0 for size.
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            var dim = OpenLayers.Element.getDimensions(this.div);
            size.w = dim.width;
            size.h = dim.height;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },

    /** 
     * Method: calculateBounds
     * 
     * Parameters:
     * center - {<OpenLayers.LonLat>} Default is this.getCenter()
     * resolution - {float} Default is this.getResolution() 
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A bounds based on resolution, center, and 
     *                       current mapsize.
     */
    calculateBounds: function(center, resolution) {

        var extent = null;
        
        if (center == null) {
            center = this.getCenter();
        }                
        if (resolution == null) {
            resolution = this.getResolution();
        }
    
        if ((center != null) && (resolution != null)) {

            var size = this.getSize();
            var w_deg = size.w * resolution;
            var h_deg = size.h * resolution;
        
            extent = new OpenLayers.Bounds(center.lon - w_deg / 2,
                                           center.lat - h_deg / 2,
                                           center.lon + w_deg / 2,
                                           center.lat + h_deg / 2);
        
        }

        return extent;
    },


  /********************************************************/
  /*                                                      */
  /*            Zoom, Center, Pan Functions               */
  /*                                                      */
  /*    The following functions handle the validation,    */
  /*   getting and setting of the Zoom Level and Center   */
  /*       as well as the panning of the Map              */
  /*                                                      */
  /********************************************************/
    /**
     * APIMethod: getCenter
     * 
     * Returns:
     * {<OpenLayers.LonLat>}
     */
    getCenter: function () {
        return this.center;
    },


    /**
     * APIMethod: getZoom
     * 
     * Returns:
     * {Integer}
     */
    getZoom: function () {
        return this.zoom;
    },
    
    /** 
     * APIMethod: pan
     * Allows user to pan by a value of screen pixels
     * 
     * Parameters:
     * dx - {Integer}
     * dy - {Integer}
     * options - {Object} Options to configure panning:
     *  - *animate* {Boolean} Use panTo instead of setCenter. Default is true.
     *  - *dragging* {Boolean} Call setCenter with dragging true.  Default is
     *    false.
     */
    pan: function(dx, dy, options) {
        // this should be pushed to applyDefaults and extend
        if (!options) {
            options = {};
        }
        OpenLayers.Util.applyDefaults(options, {
            animate: true,
            dragging: false
        });
        // getCenter
        var centerPx = this.getViewPortPxFromLonLat(this.getCenter());

        // adjust
        var newCenterPx = centerPx.add(dx, dy);
        
        // only call setCenter if not dragging or there has been a change
        if (!options.dragging || !newCenterPx.equals(centerPx)) {
            var newCenterLonLat = this.getLonLatFromViewPortPx(newCenterPx);
            if (options.animate) {
                this.panTo(newCenterLonLat);
            } else {
                this.setCenter(newCenterLonLat, null, options.dragging);
            }    
        }

   },
   
   /** 
     * APIMethod: panTo
     * Allows user to pan to a new lonlat
     * If the new lonlat is in the current extent the map will slide smoothly
     * 
     * Parameters:
     * lonlat - {<OpenLayers.Lonlat>}
     */
    panTo: function(lonlat) {
        if (this.panMethod && this.getExtent().containsLonLat(lonlat)) {
            if (!this.panTween) {
                this.panTween = new OpenLayers.Tween(this.panMethod);
            }
            var center = this.getCenter();
            var from = {
                lon: center.lon,
                lat: center.lat
            };
            var to = {
                lon: lonlat.lon,
                lat: lonlat.lat
            };
            this.panTween.start(from, to, 50, {
                callbacks: {
                    start: OpenLayers.Function.bind(function(lonlat) {
                        this.events.triggerEvent("movestart");
                    }, this),
                    eachStep: OpenLayers.Function.bind(function(lonlat) {
                        lonlat = new OpenLayers.LonLat(lonlat.lon, lonlat.lat);
                        this.moveTo(lonlat, this.zoom, {
                            'dragging': true,
                            'noEvent': true
                        });
                    }, this),
                    done: OpenLayers.Function.bind(function(lonlat) {
                        lonlat = new OpenLayers.LonLat(lonlat.lon, lonlat.lat);
                        this.moveTo(lonlat, this.zoom, {
                            'noEvent': true
                        });
                        this.events.triggerEvent("moveend");
                    }, this)
                }
            });
        } else {
            this.setCenter(lonlat);
        }
    },

    /**
     * APIMethod: setCenter
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * zoom - {Integer}
     * dragging - {Boolean} Specifies whether or not to trigger 
     *                      movestart/end events
     * forceZoomChange - {Boolean} Specifies whether or not to trigger zoom 
     *                             change events (needed on baseLayer change)
     *
     * TBD: reconsider forceZoomChange in 3.0
     */
    setCenter: function(lonlat, zoom, dragging, forceZoomChange) {
        this.moveTo(lonlat, zoom, {
            'dragging': dragging,
            'forceZoomChange': forceZoomChange,
            'caller': 'setCenter'
        });
    },

    /**
     * Method: moveTo
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * zoom - {Integer}
     * options - {Object}
     */
    moveTo: function(lonlat, zoom, options) {
        if (!options) { 
            options = {};
        }    
        // dragging is false by default
        var dragging = options.dragging;
        // forceZoomChange is false by default
        var forceZoomChange = options.forceZoomChange;
        // noEvent is false by default
        var noEvent = options.noEvent;

        if (this.panTween && options.caller == "setCenter") {
            this.panTween.stop();
        }    
             
        if (!this.center && !this.isValidLonLat(lonlat)) {
            lonlat = this.maxExtent.getCenterLonLat();
        }

        if(this.restrictedExtent != null) {
            // In 3.0, decide if we want to change interpretation of maxExtent.
            if(lonlat == null) { 
                lonlat = this.getCenter(); 
            }
            if(zoom == null) { 
                zoom = this.getZoom(); 
            }
            var resolution = this.getResolutionForZoom(zoom);
            var extent = this.calculateBounds(lonlat, resolution); 
            if(!this.restrictedExtent.containsBounds(extent)) {
                var maxCenter = this.restrictedExtent.getCenterLonLat(); 
                if(extent.getWidth() > this.restrictedExtent.getWidth()) { 
                    lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat); 
                } else if(extent.left < this.restrictedExtent.left) {
                    lonlat = lonlat.add(this.restrictedExtent.left -
                                        extent.left, 0); 
                } else if(extent.right > this.restrictedExtent.right) { 
                    lonlat = lonlat.add(this.restrictedExtent.right -
                                        extent.right, 0); 
                } 
                if(extent.getHeight() > this.restrictedExtent.getHeight()) { 
                    lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat); 
                } else if(extent.bottom < this.restrictedExtent.bottom) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                                        extent.bottom); 
                } 
                else if(extent.top > this.restrictedExtent.top) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.top -
                                        extent.top); 
                } 
            }
        }
        
        var zoomChanged = forceZoomChange || (
                            (this.isValidZoomLevel(zoom)) && 
                            (zoom != this.getZoom()) );

        var centerChanged = (this.isValidLonLat(lonlat)) && 
                            (!lonlat.equals(this.center));


        // if neither center nor zoom will change, no need to do anything
        if (zoomChanged || centerChanged || !dragging) {

            if (!this.dragging && !noEvent) {
                this.events.triggerEvent("movestart");
            }

            if (centerChanged) {
                if ((!zoomChanged) && (this.center)) { 
                    // if zoom hasnt changed, just slide layerContainer
                    //  (must be done before setting this.center to new value)
                    this.centerLayerContainer(lonlat);
                }
                this.center = lonlat.clone();
            }

            // (re)set the layerContainerDiv's location
            if ((zoomChanged) || (this.layerContainerOrigin == null)) {
                this.layerContainerOrigin = this.center.clone();
                this.layerContainerDiv.style.left = "0px";
                this.layerContainerDiv.style.top  = "0px";
            }

            if (zoomChanged) {
                this.zoom = zoom;
                this.resolution = this.getResolutionForZoom(zoom);
                // zoom level has changed, increment viewRequestID.
                this.viewRequestID++;
            }    
            
            var bounds = this.getExtent();
            
            //send the move call to the baselayer and all the overlays    
            this.baseLayer.moveTo(bounds, zoomChanged, dragging);
            
            bounds = this.baseLayer.getExtent();
            
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                if (!layer.isBaseLayer) {
                    var inRange = layer.calculateInRange();
                    if (layer.inRange != inRange) {
                        // the inRange property has changed. If the layer is
                        // no longer in range, we turn it off right away. If
                        // the layer is no longer out of range, the moveTo
                        // call below will turn on the layer.
                        layer.inRange = inRange;
                        if (!inRange) {
                            layer.display(false);
                        }
                        this.events.triggerEvent("changelayer", {
                            layer: layer, property: "visibility"
                        });
                    }
                    if (inRange && layer.visibility) {
                        layer.moveTo(bounds, zoomChanged, dragging);
                    }
                }                
            }
            
            if (zoomChanged) {
                //redraw popups
                for (var i = 0; i < this.popups.length; i++) {
                    this.popups[i].updatePosition();
                }
            }    
            
            this.events.triggerEvent("move");
    
            if (zoomChanged) { this.events.triggerEvent("zoomend"); }
        }

        // even if nothing was done, we want to notify of this
        if (!dragging && !noEvent) {
            this.events.triggerEvent("moveend");
        }
        
        // Store the map dragging state for later use
        this.dragging = !!dragging; 

    },

    /** 
     * Method: centerLayerContainer
     * This function takes care to recenter the layerContainerDiv.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     */
    centerLayerContainer: function (lonlat) {

        var originPx = this.getViewPortPxFromLonLat(this.layerContainerOrigin);
        var newPx = this.getViewPortPxFromLonLat(lonlat);

        if ((originPx != null) && (newPx != null)) {
            this.layerContainerDiv.style.left = Math.round(originPx.x - newPx.x) + "px";
            this.layerContainerDiv.style.top  = Math.round(originPx.y - newPx.y) + "px";
        }
    },

    /**
     * Method: isValidZoomLevel
     * 
     * Parameters:
     * zoomLevel - {Integer}
     * 
     * Returns:
     * {Boolean} Whether or not the zoom level passed in is non-null and 
     *           within the min/max range of zoom levels.
     */
    isValidZoomLevel: function(zoomLevel) {
       return ( (zoomLevel != null) &&
                (zoomLevel >= 0) && 
                (zoomLevel < this.getNumZoomLevels()) );
    },
    
    /**
     * Method: isValidLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {Boolean} Whether or not the lonlat passed in is non-null and within
     *           the maxExtent bounds
     */
    isValidLonLat: function(lonlat) {
        var valid = false;
        if (lonlat != null) {
            var maxExtent = this.getMaxExtent();
            valid = maxExtent.containsLonLat(lonlat);        
        }
        return valid;
    },

  /********************************************************/
  /*                                                      */
  /*                 Layer Options                        */
  /*                                                      */
  /*    Accessor functions to Layer Options parameters    */
  /*                                                      */
  /********************************************************/
    
    /**
     * APIMethod: getProjection
     * This method returns a string representing the projection. In 
     *     the case of projection support, this will be the srsCode which
     *     is loaded -- otherwise it will simply be the string value that
     *     was passed to the projection at startup.
     *
     * FIXME: In 3.0, we will remove getProjectionObject, and instead
     *     return a Projection object from this function. 
     * 
     * Returns:
     * {String} The Projection string from the base layer or null. 
     */
    getProjection: function() {
        var projection = this.getProjectionObject();
        return projection ? projection.getCode() : null;
    },
    
    /**
     * APIMethod: getProjectionObject
     * Returns the projection obect from the baselayer.
     *
     * Returns:
     * {<OpenLayers.Projection>} The Projection of the base layer.
     */
    getProjectionObject: function() {
        var projection = null;
        if (this.baseLayer != null) {
            projection = this.baseLayer.projection;
        }
        return projection;
    },
    
    /**
     * APIMethod: getMaxResolution
     * 
     * Returns:
     * {String} The Map's Maximum Resolution
     */
    getMaxResolution: function() {
        var maxResolution = null;
        if (this.baseLayer != null) {
            maxResolution = this.baseLayer.maxResolution;
        }
        return maxResolution;
    },
        
    /**
     * APIMethod: getMaxExtent
     * 
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getMaxExtent: function () {
        var maxExtent = null;
        if (this.baseLayer != null) {
            maxExtent = this.baseLayer.maxExtent;
        }        
        return maxExtent;
    },
    
    /**
     * APIMethod: getNumZoomLevels
     * 
     * Returns:
     * {Integer} The total number of zoom levels that can be displayed by the 
     *           current baseLayer.
     */
    getNumZoomLevels: function() {
        var numZoomLevels = null;
        if (this.baseLayer != null) {
            numZoomLevels = this.baseLayer.numZoomLevels;
        }
        return numZoomLevels;
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API?, are all merely wrappers to the    */
  /*       the same calls on whatever layer is set as     */
  /*                the current base layer                */
  /*                                                      */
  /********************************************************/

    /**
     * APIMethod: getExtent
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object which represents the lon/lat 
     *                       bounds of the current viewPort. 
     *                       If no baselayer is set, returns null.
     */
    getExtent: function () {
        var extent = null;
        if (this.baseLayer != null) {
            extent = this.baseLayer.getExtent();
        }
        return extent;
    },

    /**
     * APIMethod: getResolution
     * 
     * Returns:
     * {Float} The current resolution of the map. 
     *         If no baselayer is set, returns null.
     */
    getResolution: function () {
        var resolution = null;
        if (this.baseLayer != null) {
            resolution = this.baseLayer.getResolution();
        }
        return resolution;
    },

     /**
      * APIMethod: getScale
      * 
      * Returns:
      * {Float} The current scale denominator of the map. 
      *         If no baselayer is set, returns null.
      */
    getScale: function () {
        var scale = null;
        if (this.baseLayer != null) {
            var res = this.getResolution();
            var units = this.baseLayer.units;
            scale = OpenLayers.Util.getScaleFromResolution(res, units);
        }
        return scale;
    },


    /**
     * APIMethod: getZoomForExtent
     * 
     * Parameters: 
     * bounds - {<OpenLayers.Bounds>}
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified bounds. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     * 
     * Returns:
     * {Integer} A suitable zoom level for the specified bounds.
     *           If no baselayer is set, returns null.
     */
    getZoomForExtent: function (bounds, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForExtent(bounds, closest);
        }
        return zoom;
    },

    /**
     * APIMethod: getResolutionForZoom
     * 
     * Parameter:
     * zoom - {Float}
     * 
     * Returns:
     * {Float} A suitable resolution for the specified zoom.  If no baselayer
     *     is set, returns null.
     */
    getResolutionForZoom: function(zoom) {
        var resolution = null;
        if(this.baseLayer) {
            resolution = this.baseLayer.getResolutionForZoom(zoom);
        }
        return resolution;
    },

    /**
     * APIMethod: getZoomForResolution
     * 
     * Parameter:
     * resolution - {Float}
     * closest - {Boolean} Find the zoom level that corresponds to the absolute 
     *     closest resolution, which may result in a zoom whose corresponding
     *     resolution is actually smaller than we would have desired (if this
     *     is being called from a getZoomForExtent() call, then this means that
     *     the returned zoom index might not actually contain the entire 
     *     extent specified... but it'll be close).
     *     Default is false.
     * 
     * Returns:
     * {Integer} A suitable zoom level for the specified resolution.
     *           If no baselayer is set, returns null.
     */
    getZoomForResolution: function(resolution, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForResolution(resolution, closest);
        }
        return zoom;
    },

  /********************************************************/
  /*                                                      */
  /*                  Zooming Functions                   */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API, are all merely wrappers to the     */
  /*               the setCenter() function               */
  /*                                                      */
  /********************************************************/
  
    /** 
     * APIMethod: zoomTo
     * Zoom to a specific zoom level
     * 
     * Parameters:
     * zoom - {Integer}
     */
    zoomTo: function(zoom) {
        if (this.isValidZoomLevel(zoom)) {
            this.setCenter(null, zoom);
        }
    },
    
    /**
     * APIMethod: zoomIn
     * 
     * Parameters:
     * zoom - {int}
     */
    zoomIn: function() {
        this.zoomTo(this.getZoom() + 1);
    },
    
    /**
     * APIMethod: zoomOut
     * 
     * Parameters:
     * zoom - {int}
     */
    zoomOut: function() {
        this.zoomTo(this.getZoom() - 1);
    },

    /**
     * APIMethod: zoomToExtent
     * Zoom to the passed in bounds, recenter
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    zoomToExtent: function(bounds) {
        var center = bounds.getCenterLonLat();
        if (this.baseLayer.wrapDateLine) {
            var maxExtent = this.getMaxExtent();

            //fix straddling bounds (in the case of a bbox that straddles the 
            // dateline, it's left and right boundaries will appear backwards. 
            // we fix this by allowing a right value that is greater than the
            // max value at the dateline -- this allows us to pass a valid 
            // bounds to calculate zoom)
            //
            bounds = bounds.clone();
            while (bounds.right < bounds.left) {
                bounds.right += maxExtent.getWidth();
            }
            //if the bounds was straddling (see above), then the center point 
            // we got from it was wrong. So we take our new bounds and ask it
            // for the center. Because our new bounds is at least partially 
            // outside the bounds of maxExtent, the new calculated center 
            // might also be. We don't want to pass a bad center value to 
            // setCenter, so we have it wrap itself across the date line.
            //
            center = bounds.getCenterLonLat().wrapDateLine(maxExtent);
        }
        this.setCenter(center, this.getZoomForExtent(bounds));
    },

    /** 
     * APIMethod: zoomToMaxExtent
     * Zoom to the full extent and recenter.
     */
    zoomToMaxExtent: function() {
        this.zoomToExtent(this.getMaxExtent());
    },

    /** 
     * APIMethod: zoomToScale
     * Zoom to a specified scale 
     * 
     * Parameters:
     * scale - {float}
     */
    zoomToScale: function(scale) {
        var res = OpenLayers.Util.getResolutionFromScale(scale, 
                                                         this.baseLayer.units);
        var size = this.getSize();
        var w_deg = size.w * res;
        var h_deg = size.h * res;
        var center = this.getCenter();

        var extent = new OpenLayers.Bounds(center.lon - w_deg / 2,
                                           center.lat - h_deg / 2,
                                           center.lon + w_deg / 2,
                                           center.lat + h_deg / 2);
        this.zoomToExtent(extent);
    },
    
  /********************************************************/
  /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*      The following functions translate between       */
  /*           LonLat, LayerPx, and ViewPortPx            */
  /*                                                      */
  /********************************************************/
      
  //
  // TRANSLATION: LonLat <-> ViewPortPx
  //

    /**
     * Method: getLonLatFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in view 
     *                       port <OpenLayers.Pixel>, translated into lon/lat
     *                       by the current base layer.
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null; 
        if (this.baseLayer != null) {
            lonlat = this.baseLayer.getLonLatFromViewPortPx(viewPortPx);
        }
        return lonlat;
    },

    /**
     * APIMethod: getViewPortPxFromLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in 
     *                      <OpenLayers.LonLat>, translated into view port 
     *                      pixels by the current base layer.
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (this.baseLayer != null) {
            px = this.baseLayer.getViewPortPxFromLonLat(lonlat);
        }
        return px;
    },

    
  //
  // CONVENIENCE TRANSLATION FUNCTIONS FOR API
  //

    /**
     * APIMethod: getLonLatFromPixel
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat corresponding to the given
     *                       OpenLayers.Pixel, translated into lon/lat by the 
     *                       current base layer
     */
    getLonLatFromPixel: function (px) {
        return this.getLonLatFromViewPortPx(px);
    },

    /**
     * APIMethod: getPixelFromLonLat
     * Returns a pixel location given a map location.  The map location is
     *     translated to an integer pixel location (in viewport pixel
     *     coordinates) by the current base layer.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} A map location.
     * 
     * Returns: 
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel corresponding to the 
     *     <OpenLayers.LonLat> translated into view port pixels by the current
     *     base layer.
     */
    getPixelFromLonLat: function (lonlat) {
        var px = this.getViewPortPxFromLonLat(lonlat);
        px.x = Math.round(px.x);
        px.y = Math.round(px.y);
        return px;
    },



  //
  // TRANSLATION: ViewPortPx <-> LayerPx
  //

    /**
     * APIMethod: getViewPortPxFromLayerPx
     * 
     * Parameters:
     * layerPx - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} Layer Pixel translated into ViewPort Pixel 
     *                      coordinates
     */
    getViewPortPxFromLayerPx:function(layerPx) {
        var viewPortPx = null;
        if (layerPx != null) {
            var dX = parseInt(this.layerContainerDiv.style.left);
            var dY = parseInt(this.layerContainerDiv.style.top);
            viewPortPx = layerPx.add(dX, dY);            
        }
        return viewPortPx;
    },
    
    /**
     * APIMethod: getLayerPxFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Pixel>} ViewPort Pixel translated into Layer Pixel 
     *                      coordinates
     */
    getLayerPxFromViewPortPx:function(viewPortPx) {
        var layerPx = null;
        if (viewPortPx != null) {
            var dX = -parseInt(this.layerContainerDiv.style.left);
            var dY = -parseInt(this.layerContainerDiv.style.top);
            layerPx = viewPortPx.add(dX, dY);
            if (isNaN(layerPx.x) || isNaN(layerPx.y)) {
                layerPx = null;
            }
        }
        return layerPx;
    },
    
  //
  // TRANSLATION: LonLat <-> LayerPx
  //

    /**
     * Method: getLonLatFromLayerPx
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.LonLat>}
     */
    getLonLatFromLayerPx: function (px) {
       //adjust for displacement of layerContainerDiv
       px = this.getViewPortPxFromLayerPx(px);
       return this.getLonLatFromViewPortPx(px);         
    },
    
    /**
     * APIMethod: getLayerPxFromLonLat
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} lonlat
     *
     * Returns:
     * {<OpenLayers.Pixel>} An OpenLayers.Pixel which is the passed-in 
     *                      <OpenLayers.LonLat>, translated into layer pixels 
     *                      by the current base layer
     */
    getLayerPxFromLonLat: function (lonlat) {
       //adjust for displacement of layerContainerDiv
       var px = this.getPixelFromLonLat(lonlat);
       return this.getLayerPxFromViewPortPx(px);         
    },

    CLASS_NAME: "OpenLayers.Map"
});

/**
 * Constant: TILE_WIDTH
 * {Integer} 256 Default tile width (unless otherwise specified)
 */
OpenLayers.Map.TILE_WIDTH = 256;
/**
 * Constant: TILE_HEIGHT
 * {Integer} 256 Default tile height (unless otherwise specified)
 */
OpenLayers.Map.TILE_HEIGHT = 256;
/* ======================================================================
    OpenLayers/Marker.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/Icon.js
 */

/**
 * Class: OpenLayers.Marker
 * Instances of OpenLayers.Marker are a combination of a 
 * <OpenLayers.LonLat> and an <OpenLayers.Icon>.  
 *
 * Markers are generally added to a special layer called
 * <OpenLayers.Layer.Markers>.
 *
 * Example:
 * (code)
 * var markers = new OpenLayers.Layer.Markers( "Markers" );
 * map.addLayer(markers);
 *
 * var size = new OpenLayers.Size(10,17);
 * var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
 * var icon = new OpenLayers.Icon('http://boston.openguides.org/markers/AQUA.png',size,offset);
 * markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));
 * markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon.clone()));
 *
 * (end)
 *
 * Note that if you pass an icon into the Marker constructor, it will take
 * that icon and use it. This means that you should not share icons between
 * markers -- you use them once, but you should clone() for any additional
 * markers using that same icon.
 */
OpenLayers.Marker = OpenLayers.Class({
    
    /** 
     * Property: icon 
     * {<OpenLayers.Icon>} The icon used by this marker.
     */
    icon: null,

    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} location of object
     */
    lonlat: null,
    
    /** 
     * Property: events 
     * {<OpenLayers.Events>} the event handler.
     */
    events: null,
    
    /** 
     * Property: map 
     * {<OpenLayers.Map>} the map this marker is attached to
     */
    map: null,
    
    /** 
     * Constructor: OpenLayers.Marker
     * Paraemeters:
     * icon - {<OpenLayers.Icon>}  the icon for this marker
     * lonlat - {<OpenLayers.LonLat>} the position of this marker
     */
    initialize: function(lonlat, icon) {
        this.lonlat = lonlat;
        
        var newIcon = (icon) ? icon : OpenLayers.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new OpenLayers.Events(this, this.icon.imageDiv, null);
    },
    
    /**
     * APIMethod: destroy
     * Destroy the marker. You must first remove the marker from any 
     * layer which it has been added to, or you will get buggy behavior.
     * (This can not be done within the marker since the marker does not
     * know which layer it is attached to.)
     */
    destroy: function() {
        this.map = null;

        this.events.destroy();
        this.events = null;

        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    
    /** 
    * Method: draw
    * Calls draw on the icon, and returns that output.
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>}
    * 
    * Returns:
    * {DOMElement} A new DOM Image with this marker's icon set at the 
    * location passed-in
    */
    draw: function(px) {
        return this.icon.draw(px);
    }, 

    /**
    * Method: moveTo
    * Move the marker to the new location.
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} the pixel position to move to
    */
    moveTo: function (px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }           
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },

    /**
     * Method: onScreen
     *
     * Returns:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    
    /**
     * Method: inflate
     * Englarges the markers icon by the specified ratio.
     *
     * Parameters:
     * inflate - {float} the ratio to enlarge the marker by (passing 2
     *                   will double the size).
     */
    inflate: function(inflate) {
        if (this.icon) {
            var newSize = new OpenLayers.Size(this.icon.size.w * inflate,
                                              this.icon.size.h * inflate);
            this.icon.setSize(newSize);
        }        
    },
    
    /** 
     * Method: setOpacity
     * Change the opacity of the marker by changin the opacity of 
     *   its icon
     * 
     * Parameters:
     * opacity - {float}  Specified as fraction (0.4, etc)
     */
    setOpacity: function(opacity) {
        this.icon.setOpacity(opacity);
    },

    /**
     * Method: setUrl
     * Change URL of the Icon Image.
     * 
     * url - {String} 
     */
    setUrl: function(url) {
        this.icon.setUrl(url);
    },    

    /** 
     * Method: display
     * Hide or show the icon
     * 
     * display - {Boolean} 
     */
    display: function(display) {
        this.icon.display(display);
    },

    CLASS_NAME: "OpenLayers.Marker"
});


/**
 * Function: defaultIcon
 * Creates a default <OpenLayers.Icon>.
 * 
 * Returns:
 * {<OpenLayers.Icon>} A default OpenLayers.Icon to use for a marker
 */
OpenLayers.Marker.defaultIcon = function() {
    var url = OpenLayers.Util.getImagesLocation() + "marker.png";
    var size = new OpenLayers.Size(21, 25);
    var calculateOffset = function(size) {
                    return new OpenLayers.Pixel(-(size.w/2), -size.h);
                 };

    return new OpenLayers.Icon(url, size, null, calculateOffset);        
};
    

/* ======================================================================
    OpenLayers/Tile/Image.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Tile.js
 */

/**
 * Class: OpenLayers.Tile.Image
 * Instances of OpenLayers.Tile.Image are used to manage the image tiles
 * used by various layers.  Create a new image tile with the
 * <OpenLayers.Tile.Image> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Tile>
 */
OpenLayers.Tile.Image = OpenLayers.Class(OpenLayers.Tile, {

    /** 
     * Property: url
     * {String} The URL of the image being requested. No default. Filled in by
     * layer.getURL() function. 
     */
    url: null,
    
    /** 
     * Property: imgDiv
     * {DOMElement} The div element which wraps the image.
     */
    imgDiv: null,

    /**
     * Property: frame
     * {DOMElement} The image element is appended to the frame.  Any gutter on
     * the image will be hidden behind the frame. 
     */ 
    frame: null, 

    
    /**
     * Property: layerAlphaHack
     * {Boolean} True if the png alpha hack needs to be applied on the layer's div.
     */
    layerAlphaHack: null,

    /** TBD 3.0 - reorder the parameters to the init function to remove 
     *             URL. the getUrl() function on the layer gets called on 
     *             each draw(), so no need to specify it here.
     * 
     * Constructor: OpenLayers.Tile.Image
     * Constructor for a new <OpenLayers.Tile.Image> instance.
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer>} layer that the tile will go in.
     * position - {<OpenLayers.Pixel>}
     * bounds - {<OpenLayers.Bounds>}
     * url - {<String>} Deprecated. Remove me in 3.0.
     * size - {<OpenLayers.Size>}
     */   
    initialize: function(layer, position, bounds, url, size) {
        OpenLayers.Tile.prototype.initialize.apply(this, arguments);

        this.url = url; //deprecated remove me
        
        this.frame = document.createElement('div'); 
        this.frame.style.overflow = 'hidden'; 
        this.frame.style.position = 'absolute'; 

        this.layerAlphaHack = this.layer.alpha && OpenLayers.Util.alphaHack();
    },

    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        if (this.imgDiv != null)  {
            if (this.layerAlphaHack) {
                OpenLayers.Event.stopObservingElement(this.imgDiv.childNodes[0].id);                
            } else {
                OpenLayers.Event.stopObservingElement(this.imgDiv.id);
            }
            if (this.imgDiv.parentNode == this.frame) {
                this.frame.removeChild(this.imgDiv);
                this.imgDiv.map = null;
            }
        }
        this.imgDiv = null;
        if ((this.frame != null) && (this.frame.parentNode == this.layer.div)) { 
            this.layer.div.removeChild(this.frame); 
        }
        this.frame = null; 
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: clone
     *
     * Parameters:
     * obj - {<OpenLayers.Tile.Image>} The tile to be cloned
     *
     * Returns:
     * {<OpenLayers.Tile.Image>} An exact clone of this <OpenLayers.Tile.Image>
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Tile.Image(this.layer, 
                                            this.position, 
                                            this.bounds, 
                                            this.url, 
                                            this.size);        
        } 
        
        //pick up properties from superclass
        obj = OpenLayers.Tile.prototype.clone.apply(this, [obj]);
        
        //dont want to directly copy the image div
        obj.imgDiv = null;
            
        
        return obj;
    },
    
    /**
     * Method: draw
     * Check that a tile should be drawn, and draw it.
     * 
     * Returns:
     * {Boolean} Always returns true.
     */
    draw: function() {
        if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
            this.bounds = this.getBoundsFromBaseLayer(this.position);
        }
        if (!OpenLayers.Tile.prototype.draw.apply(this, arguments)) {
            return false;    
        }
        
        if (this.isLoading) {
            //if we're already loading, send 'reload' instead of 'loadstart'.
            this.events.triggerEvent("reload"); 
        } else {
            this.isLoading = true;
            this.events.triggerEvent("loadstart");
        }
        
        return this.renderTile();
    },
    
    /**
     * Method: renderTile
     * Internal function to actually initialize the image tile,
     *     position it correctly, and set its url.
     */
    renderTile: function() {
        if (this.imgDiv == null) {
            this.initImgDiv();
        }

        this.imgDiv.viewRequestID = this.layer.map.viewRequestID;
        
        this.url = this.layer.getURL(this.bounds);
        // position the frame 
        OpenLayers.Util.modifyDOMElement(this.frame, 
                                         null, this.position, this.size);   

        var imageSize = this.layer.getImageSize(); 
        if (this.layerAlphaHack) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,
                    null, null, imageSize, this.url);
        } else {
            OpenLayers.Util.modifyDOMElement(this.imgDiv,
                    null, null, imageSize) ;
            this.imgDiv.src = this.url;
        }
        return true;
    },

    /** 
     * Method: clear
     *  Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        if(this.imgDiv) {
            this.hide();
            if (OpenLayers.Tile.Image.useBlankTile) { 
                this.imgDiv.src = OpenLayers.Util.getImagesLocation() + "blank.gif";
            }    
        }
    },

    /**
     * Method: initImgDiv
     * Creates the imgDiv property on the tile.
     */
    initImgDiv: function() {
        
        var offset = this.layer.imageOffset; 
        var size = this.layer.getImageSize(); 
     
        if (this.layerAlphaHack) {
            this.imgDiv = OpenLayers.Util.createAlphaImageDiv(null,
                                                           offset,
                                                           size,
                                                           null,
                                                           "relative",
                                                           null,
                                                           null,
                                                           null,
                                                           true);
        } else {
            this.imgDiv = OpenLayers.Util.createImage(null,
                                                      offset,
                                                      size,
                                                      null,
                                                      "relative",
                                                      null,
                                                      null,
                                                      true);
        }
        
        this.imgDiv.className = 'olTileImage';

        /* checkImgURL used to be used to called as a work around, but it
           ended up hiding problems instead of solving them and broke things
           like relative URLs. See discussion on the dev list:
           http://openlayers.org/pipermail/dev/2007-January/000205.html

        OpenLayers.Event.observe( this.imgDiv, "load",
            OpenLayers.Function.bind(this.checkImgURL, this) );
        */
        this.frame.style.zIndex = this.isBackBuffer ? 0 : 1;
        this.frame.appendChild(this.imgDiv); 
        this.layer.div.appendChild(this.frame); 

        if(this.layer.opacity != null) {
            
            OpenLayers.Util.modifyDOMElement(this.imgDiv, null, null, null,
                                             null, null, null, 
                                             this.layer.opacity);
        }

        // we need this reference to check back the viewRequestID
        this.imgDiv.map = this.layer.map;

        //bind a listener to the onload of the image div so that we 
        // can register when a tile has finished loading.
        var onload = function() {
            
            //normally isLoading should always be true here but there are some 
            // right funky conditions where loading and then reloading a tile
            // with the same url *really*fast*. this check prevents sending 
            // a 'loadend' if the msg has already been sent
            //
            if (this.isLoading) { 
                this.isLoading = false; 
                this.events.triggerEvent("loadend"); 
            }
        };
        
        if (this.layerAlphaHack) { 
            OpenLayers.Event.observe(this.imgDiv.childNodes[0], 'load', 
                                     OpenLayers.Function.bind(onload, this));    
        } else { 
            OpenLayers.Event.observe(this.imgDiv, 'load', 
                                 OpenLayers.Function.bind(onload, this)); 
        } 
        

        // Bind a listener to the onerror of the image div so that we
        // can registere when a tile has finished loading with errors.
        var onerror = function() {

            // If we have gone through all image reload attempts, it is time
            // to realize that we are done with this image. Since
            // OpenLayers.Util.onImageLoadError already has taken care about
            // the error, we can continue as if the image was loaded
            // successfully.
            if (this.imgDiv._attempts > OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
                onload.call(this);
            }
        };
        OpenLayers.Event.observe(this.imgDiv, "error",
                                 OpenLayers.Function.bind(onerror, this));
    },

    /**
     * Method: checkImgURL
     * Make sure that the image that just loaded is the one this tile is meant
     * to display, since panning/zooming might have changed the tile's URL in
     * the meantime. If the tile URL did change before the image loaded, set
     * the imgDiv display to 'none', as either (a) it will be reset to visible
     * when the new URL loads in the image, or (b) we don't want to display
     * this tile after all because its new bounds are outside our maxExtent.
     * 
     * This function should no longer  be neccesary with the improvements to
     * Grid.js in OpenLayers 2.3. The lack of a good isEquivilantURL function
     * caused problems in 2.2, but it's possible that with the improved 
     * isEquivilant URL function, this might be neccesary at some point.
     * 
     * See discussion in the thread at 
     * http://openlayers.org/pipermail/dev/2007-January/000205.html
     */
    checkImgURL: function () {
        // Sometimes our image will load after it has already been removed
        // from the map, in which case this check is not needed.  
        if (this.layer) {
            var loaded = this.layerAlphaHack ? this.imgDiv.firstChild.src : this.imgDiv.src;
            if (!OpenLayers.Util.isEquivalentUrl(loaded, this.url)) {
                this.hide();
            }
        }
    },
    
    /**
     * Method: startTransition
     * This method is invoked on tiles that are backBuffers for tiles in the
     *     grid.  The grid tile is about to be cleared and a new tile source
     *     loaded.  This is where the transition effect needs to be started
     *     to provide visual continuity.
     */
    startTransition: function() {
        // backBufferTile has to be valid and ready to use
        if (!this.backBufferTile || !this.backBufferTile.imgDiv) {
            return;
        }

        // calculate the ratio of change between the current resolution of the
        // backBufferTile and the layer.  If several animations happen in a
        // row, then the backBufferTile will scale itself appropriately for
        // each request.
        var ratio = 1;
        if (this.backBufferTile.resolution) {
            ratio = this.backBufferTile.resolution / this.layer.getResolution();
        }
        
        // if the ratio is not the same as it was last time (i.e. we are
        // zooming), then we need to adjust the backBuffer tile
        if (ratio != this.lastRatio) {
            if (this.layer.transitionEffect == 'resize') {
                // In this case, we can just immediately resize the 
                // backBufferTile.
                var upperLeft = new OpenLayers.LonLat(
                    this.backBufferTile.bounds.left, 
                    this.backBufferTile.bounds.top
                );
                var size = new OpenLayers.Size(
                    this.backBufferTile.size.w * ratio,
                    this.backBufferTile.size.h * ratio
                );

                var px = this.layer.map.getLayerPxFromLonLat(upperLeft);
                OpenLayers.Util.modifyDOMElement(this.backBufferTile.frame, 
                                                 null, px, size);
                var imageSize = this.backBufferTile.imageSize;
                imageSize = new OpenLayers.Size(imageSize.w * ratio, 
                                                imageSize.h * ratio);
                var imageOffset = this.backBufferTile.imageOffset;
                if(imageOffset) {
                    imageOffset = new OpenLayers.Pixel(
                        imageOffset.x * ratio, imageOffset.y * ratio
                    );
                }

                OpenLayers.Util.modifyDOMElement(
                    this.backBufferTile.imgDiv, null, imageOffset, imageSize
                ) ;

                this.backBufferTile.show();
            }
        } else {
            // default effect is just to leave the existing tile
            // until the new one loads if this is a singleTile and
            // there was no change in resolution.  Otherwise we
            // don't bother to show the backBufferTile at all
            if (this.layer.singleTile) {
                this.backBufferTile.show();
            } else {
                this.backBufferTile.hide();
            }
        }
        this.lastRatio = ratio;

    },
    
    /** 
     * Method: show
     * Show the tile by showing its frame.
     */
    show: function() {
        this.frame.style.display = '';
        // Force a reflow on gecko based browsers to actually show the element
        // before continuing execution.
        if (OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, 
                this.layer.transitionEffect) != -1) {
            if (navigator.userAgent.toLowerCase().indexOf("gecko") != -1) { 
                this.frame.scrollLeft = this.frame.scrollLeft; 
            } 
        }
    },
    
    /** 
     * Method: hide
     * Hide the tile by hiding its frame.
     */
    hide: function() {
        this.frame.style.display = 'none';
    },
    
    CLASS_NAME: "OpenLayers.Tile.Image"
  }
);

OpenLayers.Tile.Image.useBlankTile = ( 
    OpenLayers.Util.getBrowserName() == "safari" || 
    OpenLayers.Util.getBrowserName() == "opera"); 
/* ======================================================================
    OpenLayers/Control/OverviewMap.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/** 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Events.js
 */

/**
 * Class: OpenLayers.Control.OverviewMap
 * Create an overview map to display the extent of your main map and provide
 * additional navigation control.  Create a new overview map with the
 * <OpenLayers.Control.OverviewMap> constructor.
 *
 * Inerits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.OverviewMap = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: element
     * {DOMElement} The DOM element that contains the overview map
     */
    element: null,
    
    /**
     * APIProperty: ovmap
     * {<OpenLayers.Map>} A reference to the overview map itself.
     */
    ovmap: null,

    /**
     * APIProperty: size
     * {<OpenLayers.Size>} The overvew map size in pixels.  Note that this is
     * the size of the map itself - the element that contains the map (default
     * class name olControlOverviewMapElement) may have padding or other style
     * attributes added via CSS.
     */
    size: new OpenLayers.Size(180, 90),

    /**
     * APIProperty: layers
     * {Array(<OpenLayers.Layer>)} Ordered list of layers in the overview map.
     * If none are sent at construction, the base layer for the main map is used.
     */
    layers: null,
    
    /**
     * APIProperty: minRectSize
     * {Integer} The minimum width or height (in pixels) of the extent
     *     rectangle on the overview map.  When the extent rectangle reaches
     *     this size, it will be replaced depending on the value of the
     *     <minRectDisplayClass> property.  Default is 15 pixels.
     */
    minRectSize: 15,
    
    /**
     * APIProperty: minRectDisplayClass
     * {String} Replacement style class name for the extent rectangle when
     *     <minRectSize> is reached.  This string will be suffixed on to the
     *     displayClass.  Default is "RectReplacement".
     *
     * Example CSS declaration:
     * (code)
     * .olControlOverviewMapRectReplacement {
     *     overflow: hidden;
     *     cursor: move;
     *     background-image: url("img/overview_replacement.gif");
     *     background-repeat: no-repeat;
     *     background-position: center;
     * }
     * (end)
     */
    minRectDisplayClass: "RectReplacement",

    /**
     * APIProperty: minRatio
     * {Float} The ratio of the overview map resolution to the main map
     * resolution at which to zoom farther out on the overview map.
     */
    minRatio: 8,

    /**
     * APIProperty: maxRatio
     * {Float} The ratio of the overview map resolution to the main map
     * resolution at which to zoom farther in on the overview map.
     */
    maxRatio: 32,

    /**
     * APIProperty: mapOptions
     * {Object} An object containing any non-default properties to be sent to
     * the overview map's map constructor.  These should include any non-default
     * options that the main map was constructed with.
     */
    mapOptions: null,
    
    /**
     * Property: handlers
     * {Object}
     */
    handlers: null,

    /**
     * Constructor: OpenLayers.Control.OverviewMap
     * Create a new overview map
     *
     * Parameters:
     * object - {Object} Properties of this object will be set on the overview
     * map object.  Note, to set options on the map object contained in this
     * control, set <mapOptions> as one of the options properties.
     */
    initialize: function(options) {
        this.layers = [];
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * APIMethod: destroy
     * Deconstruct the control
     */
    destroy: function() {
        if (!this.mapDiv) { // we've already been destroyed
            return;
        }
        this.handlers.click.destroy();

        this.mapDiv.removeChild(this.extentRectangle);
        this.extentRectangle = null;
        this.rectEvents.destroy();
        this.rectEvents = null;

        this.ovmap.destroy();
        this.ovmap = null;
        
        this.element.removeChild(this.mapDiv);
        this.mapDiv = null;

        this.div.removeChild(this.element);
        this.element = null;

        if (this.maximizeDiv) {
            OpenLayers.Event.stopObservingElement(this.maximizeDiv);
            this.div.removeChild(this.maximizeDiv);
            this.maximizeDiv = null;
        }
        
        if (this.minimizeDiv) {
            OpenLayers.Event.stopObservingElement(this.minimizeDiv);
            this.div.removeChild(this.minimizeDiv);
            this.minimizeDiv = null;
        }
        
        this.map.events.un({
            "moveend": this.update,
            "changebaselayer": this.baseLayerDraw,
            scope: this
        });

        OpenLayers.Control.prototype.destroy.apply(this, arguments);    
    },

    /**
     * Method: draw
     * Render the control in the browser.
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if(!(this.layers.length > 0)) {
            if (this.map.baseLayer) {
                var layer = this.map.baseLayer.clone();
                this.layers = [layer];
            } else {
                this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                return this.div;
            }
        }

        // create overview map DOM elements
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'none';

        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');
        
        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000;  //HACK
        this.extentRectangle.className = this.displayClass+'ExtentRectangle';
        this.mapDiv.appendChild(this.extentRectangle);

        this.element.appendChild(this.mapDiv);  

        this.div.appendChild(this.element);

        // Optionally add min/max buttons if the control will go in the
        // map viewport.
        if(!this.outsideViewport) {
            this.div.className += " " + this.displayClass + 'Container';
            var imgLocation = OpenLayers.Util.getImagesLocation();
            // maximize button div
            var img = imgLocation + 'layer-switcher-maximize.png';
            this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        this.displayClass + 'MaximizeButton', 
                                        null, 
                                        new OpenLayers.Size(18,18), 
                                        img, 
                                        'absolute');
            this.maximizeDiv.style.display = 'none';
            this.maximizeDiv.className = this.displayClass + 'MaximizeButton';
            OpenLayers.Event.observe(this.maximizeDiv, 'click', 
                OpenLayers.Function.bindAsEventListener(this.maximizeControl,
                                                        this)
            );
            this.div.appendChild(this.maximizeDiv);
    
            // minimize button div
            var img = imgLocation + 'layer-switcher-minimize.png';
            this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        'OpenLayers_Control_minimizeDiv', 
                                        null, 
                                        new OpenLayers.Size(18,18), 
                                        img, 
                                        'absolute');
            this.minimizeDiv.style.display = 'none';
            this.minimizeDiv.className = this.displayClass + 'MinimizeButton';
            OpenLayers.Event.observe(this.minimizeDiv, 'click', 
                OpenLayers.Function.bindAsEventListener(this.minimizeControl,
                                                        this)
            );
            this.div.appendChild(this.minimizeDiv);
            
            var eventsToStop = ['dblclick','mousedown'];
            
            for (var i = 0; i < eventsToStop.length; i++) {

                OpenLayers.Event.observe(this.maximizeDiv, 
                                         eventsToStop[i], 
                                         OpenLayers.Event.stop);

                OpenLayers.Event.observe(this.minimizeDiv,
                                         eventsToStop[i], 
                                         OpenLayers.Event.stop);
            }
            
            this.minimizeControl();
        } else {
            // show the overview map
            this.element.style.display = '';
        }
        if(this.map.getExtent()) {
            this.update();
        }
        
        this.map.events.register('moveend', this, this.update);

        return this.div;
    },
    
    /**
     * Method: baseLayerDraw
     * Draw the base layer - called if unable to complete in the initial draw
     */
    baseLayerDraw: function() {
        this.draw();
        this.map.events.unregister("changebaselayer", this, this.baseLayerDraw);
    },

    /**
     * Method: rectDrag
     * Handle extent rectangle drag
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} The pixel location of the drag.
     */
    rectDrag: function(px) {
        var deltaX = this.handlers.drag.last.x - px.x;
        var deltaY = this.handlers.drag.last.y - px.y;
        if(deltaX != 0 || deltaY != 0) {
            var rectTop = this.rectPxBounds.top;
            var rectLeft = this.rectPxBounds.left;
            var rectHeight = Math.abs(this.rectPxBounds.getHeight());
            var rectWidth = this.rectPxBounds.getWidth();
            // don't allow dragging off of parent element
            var newTop = Math.max(0, (rectTop - deltaY));
            newTop = Math.min(newTop,
                              this.ovmap.size.h - this.hComp - rectHeight);
            var newLeft = Math.max(0, (rectLeft - deltaX));
            newLeft = Math.min(newLeft,
                               this.ovmap.size.w - this.wComp - rectWidth);
            this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                       newTop + rectHeight,
                                                       newLeft + rectWidth,
                                                       newTop));
        }
    },
    
    /**
     * Method: mapDivClick
     * Handle browser events
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} evt
     */
    mapDivClick: function(evt) {
        var pxCenter = this.rectPxBounds.getCenterPixel();
        var deltaX = evt.xy.x - pxCenter.x;
        var deltaY = evt.xy.y - pxCenter.y;
        var top = this.rectPxBounds.top;
        var left = this.rectPxBounds.left;
        var height = Math.abs(this.rectPxBounds.getHeight());
        var width = this.rectPxBounds.getWidth();
        var newTop = Math.max(0, (top + deltaY));
        newTop = Math.min(newTop, this.ovmap.size.h - height);
        var newLeft = Math.max(0, (left + deltaX));
        newLeft = Math.min(newLeft, this.ovmap.size.w - width);
        this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                   newTop + height,
                                                   newLeft + width,
                                                   newTop));
        this.updateMapToRect();
    },

    /**
     * Method: maximizeControl
     * Unhide the control.  Called when the control is in the map viewport.
     *
     * Parameters:
     * e - {<OpenLayers.Event>}
     */
    maximizeControl: function(e) {
        this.element.style.display = '';
        this.showToggle(false);
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /**
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size, 
     * add the maximize icon
     * 
     * Parameters:
     * e - {<OpenLayers.Event>}
     */
    minimizeControl: function(e) {
        this.element.style.display = 'none';
        this.showToggle(true);
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /**
     * Method: showToggle
     * Hide/Show the toggle depending on whether the control is minimized
     *
     * Parameters:
     * minimize - {Boolean} 
     */
    showToggle: function(minimize) {
        this.maximizeDiv.style.display = minimize ? '' : 'none';
        this.minimizeDiv.style.display = minimize ? 'none' : '';
    },

    /**
     * Method: update
     * Update the overview map after layers move.
     */
    update: function() {
        if(this.ovmap == null) {
            this.createMap();
        }
        
        if(!this.isSuitableOverview()) {
            this.updateOverview();
        }
        
        // update extent rectangle
        this.updateRectToMap();
    },
    
    /**
     * Method: isSuitableOverview
     * Determines if the overview map is suitable given the extent and
     * resolution of the main map.
     */
    isSuitableOverview: function() {
        var mapExtent = this.map.getExtent();
        var maxExtent = this.map.maxExtent;
        var testExtent = new OpenLayers.Bounds(
                                Math.max(mapExtent.left, maxExtent.left),
                                Math.max(mapExtent.bottom, maxExtent.bottom),
                                Math.min(mapExtent.right, maxExtent.right),
                                Math.min(mapExtent.top, maxExtent.top));        
        var resRatio = this.ovmap.getResolution() / this.map.getResolution();
        return ((resRatio > this.minRatio) &&
                (resRatio <= this.maxRatio) &&
                (this.ovmap.getExtent().containsBounds(testExtent)));
    },
    
    /**
     * Method updateOverview
     * Called by <update> if <isSuitableOverview> returns true
     */
    updateOverview: function() {
        var mapRes = this.map.getResolution();
        var targetRes = this.ovmap.getResolution();
        var resRatio = targetRes / mapRes;
        if(resRatio > this.maxRatio) {
            // zoom in overview map
            targetRes = this.minRatio * mapRes;            
        } else if(resRatio <= this.minRatio) {
            // zoom out overview map
            targetRes = this.maxRatio * mapRes;
        }
        this.ovmap.setCenter(this.map.center,
                            this.ovmap.getZoomForResolution(targetRes));
        this.updateRectToMap();
    },
    
    /**
     * Method: createMap
     * Construct the map that this control contains
     */
    createMap: function() {
        // create the overview map
        var options = OpenLayers.Util.extend(
                        {controls: [], maxResolution: 'auto', 
                         fallThrough: false}, this.mapOptions);
        this.ovmap = new OpenLayers.Map(this.mapDiv, options);
        
        // prevent ovmap from being destroyed when the page unloads, because
        // the OverviewMap control has to do this (and does it).
        OpenLayers.Event.stopObserving(window, 'unload', this.ovmap.unloadDestroy);
        
        this.ovmap.addLayers(this.layers);
        this.ovmap.zoomToMaxExtent();
        // check extent rectangle border width
        this.wComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-left-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-right-width'));
        this.wComp = (this.wComp) ? this.wComp : 2;
        this.hComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-top-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-bottom-width'));
        this.hComp = (this.hComp) ? this.hComp : 2;

        this.handlers.drag = new OpenLayers.Handler.Drag(
            this, {move: this.rectDrag, done: this.updateMapToRect},
            {map: this.ovmap}
        );
        this.handlers.click = new OpenLayers.Handler.Click(
            this, {
                "click": this.mapDivClick
            },{
                "single": true, "double": false,
                "stopSingle": true, "stopDouble": true,
                "pixelTolerance": 1,
                map: this.ovmap
            }
        );
        this.handlers.click.activate();
        
        this.rectEvents = new OpenLayers.Events(this, this.extentRectangle,
                                                null, true);
        this.rectEvents.register("mouseover", this, function(e) {
            if(!this.handlers.drag.active && !this.map.dragging) {
                this.handlers.drag.activate();
            }
        });
        this.rectEvents.register("mouseout", this, function(e) {
            if(!this.handlers.drag.dragging) {
                this.handlers.drag.deactivate();
            }
        });

    },
        
    /**
     * Method: updateRectToMap
     * Updates the extent rectangle position and size to match the map extent
     */
    updateRectToMap: function() {
        // The base layer for overview map needs to be in the same projection
        // as the base layer for the main map.  This should be made more robust.
        if(this.map.units != 'degrees') {
            if(this.ovmap.getProjection() && (this.map.getProjection() != this.ovmap.getProjection())) {
                alert(OpenLayers.i18n("sameProjection"));
            }
        }
        var pxBounds = this.getRectBoundsFromMapBounds(this.map.getExtent());
        if (pxBounds) {
            this.setRectPxBounds(pxBounds);
        }
    },
    
    /**
     * Method: updateMapToRect
     * Updates the map extent to match the extent rectangle position and size
     */
    updateMapToRect: function() {
        var lonLatBounds = this.getMapBoundsFromRectBounds(this.rectPxBounds);
        this.map.panTo(lonLatBounds.getCenterLonLat());
    },

    /**
     * Method: setRectPxBounds
     * Set extent rectangle pixel bounds.
     *
     * Parameters:
     * pxBounds - {<OpenLayers.Bounds>}
     */
    setRectPxBounds: function(pxBounds) {
        var top = Math.max(pxBounds.top, 0);
        var left = Math.max(pxBounds.left, 0);
        var bottom = Math.min(pxBounds.top + Math.abs(pxBounds.getHeight()),
                              this.ovmap.size.h - this.hComp);
        var right = Math.min(pxBounds.left + pxBounds.getWidth(),
                             this.ovmap.size.w - this.wComp);
        var width = Math.max(right - left, 0);
        var height = Math.max(bottom - top, 0);
        if(width < this.minRectSize || height < this.minRectSize) {
            this.extentRectangle.className = this.displayClass +
                                             this.minRectDisplayClass;
            var rLeft = left + (width / 2) - (this.minRectSize / 2);
            var rTop = top + (height / 2) - (this.minRectSize / 2);
            this.extentRectangle.style.top = Math.round(rTop) + 'px';
            this.extentRectangle.style.left = Math.round(rLeft) + 'px';
            this.extentRectangle.style.height = this.minRectSize + 'px';
            this.extentRectangle.style.width = this.minRectSize + 'px';
        } else {
            this.extentRectangle.className = this.displayClass +
                                             'ExtentRectangle';
            this.extentRectangle.style.top = Math.round(top) + 'px';
            this.extentRectangle.style.left = Math.round(left) + 'px';
            this.extentRectangle.style.height = Math.round(height) + 'px';
            this.extentRectangle.style.width = Math.round(width) + 'px';
        }
        this.rectPxBounds = new OpenLayers.Bounds(
            Math.round(left), Math.round(bottom),
            Math.round(right), Math.round(top)
        );
    },

    /**
     * Method: getRectBoundsFromMapBounds
     * Get the rect bounds from the map bounds.
     *
     * Parameters:
     * lonLatBounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {<OpenLayers.Bounds>}A bounds which is the passed-in map lon/lat extent
     * translated into pixel bounds for the overview map
     */
    getRectBoundsFromMapBounds: function(lonLatBounds) {
        var leftBottomLonLat = new OpenLayers.LonLat(lonLatBounds.left,
                                                     lonLatBounds.bottom);
        var rightTopLonLat = new OpenLayers.LonLat(lonLatBounds.right,
                                                   lonLatBounds.top);
        var leftBottomPx = this.getOverviewPxFromLonLat(leftBottomLonLat);
        var rightTopPx = this.getOverviewPxFromLonLat(rightTopLonLat);
        var bounds = null;
        if (leftBottomPx && rightTopPx) {
            bounds = new OpenLayers.Bounds(leftBottomPx.x, leftBottomPx.y,
                                           rightTopPx.x, rightTopPx.y);
        }
        return bounds;
    },

    /**
     * Method: getMapBoundsFromRectBounds
     * Get the map bounds from the rect bounds.
     *
     * Parameters:
     * pxBounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {<OpenLayers.Bounds>} Bounds which is the passed-in overview rect bounds
     * translated into lon/lat bounds for the overview map
     */
    getMapBoundsFromRectBounds: function(pxBounds) {
        var leftBottomPx = new OpenLayers.Pixel(pxBounds.left,
                                                pxBounds.bottom);
        var rightTopPx = new OpenLayers.Pixel(pxBounds.right,
                                              pxBounds.top);
        var leftBottomLonLat = this.getLonLatFromOverviewPx(leftBottomPx);
        var rightTopLonLat = this.getLonLatFromOverviewPx(rightTopPx);
        return new OpenLayers.Bounds(leftBottomLonLat.lon, leftBottomLonLat.lat,
                                     rightTopLonLat.lon, rightTopLonLat.lat);
    },

    /**
     * Method: getLonLatFromOverviewPx
     * Get a map location from a pixel location
     *
     * Parameters:
     * overviewMapPx - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.LonLat>} Location which is the passed-in overview map
     * OpenLayers.Pixel, translated into lon/lat by the overview map
     */
    getLonLatFromOverviewPx: function(overviewMapPx) {
        var size = this.ovmap.size;
        var res  = this.ovmap.getResolution();
        var center = this.ovmap.getExtent().getCenterLonLat();
    
        var delta_x = overviewMapPx.x - (size.w / 2);
        var delta_y = overviewMapPx.y - (size.h / 2);
        
        return new OpenLayers.LonLat(center.lon + delta_x * res ,
                                     center.lat - delta_y * res); 
    },

    /**
     * Method: getOverviewPxFromLonLat
     * Get a pixel location from a map location
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     *
     * Returns:
     * {<OpenLayers.Pixel>} Location which is the passed-in OpenLayers.LonLat, 
     * translated into overview map pixels
     */
    getOverviewPxFromLonLat: function(lonlat) {
        var res  = this.ovmap.getResolution();
        var extent = this.ovmap.getExtent();
        var px = null;
        if (extent) {
            px = new OpenLayers.Pixel(
                        Math.round(1/res * (lonlat.lon - extent.left)),
                        Math.round(1/res * (extent.top - lonlat.lat)));
        } 
        return px;
    },

    CLASS_NAME: 'OpenLayers.Control.OverviewMap'
});
/* ======================================================================
    OpenLayers/Handler/Click.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.Click
 * A handler for mouse clicks.  The intention of this handler is to give
 *     controls more flexibility with handling clicks.  Browsers trigger
 *     click events twice for a double-click.  In addition, the mousedown,
 *     mousemove, mouseup sequence fires a click event.  With this handler,
 *     controls can decide whether to ignore clicks associated with a double
 *     click.  By setting a <pixelTolerance>, controls can also ignore clicks
 *     that include a drag.  Create a new instance with the
 *     <OpenLayers.Handler.Click> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Handler> 
 */
OpenLayers.Handler.Click = OpenLayers.Class(OpenLayers.Handler, {

    /**
     * APIProperty: delay
     * {Number} Number of milliseconds between clicks before the event is
     *     considered a double-click.
     */
    delay: 300,
    
    /**
     * APIProperty: single
     * {Boolean} Handle single clicks.  Default is true.  If false, clicks
     * will not be reported.  If true, single-clicks will be reported.
     */
    single: true,
    
    /**
     * APIProperty: double
     * {Boolean} Handle double-clicks.  Default is false.
     */
    'double': false,
    
    /**
     * APIProperty: pixelTolerance
     * {Number} Maximum number of pixels between mouseup and mousedown for an
     *     event to be considered a click.  Default is 0.  If set to an
     *     integer value, clicks with a drag greater than the value will be
     *     ignored.  This property can only be set when the handler is
     *     constructed.
     */
    pixelTolerance: 0,
    
    /**
     * APIProperty: stopSingle
     * {Boolean} Stop other listeners from being notified of clicks.  Default
     *     is false.  If true, any click listeners registered before this one
     *     will not be notified of *any* click event (associated with double
     *     or single clicks).
     */
    stopSingle: false,
    
    /**
     * APIProperty: stopDouble
     * {Boolean} Stop other listeners from being notified of double-clicks.
     *     Default is false.  If true, any click listeners registered before
     *     this one will not be notified of *any* double-click events.
     * 
     * The one caveat with stopDouble is that given a map with two click
     *     handlers, one with stopDouble true and the other with stopSingle
     *     true, the stopSingle handler should be activated last to get
     *     uniform cross-browser performance.  Since IE triggers one click
     *     with a dblclick and FF triggers two, if a stopSingle handler is
     *     activated first, all it gets in IE is a single click when the
     *     second handler stops propagation on the dblclick.
     */
    stopDouble: false,

    /**
     * Property: timerId
     * {Number} The id of the timeout waiting to clear the <delayedCall>.
     */
    timerId: null,
    
    /**
     * Property: down
     * {<OpenLayers.Pixel>} The pixel location of the last mousedown.
     */
    down: null,
    
    /**
     * Constructor: OpenLayers.Handler.Click
     * Create a new click handler.
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *     this handler.  If a handler is being used without a control, the
     *     handler's setMap method must be overridden to deal properly with
     *     the map.
     * callbacks - {Object} An object with keys corresponding to callbacks
     *     that will be called by the handler. The callbacks should
     *     expect to recieve a single argument, the click event.
     *     Callbacks for 'click' and 'dblclick' are supported.
     * options - {Object} Optional object whose properties will be set on the
     *     handler.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        // optionally register for mouseup and mousedown
        if(this.pixelTolerance != null) {
            this.mousedown = function(evt) {
                this.down = evt.xy;
                return true;
            };
        }
    },
    
    /**
     * Method: mousedown
     * Handle mousedown.  Only registered as a listener if pixelTolerance is
     *     a non-zero value at construction.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    mousedown: null,
    
    /**
     * Method: dblclick
     * Handle dblclick.  For a dblclick, we get two clicks in some browsers
     *     (FF) and one in others (IE).  So we need to always register for
     *     dblclick to properly handle single clicks.
     *     
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    dblclick: function(evt) {
        if(this.passesTolerance(evt)) {
            if(this["double"]) {
                this.callback('dblclick', [evt]);
            }
            this.clearTimer();
        }
        return !this.stopDouble;
    },
    
    /**
     * Method: click
     * Handle click.
     *
     * Returns:
     * {Boolean} Continue propagating this event.
     */
    click: function(evt) {
        if(this.passesTolerance(evt)) {
            if(this.timerId != null) {
                // already received a click
                this.clearTimer();
            } else {
                // set the timer, send evt only if single is true
                //use a clone of the event object because it will no longer 
                //be a valid event object in IE in the timer callback
                var clickEvent = this.single ?
                    OpenLayers.Util.extend({}, evt) : null;
                this.timerId = window.setTimeout(
                    OpenLayers.Function.bind(this.delayedCall, this, clickEvent),
                    this.delay
                );
            }
        }
        return !this.stopSingle;
    },
    
    /**
     * Method: passesTolerance
     * Determine whether the event is within the optional pixel tolerance.  Note
     *     that the pixel tolerance check only works if mousedown events get to
     *     the listeners registered here.  If they are stopped by other elements,
     *     the <pixelTolerance> will have no effect here (this method will always
     *     return true).
     *
     * Returns:
     * {Boolean} The click is within the pixel tolerance (if specified).
     */
    passesTolerance: function(evt) {
        var passes = true;
        if(this.pixelTolerance != null && this.down) {
            var dpx = Math.sqrt(
                Math.pow(this.down.x - evt.xy.x, 2) +
                Math.pow(this.down.y - evt.xy.y, 2)
            );
            if(dpx > this.pixelTolerance) {
                passes = false;
            }
        }
        return passes;
    },

    /**
     * Method: clearTimer
     * Clear the timer and set <timerId> to null.
     */
    clearTimer: function() {
        if(this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
    },
    
    /**
     * Method: delayedCall
     * Sets <timerId> to null.  And optionally triggers the click callback if
     *     evt is set.
     */
    delayedCall: function(evt) {
        this.timerId = null;
        if(evt) {
            this.callback('click', [evt]);
        }
    },

    /**
     * APIMethod: deactivate
     * Deactivate the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            this.down = null;
            deactivated = true;
        }
        return deactivated;
    },

    CLASS_NAME: "OpenLayers.Handler.Click"
});
/* ======================================================================
    OpenLayers/Handler/Drag.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.Drag
 * The drag handler is used to deal with sequences of browser events related
 *     to dragging.  The handler is used by controls that want to know when
 *     a drag sequence begins, when a drag is happening, and when it has
 *     finished.
 *
 * Controls that use the drag handler typically construct it with callbacks
 *     for 'down', 'move', and 'done'.  Callbacks for these keys are called
 *     when the drag begins, with each move, and when the drag is done.  In
 *     addition, controls can have callbacks keyed to 'up' and 'out' if they
 *     care to differentiate between the types of events that correspond with
 *     the end of a drag sequence.  If no drag actually occurs (no mouse move)
 *     the 'down' and 'up' callbacks will be called, but not the 'done'
 *     callback.
 *
 * Create a new drag handler with the <OpenLayers.Handler.Drag> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Handler>
 */
OpenLayers.Handler.Drag = OpenLayers.Class(OpenLayers.Handler, {
  
    /** 
     * Property: started
     * {Boolean} When a mousedown event is received, we want to record it, but
     *     not set 'dragging' until the mouse moves after starting. 
     */
    started: false,
    
    /**
     * Property: stopDown
     * {Boolean} Stop propagation of mousedown events from getting to listeners
     *     on the same element.  Default is true.
     */
    stopDown: true,

    /** 
     * Property: dragging 
     * {Boolean} 
     */
    dragging: false,

    /** 
     * Property: last
     * {<OpenLayers.Pixel>} The last pixel location of the drag.
     */
    last: null,

    /** 
     * Property: start
     * {<OpenLayers.Pixel>} The first pixel location of the drag.
     */
    start: null,

    /**
     * Property: oldOnselectstart
     * {Function}
     */
    oldOnselectstart: null,

    /**
     * Constructor: OpenLayers.Handler.Drag
     * Returns OpenLayers.Handler.Drag
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *     this handler.  If a handler is being used without a control, the
     *     handlers setMap method must be overridden to deal properly with
     *     the map.
     * callbacks - {Object} An object containing a single function to be
     *     called when the drag operation is finished. The callback should
     *     expect to recieve a single argument, the pixel location of the event.
     *     Callbacks for 'move' and 'done' are supported. You can also speficy
     *     callbacks for 'down', 'up', and 'out' to respond to those events.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * The four methods below (down, move, up, and out) are used by subclasses
     *     to do their own processing related to these mouse events.
     */
    
    /**
     * Method: down
     * This method is called during the handling of the mouse down event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse down event
     */
    down: function(evt) {
    },
    
    /**
     * Method: move
     * This method is called during the handling of the mouse move event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse move event
     *
     */
    move: function(evt) {
    },

    /**
     * Method: up
     * This method is called during the handling of the mouse up event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    up: function(evt) {
    },

    /**
     * Method: out
     * This method is called during the handling of the mouse out event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    out: function(evt) {
    },

    /**
     * The methods below are part of the magic of event handling.  Because
     *     they are named like browser events, they are registered as listeners
     *     for the events they represent.
     */

    /**
     * Method: mousedown
     * Handle mousedown events
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousedown: function (evt) {
        var propagate = true;
        this.dragging = false;
        if (this.checkModifiers(evt) && OpenLayers.Event.isLeftClick(evt)) {
            this.started = true;
            this.start = evt.xy;
            this.last = evt.xy;
            // TBD replace with CSS classes
            this.map.div.style.cursor = "move";
            this.down(evt);
            this.callback("down", [evt.xy]);
            OpenLayers.Event.stop(evt);
            
            if(!this.oldOnselectstart) {
                this.oldOnselectstart = (document.onselectstart) ? document.onselectstart : function() { return true; };
                document.onselectstart = function() {return false;};
            }
            
            propagate = !this.stopDown;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        return propagate;
    },

    /**
     * Method: mousemove
     * Handle mousemove events
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousemove: function (evt) {
        if (this.started) {
            if(evt.xy.x != this.last.x || evt.xy.y != this.last.y) {
                this.dragging = true;
                this.move(evt);
                this.callback("move", [evt.xy]);
                if(!this.oldOnselectstart) {
                    this.oldOnselectstart = document.onselectstart;
                    document.onselectstart = function() {return false;};
                }
                this.last = evt.xy;
            }
        }
        return true;
    },

    /**
     * Method: mouseup
     * Handle mouseup events
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseup: function (evt) {
        if (this.started) {
            var dragged = (this.start != this.last);
            this.started = false;
            this.dragging = false;
            // TBD replace with CSS classes
            this.map.div.style.cursor = "";
            this.up(evt);
            this.callback("up", [evt.xy]);
            if(dragged) {
                this.callback("done", [evt.xy]);
            }
            document.onselectstart = this.oldOnselectstart;
        }
        return true;
    },

    /**
     * Method: mouseout
     * Handle mouseout events
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.div)) {
            var dragged = (this.start != this.last);
            this.started = false; 
            this.dragging = false;
            // TBD replace with CSS classes
            this.map.div.style.cursor = "";
            this.out(evt);
            this.callback("out", []);
            if(dragged) {
                this.callback("done", [evt.xy]);
            }
            if(document.onselectstart) {
                document.onselectstart = this.oldOnselectstart;
            }
        }
        return true;
    },

    /**
     * Method: click
     * The drag handler captures the click event.  If something else registers
     *     for clicks on the same element, its listener will not be called 
     *     after a drag.
     * 
     * Parameters: 
     * evt - {Event} 
     * 
     * Returns:
     * {Boolean} Let the event propagate.
     */
    click: function (evt) {
        // let the click event propagate only if the mouse moved
        return (this.start == this.last);
    },

    /**
     * Method: activate
     * Activate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully activated.
     */
    activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            activated = true;
        }
        return activated;
    },

    /**
     * Method: deactivate 
     * Deactivate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.started = false;
            this.dragging = false;
            this.start = null;
            this.last = null;
            deactivated = true;
        }
        return deactivated;
    },

    CLASS_NAME: "OpenLayers.Handler.Drag"
});
/* ======================================================================
    OpenLayers/Handler/MouseWheel.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.MouseWheel
 * Handler for wheel up/down events.
 * 
 * Inherits from:
 *  - <OpenLayers.Handler>
 */
OpenLayers.Handler.MouseWheel = OpenLayers.Class(OpenLayers.Handler, {
    /** 
     * Property: wheelListener 
     * {function} 
     */
    wheelListener: null,

    /** 
     * Property: mousePosition
     * {<OpenLayers.Pixel>} mousePosition is necessary because
     * evt.clientX/Y is buggy in Moz on wheel events, so we cache and use the
     * value from the last mousemove.
     */
    mousePosition: null,

    /**
     * Constructor: OpenLayers.Handler.MouseWheel
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.wheelListener = OpenLayers.Function.bindAsEventListener(
            this.onWheelEvent, this
        );
    },

    /**
     * Method: destroy
     */    
    destroy: function() {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        this.wheelListener = null;
    },

    /**
     *  Mouse ScrollWheel code thanks to http://adomas.org/javascript-mouse-wheel/
     */

    /** 
     * Method: onWheelEvent
     * Catch the wheel event and handle it xbrowserly
     * 
     * Parameters:
     * e - {Event} 
     */
    onWheelEvent: function(e){
        
        // make sure we have a map and check keyboard modifiers
        if (!this.map || !this.checkModifiers(e)) {
            return;
        }
        
        // Ride up the element's DOM hierarchy to determine if it or any of 
        //  its ancestors was: 
        //   * specifically marked as scrollable
        //   * one of our layer divs
        //   * the map div
        //
        var overScrollableDiv = false;
        var overLayerDiv = false;
        var overMapDiv = false;
        
        var elem = OpenLayers.Event.element(e);
        while((elem != null) && !overMapDiv && !overScrollableDiv) {

            if (!overScrollableDiv) {
                try {
                    if (elem.currentStyle) {
                        overflow = elem.currentStyle["overflow"];
                    } else {
                        var style = 
                            document.defaultView.getComputedStyle(elem, null);
                        var overflow = style.getPropertyValue("overflow");
                    }
                    overScrollableDiv = ( overflow && 
                        (overflow == "auto") || (overflow == "scroll") );
                } catch(err) {
                    //sometimes when scrolling in a popup, this causes 
                    // obscure browser error
                }
            }

            if (!overLayerDiv) {
                for(var i=0; i < this.map.layers.length; i++) {
                    // Are we in the layer div? Note that we have two cases
                    // here: one is to catch EventPane layers, which have a 
                    // pane above the layer (layer.pane)
                    if (elem == this.map.layers[i].div 
                        || elem == this.map.layers[i].pane) { 
                        overLayerDiv = true;
                        break;
                    }
                }
            }
            overMapDiv = (elem == this.map.div);

            elem = elem.parentNode;
        }
        
        // Logic below is the following:
        //
        // If we are over a scrollable div or not over the map div:
        //  * do nothing (let the browser handle scrolling)
        //
        //    otherwise 
        // 
        //    If we are over the layer div: 
        //     * zoom/in out
        //     then
        //     * kill event (so as not to also scroll the page after zooming)
        //
        //       otherwise
        //
        //       Kill the event (dont scroll the page if we wheel over the 
        //        layerswitcher or the pan/zoom control)
        //
        if (!overScrollableDiv && overMapDiv) {
            if (overLayerDiv) {
                this.wheelZoom(e);
            }
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: wheelZoom
     * Given the wheel event, we carry out the appropriate zooming in or out,
     *     based on the 'wheelDelta' or 'detail' property of the event.
     * 
     * Parameters:
     * e - {Event}
     */
    wheelZoom: function(e) {
        
        var delta = 0;
        if (!e) {
            e = window.event;
        }
        if (e.wheelDelta) {
            delta = e.wheelDelta/120; 
            if (window.opera && window.opera.version() < 9.2) {
                delta = -delta;
            }
        } else if (e.detail) {
            delta = -e.detail / 3;
        }
        if (delta) {
            // add the mouse position to the event because mozilla has 
            // a bug with clientX and clientY (see 
            // https://bugzilla.mozilla.org/show_bug.cgi?id=352179)
            // getLonLatFromViewPortPx(e) returns wrong values
            if (this.mousePosition) {
                e.xy = this.mousePosition;
            } 
            if (!e.xy) {
                // If the mouse hasn't moved over the map yet, then
                // we don't have a mouse position (in FF), so we just
                // act as if the mouse was at the center of the map.
                // Note that we can tell we are in the map -- and 
                // this.map is ensured to be true above.
                e.xy = this.map.getPixelFromLonLat(
                    this.map.getCenter()
                );
            }
            if (delta < 0) {
               this.callback("down", [e, delta]);
            } else {
               this.callback("up", [e, delta]);
            }
        }
    },
    
    /**
     * Method: mousemove
     * Update the stored mousePosition on every move.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    mousemove: function (evt) {
        this.mousePosition = evt.xy;
    },

    /**
     * Method: activate 
     */
    activate: function (evt) {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            //register mousewheel events specifically on the window and document
            var wheelListener = this.wheelListener;
            OpenLayers.Event.observe(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.observe(window, "mousewheel", wheelListener);
            OpenLayers.Event.observe(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: deactivate 
     */
    deactivate: function (evt) {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            // unregister mousewheel events specifically on the window and document
            var wheelListener = this.wheelListener;
            OpenLayers.Event.stopObserving(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.stopObserving(window, "mousewheel", wheelListener);
            OpenLayers.Event.stopObserving(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

    CLASS_NAME: "OpenLayers.Handler.MouseWheel"
});
/* ======================================================================
    OpenLayers/Layer.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Map.js
 * @requires OpenLayers/Projection.js
 */

/**
 * Class: OpenLayers.Layer
 */
OpenLayers.Layer = OpenLayers.Class({

    /**
     * APIProperty: id
     * {String}
     */
    id: null,

    /** 
     * APIProperty: name
     * {String}
     */
    name: null,

    /** 
     * APIProperty: div
     * {DOMElement}
     */
    div: null,

    /**
     * Property: opacity
     * {Float} The layer's opacity. Float number between 0.0 and 1.0.
     */
    opacity: null,

    /**
     * Constant: EVENT_TYPES
     * {Array(String)} Supported application event types.  Register a listener
     *     for a particular event with the following syntax:
     * (code)
     * layer.events.register(type, obj, listener);
     * (end)
     *
     * Listeners will be called with a reference to an event object.  The
     *     properties of this event depends on exactly what happened.
     *
     * All event objects have at least the following properties:
     *  - *object* {Object} A reference to layer.events.object.
     *  - *element* {DOMElement} A reference to layer.events.element.
     *
     * Supported map event types:
     *  - *loadstart* Triggered when layer loading starts.
     *  - *loadend* Triggered when layer loading ends.
     *  - *loadcancel* Triggered when layer loading is canceled.
     *  - *visibilitychanged* Triggered when layer visibility is changed.
     */
    EVENT_TYPES: ["loadstart", "loadend", "loadcancel", "visibilitychanged"],
        
    /**
     * APIProperty: events
     * {<OpenLayers.Events>}
     */
    events: null,

    /**
     * APIProperty: map
     * {<OpenLayers.Map>} This variable is set when the layer is added to 
     *     the map, via the accessor function setMap().
     */
    map: null,
    
    /**
     * APIProperty: isBaseLayer
     * {Boolean} Whether or not the layer is a base layer. This should be set 
     *     individually by all subclasses. Default is false
     */
    isBaseLayer: false,
 
    /**
     * Property: alpha
     * {Boolean} The layer's images have an alpha channel.  Default is false. 
     */
    alpha: false,

    /** 
     * APIProperty: displayInLayerSwitcher
     * {Boolean} Display the layer's name in the layer switcher.  Default is
     *     true.
     */
    displayInLayerSwitcher: true,

    /**
     * APIProperty: visibility
     * {Boolean} The layer should be displayed in the map.  Default is true.
     */
    visibility: true,

    /**
     * APIProperty: attribution
     * {String} Attribution string, displayed when an 
     *     <OpenLayers.Control.Attribution> has been added to the map.
     */
    attribution: null, 

    /** 
     * Property: inRange
     * {Boolean} The current map resolution is within the layer's min/max 
     *     range. This is set in <OpenLayers.Map.setCenter> whenever the zoom 
     *     changes.
     */
    inRange: false,
    
    /**
     * Propery: imageSize
     * {<OpenLayers.Size>} For layers with a gutter, the image is larger than 
     *     the tile by twice the gutter in each dimension.
     */
    imageSize: null,
    
    /**
     * Property: imageOffset
     * {<OpenLayers.Pixel>} For layers with a gutter, the image offset 
     *     represents displacement due to the gutter.
     */
    imageOffset: null,

  // OPTIONS

    /** 
     * Property: options
     * {Object} An optional object whose properties will be set on the layer.
     *     Any of the layer properties can be set as a property of the options
     *     object and sent to the constructor when the layer is created.
     */
    options: null,

    /**
     * APIProperty: eventListeners
     * {Object} If set as an option at construction, the eventListeners
     *     object will be registered with <OpenLayers.Events.on>.  Object
     *     structure must be a listeners object as shown in the example for
     *     the events.on method.
     */
    eventListeners: null,

    /**
     * APIProperty: gutter
     * {Integer} Determines the width (in pixels) of the gutter around image
     *     tiles to ignore.  By setting this property to a non-zero value,
     *     images will be requested that are wider and taller than the tile
     *     size by a value of 2 x gutter.  This allows artifacts of rendering
     *     at tile edges to be ignored.  Set a gutter value that is equal to
     *     half the size of the widest symbol that needs to be displayed.
     *     Defaults to zero.  Non-tiled layers always have zero gutter.
     */ 
    gutter: 0, 

    /**
     * APIProperty: projection
     * {<OpenLayers.Projection>} or {<String>} Set in the layer options to
     *     override the default projection string this layer - also set maxExtent,
     *     maxResolution, and units if appropriate. Can be either a string or
     *     an <OpenLayers.Projection> object when created -- will be converted
     *     to an object when setMap is called if a string is passed.  
     */
    projection: null,    
    
    /**
     * APIProperty: units
     * {String} The layer map units.  Defaults to 'degrees'.  Possible values
     *     are 'degrees' (or 'dd'), 'm', 'ft', 'km', 'mi', 'inches'.
     */
    units: null,

    /**
     * APIProperty: scales
     * {Array}  An array of map scales in descending order.  The values in the
     *     array correspond to the map scale denominator.  Note that these
     *     values only make sense if the display (monitor) resolution of the
     *     client is correctly guessed by whomever is configuring the
     *     application.  In addition, the units property must also be set.
     *     Use <resolutions> instead wherever possible.
     */
    scales: null,

    /**
     * APIProperty: resolutions
     * {Array} A list of map resolutions (map units per pixel) in descending
     *     order.  If this is not set in the layer constructor, it will be set
     *     based on other resolution related properties (maxExtent,
     *     maxResolution, maxScale, etc.).
     */
    resolutions: null,
    
    /**
     * APIProperty: maxExtent
     * {<OpenLayers.Bounds>}  The center of these bounds will not stray outside
     *     of the viewport extent during panning.  In addition, if
     *     <displayOutsideMaxExtent> is set to false, data will not be
     *     requested that falls completely outside of these bounds.
     */
    maxExtent: null,
    
    /**
     * APIProperty: minExtent
     * {<OpenLayers.Bounds>}
     */
    minExtent: null,
    
    /**
     * APIProperty: maxResolution
     * {Float} Default max is 360 deg / 256 px, which corresponds to
     *     zoom level 0 on gmaps.  Specify a different value in the layer 
     *     options if you are not using a geographic projection and 
     *     displaying the whole world.
     */
    maxResolution: null,

    /**
     * APIProperty: minResolution
     * {Float}
     */
    minResolution: null,

    /**
     * APIProperty: numZoomLevels
     * {Integer}
     */
    numZoomLevels: null,
   
    /**
     * APIProperty: minScale
     * {Float}
     */
    minScale: null,
    
    /**
     * APIProperty: maxScale
     * {Float}
     */
    maxScale: null,

    /**
     * APIProperty: displayOutsideMaxExtent
     * {Boolean} Request map tiles that are completely outside of the max 
     *     extent for this layer. Defaults to false.
     */
    displayOutsideMaxExtent: false,

    /**
     * APIProperty: wrapDateLine
     * {Boolean} #487 for more info.   
     */
    wrapDateLine: false,
    
    /**
     * APIProperty: transitionEffect
     * {String} The transition effect to use when the map is panned or
     *     zoomed.  
     *
     * There are currently two supported values:
     *  - *null* No transition effect (the default).
     *  - *resize*  Existing tiles are resized on zoom to provide a visual
     *    effect of the zoom having taken place immediately.  As the
     *    new tiles become available, they are drawn over top of the
     *    resized tiles.
     */
    transitionEffect: null,
    
    /**
     * Property: SUPPORTED_TRANSITIONS
     * {Array} An immutable (that means don't change it!) list of supported 
     *     transitionEffect values.
     */
    SUPPORTED_TRANSITIONS: ['resize'],
    
    /**
     * Constructor: OpenLayers.Layer
     *
     * Parameters:
     * name - {String} The layer name
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {

        this.addOptions(options);

        this.name = name;
        
        if (this.id == null) {

            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");

            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.style.width = "100%";
            this.div.style.height = "100%";

            this.events = new OpenLayers.Events(this, this.div, 
                                                this.EVENT_TYPES);
            if(this.eventListeners instanceof Object) {
                this.events.on(this.eventListeners);
            }

        }

        if (this.wrapDateLine) {
            this.displayOutsideMaxExtent = true;
        }
    },
    
    /**
     * Method: destroy
     * Destroy is a destructor: this is to alleviate cyclic references which
     *     the Javascript garbage cleaner can not take care of on its own.
     *
     * Parameters:
     * setNewBaseLayer - {Boolean} Set a new base layer when this layer has
     *     been destroyed.  Default is true.
     */
    destroy: function(setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (this.map != null) {
            this.map.removeLayer(this, setNewBaseLayer);
        }
        this.projection = null;
        this.map = null;
        this.name = null;
        this.div = null;
        this.options = null;

        if (this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
        }
        this.eventListeners = null;
        this.events = null;
    },
    
   /**
    * Method: clone
    *
    * Parameters:
    * obj - {<OpenLayers.Layer>} The layer to be cloned
    *
    * Returns:
    * {<OpenLayers.Layer>} An exact clone of this <OpenLayers.Layer>
    */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer(this.name, this.options);
        } 
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        // a cloned layer should never have its map property set
        //  because it has not been added to a map yet. 
        obj.map = null;
        
        return obj;
    },
    
    /** 
     * APIMethod: setName
     * Sets the new layer name for this layer.  Can trigger a changelayer event
     *     on the map.
     *
     * Parameters:
     * newName - {String} The new name.
     */
    setName: function(newName) {
        if (newName != this.name) {
            this.name = newName;
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "name"
                });
            }
        }
    },    
    
   /**
    * APIMethod: addOptions
    * 
    * Parameters:
    * newOptions - {Object}
    */
    addOptions: function (newOptions) {
        
        if (this.options == null) {
            this.options = {};
        }
        
        // update our copy for clone
        OpenLayers.Util.extend(this.options, newOptions);

        // add new options to this
        OpenLayers.Util.extend(this, newOptions);
    },
    
    /**
     * APIMethod: onMapResize
     * This function can be implemented by subclasses
     */
    onMapResize: function() {
        //this function can be implemented by subclasses  
    },

    /**
     * APIMethod: redraw
     * Redraws the layer.  Returns true if the layer was redrawn, false if not.
     *
     * Returns:
     * {Boolean} The layer was redrawn.
     */
    redraw: function() {
        var redrawn = false;
        if (this.map) {

            // min/max Range may have changed
            this.inRange = this.calculateInRange();

            // map's center might not yet be set
            var extent = this.getExtent();

            if (extent && this.inRange && this.visibility) {
                this.moveTo(extent, true, false);
                redrawn = true;
            }
        }
        return redrawn;
    },

    /**
     * Method: moveTo
     * 
     * Parameters:
     * bound - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean} Tells when zoom has changed, as layers have to
     *     do some init work in that case.
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        var display = this.visibility;
        if (!this.isBaseLayer) {
            display = display && this.inRange;
        }
        this.display(display);
    },

    /**
     * Method: setMap
     * Set the map property for the layer. This is done through an accessor
     *     so that subclasses can override this and take special action once 
     *     they have their map variable set. 
     * 
     *     Here we take care to bring over any of the necessary default 
     *     properties from the map. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        if (this.map == null) {
        
            this.map = map;
            
            // grab some essential layer data from the map if it hasn't already
            //  been set
            this.maxExtent = this.maxExtent || this.map.maxExtent;
            this.projection = this.projection || this.map.projection;
            
            if (this.projection && typeof this.projection == "string") {
                this.projection = new OpenLayers.Projection(this.projection);
            }
            
            // Check the projection to see if we can get units -- if not, refer
            // to properties.
            this.units = this.projection.getUnits() ||
                         this.units || this.map.units;
            
            this.initResolutions();
            
            if (!this.isBaseLayer) {
                this.inRange = this.calculateInRange();
                var show = ((this.visibility) && (this.inRange));
                this.div.style.display = show ? "" : "none";
            }
            
            // deal with gutters
            this.setTileSize();
        }
    },
    
    /**
     * APIMethod: removeMap
     * Just as setMap() allows each layer the possibility to take a 
     *     personalized action on being added to the map, removeMap() allows
     *     each layer to take a personalized action on being removed from it. 
     *     For now, this will be mostly unused, except for the EventPane layer,
     *     which needs this hook so that it can remove the special invisible
     *     pane. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        //to be overridden by subclasses
    },
    
    /**
     * APIMethod: getImageSize
     * 
     * Returns:
     * {<OpenLayers.Size>} The size that the image should be, taking into 
     *     account gutters.
     */ 
    getImageSize: function() { 
        return (this.imageSize || this.tileSize); 
    },    
  
    /**
     * APIMethod: setTileSize
     * Set the tile size based on the map size.  This also sets layer.imageSize
     *     and layer.imageOffset for use by Tile.Image.
     * 
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) {
        var tileSize = (size) ? size :
                                ((this.tileSize) ? this.tileSize :
                                                   this.map.getTileSize());
        this.tileSize = tileSize;
        if(this.gutter) {
          // layers with gutters need non-null tile sizes
          //if(tileSize == null) {
          //    OpenLayers.console.error("Error in layer.setMap() for " +
          //                              this.name + ": layers with " +
          //                              "gutters need non-null tile sizes");
          //}
            this.imageOffset = new OpenLayers.Pixel(-this.gutter, 
                                                    -this.gutter); 
            this.imageSize = new OpenLayers.Size(tileSize.w + (2*this.gutter), 
                                                 tileSize.h + (2*this.gutter)); 
        }
    },

    /**
     * APIMethod: getVisibility
     * 
     * Returns:
     * {Boolean} The layer should be displayed (if in range).
     */
    getVisibility: function() {
        return this.visibility;
    },

    /** 
     * APIMethod: setVisibility
     * Set the visibility flag for the layer and hide/show & redraw 
     *     accordingly. Fire event unless otherwise specified
     * 
     * Note that visibility is no longer simply whether or not the layer's
     *     style.display is set to "block". Now we store a 'visibility' state 
     *     property on the layer class, this allows us to remember whether or 
     *     not we *desire* for a layer to be visible. In the case where the 
     *     map's resolution is out of the layer's range, this desire may be 
     *     subverted.
     * 
     * Parameters:
     * visible - {Boolean} Whether or not to display the layer (if in range)
     */
    setVisibility: function(visibility) {
        if (visibility != this.visibility) {
            this.visibility = visibility;
            this.display(visibility);
            this.redraw();
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "visibility"
                });
            }
            this.events.triggerEvent("visibilitychanged");
        }
    },

    /** 
     * APIMethod: display
     * Hide or show the Layer
     * 
     * Parameters:
     * display - {Boolean}
     */
    display: function(display) {
        var inRange = this.calculateInRange();
        if (display != (this.div.style.display != "none")) {
            this.div.style.display = (display && inRange) ? "block" : "none";
        }
    },

    /**
     * Method: calculateInRange
     * 
     * Returns:
     * {Boolean} The layer is displayable at the current map's current
     *     resolution.
     */
    calculateInRange: function() {
        var inRange = false;
        if (this.map) {
            var resolution = this.map.getResolution();
            inRange = ( (resolution >= this.minResolution) &&
                        (resolution <= this.maxResolution) );
        }
        return inRange;
    },

    /** 
     * APIMethod: setIsBaseLayer
     * 
     * Parameters:
     * isBaseLayer - {Boolean}
     */
    setIsBaseLayer: function(isBaseLayer) {
        if (isBaseLayer != this.isBaseLayer) {
            this.isBaseLayer = isBaseLayer;
            if (this.map != null) {
                this.map.events.triggerEvent("changebaselayer", {
                    layer: this
                });
            }
        }
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /********************************************************/
  
    /** 
     * Method: initResolutions
     * This method's responsibility is to set up the 'resolutions' array 
     *     for the layer -- this array is what the layer will use to interface
     *     between the zoom levels of the map and the resolution display 
     *     of the layer.
     * 
     * The user has several options that determine how the array is set up.
     *  
     * For a detailed explanation, see the following wiki from the 
     *     openlayers.org homepage:
     *     http://trac.openlayers.org/wiki/SettingZoomLevels
     */
    initResolutions: function() {

        // These are the relevant options which are used for calculating 
        //  resolutions information.
        //
        var props = new Array(
          'projection', 'units',
          'scales', 'resolutions',
          'maxScale', 'minScale', 
          'maxResolution', 'minResolution', 
          'minExtent', 'maxExtent',
          'numZoomLevels', 'maxZoomLevel'
        );

        // First we create a new object where we will store all of the 
        //  resolution-related properties that we find in either the layer's
        //  'options' array or from the map.
        //
        var confProps = {};        
        for(var i=0; i < props.length; i++) {
            var property = props[i];
            confProps[property] = this.options[property] || this.map[property];
        }

        // Do not use the scales/resolutions at the map level if
        // minScale/minResolution and maxScale/maxResolution are
        // specified at the layer level
        if (this.options.minScale != null &&
            this.options.maxScale != null &&
            this.options.scales == null) {
            confProps.scales = null;
        }
        if (this.options.minResolution != null &&
            this.options.maxResolution != null &&
            this.options.resolutions == null) {
            confProps.resolutions = null;
        }

        // If numZoomLevels hasn't been set and the maxZoomLevel *has*, 
        //  then use maxZoomLevel to calculate numZoomLevels
        //
        if ( (!confProps.numZoomLevels) && (confProps.maxZoomLevel) ) {
            confProps.numZoomLevels = confProps.maxZoomLevel + 1;
        }

        // First off, we take whatever hodge-podge of values we have and 
        //  calculate/distill them down into a resolutions[] array
        //
        if ((confProps.scales != null) || (confProps.resolutions != null)) {
          //preset levels
            if (confProps.scales != null) {
                confProps.resolutions = [];
                for(var i = 0; i < confProps.scales.length; i++) {
                    var scale = confProps.scales[i];
                    confProps.resolutions[i] = 
                       OpenLayers.Util.getResolutionFromScale(scale, 
                                                              confProps.units);
                }
            }
            confProps.numZoomLevels = confProps.resolutions.length;

        } else {
          //maxResolution and numZoomLevels based calculation

            // determine maxResolution
            if (confProps.minScale) {
                confProps.maxResolution = 
                    OpenLayers.Util.getResolutionFromScale(confProps.minScale, 
                                                           confProps.units);
            } else if (confProps.maxResolution == "auto") {
                var viewSize = this.map.getSize();
                var wRes = confProps.maxExtent.getWidth() / viewSize.w;
                var hRes = confProps.maxExtent.getHeight()/ viewSize.h;
                confProps.maxResolution = Math.max(wRes, hRes);
            } 

            // determine minResolution
            if (confProps.maxScale != null) {           
                confProps.minResolution = 
                    OpenLayers.Util.getResolutionFromScale(confProps.maxScale, 
                                                           confProps.units);
            } else if ( (confProps.minResolution == "auto") && 
                        (confProps.minExtent != null) ) {
                var viewSize = this.map.getSize();
                var wRes = confProps.minExtent.getWidth() / viewSize.w;
                var hRes = confProps.minExtent.getHeight()/ viewSize.h;
                confProps.minResolution = Math.max(wRes, hRes);
            } 

            // determine numZoomLevels if not already set on the layer
            // this gives numZoomLevels assuming approximately base 2 scaling
            if (confProps.minResolution != null &&
                this.options.numZoomLevels == undefined) {
                var ratio = confProps.maxResolution / confProps.minResolution;
                confProps.numZoomLevels = 
                    Math.floor(Math.log(ratio) / Math.log(2)) + 1;
            }
            
            // now we have numZoomLevels and maxResolution, 
            //  we can populate the resolutions array
            confProps.resolutions = new Array(confProps.numZoomLevels);
            var base = 2;
            if(typeof confProps.minResolution == "number" &&
               confProps.numZoomLevels > 1) {
                /**
                 * If maxResolution and minResolution are set (or related
                 * scale properties), we calculate the base for exponential
                 * scaling that starts at maxResolution and ends at
                 * minResolution in numZoomLevels steps.
                 */
                base = Math.pow(
                    (confProps.maxResolution / confProps.minResolution),
                    (1 / (confProps.numZoomLevels - 1))
                );
            }
            for (var i=0; i < confProps.numZoomLevels; i++) {
                var res = confProps.maxResolution / Math.pow(base, i);
                confProps.resolutions[i] = res;
            }
        }
        
        //sort resolutions array ascendingly
        //
        confProps.resolutions.sort( function(a, b) { return(b-a); } );

        // now set our newly calculated values back to the layer 
        //  Note: We specifically do *not* set them to layer.options, which we 
        //        will preserve as it was when we added this layer to the map. 
        //        this way cloned layers reset themselves to new map div 
        //        dimensions)
        //

        this.resolutions = confProps.resolutions;
        this.maxResolution = confProps.resolutions[0];
        var lastIndex = confProps.resolutions.length - 1;
        this.minResolution = confProps.resolutions[lastIndex];
        
        this.scales = [];
        for(var i = 0; i < confProps.resolutions.length; i++) {
            this.scales[i] = 
               OpenLayers.Util.getScaleFromResolution(confProps.resolutions[i], 
                                                      confProps.units);
        }
        this.minScale = this.scales[0];
        this.maxScale = this.scales[this.scales.length - 1];
        
        this.numZoomLevels = confProps.numZoomLevels;
    },

    /**
     * APIMethod: getResolution
     * 
     * Returns:
     * {Float} The currently selected resolution of the map, taken from the
     *     resolutions array, indexed by current zoom level.
     */
    getResolution: function() {
        var zoom = this.map.getZoom();
        return this.getResolutionForZoom(zoom);
    },

    /** 
     * APIMethod: getExtent
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object which represents the lon/lat 
     *     bounds of the current viewPort.
     */
    getExtent: function() {
        // just use stock map calculateBounds function -- passing no arguments
        //  means it will user map's current center & resolution
        //
        return this.map.calculateBounds();
    },

    /**
     * APIMethod: getZoomForExtent
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * closest - {Boolean} Find the zoom level that most closely fits the 
     *     specified bounds. Note that this may result in a zoom that does 
     *     not exactly contain the entire extent.
     *     Default is false.
     *
     * Returns:
     * {Integer} The index of the zoomLevel (entry in the resolutions array) 
     *     for the passed-in extent. We do this by calculating the ideal 
     *     resolution for the given extent (based on the map size) and then 
     *     calling getZoomForResolution(), passing along the 'closest'
     *     parameter.
     */
    getZoomForExtent: function(extent, closest) {
        var viewSize = this.map.getSize();
        var idealResolution = Math.max( extent.getWidth()  / viewSize.w,
                                        extent.getHeight() / viewSize.h );

        return this.getZoomForResolution(idealResolution, closest);
    },
    
    /** 
     * Method: getDataExtent
     * Calculates the max extent which includes all of the data for the layer.
     *     This function is to be implemented by subclasses.
     * 
     * Returns:
     * {<OpenLayers.Bounds>}
     */
    getDataExtent: function () {
        //to be implemented by subclasses
    },

    /**
     * APIMethod: getResolutionForZoom
     * 
     * Parameter:
     * zoom - {Float}
     * 
     * Returns:
     * {Float} A suitable resolution for the specified zoom.
     */
    getResolutionForZoom: function(zoom) {
        zoom = Math.max(0, Math.min(zoom, this.resolutions.length - 1));
        var resolution;
        if(this.map.fractionalZoom) {
            var low = Math.floor(zoom);
            var high = Math.ceil(zoom);
            resolution = this.resolutions[high] +
                ((zoom-low) * (this.resolutions[low]-this.resolutions[high]));
        } else {
            resolution = this.resolutions[Math.round(zoom)];
        }
        return resolution;
    },

    /**
     * APIMethod: getZoomForResolution
     * 
     * Parameters:
     * resolution - {Float}
     * closest - {Boolean} Find the zoom level that corresponds to the absolute 
     *     closest resolution, which may result in a zoom whose corresponding
     *     resolution is actually smaller than we would have desired (if this
     *     is being called from a getZoomForExtent() call, then this means that
     *     the returned zoom index might not actually contain the entire 
     *     extent specified... but it'll be close).
     *     Default is false.
     * 
     * Returns:
     * {Integer} The index of the zoomLevel (entry in the resolutions array) 
     *     that corresponds to the best fit resolution given the passed in 
     *     value and the 'closest' specification.
     */
    getZoomForResolution: function(resolution, closest) {
        var zoom;
        if(this.map.fractionalZoom) {
            var lowZoom = 0;
            var highZoom = this.resolutions.length - 1;
            var highRes = this.resolutions[lowZoom];
            var lowRes = this.resolutions[highZoom];
            var res;
            for(var i=0; i<this.resolutions.length; ++i) {
                res = this.resolutions[i];
                if(res >= resolution) {
                    highRes = res;
                    lowZoom = i;
                }
                if(res <= resolution) {
                    lowRes = res;
                    highZoom = i;
                    break;
                }
            }
            var dRes = highRes - lowRes;
            if(dRes > 0) {
                zoom = lowZoom + ((resolution - lowRes) / dRes);
            } else {
                zoom = lowZoom;
            }
        } else {
            var diff;
            var minDiff = Number.POSITIVE_INFINITY;
            for(var i=0; i < this.resolutions.length; i++) {            
                if (closest) {
                    diff = Math.abs(this.resolutions[i] - resolution);
                    if (diff > minDiff) {
                        break;
                    }
                    minDiff = diff;
                } else {
                    if (this.resolutions[i] < resolution) {
                        break;
                    }
                }
            }
            zoom = Math.max(0, i-1);
        }
        return zoom;
    },
    
    /**
     * APIMethod: getLonLatFromViewPortPx
     * 
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.LonLat>} An OpenLayers.LonLat which is the passed-in 
     *     view port <OpenLayers.Pixel>, translated into lon/lat by the layer.
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if (viewPortPx != null) {
            var size = this.map.getSize();
            var center = this.map.getCenter();
            if (center) {
                var res  = this.map.getResolution();
        
                var delta_x = viewPortPx.x - (size.w / 2);
                var delta_y = viewPortPx.y - (size.h / 2);
            
                lonlat = new OpenLayers.LonLat(center.lon + delta_x * res ,
                                             center.lat - delta_y * res); 

                if (this.wrapDateLine) {
                    lonlat = lonlat.wrapDateLine(this.maxExtent);
                }
            } // else { DEBUG STATEMENT }
        }
        return lonlat;
    },

    /**
     * APIMethod: getViewPortPxFromLonLat
     * Returns a pixel location given a map location.  This method will return
     *     fractional pixel values.
     * 
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>}
     *
     * Returns: 
     * {<OpenLayers.Pixel>} An <OpenLayers.Pixel> which is the passed-in 
     *     <OpenLayers.LonLat>,translated into view port pixels.
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (lonlat != null) {
            var resolution = this.map.getResolution();
            var extent = this.map.getExtent();
            px = new OpenLayers.Pixel(
                (1/resolution * (lonlat.lon - extent.left)),
                (1/resolution * (extent.top - lonlat.lat))
            );    
        }
        return px;
    },
    
    /**
     * APIMethod: setOpacity
     * Sets the opacity for the entire layer (all images)
     * 
     * Parameter:
     * opacity - {Float}
     */
    setOpacity: function(opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            for(var i=0; i<this.div.childNodes.length; ++i) {
                var element = this.div.childNodes[i].firstChild;
                OpenLayers.Util.modifyDOMElement(element, null, null, null, 
                                                 null, null, null, opacity);
            }
        }
    },

    /**
     * Method: setZIndex
     * 
     * Parameters: 
     * zIndex - {Integer}
     */    
    setZIndex: function (zIndex) {
        this.div.style.zIndex = zIndex;
    },

    /**
     * Method: adjustBounds
     * This function will take a bounds, and if wrapDateLine option is set
     *     on the layer, it will return a bounds which is wrapped around the 
     *     world. We do not wrap for bounds which *cross* the 
     *     maxExtent.left/right, only bounds which are entirely to the left 
     *     or entirely to the right.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    adjustBounds: function (bounds) {

        if (this.gutter) {
            // Adjust the extent of a bounds in map units by the 
            // layer's gutter in pixels.
            var mapGutter = this.gutter * this.map.getResolution();
            bounds = new OpenLayers.Bounds(bounds.left - mapGutter,
                                           bounds.bottom - mapGutter,
                                           bounds.right + mapGutter,
                                           bounds.top + mapGutter);
        }

        if (this.wrapDateLine) {
            // wrap around the date line, within the limits of rounding error
            var wrappingOptions = { 
                'rightTolerance':this.getResolution()
            };    
            bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);
                              
        }
        return bounds;
    },

    CLASS_NAME: "OpenLayers.Layer"
});
/* ======================================================================
    OpenLayers/Marker/Box.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Marker.js
 */

/**
 * Class: OpenLayers.Marker.Box
 *
 * Inherits from:
 *  - <OpenLayers.Marker> 
 */
OpenLayers.Marker.Box = OpenLayers.Class(OpenLayers.Marker, {

    /** 
     * Property: bounds 
     * {<OpenLayers.Bounds>} 
     */
    bounds: null,

    /** 
     * Property: div 
     * {DOMElement} 
     */
    div: null,
    
    /** 
     * Constructor: OpenLayers.Marker.Box
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     * borderColor - {String} 
     * borderWidth - {int} 
     */
    initialize: function(bounds, borderColor, borderWidth) {
        this.bounds = bounds;
        this.div    = OpenLayers.Util.createDiv();
        this.div.style.overflow = 'hidden';
        this.events = new OpenLayers.Events(this, this.div, null);
        this.setBorder(borderColor, borderWidth);
    },

    /**
     * Method: destroy 
     */    
    destroy: function() {

        this.bounds = null;
        this.div = null;

        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },

    /** 
     * Method: setBorder
     * Allow the user to change the box's color and border width
     * 
     * Parameters:
     * color - {String} Default is "red"
     * width - {int} Default is 2
     */
    setBorder: function (color, width) {
        if (!color) {
            color = "red";
        }
        if (!width) {
            width = 2;
        }
        this.div.style.border = width + "px solid " + color;
    },
    
    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker´s icon set at the 
    *         location passed-in
    */
    draw: function(px, sz) {
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz);
        return this.div;
    }, 

    /**
     * Method: onScreen
     * 
     * Rreturn:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsBounds(this.bounds, true, true);
        }    
        return onScreen;
    },
    
    /**
     * Method: display
     * Hide or show the icon
     * 
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.Box"
});

/* ======================================================================
    OpenLayers/Control/DragPan.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Drag.js
 */

/**
 * Class: OpenLayers.Control.DragPan
 * DragPan control.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.DragPan = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * Property: type
     * {OpenLayers.Control.TYPES}
     */
    type: OpenLayers.Control.TYPE_TOOL,
    
    /**
     * Property: panned
     * {Boolean} The map moved.
     */
    panned: false,
    
    /**
     * Method: draw
     * Creates a Drag handler, using <panMap> and
     * <panMapDone> as callbacks.
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Drag(this,
                            {"move": this.panMap, "done": this.panMapDone});
    },

    /**
    * Method: panMap
    *
    * Parameters:
    * xy - {<OpenLayers.Pixel>} Pixel of the mouse position
    */
    panMap: function(xy) {
        this.panned = true;
        this.map.pan(
            this.handler.last.x - xy.x,
            this.handler.last.y - xy.y,
            {dragging: this.handler.dragging, animate: false}
        );
    },
    
    /**
     * Method: panMapDone
     * Finish the panning operation.  Only call setCenter (through <panMap>)
     *     if the map has actually been moved.
     *
     * Parameters:
     * xy - {<OpenLayers.Pixel>} Pixel of the mouse position
     */
    panMapDone: function(xy) {
        if(this.panned) {
            this.panMap(xy);
            this.panned = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.DragPan"
});
/* ======================================================================
    OpenLayers/Handler/Box.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Handler/Drag.js
 */

/**
 * Class: OpenLayers.Handler.Box
 * Handler for dragging a rectangle across the map.  Box is displayed 
 * on mouse down, moves on mouse move, and is finished on mouse up.
 *
 * Inherits from:
 *  - <OpenLayers.Handler> 
 */
OpenLayers.Handler.Box = OpenLayers.Class(OpenLayers.Handler, {

    /** 
     * Property: dragHandler 
     * {<OpenLayers.Handler.Drag>} 
     */
    dragHandler: null,

    /**
     * APIProperty: boxDivClassName
     * {String} The CSS class to use for drawing the box. Default is
     *     olHandlerBoxZoomBox
     */
    boxDivClassName: 'olHandlerBoxZoomBox',

    /**
     * Constructor: OpenLayers.Handler.Box
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        var callbacks = {
            "down": this.startBox, 
            "move": this.moveBox, 
            "out":  this.removeBox,
            "up":   this.endBox
        };
        this.dragHandler = new OpenLayers.Handler.Drag(
                                this, callbacks, {keyMask: this.keyMask});
    },

    /**
     * Method: setMap
     */
    setMap: function (map) {
        OpenLayers.Handler.prototype.setMap.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.setMap(map);
        }
    },

    /**
    * Method: startBox
    *
    * Parameters:
    * evt - {Event} 
    */
    startBox: function (xy) {
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                 this.dragHandler.start);
        this.zoomBox.className = this.boxDivClassName;                                         
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        this.map.viewPortDiv.appendChild(this.zoomBox);

        // TBD: use CSS classes instead
        this.map.div.style.cursor = "crosshair";
    },

    /**
    * Method: moveBox
    */
    moveBox: function (xy) {
        var deltaX = Math.abs(this.dragHandler.start.x - xy.x);
        var deltaY = Math.abs(this.dragHandler.start.y - xy.y);
        this.zoomBox.style.width = Math.max(1, deltaX) + "px";
        this.zoomBox.style.height = Math.max(1, deltaY) + "px";
        if (xy.x < this.dragHandler.start.x) {
            this.zoomBox.style.left = xy.x+"px";
        }
        if (xy.y < this.dragHandler.start.y) {
            this.zoomBox.style.top = xy.y+"px";
        }
    },

    /**
    * Method: endBox
    */
    endBox: function(end) {
        var result;
        if (Math.abs(this.dragHandler.start.x - end.x) > 5 ||    
            Math.abs(this.dragHandler.start.y - end.y) > 5) {   
            var start = this.dragHandler.start;
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            result = new OpenLayers.Bounds(left, bottom, right, top);
        } else {
            result = this.dragHandler.start.clone(); // i.e. OL.Pixel
        } 
        this.removeBox();

        // TBD: use CSS classes instead
        this.map.div.style.cursor = "";

        this.callback("done", [result]);
    },

    /**
     * Method: removeBox
     * Remove the zoombox from the screen and nullify our reference to it.
     */
    removeBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
    },

    /**
     * Method: activate
     */
    activate: function () {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragHandler.activate();
            return true;
        } else {
            return false;
        }
    },

    /**
     * Method: deactivate
     */
    deactivate: function () {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.dragHandler.deactivate();
            return true;
        } else {
            return false;
        }
    },

    CLASS_NAME: "OpenLayers.Handler.Box"
});
/* ======================================================================
    OpenLayers/Layer/HTTPRequest.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer.js
 */

/**
 * Class: OpenLayers.Layer.HTTPRequest
 * 
 * Inherits from: 
 *  - <OpenLayers.Layer>
 */
OpenLayers.Layer.HTTPRequest = OpenLayers.Class(OpenLayers.Layer, {

    /** 
     * Constant: URL_HASH_FACTOR
     * {Float} Used to hash URL param strings for multi-WMS server selection.
     *         Set to the Golden Ratio per Knuth's recommendation.
     */
    URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,

    /** 
     * Property: url
     * {Array(String) or String} This is either an array of url strings or 
     *                           a single url string. 
     */
    url: null,

    /** 
     * Property: params
     * {Object} Hashtable of key/value parameters
     */
    params: null,
    
    /** 
     * APIProperty: reproject
     * *Deprecated*. See http://trac.openlayers.org/wiki/SpatialMercator
     * for information on the replacement for this functionality. 
     * {Boolean} Whether layer should reproject itself based on base layer 
     *           locations. This allows reprojection onto commercial layers. 
     *           Default is false: Most layers can't reproject, but layers 
     *           which can create non-square geographic pixels can, like WMS.
     *           
     */
    reproject: false,

    /**
     * Constructor: OpenLayers.Layer.HTTPRequest
     * 
     * Parameters:
     * name - {String}
     * url - {Array(String) or String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        var newArguments = arguments;
        newArguments = [name, options];
        OpenLayers.Layer.prototype.initialize.apply(this, newArguments);
        this.url = url;
        this.params = OpenLayers.Util.extend( {}, params);
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {
        this.url = null;
        this.params = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },
    
    /**
     * APIMethod: clone
     * 
     * Parameters:
     * obj - {Object}
     * 
     * Returns:
     * {<OpenLayers.Layer.HTTPRequest>} An exact clone of this 
     *                                  <OpenLayers.Layer.HTTPRequest>
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.HTTPRequest(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.options);
        }
        
        //get all additions from superclasses
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        
        return obj;
    },

    /** 
     * APIMethod: setUrl
     * 
     * Parameters:
     * newUrl - {String}
     */
    setUrl: function(newUrl) {
        this.url = newUrl;
    },

    /**
     * APIMethod: mergeNewParams
     * 
     * Parameters:
     * newParams - {Object}
     *
     * Returns:
     * redrawn: {Boolean} whether the layer was actually redrawn.
     */
    mergeNewParams:function(newParams) {
        this.params = OpenLayers.Util.extend(this.params, newParams);
        return this.redraw();
    },

    /**
     * APIMethod: redraw
     * Redraws the layer.  Returns true if the layer was redrawn, false if not.
     *
     * Parameters:
     * force - {Boolean} Force redraw by adding random parameter.
     *
     * Returns:
     * {Boolean} The layer was redrawn.
     */
    redraw: function(force) { 
        if (force) {
            return this.mergeNewParams({"_olSalt": Math.random()});
        } else {
            return OpenLayers.Layer.prototype.redraw.apply(this, []);
        }
    },
    
    /**
     * Method: selectUrl
     * selectUrl() implements the standard floating-point multiplicative
     *     hash function described by Knuth, and hashes the contents of the 
     *     given param string into a float between 0 and 1. This float is then
     *     scaled to the size of the provided urls array, and used to select
     *     a URL.
     *
     * Parameters:
     * paramString - {String}
     * urls - {Array(String)}
     * 
     * Returns:
     * {String} An entry from the urls array, deterministically selected based
     *          on the paramString.
     */
    selectUrl: function(paramString, urls) {
        var product = 1;
        for (var i = 0; i < paramString.length; i++) { 
            product *= paramString.charCodeAt(i) * this.URL_HASH_FACTOR; 
            product -= Math.floor(product); 
        }
        return urls[Math.floor(product * urls.length)];
    },

    /** 
     * Method: getFullRequestString
     * Combine url with layer's params and these newParams. 
     *   
     *    does checking on the serverPath variable, allowing for cases when it 
     *     is supplied with trailing ? or &, as well as cases where not. 
     *
     *    return in formatted string like this:
     *        "server?key1=value1&key2=value2&key3=value3"
     * 
     * WARNING: The altUrl parameter is deprecated and will be removed in 3.0.
     *
     * Parameters:
     * newParams - {Object}
     * altUrl - {String} Use this as the url instead of the layer's url
     *   
     * Returns: 
     * {String}
     */
    getFullRequestString:function(newParams, altUrl) {

        // if not altUrl passed in, use layer's url
        var url = altUrl || this.url;
        
        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // if url is not a string, it should be an array of strings, 
        // in which case we will deterministically select one of them in 
        // order to evenly distribute requests to different urls.
        //
        if (url instanceof Array) {
            url = this.selectUrl(paramsString, url);
        }   
 
        // ignore parameters that are already in the url search string
        var urlParams = 
            OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // requestString always starts with url
        var requestString = url;        
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    //serverPath has no ? -- add one
                    requestString += '?' + paramsString;
                } else {
                    //serverPath contains ?, so must already have 
                    // paramsString at the end
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
/* ======================================================================
    OpenLayers/Control/ZoomBox.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Box.js
 */

/**
 * Class: OpenLayers.Control.ZoomBox
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.ZoomBox = OpenLayers.Class(OpenLayers.Control, {
    /**
     * Property: type
     * {OpenLayers.Control.TYPE}
     */
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * Property: out
     * {Boolean} Should the control be used for zooming out?
     */
    out: false,

    /**
     * Method: draw
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
                            {done: this.zoomBox}, {keyMask: this.keyMask} );
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.left, position.bottom));
                var maxXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.right, position.top));
                var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                var bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
            this.map.zoomToExtent(bounds);
        } else { // it's a pixel
            if (!this.out) {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() + 1);
            } else {
                this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() - 1);
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
/* ======================================================================
    OpenLayers/Layer/Grid.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/HTTPRequest.js
 */

/**
 * Class: OpenLayers.Layer.Grid
 * Base class for layers that use a lattice of tiles.  Create a new grid
 * layer with the <OpenLayers.Layer.Grid> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.HTTPRequest>
 */
OpenLayers.Layer.Grid = OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    
    /**
     * APIProperty: tileSize
     * {<OpenLayers.Size>}
     */
    tileSize: null,
    
    /**
     * Property: grid
     * {Array(Array(<OpenLayers.Tile>))} This is an array of rows, each row is 
     *     an array of tiles.
     */
    grid: null,

    /**
     * APIProperty: singleTile
     * {Boolean} Moves the layer into single-tile mode, meaning that one tile 
     *     will be loaded. The tile's size will be determined by the 'ratio'
     *     property. When the tile is dragged such that it does not cover the 
     *     entire viewport, it is reloaded.
     */
    singleTile: false,

    /** APIProperty: ratio
     *  {Float} Used only when in single-tile mode, this specifies the 
     *          ratio of the size of the single tile to the size of the map.
     */
    ratio: 1.5,

    /**
     * APIProperty: buffer
     * {Integer} Used only when in gridded mode, this specifies the number of 
     *           extra rows and colums of tiles on each side which will
     *           surround the minimum grid tiles to cover the map.
     */
    buffer: 2,

    /**
     * APIProperty: numLoadingTiles
     * {Integer} How many tiles are still loading?
     */
    numLoadingTiles: 0,

    /**
     * Constructor: OpenLayers.Layer.Grid
     * Create a new grid layer
     *
     * Parameters:
     * name - {String}
     * url - {String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        
        //grid layers will trigger 'tileloaded' when each new tile is 
        // loaded, as a means of progress update to listeners.
        // listeners can access 'numLoadingTiles' if they wish to keep track
        // of the loading progress
        //
        this.events.addEventType("tileloaded");

        this.grid = [];
    },

    /**
     * APIMethod: destroy
     * Deconstruct the layer and clear the grid.
     */
    destroy: function() {
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments); 
    },

    /**
     * Method: clearGrid
     * Go through and remove all tiles from the grid, calling
     *    destroy() on each of them to kill circular references
     */
    clearGrid:function() {
        if (this.grid) {
            for(var iRow=0; iRow < this.grid.length; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0; iCol < row.length; iCol++) {
                    var tile = row[iCol];
                    this.removeTileMonitoringHooks(tile);
                    tile.destroy();
                }
            }
            this.grid = [];
        }
    },

    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Is this ever used?
     * 
     * Returns:
     * {<OpenLayers.Layer.Grid>} An exact clone of this OpenLayers.Layer.Grid
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name,
                                            this.url,
                                            this.params,
                                            this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        
        // we do not want to copy reference to grid, so we make a new array
        obj.grid = [];

        return obj;
    },    

    /**
     * Method: moveTo
     * This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        
        bounds = bounds || this.map.getExtent();

        if (bounds != null) {
             
            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;

            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();            
      
            if (this.singleTile) {
                
                // We want to redraw whenever even the slightest part of the 
                //  current bounds is not contained by our tile.
                //  (thus, we do not specify partial -- its default is false)
                if ( forceReTile || 
                     (!dragging && !tilesBounds.containsBounds(bounds))) {
                    this.initSingleTile(bounds);
                }
            } else {
             
                // if the bounds have changed such that they are not even 
                //  *partially* contained by our tiles (IE user has 
                //  programmatically panned to the other side of the earth) 
                //  then we want to reTile (thus, partial true).  
                //
                if (forceReTile || !tilesBounds.containsBounds(bounds, true)) {
                    this.initGriddedTiles(bounds);
                } else {
                    //we might have to shift our buffer tiles
                    this.moveGriddedTiles(bounds);
                }
            }
        }
    },
    
    /**
     * APIMethod: setTileSize
     * Check if we are in singleTile mode and if so, set the size as a ratio
     *     of the map size (as specified by the layer's 'ratio' property).
     * 
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) { 
        if (this.singleTile) {
            size = this.map.getSize().clone();
            size.h = parseInt(size.h * this.ratio);
            size.w = parseInt(size.w * this.ratio);
        } 
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [size]);
    },
        
    /**
     * Method: getGridBounds
     * Deprecated. This function will be removed in 3.0. Please use 
     *     getTilesBounds() instead.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     * currently loaded tiles (including those partially or not at all seen 
     * onscreen)
     */
    getGridBounds: function() {
        var msg = "The getGridBounds() function is deprecated. It will be " +
                  "removed in 3.0. Please use getTilesBounds() instead.";
        OpenLayers.Console.warn(msg);
        return this.getTilesBounds();
    },

    /**
     * APIMethod: getTilesBounds
     * Return the bounds of the tile grid.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     *     currently loaded tiles (including those partially or not at all seen 
     *     onscreen).
     */
    getTilesBounds: function() {    
        var bounds = null; 
        
        if (this.grid.length) {
            var bottom = this.grid.length - 1;
            var bottomLeftTile = this.grid[bottom][0];
    
            var right = this.grid[0].length - 1; 
            var topRightTile = this.grid[0][right];
    
            bounds = new OpenLayers.Bounds(bottomLeftTile.bounds.left, 
                                           bottomLeftTile.bounds.bottom,
                                           topRightTile.bounds.right, 
                                           topRightTile.bounds.top);
            
        }   
        return bounds;
    },

    /**
     * Method: initSingleTile
     * 
     * Parameters: 
     * bounds - {<OpenLayers.Bounds>}
     */
    initSingleTile: function(bounds) {

        //determine new tile bounds
        var center = bounds.getCenterLonLat();
        var tileWidth = bounds.getWidth() * this.ratio;
        var tileHeight = bounds.getHeight() * this.ratio;
                                       
        var tileBounds = 
            new OpenLayers.Bounds(center.lon - (tileWidth/2),
                                  center.lat - (tileHeight/2),
                                  center.lon + (tileWidth/2),
                                  center.lat + (tileHeight/2));
  
        var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
        var px = this.map.getLayerPxFromLonLat(ul);

        if (!this.grid.length) {
            this.grid[0] = [];
        }

        var tile = this.grid[0][0];
        if (!tile) {
            tile = this.addTile(tileBounds, px);
            
            this.addTileMonitoringHooks(tile);
            tile.draw();
            this.grid[0][0] = tile;
        } else {
            tile.moveTo(tileBounds, px);
        }           
        
        //remove all but our single tile
        this.removeExcessTiles(1,1);
    },

    /** 
     * Method: calculateGridLayout
     * Generate parameters for the grid layout. This  
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>}
     * extent - {<OpenLayers.Bounds>}
     * resolution - {Number}
     *
     * Returns:
     * Object containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;
        
        var offsetlat = bounds.top - (extent.bottom + tilelat);  
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.bottom + tilerow * tilelat;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },

    /**
     * Method: initGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    initGriddedTiles:function(bounds) {
        
        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus at least one for panning

        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) + 
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);
        
        var extent = this.map.getMaxExtent();
        var resolution = this.map.getResolution();
        
        var tileLayout = this.calculateGridLayout(bounds, extent, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;
        
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;

        var rowidx = 0;
        
        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);
        
    
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
 
            do {
                var tileBounds = 
                    new OpenLayers.Bounds(tileoffsetlon, 
                                          tileoffsetlat, 
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols)  
             
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows)
        
        //shave off exceess rows and colums
        this.removeExcessTiles(rowidx, colidx);

        //now actually draw the tiles
        this.spiralTileLoad();
    },
    
    /**
     * Method: spiralTileLoad
     *   Starts at the top right corner of the grid and proceeds in a spiral 
     *    towards the center, adding tiles one at a time to the beginning of a 
     *    queue. 
     * 
     *   Once all the grid's tiles have been added to the queue, we go back 
     *    and iterate through the queue (thus reversing the spiral order from 
     *    outside-in to inside-out), calling draw() on each tile. 
     */
    spiralTileLoad: function() {
        var tileQueue = [];
 
        var directions = ["right", "down", "left", "up"];

        var iRow = 0;
        var iCell = -1;
        var direction = OpenLayers.Util.indexOf(directions, "right");
        var directionsTried = 0;
        
        while( directionsTried < directions.length) {

            var testRow = iRow;
            var testCell = iCell;

            switch (directions[direction]) {
                case "right":
                    testCell++;
                    break;
                case "down":
                    testRow++;
                    break;
                case "left":
                    testCell--;
                    break;
                case "up":
                    testRow--;
                    break;
            } 
    
            // if the test grid coordinates are within the bounds of the 
            //  grid, get a reference to the tile.
            var tile = null;
            if ((testRow < this.grid.length) && (testRow >= 0) &&
                (testCell < this.grid[0].length) && (testCell >= 0)) {
                tile = this.grid[testRow][testCell];
            }
            
            if ((tile != null) && (!tile.queued)) {
                //add tile to beginning of queue, mark it as queued.
                tileQueue.unshift(tile);
                tile.queued = true;
                
                //restart the directions counter and take on the new coords
                directionsTried = 0;
                iRow = testRow;
                iCell = testCell;
            } else {
                //need to try to load a tile in a different direction
                direction = (direction + 1) % 4;
                directionsTried++;
            }
        } 
        
        // now we go through and draw the tiles in forward order
        for(var i=0; i < tileQueue.length; i++) {
            var tile = tileQueue[i];
            tile.draw();
            //mark tile as unqueued for the next time (since tiles are reused)
            tile.queued = false;       
        }
    },

    /**
     * APIMethod: addTile
     * Gives subclasses of Grid the opportunity to create an 
     * OpenLayer.Tile of their choosing. The implementer should initialize 
     * the new tile and take whatever steps necessary to display it.
     *
     * Parameters
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.Tile>} The added OpenLayers.Tile
     */
    addTile:function(bounds, position) {
        // Should be implemented by subclasses
    },
    
    /** 
     * Method: addTileMonitoringHooks
     * This function takes a tile as input and adds the appropriate hooks to 
     *     the tile so that the layer can keep track of the loading tiles.
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    addTileMonitoringHooks: function(tile) {
        
        tile.onLoadStart = function() {
            //if that was first tile then trigger a 'loadstart' on the layer
            if (this.numLoadingTiles == 0) {
                this.events.triggerEvent("loadstart");
            }
            this.numLoadingTiles++;
        };
        tile.events.register("loadstart", this, tile.onLoadStart);
      
        tile.onLoadEnd = function() {
            this.numLoadingTiles--;
            this.events.triggerEvent("tileloaded");
            //if that was the last tile, then trigger a 'loadend' on the layer
            if (this.numLoadingTiles == 0) {
                this.events.triggerEvent("loadend");
            }
        };
        tile.events.register("loadend", this, tile.onLoadEnd);
        tile.events.register("unload", this, tile.onLoadEnd);
    },

    /** 
     * Method: removeTileMonitoringHooks
     * This function takes a tile as input and removes the tile hooks 
     *     that were added in addTileMonitoringHooks()
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    removeTileMonitoringHooks: function(tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            scope: this
        });
    },
    
    /**
     * Method: moveGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    moveGriddedTiles: function(bounds) {
        var buffer = this.buffer || 1;
        while (true) {
            var tlLayer = this.grid[0][0].position;
            var tlViewPort = 
                this.map.getViewPortPxFromLayerPx(tlLayer);
            if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        };
    },

    /**
     * Method: shiftRow
     * Shifty grid work
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];

        var resolution = this.map.getResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? grid.pop() : grid.shift();

        for (var i=0; i < modelRow.length; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },

    /**
     * Method: shiftColumn
     * Shift grid work in the other dimension
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.map.getResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0; i<this.grid.length; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];
            
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },
    
    /**
     * Method: removeExcessTiles
     * When the size of the map or the buffer changes, we may need to
     *     remove some excess rows and columns.
     * 
     * Parameters:
     * rows - {Integer} Maximum number of rows we want our grid to have.
     * colums - {Integer} Maximum number of columns we want our grid to have.
     */
    removeExcessTiles: function(rows, columns) {
        
        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
        
        // remove extra columns
        while (this.grid[0].length > columns) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
    },

    /**
     * Method: onMapResize
     * For singleTile layers, this will set a new tile size according to the
     * dimensions of the map pane.
     */
    onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    
    /**
     * APIMethod: getTileBounds
     * Returns The tile bounds for a layer given a pixel location.
     *
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>} The location in the viewport.
     *
     * Returns:
     * {<OpenLayers.Bounds>} Bounds of the tile at the given pixel location.
     */
    getTileBounds: function(viewPortPx) {
        var maxExtent = this.map.getMaxExtent();
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = maxExtent.left + (tileMapWidth *
                                         Math.floor((mapPoint.lon -
                                                     maxExtent.left) /
                                                    tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight *
                                             Math.floor((mapPoint.lat -
                                                         maxExtent.bottom) /
                                                        tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },
    
    CLASS_NAME: "OpenLayers.Layer.Grid"
});
/* ======================================================================
    OpenLayers/Control/Navigation.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/ZoomBox.js
 * @requires OpenLayers/Control/DragPan.js
 * @requires OpenLayers/Handler/MouseWheel.js
 * @requires OpenLayers/Handler/Click.js
 */

/**
 * Class: OpenLayers.Control.Navigation
 * The navigation control handles map browsing with mouse events (dragging,
 *     double-clicking, and scrolling the wheel).  Create a new navigation 
 *     control with the <OpenLayers.Control.Navigation> control.  
 * 
 *     Note that this control is added to the map by default (if no controls 
 *     array is sent in the options object to the <OpenLayers.Map> 
 *     constructor).
 * 
 * Inherits:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.Navigation = OpenLayers.Class(OpenLayers.Control, {

    /** 
     * Property: dragPan
     * {<OpenLayers.Control.DragPan>} 
     */
    dragPan: null,

    /** 
     * Property: zoomBox
     * {<OpenLayers.Control.ZoomBox>}
     */
    zoomBox: null,

    /**
     * APIProperty: zoomWheelEnabled
     * {Boolean} Whether the mousewheel should zoom the map
     */
    zoomWheelEnabled: true, 

    /**
     * Constructor: OpenLayers.Control.Navigation
     * Create a new navigation control
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *                    the control
     */
    initialize: function(options) {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function() {
        this.deactivate();

        if (this.dragPan) {
            this.dragPan.destroy();
        }
        this.dragPan = null;

        if (this.zoomBox) {
            this.zoomBox.destroy();
        }
        this.zoomBox = null;
        OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },
    
    /**
     * Method: activate
     */
    activate: function() {
        this.dragPan.activate();
        if (this.zoomWheelEnabled) {
            this.handlers.wheel.activate();
        }    
        this.handlers.click.activate();
        this.zoomBox.activate();
        return OpenLayers.Control.prototype.activate.apply(this,arguments);
    },

    /**
     * Method: deactivate
     */
    deactivate: function() {
        this.zoomBox.deactivate();
        this.dragPan.deactivate();
        this.handlers.click.deactivate();
        this.handlers.wheel.deactivate();
        return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
    },
    
    /**
     * Method: draw
     */
    draw: function() {
        this.handlers.click = new OpenLayers.Handler.Click(this, 
                                        { 'dblclick': this.defaultDblClick },
                                        {
                                          'double': true, 
                                          'stopDouble': true
                                        });
        this.dragPan = new OpenLayers.Control.DragPan({map: this.map});
        this.zoomBox = new OpenLayers.Control.ZoomBox(
                    {map: this.map, keyMask: OpenLayers.Handler.MOD_SHIFT});
        this.dragPan.draw();
        this.zoomBox.draw();
        this.handlers.wheel = new OpenLayers.Handler.MouseWheel(
                                    this, {"up"  : this.wheelUp,
                                           "down": this.wheelDown} );
        this.activate();
    },

    /**
     * Method: defaultDblClick 
     * 
     * Parameters:
     * evt - {Event} 
     */
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom + 1);
    },

    /**
     * Method: wheelChange  
     *
     * Parameters:
     * evt - {Event}
     * deltaZ - {Integer}
     */
    wheelChange: function(evt, deltaZ) {
        var newZoom = this.map.getZoom() + deltaZ;
        if (!this.map.isValidZoomLevel(newZoom)) {
            return;
        }
        var size    = this.map.getSize();
        var deltaX  = size.w/2 - evt.xy.x;
        var deltaY  = evt.xy.y - size.h/2;
        var newRes  = this.map.baseLayer.getResolutionForZoom(newZoom);
        var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(
                            zoomPoint.lon + deltaX * newRes,
                            zoomPoint.lat + deltaY * newRes );
        this.map.setCenter( newCenter, newZoom );
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
     * Method: disableZoomWheel
     */
    
    disableZoomWheel : function() {
        this.zoomWheelEnabled = false;
        this.handlers.wheel.deactivate();       
    },
    
    /**
     * Method: enableZoomWheel
     */
    
    enableZoomWheel : function() {
        this.zoomWheelEnabled = true;
        if (this.active) {
            this.handlers.wheel.activate();
        }    
    },

    CLASS_NAME: "OpenLayers.Control.Navigation"
});
/* ======================================================================
    OpenLayers/Layer/MapGuide.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * licence.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Ajax.js
 * @requires OpenLayers/Layer/Grid.js
 */

/**
 * Class: OpenLayers.Layer.MapGuide
 * Instances of OpenLayers.Layer.MapGuide are used to display
 * data from a MapGuide OS instance.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.MapGuide = OpenLayers.Class(OpenLayers.Layer.Grid, {

    /** 
     * APIProperty: isBaseLayer
     * {Boolean} Treat this layer as a base layer.  Default is true.
     **/
    isBaseLayer: true,
    
    /** 
     * APIProperty: singleTile
     * {Boolean} use tile server or request single tile image. Note that using
     *    singleTile *and* isBaseLayer false is *not recommend*: it uses synchronous
     *    XMLHttpRequests to load tiles, and this will *lock up users browsers*
     *    during requests.
     **/
    singleTile: false,
    
    /**
     * Constant: TILE_PARAMS
     * {Object} Hashtable of default parameter key/value pairs for tiled layer
     */
    TILE_PARAMS: {
         operation: 'GETTILEIMAGE',
         version: '1.2.0'
    },

    /**
     * Constant: SINGLE_TILE_PARAMS
     * {Object} Hashtable of default parameter key/value pairs for untiled layer
     */
    SINGLE_TILE_PARAMS: {
        operation: 'GETMAPIMAGE',
        format: 'PNG',
        locale: 'en',
        clip: '1',
        version: '1.0.0'
    },
    
    /** 
     * Property: defaultSize
     * {<OpenLayers.Size>} Tile size as produced by MapGuide server
     **/
    defaultSize: new OpenLayers.Size(300,300),

    /**
     * Constructor: OpenLayers.Layer.MapGuide
     * Create a new Mapguide layer, either tiled or untiled.  
     *
     * For tiled layers, the 'groupName' and 'mapDefnition' options 
     * must be specified as options.
     *
     * For untiled layers, specify either combination of 'mapName' and
     * 'session', or 'mapDefinition' and 'locale'.
     *
     * Parameters:
     * name - {String} Name of the layer displayed in the interface
     * url - {String} Location of the MapGuide mapagent executable
     *            (e.g. http://localhost:8008/mapguide/mapagent/mapagent.fcgi)
     * params - {Object} hashtable of additional parameters to use. Some
     *     parameters may require additional code on the serer. The ones that
     *     you may want to use are: 
     *   - mapDefinition - {String} The MapGuide resource definition
     *            (e.g. Library://Samples/Gmap/Maps/gmapTiled.MapDefinition)
     *   - locale - Locale setting 
     *            (for untiled overlays layers only)
     *   - mapName - {String} Name of the map as stored in the MapGuide session.
     *          (for untiled layers with a session parameter only)
     *   - session - { String} MapGuide session ID 
     *            (for untiled overlays layers only)
     *   - basemaplayergroupname - {String} GroupName for tiled MapGuide layers only
     *   - format - Image format to be returned (for untiled overlay layers only)
     *   - showLayers - {String} A comma separated list of GUID's for the
     *       layers to display eg: 'cvc-xcv34,453-345-345sdf'.
     *   - hideLayers - {String} A comma separated list of GUID's for the
     *       layers to hide eg: 'cvc-xcv34,453-345-345sdf'.
     *   - showGroups - {String} A comma separated list of GUID's for the
     *       groups to display eg: 'cvc-xcv34,453-345-345sdf'.
     *   - hideGroups - {String} A comma separated list of GUID's for the
     *       groups to hide eg: 'cvc-xcv34,453-345-345sdf'
     *   - selectionXml - {String} A selection xml string Some server plumbing
     *       is required to read such a value.
     * options - {Ojbect} Hashtable of extra options to tag onto the layer; 
     *          will vary depending if tiled or untiled maps are being requested
     */
    initialize: function(name, url, params, options) {
        
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
        
        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.transparent != "true") && 
                                (this.transparent != true));
        }

        //initialize for untiled layers
        if (this.singleTile) {
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.SINGLE_TILE_PARAMS
                           );
        } else {
            //initialize for tiled layers
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.TILE_PARAMS
                           );
            this.setTileSize(this.defaultSize); 
        }
    },

    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.MapGuide>} An exact clone of this layer
     */
    clone: function (obj) {
      if (obj == null) {
            obj = new OpenLayers.Layer.MapGuide(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
      }
      //get all additions from superclasses
      obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

      return obj;
    },

    /**
     * Method: addTile
     * Creates a tile, initializes it, and adds it to the layer div. 
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
     */
    addTile:function(bounds,position) {
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                         null, this.tileSize);
    },

    /**
     * Method: getURL
     * Return a query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox 
     *                                for the request
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also 
     *          the passed-in bounds and appropriate tile size specified 
     *          as parameters.
     */
    getURL: function (bounds) {
        var url;
        var center = bounds.getCenterLonLat();
        var mapSize = this.map.getCurrentSize();

        if (this.singleTile) {
          //set up the call for GETMAPIMAGE or GETDYNAMICMAPOVERLAY
          var params = {};
          params.setdisplaydpi = OpenLayers.DOTS_PER_INCH;   
          params.setdisplayheight = mapSize.h*this.ratio;
          params.setdisplaywidth = mapSize.w*this.ratio;
          params.setviewcenterx = center.lon;
          params.setviewcentery = center.lat;
          params.setviewscale = this.map.getScale();
          
          if (!this.isBaseLayer) {
            // in this case the main image operation is remapped to this
            this.params.operation = "GETDYNAMICMAPOVERLAYIMAGE";
            
            //but we first need to call GETVISIBLEMAPEXTENT to set the extent
            var getVisParams = {};
            getVisParams.operation = "GETVISIBLEMAPEXTENT";
            getVisParams.version = "1.0.0";
            getVisParams.session = this.params.session;
            getVisParams.mapName = this.params.mapName;
            getVisParams.format = 'text/xml';
            getVisParams = OpenLayers.Util.extend(getVisParams, params);
                
            new OpenLayers.Ajax.Request(this.url, 
                  { parameters: getVisParams,
                    method: 'get',
                    asynchronous: false   //must be synchronous call to return control here
                  });
          }
          
          //construct the full URL
          url = this.getFullRequestString( params );
        } else {

          //tiled version
          var currentRes = this.map.getResolution();
          var colidx = Math.floor((bounds.left-this.maxExtent.left)/currentRes);
          colidx = Math.round(colidx/this.tileSize.w);
          var rowidx = Math.floor((this.maxExtent.top-bounds.top)/currentRes);
          rowidx = Math.round(rowidx/this.tileSize.h);

          url = this.getFullRequestString(
                       {
                           tilecol: colidx,
                           tilerow: rowidx,
                           scaleindex: this.resolutions.length - this.map.zoom - 1
                        });
         }
        
        return url;
    },

    /**
     * Method: getFullRequestString
     * getFullRequestString on MapGuide layers is special, because we 
     * do a regular expression replace on ',' in parameters to '+'.
     * This is why it is subclassed here.
     *
     * Parameters:
     * altUrl - {String} Alternative base URL to use.
     *
     * Returns:
     * {String} A string with the layer's url appropriately encoded for MapGuide
     */
    getFullRequestString:function(newParams, altUrl) {
        // use layer's url unless altUrl passed in
        var url = (altUrl == null) ? this.url : altUrl;
        
        // if url is not a string, it should be an array of strings, 
        //  in which case we will randomly select one of them in order
        //  to evenly distribute requests to different urls.
        if (typeof url == "object") {
            url = url[Math.floor(Math.random()*url.length)];
        }   
        // requestString always starts with url
        var requestString = url;        

        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        // ignore parameters that are already in the url search string
        var urlParams = OpenLayers.Util.upperCaseObject(
                            OpenLayers.Util.getArgs(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        /* MapGuide needs '+' seperating things like bounds/height/width.
           Since typically this is URL encoded, we use a slight hack: we
           depend on the list-like functionality of getParameterString to
           leave ',' only in the case of list items (since otherwise it is
           encoded) then do a regular expression replace on the , characters
           to '+' */
        paramsString = paramsString.replace(/,/g, "+");
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    //serverPath has no ? -- add one
                    requestString += '?' + paramsString;
                } else {
                    //serverPath contains ?, so must already have paramsString at the end
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

    /** 
     * Method: calculateGridLayout
     * Generate parameters for the grid layout. This  
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>}
     * extent - {<OpenLayers.Bounds>}
     * resolution - {Number}
     *
     * Returns:
     * Object containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;
        
        var offsetlat = extent.top - bounds.top + tilelat; 
        var tilerow = Math.floor(offsetlat/tilelat) - this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.top - tilelat*tilerow;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };
    },
    
    CLASS_NAME: "OpenLayers.Layer.MapGuide"
});
/* ======================================================================
    OpenLayers/Layer/MapServer.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/Grid.js
 */

/**
 * Class: OpenLayers.Layer.MapServer
 * Instances of OpenLayers.Layer.MapServer are used to display
 * data from a MapServer CGI instance.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.MapServer = OpenLayers.Class(OpenLayers.Layer.Grid, {

    /**
     * Constant: DEFAULT_PARAMS
     * {Object} Hashtable of default parameter key/value pairs 
     */
    DEFAULT_PARAMS: {
        mode: "map",
        map_imagetype: "png"
    },

    /**
     * Constructor: OpenLayers.Layer.MapServer
     * Create a new MapServer layer object
     *
     * Parameters:
     * name - {String} A name for the layer
     * url - {String} Base url for the MapServer CGI
     *       (e.g. http://www2.dmsolutions.ca/cgi-bin/mapserv)
     * params - {Object} An object with key/value pairs representing the
     *          GetMap query string parameters and parameter values.
     * options - {Ojbect} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);

        if (arguments.length > 0) {
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.DEFAULT_PARAMS
                           );
        }

        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.params.transparent != "true") && 
                                (this.params.transparent != true));
        }
    },

    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.MapServer>} An exact clone of this layer
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.MapServer(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }
        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },

    /**
     * Method: addTile
     * Creates a tile, initializes it, and adds it to the layer div. 
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
     */
    addTile:function(bounds,position) {
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                         null, this.tileSize);
    },
    
    /**
     * Method: getURL
     * Return a query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox 
     *                                for the request
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also 
     *          the passed-in bounds and appropriate tile size specified 
     *          as parameters.
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        // Make a list, so that getFullRequestString uses literal "," 
        var extent = [bounds.left, bounds. bottom, bounds.right, bounds.top];

        var imageSize = this.getImageSize(); 
        
        // make lists, so that literal ','s are used 
        var url = this.getFullRequestString(
                     {mapext:   extent,
                      imgext:   extent,
                      map_size: [imageSize.w, imageSize.h],
                      imgx:     imageSize.w / 2,
                      imgy:     imageSize.h / 2,
                      imgxy:    [imageSize.w, imageSize.h]
                      });
        
        return url;
    },
    
    /** 
     * Method: getFullRequestString
     * combine the layer's url with its params and these newParams. 
     *   
     * Parameter:
     * newParams - {Object} New parameters that should be added to the 
     *                      request string.
     * altUrl - {String} (optional) Replace the URL in the full request  
     *                              string with the provided URL.
     * 
     * Returns: 
     * {String} A string with the layer's url and parameters embedded in it.
     */
    getFullRequestString:function(newParams, altUrl) {
        // use layer's url unless altUrl passed in
        var url = (altUrl == null) ? this.url : altUrl;
        
        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // if url is not a string, it should be an array of strings, 
        // in which case we will deterministically select one of them in 
        // order to evenly distribute requests to different urls.
        if (url instanceof Array) {
            url = this.selectUrl(paramsString, url);
        }   
        
        // ignore parameters that are already in the url search string
        var urlParams = OpenLayers.Util.upperCaseObject(
                            OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // requestString always starts with url
        var requestString = url;        

        // MapServer needs '+' seperating things like bounds/height/width.
        //   Since typically this is URL encoded, we use a slight hack: we
        //  depend on the list-like functionality of getParameterString to
        //  leave ',' only in the case of list items (since otherwise it is
        //  encoded) then do a regular expression replace on the , characters
        //  to '+'
        //
        paramsString = paramsString.replace(/,/g, "+");
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    //serverPath has no ? -- add one
                    requestString += '?' + paramsString;
                } else {
                    //serverPath contains ?, so must already have paramsString at the end
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

    CLASS_NAME: "OpenLayers.Layer.MapServer"
});
/* ======================================================================
    OpenLayers/Layer/WMS.js
   ====================================================================== */

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.WMS
 * Instances of OpenLayers.Layer.WMS are used to display data from OGC Web
 *     Mapping Services. Create a new WMS layer with the <OpenLayers.Layer.WMS>
 *     constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.WMS = OpenLayers.Class(OpenLayers.Layer.Grid, {

    /**
     * Constant: DEFAULT_PARAMS
     * {Object} Hashtable of default parameter key/value pairs 
     */
    DEFAULT_PARAMS: { service: "WMS",
                      version: "1.1.1",
                      request: "GetMap",
                      styles: "",
                      exceptions: "application/vnd.ogc.se_inimage",
                      format: "image/jpeg"
                     },
    
    /**
     * Property: reproject
     * *Deprecated*. See http://trac.openlayers.org/wiki/SphericalMercator
     * for information on the replacement for this functionality. 
     * {Boolean} Try to reproject this layer if its coordinate reference system
     *           is different than that of the base layer.  Default is true.  
     *           Set this in the layer options.  Should be set to false in 
     *           most cases.
     */
    reproject: false,
 
    /**
     * APIProperty: isBaseLayer
     * {Boolean} Default is true for WMS layer
     */
    isBaseLayer: true,
    
    /**
     * APIProperty: encodeBBOX
     * {Boolean} Should the BBOX commas be encoded? The WMS spec says 'no', 
     * but some services want it that way. Default false.
     */
    encodeBBOX: false,
 
    /**
     * Constructor: OpenLayers.Layer.WMS
     * Create a new WMS layer object
     *
     * Example:
     * (code)
     * var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {layers: "modis,global_mosaic"});
     * (end)
     *
     * Parameters:
     * name - {String} A name for the layer
     * url - {String} Base url for the WMS
     *                (e.g. http://wms.jpl.nasa.gov/wms.cgi)
     * params - {Object} An object with key/value pairs representing the
     *                   GetMap query string parameters and parameter values.
     * options - {Ojbect} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        //uppercase params
        params = OpenLayers.Util.upperCaseObject(params);
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );


        //layer is transparent        
        if (this.params.TRANSPARENT && 
            this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            
            // unless explicitly set in options, make layer an overlay
            if ( (options == null) || (!options.isBaseLayer) ) {
                this.isBaseLayer = false;
            } 
            
            // jpegs can never be transparent, so intelligently switch the 
            //  format, depending on teh browser's capabilities
            if (this.params.FORMAT == "image/jpeg") {
                this.params.FORMAT = OpenLayers.Util.alphaHack() ? "image/gif"
                                                                 : "image/png";
            }
        }

    },    

    /**
     * Method: destroy
     * Destroy this layer
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.WMS>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * Method: getURL
     * Return a GetMap query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox for the
     *                                request.
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters.
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        
        var imageSize = this.getImageSize(); 
        var newParams = {
            'BBOX': this.encodeBBOX ?  bounds.toBBOX() : bounds.toArray(),
            'WIDTH': imageSize.w,
            'HEIGHT': imageSize.h
        };
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },

    /**
     * Method: addTile
     * addTile creates a tile, initializes it, and adds it to the layer div. 
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
     */
    addTile:function(bounds,position) {
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                         null, this.tileSize);
    },

    /**
     * APIMethod: mergeNewParams
     * Catch changeParams and uppercase the new params to be merged in
     *     before calling changeParams on the super class.
     * 
     *     Once params have been changed, we will need to re-init our tiles.
     * 
     * Parameters:
     * newParams - {Object} Hashtable of new params to use
     */
    mergeNewParams:function(newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, 
                                                             newArguments);
    },

    /** 
     * Method: getFullRequestString
     * Combine the layer's url with its params and these newParams. 
     *   
     *     Add the SRS parameter from projection -- this is probably
     *     more eloquently done via a setProjection() method, but this 
     *     works for now and always.
     *
     * Parameters:
     * newParams - {Object}
     * altUrl - {String} Use this as the url instead of the layer's url
     * 
     * Returns:
     * {String} 
     */
    getFullRequestString:function(newParams, altUrl) {
        var projectionCode = this.map.getProjection();
        this.params.SRS = (projectionCode == "none") ? null : projectionCode;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },

    CLASS_NAME: "OpenLayers.Layer.WMS"
});
