
'use strict';

const fs = require('fs');
const path = require('path');
const initGoogleTranslate = require('google-translate');

const animateProgress = require('./helpers/progress');
const addCheckmark = require('./helpers/checkmark');


let progress;

const newLine = () => process.stdout.write('\n');

const task = (message) => {
  progress = animateProgress(message);
  process.stdout.write(message);

  return (error) => {
    if (error) {
      process.stderr.write(error);
    }
    clearTimeout(progress);
    return addCheckmark(() => newLine());
  }
}

const getCurrentTranslations = (baseFolder) => {
  return new Promise(async (resolve, reject) => {
    const translationsObj = {};

    const directoryPath = path.join(process.cwd(), baseFolder);
    try {
      fs.readdir(directoryPath, (err, files) => {
          //handling error
          if (err) {
              throw err
          }
          files.forEach(function (file) {
              if (path.extname(file) === '.json'){
                  const language =  require(`${directoryPath}/${file}`);
                  // extract base name as it is the language key
                  translationsObj[path.basename(file, '.json')] = language;
              }
          });
          resolve(translationsObj);
      });
    } catch (err) {
      throw err
    }
  });
}

const shouldUpdateKey = (val) => {
  // check if exists key, it is string or it's value is empty
  if (typeof val !== 'string' || val.length === 0) {
    return true
  } else {
    return false
  }
}

const getTranslations = async (baseLang, baseTranslation, translations, apiKey) => {
  const stats = {

  }
  const googleTranslate = initGoogleTranslate(apiKey);
    await Promise.all(Object.keys(baseTranslation).map(async key => {
      await Promise.all(Object.keys(translations).map(async langKey => {
        if (shouldUpdateKey(translations[langKey][key])){
          const translatedKey = await getTranslatedText(baseTranslation[key], baseLang,  langKey, googleTranslate);
          translations[langKey][key] = translatedKey;
          stats[langKey] = stats[langKey] ? stats[langKey] + 1 : 1
        }
      }));
    }))
    return { translated: translations, stats };
}

const getTranslatedText = async (text, baseLang, lang, googleTranslate)  => {
  return new Promise(async (resolve, reject) => {
    googleTranslate.translate(text, baseLang, lang, (err, translation) => {
      if (err) {
        throw err
      }
      resolve(translation.translatedText);
    });
  })
}

const main = async ({ API_KEY, TRANSLATIONS_FOLDER = './translations', BASE_LANGUAGE = 'en',  }) => {

  const getTranslationsTaskDone = task('Getting current translations');
  const translations = await getCurrentTranslations(TRANSLATIONS_FOLDER);
  getTranslationsTaskDone();

  let baseTranslation = {};
  if (translations[BASE_LANGUAGE] !== undefined) {
    baseTranslation = Object.assign({}, translations[BASE_LANGUAGE]);
    delete translations[BASE_LANGUAGE];
  } else {
    throw new Error("No base language, check your config file or if your translations exist");
  }

  const translationTask = task('Translating on google translate');
  const { translated, stats } = await getTranslations(BASE_LANGUAGE, baseTranslation, translations, API_KEY);
  translationTask();

  const directoryPath = path.join(process.cwd(), TRANSLATIONS_FOLDER);
  // console.log(directoryPath);

  Object.keys(translated).forEach((lang) => {
    const content = JSON.stringify(translated[lang], null, 2);
    fs.writeFile(`${directoryPath}/${lang}.json`, content, 'utf8', () => {
        process.stderr.write(`Wrote ${stats[lang] || 0} translations to ${lang}.json`);
        addCheckmark();
        newLine()
    });
  });
}

module.exports = main;
module.exports.default = main;
