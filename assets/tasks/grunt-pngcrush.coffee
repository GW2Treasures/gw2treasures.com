fs = require 'fs'
{exec} = require 'child_process'

convertFiles = (data, files, cb) ->
    return cb false if files.length == 0

    # take next file
    nextFile = files[0].replace(/\.[^/.]+$/, "")
    cmd = "pngcrush -brute -blacken -reduce -q #{data.src}#{nextFile}.png #{data.dest}#{nextFile}.png"
    console.log "  crushing #{nextFile.cyan} (#{cmd.grey})"
    exec cmd, (err, out) ->
        cb err if err
        convertFiles data, (files.slice 1), cb

module.exports = (grunt) ->
    grunt.registerMultiTask 'pngcrush', ->
        done = this.async()
        files = (fs.readdirSync @data.src).filter (file) -> /\.png$/.test file
        convertFiles @data, files, (err) ->
            console.log err if err
            done !err