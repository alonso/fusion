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
