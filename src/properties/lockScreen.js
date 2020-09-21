const editorLockScreen = {
    /**
     * 锁屏
     * lock screen
     * 
     * @param   {Boolean}    lock    Boolean 布尔值，是否锁屏
     * @returns {editormd} Returns the instance object of editormd
     */
    
    // lockScreen : function(lock) {
    //     editormd.lockScreen(lock);
    //     this.resize();
    //     return this;
    // },

      /**
     * 锁屏
     * lock screen
     * 
     * @param   {Boolean}   lock   Boolean 布尔值，是否锁屏
     * @returns {void}
     */
    lockScreen : function(lock) {
        $("html,body").css("overflow", (lock) ? "hidden" : "");
    }
};
