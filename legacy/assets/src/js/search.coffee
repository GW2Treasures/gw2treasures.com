delay = ( t, f ) -> window.setTimeout f, t

define 'search', ['jquery', 'storage'], ($, storage) ->
    class Search
        constructor: (@form, @input, @box, @items, @recent) ->
            storage.get 'search.recent', ( r ) =>
                @recentSearches = r ? []

            @input.on 'focus input', ( e ) =>
                do @show
                value = do @getValue

                @displayRecentSearches value
                @displayItems value

            # show the suggestionbox on focus
            @form.on 'focusin', ( e ) =>
                do @show

            # hide the suggestionbox when we click outside
            $(window.document).on 'mouseup focus touchend', '*', ( e ) =>
                unless (@input.is e.target) or (@box.is e.target) or @box.has(e.target).length isnt 0
                    do @hide

            # handle click on list items
            @items.add( @recent ).on 'click', 'a', ( e ) =>
                link = $(e.target)
                text = do link.text
                url = link.attr 'href'
                @addRecent text, url, ->
                    window.location.href = url
                do e.preventDefault
                false

        ###* gets the current (trimmed) value of the search input ###
        getValue: ->
            @input.val().trim()


        ###* instantly search all recent searches and display highlighted matches ###
        displayRecentSearches: ( value ) ->
            recentSearchesToDisplay = 5
            recentSearchHtml = ''

            for recentSearch in @recentSearches by -1
                # extract search text and url
                text = recentSearch.text ? recentSearch
                url = recentSearch.url ? "/search?q=#{ encodeURIComponent text }"

                # check if the search text contains the current search term
                index = text.toLowerCase().indexOf value.toLowerCase()
                if index isnt -1
                    recentSearchesToDisplay--
                    # highlight the text
                    highlighted = "#{ text.substr 0, index}<mark>#{ text.substr index, value.length }</mark>#{ text.substr index + value.length }"
                    recentSearchHtml += """<li><a href="#{ url }">#{ highlighted }</a></li>"""
                break if recentSearchesToDisplay is 0

            @recent.html recentSearchHtml


        ###* search for items matching the value and display them ###
        displayItems: ( value ) ->
            # only search when the entered search term is longer than 2 characters
            # and we are not already waiting for a response or the value didnt change
            if not @waitingForAjaxResponse and value isnt @lastValue
                @lastValue = value

                if value.length > 2
                        @waitingForAjaxResponse = true
                        @items.addClass 'loading'

                        $.getJSON "/search/autocomplete?q=#{ encodeURIComponent value }", ( data ) =>
                            html = ''
                            for item in data.items
                                html += "<li>#{ @getItemLink item }</li>"
                            @items.html html

                            # our work here is done
                            @waitingForAjaxResponse = false
                            @items.removeClass 'loading'

                            # if the current value changed, run this again
                            currentValue = do @getValue
                            if currentValue isnt value
                                @displayItems currentValue
                else
                    @items.html ''


        ###* Creates a link to the item ###
        getItemLink: ( item ) ->
            icon = """<img src="#{ item.icon16 }"  srcset="#{ item.icon16 } 1x, #{ item.icon32 } 2x" width="16" height="16" crossorigin="anonymous" alt="">"""
            """<a href="/item/#{ item.id }" data-item-id="#{ item.id }">#{ icon }#{ item.name }</a>"""

        ###* Shows the search suggestion box ###
        show: ->
            @box.attr 'hidden', false

            # delay adding the class, because the transition doesnt animate for hidden elements
            delay 1, => @box.addClass 'visible'

            # we want to stop the delayed hiding
            window.clearTimeout @hideDelay if @hideDelay?

        ###* hides the search suggestion box ###
        hide: ->
            @box.removeClass 'visible'

            # delay adding the hidden attribute, so we can show a transition
            window.clearTimeout @hideDelay if @hideDelay?
            @hideDelay = delay 500, => @box.attr 'hidden', true

        addRecent: ( text, url, callback ) ->
            # construct the object to save
            recentSearch =
                text: do text.trim
                time: do Date.now
            recentSearch.url = url if url?

            # remove any object with the same text from the recent searches
            @recentSearches = @recentSearches.filter ( r ) ->
                recentSearch.text isnt (r.text or r)

            # save it
            @recentSearches.push recentSearch
            storage.put 'search.recent', @recentSearches, ->
                callback? true
