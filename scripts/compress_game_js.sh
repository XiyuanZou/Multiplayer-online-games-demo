#! /bin/bash

JS_PATH=/home/xiyuan/acapp/game/static/js/
JS_PATH_dist=${JS_PATH}dist/
JS_PATH_src=${JS_PATH}src/

find ${JS_PATH_src} -type f -name "*.js" | sort | xargs cat > ${JS_PATH_dist}game.js 
