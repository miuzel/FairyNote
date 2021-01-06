#!/bin/sh
yarn build
cd build 
rm ../dist/fairyNote_`jq -r .version manifest.json`_firefox.zip
zip -r ../dist/fairyNote_`jq -r .version manifest.json`_firefox.zip ./ 
cp ../dist/fairyNote_`jq -r .version manifest.json`_firefox.zip ../dist/fairyNote_`jq -r .version manifest.json`_`date +%Y%m%d%H%M%S`_firefox.zip
mv manifest.json manifest_ff.json
jq 'del(.browser_specific_settings)' manifest_ff.json > manifest.json
rm manifest_ff.json
rm ../dist/fairyNote_`jq -r .version manifest.json`_chrome.zip
zip -r ../dist/fairyNote_`jq -r .version manifest.json`_chrome.zip ./ 
cp ../dist/fairyNote_`jq -r .version manifest.json`_chrome.zip ../dist/fairyNote_`jq -r .version manifest.json`_`date +%Y%m%d%H%M%S`_chrome.zip
cd ..