const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Repository Name
// const repo = "Lanie";

module.exports = env => {
  const repo = env.REPO_NAME || "";
  // const repo = "Lanie";
  // const repo = "";
  return {
    entry: "./src/index.js",
    output: {
      // filename: repo + "/script.js",
      // filename: (repo ? `${repo}/` : "") + "script.js",
      filename: "script.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new CopyWebpackPlugin({
        // patterns: [{ from: "public", to: repo }],
        // patterns: repo ? [{ from: "public", to: repo }] : [{ from: "public" }],
        patterns: [{ from: "public" }],
      }),
      new MiniCssExtractPlugin({
        // filename: repo + "/style.css",
        // filename: (repo ? `${repo}/` : "") + "style.css",
        filename: "style.css",
      }),
      new webpack.DefinePlugin({ REPO_NAME: JSON.stringify(repo) }),
    ],
    devServer: {
      port: 8000,
      open: {
        // target: ["http://localhost:8000/" + repo + "/"],
        // target: ["http://localhost:8000/" + (repo ? `${repo}/` : "")],
        target: ["http://localhost:8000/"],
        app: {
          name: "chrome",
          arguments: ["--incognito"],
        },
      },
      historyApiFallback: {
        // rewrites: [{ from: /./, to: "/" + repo + "/404.html" }],
        // rewrites: [
        //   { from: /./, to: "/" + (repo ? `${repo}/` : "") + "404.html" },
        // ],
        rewrites: [{ from: /./, to: "/404.html" }],
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[hash:base64:5]",
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: {
            condition: true,
            filename: fileData => {
              // return `${repo}/LICENSE.txt${fileData.query}`;
              // return `${repo ? `${repo}/` : ""}LICENSE.txt${fileData.query}`;
              return `LICENSE.txt${fileData.query}`;
            },
            banner: commentsFile => {
              return `All License information available in "https://lyandiff.github.io/${commentsFile}"`;
            },
          },
        }),
      ],
    },
  };
};
