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
