module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.0.0",
        targets: {
          browsers: ["last 2 versions", "safari >= 7", "ie 11"]
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-transform-modules-commonjs"
  ]
};
