/* eslint-disable global-require */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const postcssNormalize = require("postcss-normalize");

const cwd = process.cwd();
// Show warning for webpack
process.traceDeprecation = true;

function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

function resolve(moduleName) {
  return require.resolve(moduleName);
}

const imageOptions = {
  limit: 10000
};

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: "postcss-loader",
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize()
        ],
        sourceMap: true
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(preProcessor);
  }
  return loaders;
};

const pkg = require(getProjectPath("package.json"));
const entry = ["./src/index"];

function createConfig(config) {
  return {
    devtool: "source-map",
    entry: {
      [pkg.name]: entry
    },
    output: {
      path: getProjectPath("./dist/"),
      filename: "[name].js",
      library: pkg.name,
      libraryTarget: "umd"
    },

    resolve: {
      modules: ["node_modules", path.join(__dirname, "../node_modules")],
      // modules: ['node_modules'],
      extensions: [
        ".web.tsx",
        ".web.ts",
        ".web.jsx",
        ".web.js",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".json"
      ],
      alias: {
        [pkg.name]: process.cwd()
      }
    },

    node: [
      "child_process",
      "cluster",
      "dgram",
      "dns",
      "fs",
      "module",
      "net",
      "readline",
      "repl",
      "tls"
    ].reduce((acc, name) => Object.assign({}, acc, { [name]: "empty" }), {}),

    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)?$/,
          use: [
            {
              loader: resolve("babel-loader")
            },
            "ts-loader"
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: true
          })
        },
        {
          test: /\.less$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: true
            },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true,
                sourceMap: true
              }
            }
          )
        },
        {
          test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
          loader: "url-loader",
          options: imageOptions
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
      new CaseSensitivePathsPlugin(),
      new CleanWebpackPlugin()
    ].filter(Boolean),
    externals: [nodeExternals()],
    ...config
  };
}

// Common config

// // Development
// const uncompressedConfig = webpackMerge({}, config, {
//   entry: {
//     [pkg.name]: entry,
//   },
//   mode: 'development',
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: '[name].css',
//     }),
//   ],
// });

// Production
// const prodConfig = webpackMerge({}, config, {
//   entry: {
//     [`${pkg.name}.min`]: entry,
//   },
//   mode: 'production',
//   plugins: [
//     new webpack.optimize.ModuleConcatenationPlugin(),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true,
//     }),
//     new MiniCssExtractPlugin({
//       filename: '[name].css',
//     }),
//   ],
//   optimization: {
//     minimizer: [new OptimizeCSSAssetsPlugin({})],
//   },
// });

module.exports = [
  // createConfig({
  //   mode: "development",
  //   output: {
  //     library: pkg.name,
  //     libraryTarget: "var"
  //   }
  // }),
  createConfig({
    mode: "production",
    output: {
      path: getProjectPath("./dist/"),
      filename: "[name].umd.js",
      library: pkg.name,
      libraryTarget: "umd"
    }
  }),
  createConfig({
    mode: "production",
    output: {
      path: getProjectPath("./dist/"),
      filename: "[name].js"
    }
  })
];
