/**
 * Fusion.Widget.TaskPane
 *
 * $Id: TaskPane.js 1591 2008-10-10 15:24:02Z madair $
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
 * Class: Fusion.Widget.TaskPane
 *
 * A utility widget that holds output from other widgets.
 ****************************************************************************/


Fusion.Widget.TaskPane = OpenLayers.Class(Fusion.Widget,
{
    aExecutedTasks: null,   //array of URLs for tasks execcuted in the TaskPane
    nCurrentTask: 0,
    nTasks: 0,
    homeAction: null,
    prevAction: null,
    nextAction: null,
    
    initialize : function(widgetTag)
    {
        //console.log('TaskPane.initialize');

        Fusion.Widget.prototype.initialize.apply(this, [widgetTag, true]);
        
        this.aExecutedTasks = [];
        this.defHomeIcon = 'images/icon_home.png';
        this.defPrevTaskIcon = 'images/icon_back.png';
        this.defNextTaskIcon = 'images/icon_forward.png';
        this.defTaskListIcon = 'images/icon_tasks.png';
        this.defInitialTask = widgetTag.location + 'TaskPane/TaskPane.html';
              
        var json = widgetTag.extension;
       
        
        if (json.InitialTask) {
            this.initialTask = taskURL = json.InitialTask[0];
        } else {
            this.initialTask = Fusion.getFusionURL() + this.defInitialTask;
        }
        
        if (json.MenuContainer) {
            this.menuName = json.MenuContainer[0];
        }
        
        var divName = 'TaskNav';
        var tmpDiv = document.createElement('div');
        tmpDiv.setAttribute('id', divName);
        this.toolbar = new Jx.Toolbar(tmpDiv,{left:0});

        this.homeAction = new Jx.Action(OpenLayers.Function.bind(this.goHome, this));
        this.toolbar.add(new Jx.Button(this.homeAction, 
            {
            image: this.defHomeIcon, 
            tooltip: OpenLayers.i18n('taskHome')
            }
        ));

        this.prevAction = new Jx.Action(OpenLayers.Function.bind(this.gotoPrevTask, this));
        this.toolbar.add(new Jx.Button(this.prevAction, 
            {
            image: this.defPrevTaskIcon, 
            tooltip: OpenLayers.i18n('prevTask')
            }
        ));

        this.nextAction = new Jx.Action(OpenLayers.Function.bind(this.gotoNextTask, this));
        this.toolbar.add(new Jx.Button(this.nextAction, 
            {
            image: this.defNextTaskIcon, 
            tooltip: OpenLayers.i18n('nextTask')
            }
        ));

        this.taskMenu = new Jx.Menu({image: this.defTaskListIcon, 
                    label: OpenLayers.i18n('taskList'), 
                    right:0});
        Element.addClassName(this.taskMenu.domObj, 'taskMenu');
        Element.addClassName(this.taskMenu.button.domObj, 'jxButtonContentLeft');
        this.toolbar.add(this.taskMenu);
        
        var iframeName = this.sName+'_IFRAME';
        this.iframe = document.createElement('iframe');
        new Jx.Layout(this.iframe);
        this.iframe.setAttribute('name', iframeName);
        this.iframe.setAttribute('id', iframeName);
        this.iframe.setAttribute('frameborder', 0);
        this.iframe.style.border = '0px solid #fff';
        this.oTaskPane = new Jx.Panel({toolbar: tmpDiv, 
                      label: OpenLayers.i18n('taskPane'), 
                      content: this.iframe
        });
        Element.addClassName(this.domObj, 'taskPanePanel');
        Fusion.addWidgetStyleSheet(widgetTag.location + 'TaskPane/TaskPane.css');
        
        this.domObj.appendChild(this.oTaskPane.domObj);
        //we need to trigger an initial resize after the panel
        //is added to the DOM
        this.oTaskPane.domObj.resize();
        
        Fusion.registerForEvent(Fusion.Event.FUSION_INITIALIZED, OpenLayers.Function.bind(this.setTaskMenu, this));
        this.getMap().registerForEvent(Fusion.Event.MAP_LOADED, OpenLayers.Function.bind(this.setContent, this,this.initialTask));
    },
    
    updateButtons: function() {
        this.prevAction.setEnabled(this.nCurrentTask > 0);
        this.nextAction.setEnabled(this.nCurrentTask < this.aExecutedTasks.length - 1);
    },
    
    gotoPrevTask: function() {
        this.nCurrentTask = this.nCurrentTask>0 ? --this.nCurrentTask : 0;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    gotoNextTask: function() {
        this.nCurrentTask = this.nCurrentTask<this.aExecutedTasks.length-1 ? 
                          ++this.nCurrentTask : this.aExecutedTasks.length-1;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    goHome: function() {
        this.nCurrentTask = 0;
        this.iframe.src = this.aExecutedTasks[this.nCurrentTask];
        this.updateButtons();
    },

    setContent: function(url) {
        if (this.nCurrentTask < this.aExecutedTasks.length) {
            this.aExecutedTasks.splice(this.nCurrentTask, this.aExecutedTasks.length - this.nCurrentTask);
        }
        
        this.aExecutedTasks.push(url);
        ++this.nCurrentTask;
        this.iframe.src = url;
        this.iframe.taskPaneId = this.widgetTag.name;
        this.updateButtons();
    },

    /**
     * Creates a list of tasks to be included in the task menu, once all widgets 
     * have been created.
     *
     */
    setTaskMenu : function() {
        if (this.menuName) {
            var container = this.getMap().widgetSet.getContainerByName(this.menuName);
            if (container) {
                container.createWidgets(this.getMap().widgetSet, this.taskMenu);
            }
        }
    }
   
});
