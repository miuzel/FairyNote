#!/bin/sh
yarn build $1
cd build
rm -rf ../dist/fairyNote_`jq -r .version manifest.json`_firefox$1.zip
zip -r ../dist/fairyNote_`jq -r .version manifest.json`_firefox$1.zip ./ 
cp ../dist/fairyNote_`jq -r .version manifest.json`_firefox$1.zip ../dist/fairyNote_`jq -r .version manifest.json`_`date +%Y%m%d%H%M%S`_firefox$1.zip
mv manifest.json manifest_ff.json
jq 'del(.browser_specific_settings)' manifest_ff.json > manifest.json
rm -rf  manifest_ff.json
rm -rf  ../dist/fairyNote_`jq -r .version manifest.json`_chrome$1.zip
zip -r ../dist/fairyNote_`jq -r .version manifest.json`_chrome$1.zip ./ 
cp ../dist/fairyNote_`jq -r .version manifest.json`_chrome$1.zip ../dist/fairyNote_`jq -r .version manifest.json`_`date +%Y%m%d%H%M%S`_chrome$1.zip
cd ..