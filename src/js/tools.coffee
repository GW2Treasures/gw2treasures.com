tools =
	'webp': ( useWebp ) ->
		(( $ ) ->
			$('noscript[data-webp]')['each'] ( _, $t ) ->
				$t = $ $t
				$img = $ '<img/>'
				$img['attr'] 'src',    if useWebp then $t['data'] 'webp' else $t['data'] 'src'
				$img['attr'] 'width',  $t['data'] 'width'
				$img['attr'] 'height', $t['data'] 'height'
				$img['attr'] 'alt',    $t['data'] 'alt'
				$t['replaceWith'] $img
		) window['jQuery']



if module?.exports
    module.exports = tools
else
    window['gw2treasures'] ?= {}
    window['gw2treasures']['tools'] ?= {}
    window['gw2treasures']['tools'][name] = func for name,func of tools