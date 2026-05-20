module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  output: "./",

  options: {
    debug: false,
    removeUnusedKeys: false,

    // Treat full strings as translation keys
    keySeparator: false,
    nsSeparator: false,

    func: {
      list: ["t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    lngs: ["en"],

    defaultLng: "en",
    defaultNs: "translation",

    resource: {
      loadPath: "src/locales/{{lng}}/{{ns}}.json",
      savePath: "src/locales/{{lng}}/{{ns}}.json",
    },
  },
};