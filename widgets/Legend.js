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
