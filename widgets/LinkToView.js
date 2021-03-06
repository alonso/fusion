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
