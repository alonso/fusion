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
