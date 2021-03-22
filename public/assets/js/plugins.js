// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function(window) {
    var Cache = function( name ) {
        var _this = this;
        this.name = name || 'globalCache';
        this._c = {};
        console.log( 'new cache: ' + this.name );
        storage.get( 'cache.' + this.name, function( x ) {
            if( x != null ) {
                for (var i = x.length - 1; i >= 0; i--) {
                    _this._c[x[i]] = undefined;
                };
            }
        });
    };
    Cache.prototype._raw = function( key, cb ) {
        if( !this._c[key] ) {
            var _this = this;
            window.storage.get( this._key( key ), function( x ) {
                cb( _this._c[key] = new CacheObject( x ));
            })
        } else {
            cb( this._c[key] );
        }
    };
    Cache.prototype._key = function(key) {
        return 'cache.' + this.name + '.' + key;
    };
    Cache.prototype.put = function(key, value, seconds) {
        var co = new CacheObject( key, value, Math.ceil(new Date/1000) + (seconds || 360) );
        this._c[ key ] = co;
        window.storage.put( 'cache.' + this.name, Object.keys( this._c ));
        window.storage.put( this._key( key ), co );
        return value;
    };
    Cache.prototype.get = function( key, cb ) {
        if( this.has( key )) {
            var _this = this;
            var raw = this._raw( key, function( raw ) {
                if( raw.seconds < new Date/1000 ) {
                    _this.remove( key );
                    cb( undefined );
                } else {
                    cb( raw.value );
                }
            });
        } else {
            return undefined;
        }
    };
    Cache.prototype.remove = function(key) {
        if( this.has(key) ) {
            window.storage.remove( this._key( key ));
            delete this._c[key];
        }
        window.storage.put( 'cache.' + this.name, Object.keys( this._c ));
    };
    Cache.prototype.remember = function(key, seconds, cb) {
        return this.get( key ) || ( this.put( key, cb(), seconds ));
    };
    Cache.prototype.has = function(key) {
        return key in this._c;
    };
    Cache.prototype.clear = function() {
        console.log('clear');
        var keys = Object.keys( this._c );
        for (var i = keys.length - 1; i >= 0; i--) {
            this.remove( keys[i] );
        };
    };
    Cache.prototype.clean = function() {
        console.log('clean');
        var keys = Object.keys( this._c );
        for (var i = keys.length - 1; i >= 0; i--) {
            this.get( keys[i] );
        };
    };

    var CacheObject = function( key, value, seconds ) {
        if( key == null ) return null;
        if( key && !value && !seconds ) {
            this.value = key.value;
            this.seconds = key.seconds;
            this.key = key.key;
        } else {
            this.key = key;
            this.value = value;
            this.seconds = seconds;
        }
    }

    Cache.prototype['put'] = Cache.prototype.put;
    Cache.prototype['get'] = Cache.prototype.get;
    Cache.prototype['remove'] = Cache.prototype.remove;
    Cache.prototype['remember'] = Cache.prototype.remember;
    Cache.prototype['has'] = Cache.prototype.has;
    Cache.prototype['clear'] = Cache.prototype.clear;
    Cache.prototype['clean'] = Cache.prototype.clean;
    window['cache'] = new Cache();
}(window));

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this); 