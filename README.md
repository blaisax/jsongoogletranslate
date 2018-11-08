# Json Google Translate for node

Quick tool for lazy translators using i18n like json translations files.

## Overview

Module based on https://github.com/Localize/node-google-translate

Intended to user when you are developing an app using i18n, where you have a folder containing all translations json files, each named as the language short code. It detects the translations missing on each language and requests it to google translate. It also detects if a key has no content and also fills it with the automatic translation. So when you are developing and continously adding new literals to a base language you run a script to automatically handle translations.

## Installation

  `npm install @blaiv/json-google-translate --save-dev` or `yarn add @blaiv/json-google-translate`

## Usage

Enter your api key, point to the translations folder relative to the folder you execute the script and specify a base language. It will automatically translate all missing keys. If you want to add a new language, just create a short-code language named json file and run the script.


## Example
```
├── index.js
├── translations                    # translations folder
│   ├── en.json                     # base language containing all language literals
│   ├── es.json                     # another language containing some filled language literals or empty literals.
│   └── fr.json                     # it can be an empty json file
```

### index.js:

```javascript
const jsonGoogleTranslate = require('@blaiv/json-google-translate');

const config = {
  API_KEY: "YOUR_GOOGLE_API_KEY",
  TRANSLATIONS_FOLDER: "./translations",
  BASE_LANGUAGE: "en"
}
jsonGoogleTranslate(config);
```
### translations/en.json

```
{
  "hello": "hello"
}
```

### translations/es.json

```
{
  "hello": ""
}
```

### translations/fr.json

```
{
  
}
```

Run `node index.js`


