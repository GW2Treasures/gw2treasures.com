module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        paths:
            out:
                base:     'out/'
                css:      'out/css/'
                cssTemp:  'out/css/.temp/'
                img:      'out/img/'
                js:       'out/js/'
                jsCustom: 'out/js/custom/'
                jsVendor: 'out/js/vendor/'
            src:
                base:     'src/'
                css:      'src/css/'
                img:      'src/img/'
                js:       'src/js/'
                jsVendor: 'src/js/vendor/'
            tests: 'test/'
            tasks: 'tasks/'
        webp:
            img:
                src: '<%= paths.src.img %>'
                dest: '<%= paths.out.img %>'
        pngcrush:
            img:
                src: '<%= paths.src.img %>'
                dest: '<%= paths.out.img %>'
        copy:
            jquery:
                src: 'node_modules/jquery/dist/jquery.min.js'
                dest: '<%= paths.out.jsVendor %>jquery.min.js'
            modernizr:
                src: '<%= paths.src.jsVendor %>modernizr-3.0.0.min.js'
                dest: '<%= paths.out.jsVendor %>modernizr-3.0.0.min.js'
            jqueryPlugins:
                src: '<%= paths.src.jsVendor %>jquery-plugins.js'
                dest: '<%= paths.out.jsVendor %>jquery-plugins.js'
        mkdir:
            css:      options: create: ['<%= paths.out.css %>']
            cssTemp:  options: create: ['<%= paths.out.cssTemp %>']
            img:      options: create: ['<%= paths.out.img %>']
            js:       options: create: ['<%= paths.out.js %>']
            jsCustom: options: create: ['<%= paths.out.jsCustom %>']
            jsVendor: options: create: ['<%= paths.out.jsVendor %>']
        nodeunit:
            all:   ['<%= paths.tests %>**/*.coffee']
            cache: ['<%= paths.tests %>cache/*.coffee']
        coffee:
            multi:
                expand: true
                flatten: true
                ext: '.js'
                src: ['<%= paths.src.js %>*.coffee']
                dest: '<%= paths.out.jsCustom %>'
        coffee_jshint:
            options: globals: ['window','module','define','require']
            all: ['<%= paths.src.js %>*.coffee']
        concat:
            js:
                src: ['<%= paths.out.jsVendor %>jquery.min.js', '<%= paths.out.jsVendor %>jquery-plugins.js']
                dest: '<%= paths.out.js %>jquery.js'
            custom:
                src: '<%= paths.out.jsCustom %>*.js'
                dest: '<%= paths.out.js %>gw2t.js'
        'regex-replace':
            js:
                src: '<%= paths.out.js %>gw2t.js'
                actions: [{
                        name: 'multiline_comments'
                        search: /\/\*[^]*?\*\//g
                        replace: ''
                    },{
                        name: 'singleline_comments'
                        search: /^\/\/.*/gm
                        replace: ''
                    },{
                        name: 'empty_lines'
                        search: /^\n/gm
                        replace: ''
                    }]
        sass:
            main:
                options:
                    style: 'expand'
                files:
                    '<%= paths.out.cssTemp %>sass.css': '<%= paths.src.css %>main.scss'
        autoprefixer:
            main:
                src: '<%= paths.out.cssTemp %>sass.css'
                dest: '<%= paths.out.cssTemp %>prefixed.css'
        cssmin:
            main:
                src: '<%= paths.out.cssTemp %>prefixed.css'
                dest: '<%= paths.out.css %>gw2t.css'
        clean:
            css:      '<%= paths.out.css %>'
            cssTemp:  '<%= paths.out.cssTemp %>'
            img:      '<%= paths.out.img %>'
            js:       '<%= paths.out.js %>'
            jsCustom: '<%= paths.out.jsCustom %>'
            jsVendor: '<%= paths.out.jsVendor %>'

        connect:
            rules: [
                from: '^/assets/(.*)$',  to: '/$1'
            ,   from: '^/assets2/(.*)%', to: '/$1'
            ]
            server:
                options:
                    port: 8080
                    middleware: ( connect, options, middlewares ) ->
                        middlewares.unshift require('grunt-connect-rewrite/lib/utils').rewriteRequest
                        middlewares
                    keepalive: true
                    base:
                        [ '<%= paths.out.base %>' ]

        watch:
            css:
                files: '<%= paths.src.css %>*.scss'
                tasks: [ 'build:css' ]
            img:
                files: '<%= paths.src.img %>*.png'
                tasks: [ 'build:img' ]
            js:
                files: '<%= paths.src.js %>*.coffee'
                tasks: [ 'build:js' ]

    # load tasks
    grunt.loadTasks 'tasks/'

    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-closure-compiler'
    grunt.loadNpmTasks 'grunt-coffee-jshint'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-connect-rewrite'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-contrib-nodeunit'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-mkdir'
    grunt.loadNpmTasks 'grunt-regex-replace'

    # img
    grunt.registerTask 'img', ['clean:img','mkdir:img','webp','pngcrush']

    # js
    grunt.registerTask 'jquery', ['copy:jquery']
    grunt.registerTask 'jqueryPlugins', ['copy:jqueryPlugins']
    grunt.registerTask 'modernizr', ['copy:modernizr']

    grunt.registerTask 'js:vendor', ['clean:jsVendor','mkdir:jsVendor','jquery','jqueryPlugins','modernizr']
    grunt.registerTask 'js:custom', ['clean:jsCustom','mkdir:jsCustom','coffee:multi']

    grunt.registerTask 'js:minify', [ 'concat:custom' ]

    grunt.registerTask 'js:concat', ['concat:js', 'regex-replace:js']

    grunt.registerTask 'js', ['clean:js','mkdir:js','coffee:multi','js:vendor','js:minify','js:concat']

    # css
    grunt.registerTask 'css:sass', ['mkdir:cssTemp', 'sass:main']
    grunt.registerTask 'css:prefix', ['autoprefixer:main']
    grunt.registerTask 'css:minify', ['cssmin:main']

    grunt.registerTask 'css', ['clean:css', 'mkdir:css', 'css:sass', 'css:prefix', 'css:minify']

    # tests
    grunt.registerTask 'test:cache', ['nodeunit:cache']
    grunt.registerTask 'test', ['coffee_jshint', 'nodeunit:all']

    # build
    grunt.registerTask 'build:js', ['js']
    grunt.registerTask 'build:img', ['img']
    grunt.registerTask 'build:css', ['css']
    grunt.registerTask 'build', ['build:js', 'build:css', 'build:img']

    # server
    grunt.registerTask 'serve', [ 'configureRewriteRules', 'connect:server' ]

    # default/help
    grunt.registerTask 'default', ->
        console.log ""
        console.log "  #{'grunt build'.cyan}     - build #{'everything'.bold}"
        console.log "  #{'grunt build:css'.cyan} - build #{'stylesheets'.bold}"
        console.log "  #{'grunt build:img'.cyan} - build #{'images'.bold}"
        console.log "  #{'grunt build:js'.cyan}  - build #{'scripts'.bold}"
        console.log "  #{'You can use watch instead of build to watch for changes'.grey}"
        console.log ""
        console.log "  #{'grunt serve'.cyan}     - serve the assets on 127.0.0.1:8080"
        console.log ""
        console.log "  #{'grunt test'.cyan}      - run all unit tests"
    grunt.registerTask 'help', ['default']
