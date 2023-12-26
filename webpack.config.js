const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Repository Name
// const repo = "Lanie";

module.exports = env => {
  // const repo = env.REPO_NAME || "";
  const DIST_DIR = env.DIST_DIR || "dist";
  const REPO_NAME = env.REPO_NAME || "";
  const REPO_DIST = !!env.REPO_DIST;
  const DOMAIN = env.DOMAIN || "localhost";
  const PORT = /^[1-9]\d*$/.test(env.PORT) ? parseInt(env.PORT) : 8000;
  // const repo = "Lanie";
  // const repo = "";
  return {
    entry: "./src/index.js",
    output: {
      // filename: repo + "/script.js",
      filename: (REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : "") + "script.js",
      // filename: "script.js",
      path: path.resolve(__dirname, DIST_DIR),
    },
    plugins: [
      new CopyWebpackPlugin({
        // patterns: [{ from: "public", to: repo }],
        // patterns: repo ? [{ from: "public", to: repo }] : [{ from: "public" }],
        patterns: [
          // { from: "public" },
          REPO_NAME && REPO_DIST
            ? { from: "public", to: REPO_NAME }
            : { from: "public" },
          // {
          //   from: ".github\\workflows\\deploy_jadi.yml",
          //   to: (REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : "") + ".github/workflows",
          // },
        ],
      }),
      new MiniCssExtractPlugin({
        // filename: repo + "/style.css",
        filename: (REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : "") + "style.css",
        // filename: "style.css",
      }),
      new webpack.DefinePlugin({ REPO_NAME: JSON.stringify(REPO_NAME) }),
    ],
    devServer: {
      port: PORT,
      open: {
        // target: ["http://localhost:8000/" + repo + "/"],
        // target: ["http://localhost:8000/" + (repo ? `${repo}/` : "")],
        // target: ["http://localhost:8000/"],
        target: [
          `http://${DOMAIN}:${PORT}/${
            REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : ""
          }`,
        ],
        app: {
          name: "chrome",
          arguments: ["--incognito"],
        },
      },
      historyApiFallback: {
        // rewrites: [{ from: /./, to: "/" + repo + "/404.html" }],
        // rewrites: [{ from: /./, to: "/404.html" }],
        rewrites: [
          {
            from: /./,
            to: `/${REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : ""}404.html`,
          },
        ],
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
              return `${
                REPO_NAME && REPO_DIST ? `${REPO_NAME}/` : ""
              }LICENSE.txt${fileData.query}`;
              // return `LICENSE.txt${fileData.query}`;
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
