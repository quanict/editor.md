class HeadingRenderder extends EditorRenderer {

    execute(text, level) {
        let {markdownToC, headerPrefix } = this.config;
        var _headingIds     = [];
        var linkText       = text;
        var hasLinkReg     = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
        // var getLinkTextReg = /\s*\<a\s*([^\>]+)\>([^\>]*)\<\/a\>\s*/g;

        if (hasLinkReg.test(text)) 
        {
            var tempText = [];
            text         = text.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);

            for (var i = 0, len = text.length; i < len; i++)
            {
                tempText.push(text[i].replace(/\s*href\=\"(.*)\"\s*/g, ""));
            }

            text = tempText.join(" ");
        }
        
        text = editormd.trim(text);
        
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

        var toc = {
            text  : text,
            level : level,
            slug  : escapedText
        };
        
        var isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
        var id        = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");

        if (_headingIds.indexOf(id) >= 0) {
            id += editormd.rand(100, 999999);
        }

        _headingIds.push(id);

        toc.id = id;

        markdownToC.push(toc);
        
        var headingHTML = "<h" + level + " id=\"h"+ level + "-" + headerPrefix + id +"\">";
        
        headingHTML    += "<a name=\"" + text + "\" class=\"reference-link\"></a>";
        headingHTML    += "<span class=\"header-link octicon octicon-link\"></span>";
        headingHTML    += (hasLinkReg) ? this.atLink(this.emoji(linkText)) : this.atLink(this.emoji(text));
        headingHTML    += "</h" + level + ">";
        console.log(`render header`)
        return headingHTML;
    }
}