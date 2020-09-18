const editorCursor = {
    /**
     * 聚焦光标位置
     * Focusing the cursor position
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    focus : function() {
        this.cm.focus();
        return this;
    },
    
    /**
     * 设置光标的位置
     * Set cursor position
     * 
     * @param   {Object}    cursor 要设置的光标位置键值对象，例：{line:1, ch:0}
     * @returns {editormd}         返回editormd的实例对象
     */
    
    setCursor : function(cursor) {
        this.cm.setCursor(cursor);
        return this;
    },
    
    /**
     * 获取当前光标的位置
     * Get the current position of the cursor
     * 
     * @returns {Cursor}         返回一个光标Cursor对象
     */
    
    getCursor : function() {
        return this.cm.getCursor();
    },
};