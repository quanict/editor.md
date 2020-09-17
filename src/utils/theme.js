
var editorTheme = {

    // Editor.md themes, change toolbar themes etc.
    // added @1.5.0
    themes        : ["default", "dark"],
    
    // Preview area themes
    // added @1.5.0
    previewThemes : ["default", "dark"],

     // CodeMirror / editor area themes
    // @1.5.0 rename -> editorThemes, old version -> themes
    editorThemes : [
        "default", "3024-day", "3024-night",
        "ambiance", "ambiance-mobile",
        "base16-dark", "base16-light", "blackboard",
        "cobalt",
        "eclipse", "elegant", "erlang-dark",
        "lesser-dark",
        "mbo", "mdn-like", "midnight", "monokai",
        "neat", "neo", "night",
        "paraiso-dark", "paraiso-light", "pastel-on-dark",
        "rubyblue",
        "solarized",
        "the-matrix", "tomorrow-night-eighties", "twilight",
        "vibrant-ink",
        "xq-dark", "xq-light"
    ],

    /**
     * 设置 Editor.md 的整体主题，主要是工具栏
     * Setting Editor.md theme
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    setTheme : function(theme) {
        var editor      = this.editor;
        var oldTheme    = this.settings.theme;
        var themePrefix = this.classPrefix + "theme-";
        
        editor.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);
        
        this.settings.theme = theme;
        
        return this;
    },

    /**
     * 设置 CodeMirror（编辑区）的主题
     * Setting CodeMirror (Editor area) theme
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    setEditorTheme : function(theme){  
        var settings   = this.settings;  
        settings.editorTheme = theme;  
        
        if (theme !== "default")
        {
            editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
        }
        
        this.cm.setOption("theme", theme);
        
        return this;
    },

    /**
     * 设置 Editor.md 的主题
     * Setting Editor.md theme
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    
    setPreviewTheme : function(theme) {  
        var preview     = this.preview;
        var oldTheme    = this.settings.previewTheme;
        var themePrefix = this.classPrefix + "preview-theme-";
        
        preview.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);
        
        this.settings.previewTheme = theme;
        
        return this;
    },
};
