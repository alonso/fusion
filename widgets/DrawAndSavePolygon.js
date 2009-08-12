/**
 * Fusion.Widget.DrawAndSavePolygon
 *
 * $Id: SelectPolygon.js 1462 2008-08-21 13:57:06Z madair $
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
 * Class: Fusion.Widget.FooWidget
 *
 * My first from zero custom widget
 * 
 * **********************************************************************/


Fusion.Widget.DrawAndSavePolygon = OpenLayers.Class(Fusion.Widget, Fusion.Tool.Canvas, Fusion.Tool.ButtonBase,
{
	/**
	 * Árbol con poligonios
	 */
	oTree: null,
    
    saveShapes: null,
    
    selectionType: 'INTERSECTS',
    
    nTolerance : 3, //default pixel tolernace for a point click
    
    nShapes: 0,
    
    currentShape: null,
    
    shapeItem: null,
    
    shapeFinished: true,
    
    avoidFusionBug: false,
    
    POLYGON: 'polygon',
    
    LINE: 'line',
    
    POINT: 'point',

    initialize : function(widgetTag) {
        //console.log('Select.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        Fusion.Tool.Canvas.prototype.initialize.apply(this, []);
        Fusion.Tool.ButtonBase.prototype.initialize.apply(this, []);
        
        this.asCursor = ['auto'];
        
        this.nShapes = 0;
        this.shape = null;

        /* Not forget to manage the xml file.
         * var json = widgetTag.extension;
         */
        this.drawPolygon = new Jx.Button(
        		this.buttonAction = new Jx.Action(OpenLayers.Function.bind(this.activateDrawPoligon, this)),
        		{id: 'drawPolygonButton',
        	     imgPath: 'images/icons/draw_polygon_button.png'}
        		);
        this.drawLine = new Jx.Button(
        		this.buttonAction = new Jx.Action(OpenLayers.Function.bind(this.activateDrawLine, this)),
        		{id: 'drawLineButton',
        	     imgPath: 'images/icons/draw_line_button.png'}
        		);
        this.drawPoint = new Jx.Button(
        		this.buttonAction = new Jx.Action(OpenLayers.Function.bind(this.activateDrawPoint, this)),
        		{id: 'drawPointButton',
        	     imgPath: 'images/icons/draw_point_button.png'}
        		);
        this.savePolygons = new Jx.Button(
        		new Jx.Action(OpenLayers.Function.bind(this.openSaveDialog, this)),
        		{id: 'savePolygonButton',
        		 imgPath: 'images/icons/file-save.png'}
        		);
        var splitV = new Jx.Splitter(
        		this.domObj,
        		{layout: 'vertical',
                 containerOptions: [{height: 28}]
                });
        this.tBar = new Jx.Toolbar(splitV.elements[0]);
        this.tBar.add(this.drawPolygon,
        		      this.drawLine,
        		      this.drawPoint,
        		      this.savePolygons);
        
        this.oTree =new Jx.Tree(splitV.elements[1]);
        this.tFolder = new Jx.TreeFolder({label: 'Mis Polígonos'});
        this.oTree.append(this.tFolder);
        this.tFolder.checkBox = document.createElement('input');
        this.tFolder.checkBox.type = 'checkbox';
        this.tFolder.domObj.insertBefore(this.tFolder.checkBox, this.tFolder.domObj.childNodes[1]);
        this.tFolder.expand();
        
        this.currentShape = null;
		this.currentNode = null;
		this.currentSegTo = null;
		this.currentSegFrom = null;
		this.currentSegment = null;
		this.currentSegmentIndex = null;
		this.isMouseDown = false;
        
        this.dialogContentURL = Fusion.getFusionURL() + widgetTag.location + 'DrawAndSavePolygon/DrawAndSavePolygon.html';
        this.dialogLabelContentURL = Fusion.getFusionURL() + widgetTag.location + 'DrawAndSavePolygon/DrawAndSavePolygonLabel.html';
        this.savedFolder = '';
        Fusion.addWidgetStyleSheet(widgetTag.location + 'DrawAndSavePolygon/DrawAndSavePolygon.css');
        Fusion.addWidgetStyleSheet(widgetTag.location + 'DrawAndSavePolygon/DrawAndSavePolygonLabel.css');
        
        this.getMap().registerForEvent(Fusion.Event.MAP_EXTENTS_CHANGED,
        		                       OpenLayers.Function.bind(this.extentsChanged, this));
    },
    
    activate : function(){},
    
    deactivate : function(){
    	this.deactivateCanvas();
        this.getMap().setCursor('auto');
    },

    activateDrawPoligon: function() {
    	if(!this.shapeFinished)
    		return;
    	this.activateCanvas();
        this.getMap().setCursor(this.asCursor);
        this.shapeFinished = false;
        this.shapeItem = new Jx.TreeItem({label:' '});
        this.currentShape = new Fusion.Tool.Canvas.Polygon(this.getMap());
        /**
         * @FIXME Es mejor usar instanceof
         */
        this.currentShape.type = this.POLYGON;
        this.shapeItem.shape = this.currentShape;
        this.shapeItem.textField = document.createElement('input');
        this.shapeItem.textField.type = 'text';
//        Event.observe(this.shapeItem.textField, 
//        		      'click',
//        		      function(){alert('ayy!!!');});
        this.shapeItem.textField.value = 'polygon';
        this.shapeItem.textField.size = 10;
        this.shapeItem.domObj.insertBefore(this.shapeItem.textField, 
        		                           this.shapeItem.domObj.childNodes[2]);
        this.shapeItem.checkBox = document.createElement('input');
        this.shapeItem.checkBox.type = 'checkbox';
        Event.observe(this.shapeItem.checkBox, 
        		      'click',
        		      OpenLayers.Function.bind(this.drawChecked, this));
        this.shapeItem.checkBox.checked = true;
        this.shapeItem.domObj.insertBefore(this.shapeItem.checkBox, 
        		                           this.shapeItem.domObj.childNodes[1]);
        this.tFolder.append(this.shapeItem);
        this.isDigitizing = false;
        this.drawChecked();
        
    },
    
    activateDrawLine: function() {
    	if(!this.shapeFinished)
    		return;
    	this.activateCanvas();
        this.getMap().setCursor(this.asCursor);
        this.shapeFinished = false;
        this.shapeItem = new Jx.TreeItem({label: ' '});
        this.currentShape = new Fusion.Tool.Canvas.Line(this.getMap());
        this.currentShape.type = this.LINE;
        this.shapeItem.shape = this.currentShape;
        this.shapeItem.textField = document.createElement('input');
        this.shapeItem.textField.type = 'text';
//        Event.observe(this.shapeItem.textField, 
//        		      'click',
//        		      function(){alert('ayy!!!');});
        this.shapeItem.textField.value = 'line';
        this.shapeItem.textField.size = 10;
        this.shapeItem.domObj.insertBefore(this.shapeItem.textField, 
        		                           this.shapeItem.domObj.childNodes[2]);
        this.shapeItem.checkBox = document.createElement('input');
        this.shapeItem.checkBox.type = 'checkbox';
        Event.observe(this.shapeItem.checkBox, 
        		      'click',
        		      OpenLayers.Function.bind(this.drawChecked, this));
        this.shapeItem.checkBox.checked = true;
        this.shapeItem.domObj.insertBefore(this.shapeItem.checkBox, 
        		                           this.shapeItem.domObj.childNodes[1]);
        this.tFolder.append(this.shapeItem);
        this.isDigitizing = false;
        this.drawChecked();
        
    },
    
    activateDrawPoint: function() {
    	if(!this.shapeFinished)
    		return;
    	this.activateCanvas();
        this.getMap().setCursor(this.asCursor);
        this.shapeFinished = false;
        this.shapeItem = new Jx.TreeItem({label: ' '});
        this.currentShape = new Fusion.Tool.Canvas.Point(this.getMap());
        this.currentShape.type = this.POINT;
        this.shapeItem.shape = this.currentShape;
        this.shapeItem.textField = document.createElement('input');
        this.shapeItem.textField.type = 'text';
//        Event.observe(this.shapeItem.textField, 
//        		      'click',
//        		      function(){alert('ayy!!!');});
        this.shapeItem.textField.value = 'point';
        this.shapeItem.textField.size = 10;
        this.shapeItem.domObj.insertBefore(this.shapeItem.textField, 
        		                           this.shapeItem.domObj.childNodes[2]);
        this.shapeItem.checkBox = document.createElement('input');
        this.shapeItem.checkBox.type = 'checkbox';
        Event.observe(this.shapeItem.checkBox, 
        		      'click',
        		      OpenLayers.Function.bind(this.drawChecked, this));
        this.shapeItem.checkBox.checked = true;
        this.shapeItem.domObj.insertBefore(this.shapeItem.checkBox, 
        		                           this.shapeItem.domObj.childNodes[1]);
        this.tFolder.append(this.shapeItem);
        this.isDigitizing = false;
        this.drawChecked();
        
    },
    
    extentsChanged: function(e) {
        var charCode = (e.charCode ) ? e.charCode : ((e.keyCode) ? e.keyCode : e.which);
        if (this.nShapes > 0) {
        	this.resizeShapes();
        } 
    },
    
    /**
     * (public) mouseDown(e)
     *
     * handle the mouse down event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseDown: function(e) {
        //console.log('SelectRadius.mouseDown');
    	if(this.shapeFinished && this.currentSegment == null){
    		this.isMouseDown = true;
    		return;
    	}
        if (Event.isLeftClick(e)) {
            var p = this.getMap().getEventPosition(e);
            if(this.currentSegment != null){
            	var point = this.getMap().pixToGeo(p.x, p.y);
//            	alert(this.currentShape.segments.length);
    			var nextSegments = this.currentShape.segments.splice(this.currentSegmentIndex+1);
//    			alert(nextSegments.length+" "+this.currentShape.segments.length+" "+this.currentSegmentIndex);
    			this.currentShape.segments.pop();
    			var node = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
    			var newSeg1 = new Fusion.Tool.Canvas.Segment(this.currentSegment.from,
                                                             node);
    			var newSeg2 = new Fusion.Tool.Canvas.Segment(node,
    					                                     this.currentSegment.to);
    			this.currentShape.segments.push(newSeg1);
    			this.currentShape.segments.push(newSeg2);
    			this.currentShape.segments = this.currentShape.segments.concat(nextSegments);
    			this.drawChecked();
    		}
            else if (!this.isDigitizing) {            		
                var point = this.getMap().pixToGeo(p.x, p.y);
//                var proj = new OpenLayers.Projection("EPSG:4326");
//                var lonLat = new OpenLayers.LonLat(point.x, point.y);
//                var mercPoint = lonLat.transform(proj, this.oMap.oMapOL.getProjectionObject());
//                alert("projection = "+this.oMap.oMapOL.projection+" x = "+lonLat.lon+" y = "+lonLat.lat+
//                		" merc x = "+mercPoint.lon+" merc y = "+mercPoint.lat);
                if(this.currentShape.type == this.POINT){
                	this.currentShape.setPoint(point.x, point.y);
                	this.drawChecked();
                    this.shapeFinished = this.isDigitizing = true;
                    this.getMap().setCursor('auto');
                    return;
                }
                var from = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var to = new Fusion.Tool.Canvas.Node(point.x,point.y, this.getMap());
                var seg = new Fusion.Tool.Canvas.Segment(from,to);
                seg.setEditing(true);
                this.currentShape.addSegment(seg);
                this.drawChecked();
                this.isDigitizing = true;
            } else {
            	var seg = this.currentShape.lastSegment();
            	//El problema de doble Click => 2 mouse down
            	if(seg.from.px == seg.to.px && seg.from.py == seg.to.py)
            		return;
                seg.setEditing(false);
                seg = this.currentShape.extendLine();
                seg.setEditing(true);
                this.drawChecked();
            }
        }
    },
    
    mouseUp: function(e) {
    	this.isMouseDown = false;
    },
    /**
     * (public) mouseMove(e)
     *
     * handle the mouse move event
     *
     * @param e Event the event that happened on the mapObj
     */
    mouseMove: function(e) {
        //console.log('SelectRadius.mouseMove');
        if (!this.isDigitizing) {
        	return;
        }
        if(this.shapeFinished){
        	var p = this.getMap().getEventPosition(e);
        	if(this.isMouseDown){
        		if(this.currentShape == null)
        			return;
        		else{
        			if(this.currentShape.type == this.POINT){
        				var nodes = this.currentShape.getNodes(); 
        				nodes[0].setPx(p.x, p.y);
        				this.currentShape.updateGeo();
        			}
        			else{
        				var pxTo = this.currentSegTo != null? this.currentSegTo.to.px : -1;
        				var pyTo = this.currentSegTo != null? this.currentSegTo.to.py : -1;
        				var pxFrom = this.currentSegFrom != null? this.currentSegFrom.from.px : -1;
        				var pyFrom = this.currentSegFrom != null? this.currentSegFrom.from.py : -1;
        				if(this.currentSegTo != null){
        					this.currentSegTo.to.setPx(p.x,p.y);
        					this.currentSegTo.to.updateGeo();
        				}
        				if(this.currentSegFrom != null){
        					this.currentSegFrom.from.setPx(p.x,p.y);
        					this.currentSegFrom.from.updateGeo();
        				}
        				if(!this.verifyValidity(this.currentShape, this.currentSegTo) ||
        						!this.verifyValidity(this.currentShape, this.currentSegFrom)){
        					if(this.currentSegTo != null){
        						this.currentSegTo.to.setPx(pxTo,pyTo);
        						this.currentSegTo.to.updateGeo();
        					}
        					if(this.currentSegFrom != null){
        						this.currentSegFrom.from.setPx(pxFrom,pyFrom);
        						this.currentSegFrom.from.updateGeo();
        					}	
        				}
        			}
        		}
        	}
        	else{
        		var o = this.nearShapePoint(p);
        		if(o != null){
        			this.currentShape = o.shape;
        			this.currentNode = o.node;
        			if(this.currentShape.type == this.POINT)
        				this.currentNode.setSelected(true);
        			else{
        				if(this.currentSegTo != null)
        					this.currentSegTo.setEditing(false);
        				this.currentSegTo = o.segTo;
        				if(this.currentSegTo != null)
        					this.currentSegTo.setEditing(true);
        				if(this.currentSegFrom != null)
        					this.currentSegFrom.setEditing(false);
        				this.currentSegFrom = o.segFrom;
        				if(this.currentSegFrom != null)
        					this.currentSegFrom.setEditing(true);
        			}
        		}
        		else{
        			o = this.nearShapeSegment(p);
        			if(o!= null){
        				this.currentShape = o.shape;
            			this.currentSegment = o.segment;
            			this.currentSegmentIndex = o.index;
            			this.currentSegment.setEditing(true);
        			}
        			else{
            			if(this.currentShape != null &&
            					this.currentNode != null &&
            					this.currentShape.type == this.POINT)
            				this.currentNode.setSelected(false);
            			this.currentShape = null;
            			this.currentNode = null;
            			if(this.currentSegTo != null)
            				this.currentSegTo.setEditing(false);
            			this.currentSegTo = null;
            			if(this.currentSegFrom != null)
            				this.currentSegFrom.setEditing(false);
            			if(this.currentSegment != null)
            				this.currentSegment.setEditing(false);
            			this.currentSegment = null;
            			this.currentSegFrom = null;
            			this.currentSegmentIndex = null;
            		}	
        		}
        	}
        	this.drawChecked();
        	return;
        }
        var p = this.getMap().getEventPosition(e);
        //Si el poligono necesariamente no será válido no lo dibujo
        if(!this.verifySoftValidity(this.currentShape, p))
        	return;
        var seg = this.currentShape.lastSegment();
        seg.to.setPx(p.x,p.y);
        seg.to.updateGeo();
        this.drawChecked();
    },
    
    /**
     * (public) dblClick(e)
     *
     * handle the mouse dblclick event
     *
     * @param e Event the event that happened on the mapObj
     */
    dblClick: function(e) {
        //console.log('Digitizer.dblClick');
        if (!this.isDigitizing || this.shapeFinished) {
            return;
        }
        this.event = e;
        var p = this.getMap().getEventPosition(e);
        this.currentShape.segments.pop(); //x el famoso doble click => 2 mouse down
        this.currentShape.lastSegment().setEditing(true);
//        alert("p.x = "+p.x+" p.y = "+p.y);
        //Si el poligono no es valido no se puede terminar
        if(this.currentShape.type == this.POLYGON && 
           !this.verifyStrongValidity(this.currentShape, p)){
        	this.currentShape.lastSegment().setEditing(true);
        	this.drawChecked();
        	return;
        }
        var point = this.getMap().pixToGeo(p.x, p.y);
        var seg = this.currentShape.lastSegment();
        seg.setEditing(false);
        this.currentShape = null;
        seg.to.set(point.x, point.y);
        this.drawChecked();
        this.shapeFinished = true;
        this.getMap().setCursor('auto');
    },
    
    openSaveDialog: function() {
        if (!this.dialog) {
            var size = Element.getPageDimensions();
            var o = {
                title: OpenLayers.i18n('Guardar Polígono'),
                id: 'drawAndSavePolygon',
                contentURL : this.dialogContentURL,
                onContentLoaded: OpenLayers.Function.bind(this.contentLoaded, this),
                imageBaseUrl: null,
                width: 250,
                height: 170,
                modal: true,
                resizeable: false,
                top: (size.height-170)/2,
                left: (size.width-250)/2,
                buttons: ['Guardar', 'Cancelar'],
                handler: OpenLayers.Function.bind(this.handler, this)
            };
            this.dialog = new Jx.Dialog(o);
            
        }
        this.dialog.open();
    },
    
    contentLoaded: function(dialog) {
        dialog.registerIds(['dialogDrawAndSavePolygonKml',
                            'dialogDrawAndSavePolygonGml',
                            'dialogDrawAndSavePolygonShp'],
                            dialog.content);
        dialog.getObj('dialogDrawAndSavePolygonKml').checked = 'false';
        dialog.getObj('dialogDrawAndSavePolygonGml').checked = 'false';
        dialog.getObj('dialogDrawAndSavePolygonShp').checked = 'false';

    },
    
    handler: function(button) {
        if (button == 'Guardar') {
            this.kml = this.dialog.getObj('dialogDrawAndSavePolygonKml').checked;
            this.gml = this.dialog.getObj('dialogDrawAndSavePolygonGml').checked;
            this.shp = this.dialog.getObj('dialogDrawAndSavePolygonShp').checked;
            this.save();
            
        }
        this.dialog.close();
    },

    /**
     *  
     **/
    save : function() {
    	var jsonPoly = this.shapesToJson();
    	alert(jsonPoly);
    	var jsonFormats = this.getFormatsJson();
    	var options = {
    			parameters: {
    		      'locale': Fusion.locale,
    		      'mapfile': this.oMap.aMaps[0].sMapFile,
    		      'ROIRENDERER': jsonPoly,
    		      'formats': jsonFormats
    	        },
                'onComplete': function(r){
    	        	var o;
//    	        	alert(r.responseText);
    	        	eval("o="+r.responseText);
    	        	window.open(o.value ,'Bajar archivo','');
    	        }
            };
    	var aMaps = this.getMap().getAllMaps();
        var saveScript = aMaps[0].arch + '/' + Fusion.getScriptLanguage() + "/Save." + Fusion.getScriptLanguage();
        Fusion.ajaxRequest(saveScript, options);
    },
    
    resizeShapes: function (type){
    	var fun = function(value, node){
    		node.shape.updatePx();
        }
        var filter = function(node){
        	return true;
        }
        this.fold(fun, filter);
        this.drawChecked();
    },
    
    selectedShapes: function (type){
    	var shapeToString = OpenLayers.Function.bind(this.shapeToString, this);
    	var fun = function(value, node){
    		return shapeToString(node.shape, type);
        }
        var filter = function(node){
        	return node.checkBox.checked;
        }
        return this.fold(fun, filter);
    },
    
    nearShapePoint: function(point){
    	var tolerance = this.nTolerance;
    	var POINT = this.POINT;
    	fun = function(last, node){
    		var shape = node.shape;
    		var nodes = shape.getNodes();
    		for(var i = 0; i<nodes.length; i++){
    			if(nodes[i].near(point, tolerance)){
    				var o = {'shape': shape,
    						 'node': nodes[i],
    						 'segTo': shape.type == POINT? null : shape.segmentTo(nodes[i]),
    						 'segFrom': shape.type == POINT? null : shape.segmentFrom(nodes[i])};
    				return o;
    			}
    		}
    		return last;
        }
    	var filter = function(node){
        	return node.checkBox.checked;
        }
        return this.fold(fun, filter, null);
    },
    
    nearShapeSegment: function(point){
    	var tolerance = this.nTolerance;
    	var POINT = this.POINT;
    	fun = function(last, node){
    		var shape = node.shape;
    		if(shape.type == POINT)
    			return last;
    		var segments = shape.segments;
    		for(var i = 0; i<segments.length; i++){
    			if(segments[i].intersectsPoint(point, tolerance+1)){
    				var o = {'shape': shape,
    						 'segment': segments[i],
    						 'index': i};
    				return o;
    			}
    		}
    		return last;
        }
    	var filter = function(node){
        	return node.checkBox.checked;
        }
        return this.fold(fun, filter, null);
    },
    
    shapesToJson: function(){
    	var fun = function(last){
    		return 1+last;
    	}
    	var filter = function(node){
        	return node.checkBox.checked;
        }
    	var nChecked = this.fold(fun, filter, 0);
    	var i = 0;
    	var shapeToJson = OpenLayers.Function.bind(this.shapeToJson, this);
    	fun = function(last, node){
    		var json = (i==0?'{"':'"')+i+'": {'+
                         '"type": "'+node.shape.type+'", '+ //puede tener más sentido incluir mucho de esto en shapeToJson
                         '"aGeoCoords": '+shapeToJson(node.shape)+', '+
    		             '"label": "'+node.textField.value+'"} '+
    		            (i==nChecked-1?'}':', ');
        	i++;
        	return last+json;
        }
        return this.fold(fun, filter, '');
    },
    
    shapeToJson: function(shape){
    	var json = '{';
    	var nodes = shape.getNodes();
    	for (var i=0; i<nodes.length-1; i++)
    		json += '"'+(2*i)+'": '+nodes[i].x+', '+
    		        '"'+(2*i+1)+'": '+nodes[i].y+', ';
    	json += '"'+(2*(nodes.length-1))+'": '+nodes[nodes.length-1].x+', '+
    	        '"'+(2*(nodes.length-1)+1)+'": '+nodes[nodes.length-1].y+'}';
    	return json;
    },
    
    shapeToString : function(shape, type){
    	if(type == 'kml'){
    		var kml = '<Placemark><name>polygon</name>'+
                      '<description></description>'+
                      '<styleUrl>#linecolour</styleUrl>'+
                      '<LineString>'+
                      '<tessellate>1</tessellate><altitudeMode>clampToGround</altitudeMode>'+
                      '<coordinates>';
    		var nodes = shape.getNodes();
    		for (var i=0; i<nodes.length; i++) {
    			kml += nodes[i].x+', '+nodes[i].y+', 0 ';
    		}
    		kml += nodes[0].x+', '+nodes[0].y+', 0';
    		kml += '</coordinates></LineString></Placemark>';
    		return kml;
    	}
    	if(type == 'gml'){
    		return '';
    	}
    	if(type == 'shp'){
    		var shp = '';
    		var nodes = shape.getNodes();
    		for (var i=0; i<nodes.length; i++) {
    			kml += nodes[i].x+' '+nodes[i].y;
    		}
    		kml += nodes[0].x+' '+nodes[0].y+' 0';
    		return shp;
    	}
    },
    
    setParameter : function(param, value) {
        if (param == "Tolerance" && value > 0) {
            this.nTolerance = value;
        }
        if (param == 'SelectionType') {
            this.selectionType = value;
        }
    },
    
    /**
     * (protected) fold(fun, filter, init)
     *
     * La típica fold de programación funcional que se aplica sobre 
     * el "árbol" this.tFolder
     * @param fun Function Función que se aplicará a cada nodo
     * @param filter Function Función para discriminar si el nodo será considerado
     * @param init Object valor inicial
     * @return Object 
     */
    fold: function(fun, filter, init){
    	var ans = init;
    	for(var i = 0; i<this.tFolder.nodes.length; i++)
    		if(filter(this.tFolder.nodes[i]))
    			ans = fun(ans, this.tFolder.nodes[i]); // Si this.tFolder.nodes[i] no fuese hojas habría que aplicar fold recursivamente sobr él
    	return ans;
    },
    
    drawChecked: function(){
    	this.clearContext();
    	var context = this.context;
    	var POINT = this.POINT;
    	var fun = function(last, node){
    		if(node.shape.type == POINT){
    			var nodes = node.shape.getNodes();
    			nodes[0].draw(context);
    		}
    		else
    			node.shape.draw(context);
        }
        var filter = function(node){
        	return node.checkBox.checked;
        }
        this.fold(fun, filter);
    },
    
    getFormatsJson: function(){
    	var json = '{"kml": '+this.kml+', '+
    	            '"gml": '+this.gml+', '+
    	            '"shp": '+this.shp+
    	           '}';
    	return json;
    },
    
    /**
     * (public) verifySoftValidity(shape, p)
     *
     * Chequea si el polígono puede llegar ser válido
     * @param Polygon (Line??) 
     * @param filter Function Función para discriminar si el nodo será considerado
     * @param init Object valor inicial
     * @return Object 
     */
    verifyValidity: function(shape, segment){
    	if(shape.type == this.POINT)
    		return true;
        var segments = shape.segments;
        if(segment == null){
    		var segment = new Fusion.Tool.Canvas.Segment(shape.lastSegment().to,
    				                                 segments[0].from);
    	}
//        alert("revisando "+(shape.segments.length-2)+"segmentos");
        //no chequeamos el último segmento
        var lastSeg = new Fusion.Tool.Canvas.Segment(shape.lastSegment().to,
                                                     segments[0].from)
        if(shape.type == this.POLYGON)
            segments.push(lastSeg);
        var l = segments.length;
//        alert(l+" "+((-1)%l))
        for(var i = 0; i<l; i++)
        	if(segments[i].to != segment.to &&
        			segments[i].to != segment.from &&
        			segments[i].from != segment.to &&
        			segments[i].from != segment.from &&
        			segments[i].intersectsSegment(segment)){
//        		alert("El segmento "+segments[i].toString()+"\n intersecta con "+segment.toString());
        		if(shape.type == this.POLYGON)
        		    segments.pop();
        		return false;
        	}
        if(shape.type == this.POLYGON)
            segments.pop();
        return true;
    },
    
    verifySoftValidity: function(shape, p){
    	var lastSeg = shape.lastSegment();
        var seg = new Fusion.Tool.Canvas.Segment(lastSeg.from,
        		                                 new Fusion.Tool.Canvas.Node(p.x,
        		                                		                     p.y,
        		                                		                     this.oMap));
        seg.to.setPx(p.x,p.y);
        var segments = shape.segments;
//        alert("revisando "+(shape.segments.length-2)+"segmentos");
        //no chequeamos el último segmento
        for(var i = 0; i<segments.length-2; i++)
        	if(segments[i].intersectsSegment(seg)){
//        		alert("El segmento "+segments[i].toString()+"\n intersecta con "+seg.toString());
        		return false;
        	}
        return true;
    },
    
    verifyStrongValidity: function(shape, p){
//    	if(!this.verifySoftValidity(shape, p))  //por construcción no es necesario
//    	    return false;
        var segments = shape.segments;
        var seg = new Fusion.Tool.Canvas.Segment(segments[0].from,
        		                                 new Fusion.Tool.Canvas.Node(p.x,
        		                                		                     p.y,
        		                                		                     this.oMap));
        seg.to.setPx(p.x, p.y);
//        alert(seg.toString());
        //no chequeamos el primer segmento
        for(var i = 1; i<segments.length-1; i++)
        	if(segments[i].intersectsSegment(seg)){
//        		alert("El segmento "+i+" "+segments[i].toString()+"\n intersecta con "+seg.toString());
        		return false;
        	}
        return true;
    }
});
