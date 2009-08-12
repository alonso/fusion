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
});