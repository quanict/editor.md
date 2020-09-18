/**
 * 跳转到指定的行
 * Goto CodeMirror line
 * 
 * @param   {String|Intiger}   line      line number or "first"|"last"
 * @returns {editormd}                   返回editormd的实例对象
 */

function editorGotoLine(line) {
    var settings = this.settings;
            
    if (!settings.gotoLine)
    {
        return this;
    }
    
    var cm       = this.cm;
    var count    = cm.lineCount();
    var preview  = this.preview;
    
    if (typeof line === "string")
    {
        if(line === "last")
        {
            line = count;
        }
    
        if (line === "first")
        {
            line = 1;
        }
    }
    
    if (typeof line !== "number") 
    {  
        alert("Error: The line number must be an integer.");
        return this;
    }
    
    line  = parseInt(line) - 1;
    
    if (line > count)
    {
        alert("Error: The line number range 1-" + count);
        
        return this;
    }
    
    cm.setCursor( {line : line, ch : 0} );
    
    var scrollInfo   = cm.getScrollInfo();
    var clientHeight = scrollInfo.clientHeight; 
    var coords       = cm.charCoords({line : line, ch : 0}, "local");
    
    cm.scrollTo(null, (coords.top + coords.bottom - clientHeight) / 2);
    
    if (settings.watch)
    {            
        var cmScroll  = this.codeMirror.find(".CodeMirror-scroll")[0];
        var height    = $(cmScroll).height(); 
        var scrollTop = cmScroll.scrollTop;         
        var percent   = (scrollTop / cmScroll.scrollHeight);

        if (scrollTop === 0)
        {
            preview.scrollTop(0);
        } 
        else if (scrollTop + height >= cmScroll.scrollHeight - 16)
        { 
            preview.scrollTop(preview[0].scrollHeight);                    
        } 
        else
        {                    
            preview.scrollTop(preview[0].scrollHeight * percent);
        }
    }

    cm.focus();
    
    return this;
}