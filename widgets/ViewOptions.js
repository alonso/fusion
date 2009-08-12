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
