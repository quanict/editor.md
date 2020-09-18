/**
 * 动态创建对话框
 * Creating custom dialogs
 * 
 * @param   {Object} options 配置项键值对 Key/Value
 * @returns {dialog} 返回创建的dialog的jQuery实例对象
 */

function editorCreateDialog(options) {
    var defaults = {
        name : "",
        width : 420,
        height: 240,
        title : "",
        drag  : true,
        closed : true,
        cached : false,
        content : "",
        mask : true,
        maskStyle : {
            backgroundColor : "#fff",
            opacity : 0.1
        },
        lockScreen : true,
        footer : true,
        buttons : false
    };

    options          = $.extend(true, defaults, options);
    
    var $this        = this;
    var editor       = this.editor;
    var classPrefix  = editormd.classPrefix;
    var guid         = (new Date()).getTime();
    var dialogName   = ( (options.name === "") ? classPrefix + "dialog-" + guid : options.name);
    var html         = "<div class=\"" + classPrefix + "dialog " + dialogName + "\">";

    if (options.title !== "")
    {
        html += "<div class=\"" + classPrefix + "dialog-header\"" + ( (options.drag) ? " style=\"cursor: move;\"" : "" ) + ">";
        html += "<strong class=\"" + classPrefix + "dialog-title\">" + options.title + "</strong>";
        html += "</div>";
    }

    if (options.closed)
    {
        html += "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>";
    }

    html += "<div class=\"" + classPrefix + "dialog-container\">" + options.content;                    

    if (options.footer || typeof options.footer === "string") 
    {
        html += "<div class=\"" + classPrefix + "dialog-footer\">" + ( (typeof options.footer === "boolean") ? "" : options.footer) + "</div>";
    }

    html += "</div>";
    html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-bg\"></div>";
    html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-con\"></div>";
    html += "</div>";

    editor.append(html);

    var dialog = editor.find("." + dialogName);

    dialog.lockScreen = function(lock) {
        if (options.lockScreen)
        {                
            $("html,body").css("overflow", (lock) ? "hidden" : "");
            $this.resize();
        }

        return dialog;
    };

    dialog.showMask = function() {
        if (options.mask)
        {
            editor.find("." + classPrefix + "mask").css(options.maskStyle).css("z-index", editormd.dialogZindex - 1).show();
        }
        return dialog;
    };

    dialog.hideMask = function() {
        if (options.mask)
        {
            editor.find("." + classPrefix + "mask").hide();
        }

        return dialog;
    };

    dialog.loading = function(show) {                        
        var loading = dialog.find("." + classPrefix + "dialog-mask");
        loading[(show) ? "show" : "hide"]();

        return dialog;
    };

    dialog.lockScreen(true).showMask();

    dialog.show().css({
        zIndex : editormd.dialogZindex,
        border : (editormd.isIE8) ? "1px solid #ddd" : "",
        width  : (typeof options.width  === "number") ? options.width + "px"  : options.width,
        height : (typeof options.height === "number") ? options.height + "px" : options.height
    });

    var dialogPosition = function(){
        dialog.css({
            top    : ($(window).height() - dialog.height()) / 2 + "px",
            left   : ($(window).width() - dialog.width()) / 2 + "px"
        });
    };

    dialogPosition();

    $(window).resize(dialogPosition);

    dialog.children("." + classPrefix + "dialog-close").bind("click", function() {
        dialog.hide().lockScreen(false).hideMask();

        if (!options.cached) {
            dialog.remove();
        }
    });

    if (typeof options.buttons === "object")
    {
        var footer = dialog.footer = dialog.find("." + classPrefix + "dialog-footer");

        for (var key in options.buttons)
        {
            var btn = options.buttons[key];
            var btnClassName = classPrefix + key + "-btn";

            footer.append("<button class=\"" + classPrefix + "btn " + btnClassName + "\">" + btn[0] + "</button>");
            btn[1] = $.proxy(btn[1], dialog);
            footer.children("." + btnClassName).bind("click", btn[1]);
        }
    }

    if (options.title !== "" && options.drag)
    {                        
        var posX, posY;
        var dialogHeader = dialog.children("." + classPrefix + "dialog-header");

        if (!options.mask) {
            dialogHeader.bind("click", function(){
                editormd.dialogZindex += 2;
                dialog.css("z-index", editormd.dialogZindex);
            });
        }

        var userCanSelect = function (obj) {
            obj.removeClass(classPrefix + "user-unselect").off("selectstart");
        };

        var userUnselect = function (obj) {
            obj.addClass(classPrefix + "user-unselect").on("selectstart", function() { // selectstart for IE                        
                return false;
            });
        };

        var moveAction = function (e) {
            e = e || window.event;  //IE

            var left, top, nowLeft = parseInt(dialog[0].style.left), nowTop = parseInt(dialog[0].style.top);

            if( nowLeft >= 0 ) {
                if( nowLeft + dialog.width() <= $(window).width()) {
                    left = e.clientX - posX;
                } else {	
                    left = $(window).width() - dialog.width();
                    document.onmousemove = null;
                }
            } else {
                left = 0;
                document.onmousemove = null;
            }

            if( nowTop >= 0 ) {
                top = e.clientY - posY;
            } else {
                top = 0;
                document.onmousemove = null;
            }


            document.onselectstart = function() {
                return false;
            };

            userUnselect($("body"));
            userUnselect(dialog);
            dialog[0].style.left = left + "px";
            dialog[0].style.top  = top + "px";
        };

        dialogHeader.mousedown(function(e) {
            e = e || window.event;  //IE
            posX = e.clientX - parseInt(dialog[0].style.left);
            posY = e.clientY - parseInt(dialog[0].style.top);

            document.onmousemove = moveAction;                   
        });

        document.onmouseup = function() {                            
            userCanSelect($("body"));
            userCanSelect(dialog);

            document.onselectstart = null;         
            document.onmousemove = null;
        };

        dialogHeader.touchDraggable = function() {
            var offset = null;
            var start  = function(e) {
                var orig = e.originalEvent; 
                var pos  = $(this).parent().position();

                offset = {
                    x : orig.changedTouches[0].pageX - pos.left,
                    y : orig.changedTouches[0].pageY - pos.top
                };
            };

            var move = function(e) {
                e.preventDefault();
                var orig = e.originalEvent;

                $(this).parent().css({
                    top  : orig.changedTouches[0].pageY - offset.y,
                    left : orig.changedTouches[0].pageX - offset.x
                });
            };

            this.bind("touchstart", start).bind("touchmove", move);
        };

        dialogHeader.touchDraggable();
    }

    editormd.dialogZindex += 2;

    return dialog;
}