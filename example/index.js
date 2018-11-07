const jsonGoogleTranslate = require('@blaiv/json-google-translate');

const config = {
  API_KEY: "YOUR_GOOGLE_API_KEY",
  TRANSLATIONS_FOLDER: "./translations",
  BASE_LANGUAGE: "en"
}
jsonGoogleTranslate(config);
