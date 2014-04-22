module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        paths:
            out:
                css:      'out/css/'
                cssTemp:  'out/css/.temp/'
                img:      'out/img/'
                js:       'out/js/'
                jsCustom: 'out/js/custom/'
                jsVendor: 'out/js/vendor/'
            src:
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
            options: globals: ['window','module','$']
            all: ['<%= paths.src.js %>*.coffee']
        'closure-compiler':
            custom:
                closurePath: '.'
                js: '<%= paths.out.jsCustom %>*.js'
                jsOutputFile: '<%= paths.out.js %>gw2t.js'
                noreport: true
                options:
                    compilation_level: 'ADVANCED_OPTIMIZATIONS'
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

    # load tasks
    grunt.loadTasks 'tasks/'

    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-mkdir'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-nodeunit'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-coffee-jshint'
    grunt.loadNpmTasks 'grunt-closure-compiler'

    # img
    grunt.registerTask 'img', ['clean:img','mkdir:img','webp','pngcrush']

    # js
    grunt.registerTask 'jquery', ['copy:jquery']
    grunt.registerTask 'jqueryPlugins', ['copy:jqueryPlugins']
    grunt.registerTask 'modernizr', ['copy:modernizr']

    grunt.registerTask 'js:vendor', ['clean:jsVendor','mkdir:jsVendor','jquery','jqueryPlugins','modernizr']
    grunt.registerTask 'js:custom', ['clean:jsCustom','mkdir:jsCustom','coffee:multi']

    grunt.registerTask 'js:minify', ['closure-compiler:custom']

    grunt.registerTask 'js', ['clean:js','mkdir:js','coffee:multi','js:vendor','js:minify']

    # css
    grunt.registerTask 'css:sass', ['mkdir:cssTemp', 'sass:main'] 
    grunt.registerTask 'css:prefix', ['autoprefixer:main']
    grunt.registerTask 'css:minify', ['cssmin:main']

    grunt.registerTask 'css', ['clean:css', 'mkdir:css', 'css:sass', 'css:prefix', 'css:minify']

    # tests
    grunt.registerTask 'test:cache', ['nodeunit:cache']
    grunt.registerTask 'test', ['coffee_jshint', 'nodeunit:all']

    # build
    grunt.registerTask 'build:js', ['test','js']
    grunt.registerTask 'build:img', ['img']
    grunt.registerTask 'build:css', ['css']
    grunt.registerTask 'build', ['build:js', 'build:css', 'build:img']

    # default/help
    grunt.registerTask 'default', ->
        console.log ""
        console.log "  #{'grunt build'.cyan}     - build #{'everything'.bold}"
        console.log "  #{'grunt build:css'.cyan} - build #{'stylesheets'.bold}"
        console.log "  #{'grunt build:img'.cyan} - build #{'images'.bold}"
        console.log "  #{'grunt build:js'.cyan}  - build #{'scripts'.bold}"
        console.log ""
        console.log "  #{'grunt test'.cyan}      - run all unit tests"
    grunt.registerTask 'help', ['default']