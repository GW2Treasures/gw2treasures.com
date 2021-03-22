(function(window, document, $) {
    $(document).ready(function() {
        window.gw2treasures = {};
        window.gw2treasures.lang = $('html').attr('lang') || 'en';
        window.gw2treasures.domain = $('meta[name="gw2treasures:domain"]').attr('content');

        search.init();
        tooltips.init();
        mainsearch.init();
        $('input.chatlink').on( 'click', function() {
            $(this).focus().select();
        });
        Modernizr.on( 'webp', webp );

        /* remove analytics campaign parameter from url */
        var removeAnalyticsParameter = function() {
            /// https://gist.github.com/paulirish/626834
            if (/utm_/.test(location.search) && window.history.replaceState){  
                // thx @cowboy for the revised hash param magic.
                var oldUrl = location.href;
                var newUrl = oldUrl.replace(/\?([^#]*)/, function(_, search) {
                    search = search.split('&').map(function(v) {
                    return !/^utm_/.test(v) && v;
                }).filter(Boolean).join('&'); // omg filter(Boolean) so dope.
                    return search ? '?' + search : '';
                });
                if ( newUrl != oldUrl ) {
                    window.history.replaceState({},'', newUrl); 
                }
            }
        };
        if(window.ga) { ga(removeAnalyticsParameter); }
        else { removeAnalyticsParameter(); }
    });

    /* track outbound links */
    window.outbound = function( a ) {
        window.ga( 'send', 'event', 'Outbound Links', 'click', a.href );
    }

    var mainsearch = {
        init: function() {
            var _this = this;
            _this.$input = $('#mainsearch');
            _this.$list  = $('#mainsearchAutocomplete');

            _this.$input.on( 'input', function() {
                var val = _this.$input.val().trim();
                if( val.length >= 2 ) {
                    _this.$list.addClass( 'visible' );
                    if( val !== _this.last ) {
                        _this.$list.addClass( 'loading' );
                        _this.ajax();
                        _this.last = val;
                    }
                } else {
                    _this.$list.removeClass( 'visible' );
                }
            });
        
            _this.ajax = $.throttle( 500, function() {
                var val = _this.$input.val().trim();
                console.log('ajax go');
                $.getJSON('/search/autocomplete?q=' + encodeURIComponent( val ), function( data ) {
                    var html = '';
                    $.each(data.items, function(_, item) {
                        html += '<a href="/item/' + item.id + '" data-item-id="' + item.id + '"><img src="' + item.icon32 + '" width="32" height="32" alt="">' + item.name + '</a>';
                    });
                    _this.$list.html(html);

                    if( val === _this.$input.val().trim() ) {
                        _this.$list.removeClass('loading');
                    }
                });
            });
        }
    }

    /*function mainsearchAutocomplete() {
        var $input = $('#mainsearch');
        var $list = $('#mainsearchAutocomplete');
        if( $input.val().length >= 2 ) {
            $list.addClass('visible');
            $list.addClass('loading');
            $.getJSON('/search/autocomplete?q=' + encodeURI( $input.val() ), function(data) {
                $list.removeClass('loading');

                var html = '';

                $.each(data.items, function(_, item) {
                    html += '<a href="/item/' + item.id + '"><img src="' + item.icon32 + '" width="32" height="32" alt="">' + item.name + '</a>';
                });

                $list.html(html);

            });
        } else {
            $list.removeClass('visible');
        }
    }*/

    window.search = {
        init: function() {
            var _this  = this;
            this.$form   = $('#search');
            this.$input  = $('#q');
            this.$box    = $('#searchSuggestionbox');
            this.$items  = $('#searchSuggestionItems');
            this.$recent = $('#searchSuggestionRecent');

            window.storage.get('search.recent', function( r ) {
                _this.recent = r || [];
            })

            this.$input.on('focus', function(e) {
                _this.show();
                _this.change();
            })
            this.$input.on('input', function(e) {
                _this.show();
                _this.change();
            })
            this.$box.on('click', 'a', function() {
                _this.save( $(this).text() );
            });
            $(document).on('mouseup focus touchend', '*', function(e) {
                if(    !_this.$input.is( e.target )
                    && !_this.$box.is( e.target )
                    && _this.$box.has( e.target ).length === 0 ) {
                    _this.hide();
                }
            });
            this.$form.on('submit', function() {
                _this.save( _this.$input.val() );
            });
        },
        show: function() {
            this.$box.addClass( 'visible' );
        },
        hide: function() {
            this.$box.removeClass( 'visible' );
        },
        change: function() {
            var val = this.$input.val(),
              _this = this;

            //recent
            this.$recent.empty();
            var r = 0;
            for (var i = this.recent.length - 1; i >= 0 && r < 5; i--) {
                var index = this.recent[i].toLowerCase().indexOf( val.toLowerCase() );
                if( index != -1 ) {
                    r++;
                    this.$recent.append(
                        $('<li/>').append( $('<a/>')
                            .html( this.recent[i].substr(0, index) + "<strong>" + this.recent[i].substr(index, val.length) + "</strong>" + this.recent[i].substr(index + val.length) )
                            .attr('href', '/search?q=' + encodeURIComponent( this.recent[i] ))
                    ));
                }
            };

            //items
            if( val.length >= 2 ) {
                $.getJSON('/search/autocomplete?q=' + encodeURIComponent( val ), function(data) {
                    var html = '';
                    $.each(data.items, function(_, item) {
                        html += '<li><a href="/item/' + item.id + '" data-item-id="' + item.id + '"><img src="' + item.icon16 + '" width="16" height="16" alt=""> ' + item.name + '</a>';
                    });
                    _this.$items.html(html);
                });
            } else {
                _this.$items.empty();
            }
        },
        save: function( q ) {
            q = q.trim();
            for (var i = this.recent.length - 1; i >= 0; i--) {
                if( this.recent[i] === q ){
                    this.recent.splice(i, 1);
                }
            };
            this.recent.push( q );
            window.storage.put('search.recent', this.recent);
        }
    }

    function webp( useWebp ) {
        $('noscript[data-webp]').each(function() {
            $this = $(this);
            $img = $('<img/>')
                    .attr('src', useWebp ? $this.data('webp') : $this.data('src'))
                    .attr('width', $this.data('width'))
                    .attr('height', $this.data('height'))
                    .attr('alt', $this.data('alt'));
            $this.replaceWith($img);
        });
    }

    /* tooltips */
    var tooltips = {
        init: function() {
            tooltips.getBounds();
            $(document)
                .on( 'mouseenter', 'a', function() { tooltips.showTooltip( $(this) ) } )
                .on( 'mouseleave', 'a', tooltips.hideTooltip );
            tooltips.tooltip = $('<div/>').attr('id', 'tooltip');
            $('body').prepend(tooltips.tooltip);
            $('body').on('mousemove', function(e) {
                var x = Math.min( Math.max( e.clientX, tooltips.bounds.x ), tooltips.bounds.width - tooltips.tooltip.width() );
                var y = Math.min( Math.max( e.clientY, tooltips.bounds.y ), tooltips.bounds.height - tooltips.tooltip.height() );
                tooltips.tooltip.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            });
            $( window ).on('resize', function() {
                tooltips.getBounds();
            });
        },

        getBounds: function( ) {
            tooltips.bounds = { x: $(window).scrollLeft(), y: $(window).scrollTop(), width: $(window).width(), height: $(window).height() };
        },

        showTooltip: function( obj ) {
            $this = obj || $(this);

            var id = 0;
            var type = false;

            if($this.data('item-id')) {
                type = 'item';
                id = $this.data('item-id');
            } else if($this.data('trait-id')) {
                type = 'trait';
                id = $this.data('trait-id');
            } else if($this.data('skill-id')) {
                type = 'skill';
                id = $this.data('skill-id');
            } else if($this.data('achievement-id')) {
                type = 'achievement';
                id = $this.data('achievement-id');
            }
            
            if(type === false) {
                return;
            }

            tooltips.current = $this;
            tooltips.tooltip.addClass('visible');

            var lang = $this.attr('hreflang') || window.gw2treasures.lang;
                
            if( cache.has( 'tooltip:' + lang + ':' + type + ':' + id )) {
                cache.get( 'tooltip:' + lang + ':' + type + ':' + id, function( t ) {
                    if( t == null ) {
                        // sometimes the cache returns empty values, who knows why..
                        tooltips.tooltip.html( '' );
                        tooltips.loadTooltip( id, $this, lang, type );
                    } else {
                        tooltips.tooltip.html( t );
                    }
                });
            } else {
                tooltips.tooltip.html( '' );
                tooltips.loadTooltip( id, $this, lang, type );
            }
        },

        loadTooltip: function( id, obj, lang, type ) {
            $.get( '//' + lang + '.' + window.gw2treasures.domain + '/' + type + '/' + id + '/tooltip', function(data) {
                cache.put( 'tooltip:' + lang + ':' + type + ':' + id, data, 360 );
                if( tooltips.current == obj ) {
                    tooltips.showTooltip( obj );
                }
            });
        },

        hideTooltip: function() {
            tooltips.current = null;
            tooltips.tooltip.removeClass('visible');
        }
    }

    /* filter recipeTable */
    window.filter = {
        active: false,
        hidden: {'armorsmith': false,
                 'artificer': false,
                 'chef': false,
                 'huntsman': false,
                 'jeweler': false,
                 'leatherworker': false,
                 'tailor': false,
                 'weaponsmith': false},
        init: function() {

        },
        hide: function( discipline ) {
            this.hidden[discipline] = true;
            $( '.recipeTable' ).addClass( 'filter-hide-' + discipline );
            $( '.recipeTable' ).removeClass( 'filter-show-' + discipline );
            $( '.filterButton.discipline-' + discipline ).addClass( 'active' );
        },
        show: function( discipline ) {
            this.hidden[discipline] = false;
            $( '.recipeTable' ).addClass( 'filter-show-' + discipline );
            $( '.recipeTable' ).removeClass( 'filter-hide-' + discipline );
            $( '.filterButton.discipline-' + discipline ).removeClass( 'active' );
        },
        toggle: function( discipline ) {
            if( !discipline in this.hidden ) return;

            if( !this.active ) {
                $( '.recipeTable' ).addClass( 'filtered' );
                this.active = true;
                this.show( discipline );
                for( d in this.hidden ) {
                    if( d != discipline ) {
                        this.hide( d );
                    }
                }
            } else if ( this.hidden[ discipline ] ) {
                this.show( discipline );
            } else {
                this.hide( discipline );
            }

            for( d in this.hidden ) {
                if( !this.hidden[d] ) {
                    return
                }
            }
            this.active = false;
            $( '.recipeTable' ).removeClass( 'filtered' );
            for( d in this.hidden ) {
                this.show( d );
            }
        }
    }

}(window, document, jQuery))
