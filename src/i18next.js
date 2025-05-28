const i18next = require("i18next");
const FsBackend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");
const { join } = require("path");

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(FsBackend)
  .init(
    {
      backend: {
        loadPath: join(__dirname, "./locales/json/{{lng}}.json"),
      },
      lng: "uz",
      fallbackLng: "uz",
      preload: ["uz", "cyrl", "ru"],
      detection: {
        order: ["header", "querystring", "cookie"],
        lookupHeader: "x-app-lang",

        ignoreCase: true,

        caches: ["cookie"],
      },
    },
    (err) => {
      if (err) {
        return console.log("Something went wrong loading", err);
      }
    }
  );

module.exports = i18nextMiddleware.handle(i18next);
