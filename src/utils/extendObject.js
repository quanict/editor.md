const editorExtendObject = {
    /**
     * 扩展当前实例对象，可同时设置多个或者只设置一个
     * Extend editormd instance object, can mutil setting.
     * 
     * @returns {editormd}                  this(editormd instance object.)
     */
    
    extend : function() {
        if (typeof arguments[1] !== "undefined")
        {
            if (typeof arguments[1] === "function")
            {
                arguments[1] = $.proxy(arguments[1], this);
            }

            this[arguments[0]] = arguments[1];
        }
        
        if (typeof arguments[0] === "object" && typeof arguments[0].length === "undefined")
        {
            $.extend(true, this, arguments[0]);
        }

        return this;
    },
    
    /**
     * 设置或扩展当前实例对象，单个设置
     * Extend editormd instance object, one by one
     * 
     * @param   {String|Object}   key       option key
     * @param   {String|Object}   value     option value
     * @returns {editormd}                  this(editormd instance object.)
     */
    
    set : function (key, value) {
        
        if (typeof value !== "undefined" && typeof value === "function")
        {
            value = $.proxy(value, this);
        }
        
        this[key] = value;

        return this;
    },
};