define 'mainsearch', ['jquery', 'jquery.plugins'], ($, _) ->
    class MainSearch
        constructor: (@input, @list) ->
            @onInput = =>
                val = @input.val().trim()
                if val.length >= 2
                    @list.addClass 'visible'
                    if val != @last
                        @list.addClass 'loading'
                        @ajax()
                        @last = val
                else
                    @list.removeClass 'visible'

            @ajax = $.throttle 500, =>
                val = @input.val().trim()
                $.getJSON "/search/autocomplete?q=#{ encodeURIComponent val }", (data) =>
                    html = (for item in data.items
                        """<a href="/item/#{ item['id'] }" data-item-id="#{ item['id'] }"><img src="#{ item['icon32'] }" width="32" height="32" alt="">#{ item['name'] }</a>"""
                    )
                    .join ''
                    @list.html html
                    @list.removeClass 'loading' if val == @input.val().trim()

            @input.on 'input', => @onInput()
