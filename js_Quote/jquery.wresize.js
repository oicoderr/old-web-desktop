var onWindowResize = function(){
    //事件队列
    var queue = [],

        indexOf = Array.prototype.indexOf || function(){
                var i = 0, length = this.length;
                for( ; i < length; i++ ){
                    if(this[i] === arguments[0]){
                        return i;
                    }
                }

                return -1;
            };

    var isResizing = {}, //标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中 window.onresize 事件多次执行的 bug
        lazy = true, //懒执行标记

        listener = function(e){ //事件监听器
            var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight,
                w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

            if( h === isResizing.h && w === isResizing.w){
                return;

            }else{
                e = e || window.event;

                var i = 0, len = queue.length;
                for( ; i < len; i++){
                    queue[i].call(this, e);
                }

                isResizing.h = h,
                    isResizing.w = w;
            }
        }

    return {
        add: function(fn){
            if(typeof fn === 'function'){
                if(lazy){ //懒执行
                    if(window.addEventListener){
                        window.addEventListener('resize', listener, false);
                    }else{
                        window.attachEvent('onresize', listener);
                    }

                    lazy = false;
                }

                queue.push(fn);
            }else{  }

            return this;
        },
        remove: function(fn){
            if(typeof fn === 'undefined'){
                queue = [];
            }else if(typeof fn === 'function'){
                var i = indexOf.call(queue, fn);

                if(i > -1){
                    queue.splice(i, 1);
                }
            }

            return this;
        }
    };
}.call(this);