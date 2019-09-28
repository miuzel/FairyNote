# FairyNote

Boilerplate is from https://github.com/satendra02/react-chrome-extension.

## Description

This is a chrome extension for those need to do manually indexing and adding outlines for youtube live streams when the stream is running.

## License

The repo is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

## FairyNote 2.

### Change 2.3.0

- Port to firefox.

The keyboard shortcuts conflict with firefox built-in shortcuts. Try https://addons.mozilla.org/en-US/firefox/addon/shortkeys/ and import the following configuration to disable these built-in shortcuts on youtube.com

```json
[
    {"key":"ctrl+shift+a","action":"disable","blacklist":"whitelist","sites":"*youtube.com*","open":false,"exported":true,"sitesArray":["*youtube.com*"],"activeInInputs":true},
    {"key":"ctrl+shift+x","action":"disable","blacklist":"whitelist","sites":"*youtube.com*","open":false,"exported":true,"sitesArray":["*youtube.com*"],"activeInInputs":true},
    {"key":"ctrl+shift+h","action":"disable","blacklist":"whitelist","sites":"*youtube.com*","open":false,"activeInInputs":true,"exported":true,"sitesArray":["*youtube.com*"]},
    {"key":"ctrl+shift+k","action":"disable","blacklist":"whitelist","sites":"*youtube.com*","open":false,"activeInInputs":true,"exported":true,"sitesArray":["*youtube.com*"]}
]
```

### Change 2.2.0

- New menu items FILE > EXPORT/IMPORT. This will be useful if you are coping data among videos or you want to edit the data in VSCode, Excel, Numbers or whatever editor you like.

### Change 2.1.0

- Add a set of new shortcuts to adjust time against latency issues. Select a timeline item, then use Ctrl/Command + Shift + , /  Ctrl/Command + Shift + . to add time latency deltas. The delta will be applied on all items following the current one. Enjoy the update. 

### Change 2.0.3

- Fix Command+Shift+A cannot focus textarea in Chrome 77

### Changes 2.0.2

- New Feature: Magic LIVE Sync.
  
  When one is broadcasting while his audiences are watching the same video and talking in a online chatroom. Pass the magic word to your friends they can sync the progress of the video as is you are watching together side by side

### Changes 1.4.3 -> 2.0.1

- GUI Improvement

- Add multiple modes with different "new card" and "card sorting" behaviors.

- Add Settings Panel

- Auto save enabled as default, can be turned off

- Auto complete of the comment field can be saved for some frequently used phrase. You can modify auto complete candidates data in settings.

- You can now control whether to follow video timestamp when focus on a card

- You can change the locale of the extension in settings now. The locale no longer follows your browser.

p.s. Please read the help page and remember those keyboard shortcuts which can boost your recording speed significantly


### How to build

On Linux / node v10.16.0 / yarn v1.17.3

```bash
yarn install
yarn build
```
