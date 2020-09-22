const qLoader = {
    /**
     * 所需组件加载队列
     * Required components loading queue
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    
    loadQueues : function() {
        var _this        = this;
        var settings     = this.settings;
        var loadPath     = settings.path;
                      
        var loadFlowChartOrSequenceDiagram = function() {
            if (editormd.isIE8) 
            {
                _this.loadedDisplay();
                return ;
            }

            if (settings.flowChart || settings.sequenceDiagram) 
            {
                editormd.loadScript(loadPath + "raphael.min", function() {

                    editormd.loadScript(loadPath + "underscore.min", function() {  

                        if (!settings.flowChart && settings.sequenceDiagram) 
                        {
                            editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                _this.loadedDisplay();
                            });
                        }
                        else if (settings.flowChart && !settings.sequenceDiagram) 
                        {      
                            editormd.loadScript(loadPath + "flowchart.min", function() {  
                                editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                    _this.loadedDisplay();
                                });
                            });
                        }
                        else if (settings.flowChart && settings.sequenceDiagram) 
                        {  
                            editormd.loadScript(loadPath + "flowchart.min", function() {  
                                editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                    editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                        _this.loadedDisplay();
                                    });
                                });
                            });
                        }
                    });

                });
            } 
            else
            {
                _this.loadedDisplay();
            }
        }; 

        editormd.loadCSS(loadPath + "codemirror/codemirror.min");
        
        if (settings.searchReplace && !settings.readOnly)
        {
            editormd.loadCSS(loadPath + "codemirror/addon/dialog/dialog");
            editormd.loadCSS(loadPath + "codemirror/addon/search/matchesonscrollbar");
        }
        
        if (settings.codeFold)
        {
            editormd.loadCSS(loadPath + "codemirror/addon/fold/foldgutter");            
        }
        
        editormd.loadScript(loadPath + "codemirror/codemirror.min", function() {
            editormd.$CodeMirror = CodeMirror;
            
            editormd.loadScript(loadPath + "codemirror/modes.min", function() {
                
                editormd.loadScript(loadPath + "codemirror/addons.min", function() {
                    
                    _this.setCodeMirror();
                    
                    if (settings.mode !== "gfm" && settings.mode !== "markdown") 
                    {
                        _this.loadedDisplay();
                        
                        return false;
                    }
                    
                    _this.setToolbar();

                    editormd.loadScript(loadPath + "marked.min", function() {

                        editormd.$marked = marked;
                            
                        if (settings.previewCodeHighlight) 
                        {
                            editormd.loadScript(loadPath + "prettify.min", function() {
                                loadFlowChartOrSequenceDiagram();
                            });
                        } 
                        else
                        {                  
                            loadFlowChartOrSequenceDiagram();
                        }
                    });
                    
                });
                
            });
            
        });

        return this;
    },

    /**
     * 加载队列完成之后的显示处理
     * Display handle of the module queues loaded after.
     * 
     * @param   {Boolean}   recreate   是否为重建编辑器
     * @returns {editormd}             返回editormd的实例对象
     */
    
    loadedDisplay : function(recreate) {
        console.log(`==== load display`);
        recreate             = recreate || false;
        
        var _this            = this;
        var editor           = this.editor;
        var preview          = this.preview;
        var settings         = this.settings;
        
        this.containerMask.hide();
        
        this.save();
        
        if (settings.watch) {
            preview.show();
        }
        
        editor.data("oldWidth", editor.width()).data("oldHeight", editor.height()); // 为了兼容Zepto
        
        this.resize();
        this.registerKeyMaps();
        
        $(window).resize(function(){
            _this.resize();
        });
        
        this.bindScrollEvent().bindChangeEvent();
        
        if (!recreate)
        {
            $.proxy(settings.onload, this)();
        }
        
        this.state.loaded = true;

        return this;
    },
};