module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        coffee:
            client:
                files: 'out/storage.js': ['src/client.coffee']
            server:
                files: 'out/_server.js': ['src/server.coffee']
        uglify:
            client:
                files: 'out/storage.js': ['out/storage.js']
            server:
                files: 'out/_server.js': ['out/_server.js']
        inline:
            server:
                src: 'src/storage.html'
                dest: 'out/storage.html'

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-inline'

    grunt.registerTask 'build', [ 'coffee', 'uglify', 'inline' ]

    grunt.registerTask 'default', ->
        console.log ""
        console.log " #{'grunt build'.cyan} - build #{'everything'.bold}"

    grunt.registerTask 'help', [ 'default' ]