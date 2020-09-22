;(function(factory) {
    "use strict";

	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory();
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
	{
        if (define.amd) // for Require.js
        {
            /* Require.js define replace */
        }
        else 
        {
		    define(["jquery"], factory);  // for Sea.js
        }
	}
	else
	{
        window.editormd = factory();
	}

}(function() {  

    /* Require.js assignment replace */

    "use strict";

    var $ = (typeof (window.jQuery) !== "undefined") ? window.jQuery : window.Zepto;

	if (typeof ($) === "undefined") {
		return ;
	}

    /**
     * editormd
     * 
     * @param   {String} id           ID of the editor element
     * @param   {Object} options      Configuration options Key/Value
     * @returns {Object} editormd     返回editormd对象
     */
    
    var editormd         = function (id, options) {
        return new editormd.fn.init(id, options);
    };
    

    editormd.title        = editormd.$name = editormdTitle;
    editormd.version      = "1.5.0";
    editormd.homePage     = "https://pandao.github.io/editor.md/";
    editormd.classPrefix  = editorClassPrefix;
    
    editormd.toolbarModes = {
        full : [
            "undo", "redo", "|", 
            "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|", 
            "h1", "h2", "h3", "h4", "h5", "h6", "|", 
            "list-ul", "list-ol", "hr", "|",
            "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|",
            "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|",
            "help", "info"
        ],
        simple : [
            "undo", "redo", "|", 
            "bold", "del", "italic", "quote", "uppercase", "lowercase", "|", 
            "h1", "h2", "h3", "h4", "h5", "h6", "|", 
            "list-ul", "list-ol", "hr", "|",
            "watch", "preview", "fullscreen", "|",
            "help", "info"
        ],
        mini : [
            "undo", "redo", "|",
            "watch", "preview", "|",
            "help", "info"
        ]
    };
    
    editormd.defaults     = editorDefault;
    
    editormd.classNames  = {
        tex : editormd.classPrefix + "tex"
    };

    editormd.dialogZindex = 99999;
    
    editormd.$katex       = null;
    editormd.$marked      = null;
    editormd.$CodeMirror  = null;
    editormd.$prettyPrint = null;
    var timer, flowchartTimer;

    editormd.prototype    = editormd.fn = {
        state : {
            watching   : false,
            loaded     : false,
            preview    : false,
            fullscreen : false
        },
        
        /**
         * 构造函数/实例初始化
         * Constructor / instance initialization
         * 
         * @param   {String}   id            编辑器的ID
         * @param   {Object}   [options={}]  配置选项 Key/Value
         * @returns {editormd}               返回editormd的实例对象
         */
        
        init : function (id, options) {
            options              = options || {};
            if (typeof id === "object")
            {
                options = id;
            }
            
            var classPrefix      = this.classPrefix  = editormd.classPrefix; 
            var settings         = $.extend(true, {}, editormd.defaults, options);

            if (options.imageFormats) {
                settings.imageFormats = options.imageFormats;
            }

            if (options.emojiCategories) {
                settings.emojiCategories = options.emojiCategories;
            }

            // this.settings        = settings;

            var editor;
            if( id instanceof HTMLElement ){
                let element = id;
                editor           = this.editor       = $(element);
                id               = element.id.length > 0 ? element.id : settings.id;
            } else {
                id               = (typeof id === "object") ? settings.id : id;
                editor           = this.editor       = $("#" + id);
            }

            this.id              = id;
            this.lang            = settings.lang;

            var classNames       = this.classNames   = {
                textarea : {
                    html     : classPrefix + "html-textarea",
                    markdown : classPrefix + "markdown-textarea"
                }
            };
            
            settings.pluginPath = (settings.pluginPath === "") ? settings.path + "../plugins/" : settings.pluginPath; 
            
            this.state.watching = (settings.watch) ? true : false;
            
            if ( !editor.hasClass("editormd") ) {
                editor.addClass("editormd");
            }
            
            editor.css({
                width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
                height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
            });
            
            if (settings.autoHeight)
            {
                editor.css("height", "auto");
            }
                        
            var markdownTextarea = this.markdownTextarea = editor.children("textarea");
            
            if (markdownTextarea.length < 1)
            {
                editor.append("<textarea></textarea>");
                markdownTextarea = this.markdownTextarea = editor.children("textarea");
            }
            
            markdownTextarea.addClass(classNames.textarea.markdown).attr("placeholder", settings.placeholder);
            
            if (typeof markdownTextarea.attr("name") === "undefined" || markdownTextarea.attr("name") === "")
            {
                markdownTextarea.attr("name", (settings.name !== "") ? settings.name : id + "-markdown-doc");
            }
            console.log(`===`, { markdownTextarea });
            if (typeof markdownTextarea.get(0).dataset.imgPath !== 'undefined') {
                settings.imgPath = markdownTextarea.get(0).dataset.imgPath;
            }
            var appendElements = [
                (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",
                ( (settings.saveHTMLToTextarea) ? "<textarea class=\"" + classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "" ),
                "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
                "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
                "<div class=\"" + classPrefix + "mask\"></div>"
            ].join("\n");
            
            editor.append(appendElements).addClass(classPrefix + "vertical");
            
            if (settings.theme !== "") 
            {
                editor.addClass(classPrefix + "theme-" + settings.theme);
            }
            
            this.mask          = editor.children("." + classPrefix + "mask");    
            this.containerMask = editor.children("." + classPrefix  + "container-mask");
            
            if (settings.markdown !== "")
            {
                markdownTextarea.val(settings.markdown);
            }
            
            if (settings.appendMarkdown !== "")
            {
                markdownTextarea.val(markdownTextarea.val() + settings.appendMarkdown);
            }
            
            this.htmlTextarea     = editor.children("." + classNames.textarea.html);            
            this.preview          = editor.children("." + classPrefix + "preview");
            this.previewContainer = this.preview.children("." + classPrefix + "preview-container");
            
            if (settings.previewTheme !== "") 
            {
                this.preview.addClass(classPrefix + "preview-theme-" + settings.previewTheme);
            }
            
            if (typeof define === "function" && define.amd)
            {
                if (typeof window.katex !== "undefined") 
                {
                    editormd.$katex = window.katex;
                }
                
                if (settings.searchReplace && !settings.readOnly) 
                {
                    editormd.loadCSS(settings.path + "codemirror/addon/dialog/dialog");
                    editormd.loadCSS(settings.path + "codemirror/addon/search/matchesonscrollbar");
                }
            }

            editormd.settings = settings;
            this.settings = settings;

            if ((typeof define === "function" && define.amd) || !settings.autoLoadModules)
            {
                if (typeof window.CodeMirror !== "undefined") {
                    editormd.$CodeMirror = window.CodeMirror;
                }

                if (typeof window.marked !== "undefined") {
                    editormd.$marked = window.marked;
                }

                this.setCodeMirror().setToolbar().loadedDisplay();
            } 
            else
            {
                this.loadQueues();
            }
            // editorTheme.call(this);

            
            return this;
        },
        
        /**
         * 跳转到指定的行
         * Goto CodeMirror line
         * 
         * @param   {String|Intiger}   line      line number or "first"|"last"
         * @returns {editormd}                   返回editormd的实例对象
         */
        
        gotoLine : editorGotoLine,
        
        
        /**
         * 重新配置
         * Resetting editor options
         * 
         * @param   {String|Object}   key       option key
         * @param   {String|Object}   value     option value
         * @returns {editormd}                  this(editormd instance object.)
         */
        
        config : function(key, value) {
            var settings = editormd.settings;
            
            if (typeof key === "object")
            {
                settings = $.extend(true, settings, key);
            }
            
            if (typeof key === "string")
            {
                settings[key] = value;
            }
            
            this.settings = settings;
            this.recreate();
            return this;
        },
        
        
        /**
         * Parse & Saving Markdown source code
         * @returns {editormd} Returns the instance object of editormd
         */
        
        save : editorSave
    };

    editormd.fn.appendMethod = mdUtil.appendMethod;

    editormd.fn.appendMethod(editorKatex);
    editormd.fn.appendMethod(editorCodeMirror);

    // extend theme prototypes
    editormd.fn = Object.assign({}, editormd.fn, editorWatching);
    editormd.fn = Object.assign({}, editormd.fn, editorDialog);
    editormd.fn = Object.assign({}, editormd.fn, editorToolbar);
    editormd.fn = Object.assign({}, editormd.fn, editorTheme);
    editormd.fn = Object.assign({}, editormd.fn, editorPreview);
    editormd.fn = Object.assign({}, editormd.fn, editorSearch);
    editormd.fn = Object.assign({}, editormd.fn, editorContent);
    editormd.fn = Object.assign({}, editormd.fn, editorSelection);
    editormd.fn = Object.assign({}, editormd.fn, editorEvents);
    editormd.fn = Object.assign({}, editormd.fn, editorFlowChart);
    editormd.fn = Object.assign({}, editormd.fn, editorHighlight);
    editormd.fn = Object.assign({}, editormd.fn, editorDimension);
    editormd.fn = Object.assign({}, editormd.fn, editorPlugin);
    editormd.fn = Object.assign({}, editormd.fn, editorCursor);
    editormd.fn = Object.assign({}, editormd.fn, editorExtendObject);
    editormd.fn = Object.assign({}, editormd.fn, qKeyMap);
    editormd.fn = Object.assign({}, editormd.fn, qLoader);

    editormd.fn.init.prototype = editormd.fn; 

    // editormd = Object.assign(editormd, editorToolbarHandlers);
    // editormd = Object.assign(editormd, editorKeyMaps);
    // editormd = Object.assign(editormd, editorString);
    
    editormd.appendMethod = mdUtil.appendMethod;

    editormd.appendMethod(editorToolbarHandlers);
    editormd.appendMethod(editorKeyMaps);
    editormd.appendMethod(editorString);
    editormd.appendMethod(editorCodeTree);

    // editormd.urls = {
    //     atLinkBase : "https://github.com/"
    // };
    
    editormd.regexs = regexConst;

    // Emoji graphics files url path
    editormd.emoji     = {
        path  : "https://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/",
        ext   : ".png"
    };

    // Twitter Emoji (Twemoji)  graphics files url path    
    editormd.twemoji = {
        path : "http://twemoji.maxcdn.com/36x36/",
        ext  : ".png"
    };

    /**
     * 自定义marked的解析器
     * Custom Marked renderer rules
     * 
     * @param   {Array}    markdownToC     传入用于接收TOC的数组
     * @returns {Renderer} markedRenderer  返回marked的Renderer自定义对象
     */
    editormd.markedRenderer = markedRenderer;
    
    /**
     * Filter custom html tags
     * 
     * @param   {String}   html          要过滤HTML
     * @param   {String}   filters       要过滤的标签
     * @returns {String}   html          返回过滤的HTML
     */
    editormd.filterHTMLTags = editorFilterHTMLTags;
    
    /**
     * Parse Markdown to HTML for Font-end preview.
     * 
     * @param   {String}   id            用于显示HTML的对象ID
     * @param   {Object}   [options={}]  配置选项，可选
     * @returns {Object}   div           返回jQuery对象元素
     */
    
    editormd.markdownToHTML = editorMarkdownToHTML;
    editormd.isIE    = (navigator.appName == "Microsoft Internet Explorer");
    editormd.isIE8   = (editormd.isIE && navigator.appVersion.match(/8./i) == "8.");

    // editormd = Object.assign(editormd, editorTableOfContent);
    // editormd = Object.assign(editormd, editorLoader);
    // editormd = Object.assign(editormd, editorKatex);
    editormd.appendMethod(editorTableOfContent); 
    editormd.appendMethod(editorLoader); 
    editormd.appendMethod(editorKatex); 

    editormd.appendMethod(editorLockScreen);
    editormd.appendMethod(editorMouseEvents); 
    editormd.appendMethod(editorDate); 

    /**
     * 动态创建对话框
     * Creating custom dialogs
     * 
     * @param   {Object} options 配置项键值对 Key/Value
     * @returns {dialog} 返回创建的dialog的jQuery实例对象
     */

    editormd.createDialog = editorCreateDialog;
    // editormd = Object.assign(editormd, editorDate);

    return editormd;

}));

(function ( $ ) {
 
    var shade = "#556b2f";
 
    $.fn.editormd = function(options) {
        let containter = this.get(0);
        if( containter ){
            console.log('plugin create editor',{containter})
            return editormd(containter,options);
        }
    };
 
}( jQuery ));
