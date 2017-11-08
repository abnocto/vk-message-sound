cd build

del *.min.js

cd..

browserify     src/js/app.js -g [envify --NODE_ENV production] -t [ browserify-css --minify=true ] -t [ babelify --presets [ es2015 stage-0 ] ] | uglifyjs -cm >  build/bundle.min.js"
browserify src/js/wrapper.js -g [envify --NODE_ENV production] -t [ browserify-css --minify=true ] -t [ babelify --presets [ es2015 stage-0 ] ] | uglifyjs -cm > build/wrapper.min.js"