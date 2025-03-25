const UzCyrl = require('./json/cyrl.json');
const UzLatin = require('./json/uz.json');
const ru = require('./json/ru.json');

const resources = {
  uz: { translation: UzLatin },
  cyrl: { translation: UzCyrl },
  ru: { translation: ru }
};

module.exports = { resources };
