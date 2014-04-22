class Search
    constructor: (@form, @input, @box, @items, @recent) ->
        window['storage'].get 'search.recent', ( r ) =>
            @_recent = r || []

        @input['on'] 'focus input', (e) => 
            @show()
            val = @input['val']()

            # recent searches
            rc = 0
            html = ''
            for r in @_recent by -1
                text = r.text || r
                index = text.toLowerCase().indexOf val.toLowerCase()
                if index != -1
                    rc++
                    href = r.url || "/search?q=#{ encodeURIComponent text }";
                    html += """<li><a href="#{ href }">#{ text.substr 0, index }<strong>#{ text.substr index, val.length }</strong>#{ text.substr index + val.length }</a></li>"""
                break if rc == 5
            @recent['html'] html

            # items
            if val.length >= 2
                window['$']['getJSON'] "/search/autocomplete?q=#{ encodeURIComponent val }", (data) =>
                    html = ''
                    for item in data['items']
                        html += """<li><a href="/item/#{ item['id'] }" data-item-id="#{ item['id'] }"><img src="#{ item['icon16'] }" width="16" height="16" alt="">#{ item['name'] }</a></li>"""
                    @items['html'] html
            else
                @items['html'] ''

        @items['on'] 'click', 'a', (e) =>
            @['addRecent'] window['$'](e.target)['text'](), window['$'](e.target)['attr']('href')
        window['$'](window['document'])['on'] 'mouseup focus touchend', '*', (e) =>
            if !@input['is'](e.target) && !@box['is'](e.target) && @box['has'](e.target).length == 0
                @['hide']()

    'show': ->
        @box['addClass'] 'visible'
    'hide': ->
        @box['removeClass'] 'visible'
    'addRecent': (text, url) ->
        obj = 
            'text': text.trim(),
            'time': new Date()['getTime']()
        obj.url = url if url?
        @_recent = @_recent.filter (r) -> (r.text || r) != obj.text
        @_recent.push obj
        window['storage'].put 'search.recent', @_recent


if module?.exports
    module.exports = Search
else
    window['gw2treasures'] ?= {}
    window['gw2treasures']['definitions'] ?= {}
    window['gw2treasures']['definitions']['Search'] = Search