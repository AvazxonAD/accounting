module.exports = {
    apps: [
      {
        name: "jurnal-v2",
        script: "node",
        args: "-r module-alias/register src/server.js",
        watch: false,
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  