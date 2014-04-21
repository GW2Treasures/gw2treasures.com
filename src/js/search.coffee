# class MainSearch
# 	constructor: (@input, @list) ->
# 		@input.on 'input', @onInput
# 	onInput: ->
# 		val = @input.val().trim()
# 		if val.length >= 2
# 			@list.addClass 'visible'
# 			if val != @last
# 				@list.addClass 'loading'
# 				@ajax()
# 				@last = val
# 		else
# 			@list.removeClass 'visible'
# 	ajax: $.throttle 500, ->
# 		val = '1'