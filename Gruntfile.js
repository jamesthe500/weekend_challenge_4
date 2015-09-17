module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }/*,
             build: {
             src: 'client/scripts/app.js',
             dest: 'server/public/assets/scripts/app.min.js'
             }*/ // commented out so line numbers show up
        },
        copy: {
            jquery: {
                expand: true,
                cwd: 'node_modules',
                src: [
                    "jquery/dist/jquery.min.js",
                    "jquery/dist/jquery.min.map",
                    "jquery/dist/jquery.leanModal.min.js",
                    "jquery/dist/jquery.js"
                ],
                "dest": "server/public/vendors/"
            },
            bootstrap   : {
                expand: true,
                cwd: 'node_modules',
                src: [
                    'bootstrap/dist/css/bootstrap.min.css'
                ],
                "dest": "server/public/vendors/"
            },
            css: {
                expand: true,
                cwd: 'client',
                src: [
                    "styles/style.css"
                ],
                "dest": "server/public/assets/"
            },
            // delete below for final product
            scripts: {
                expand: true,
                cwd: 'client',
                src: [
                    "scripts/*"
                ],
                "dest": "server/public/assets/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['copy', 'uglify']);
};