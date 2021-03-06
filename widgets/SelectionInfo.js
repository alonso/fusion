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
