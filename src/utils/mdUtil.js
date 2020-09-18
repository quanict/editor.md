

var mdUtil = {
    // extend: function(ctor, superCtor)
	// {
	// 	var f = function() {};
	// 	f.prototype = superCtor.prototype;
		
	// 	ctor.prototype = new f();
	// 	ctor.prototype.constructor = ctor;
    // },

    cloneMethod: (obj, superObj)=>{
        return Object.assign({}, obj, superObj);
    },
    
    appendMethod: function(ojb){
        Object.keys(ojb).forEach((f) => {
            this[f] = ojb[f];
        });
    },

    appendPrototype: function(obj, superObj){
        let source = superObj.prototype;
        let old = obj.prototype;
        console.log(`====`,{obj, source, old})
        obj.prototype = {...obj.prototype, ...superObj.prototype};
    },

    /**
     * Get a random integer in the specified interval
     *
     * @return {Int} int Returns a randomly generated integer
     */
    rand : function (n, m) {
        var c = m - n + 1;
    
        return Math.floor(Math.random() * c + n);
    }
};



