const path = require('path'); //модуль, позволяющий найти абсолютный путь к файлу
const fs = require('fs'); //модуль для доступа к Файловой Системе
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const searchingHTML = () => {
  const HTMLfiles = fs.readdirSync(path.resolve(__dirname, 'source/'));
  const targetFiles = HTMLfiles.filter((file) => {
    return path.extname(file).toLowerCase() === '.html';
  });

  return targetFiles;
}
const HTMLSourceFiles = searchingHTML();

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const filenameForAccets = (ext) => (isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`);

const optimization = () => {
  const configObject = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    configObject.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()]
  }

  return configObject;
};

const plugins = () => {
  const basePlugins = [
    ...HTMLSourceFiles.map((file) => new HTMLWebpackPlugin({
      template: path.resolve(__dirname, `source/${file}`),
      filename: `./${file}`,
      minify: {
        collapseWhitespace: isProd,
      }
    })),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'source/assets'),
          to: path.resolve(__dirname, 'app')
        }
      ]
    }),
  ];

  if (isProd) {
    basePlugins.push(
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            // Name
            "gifsicle",
            // Name with options
            ["mozjpeg", { quality: 80 }],
            // Full package name
            [
              "imagemin-svgo",
              {
                plugins: [
                  {
                    removeViewBox: true,
                  },
                ],
              },
            ],
            [
              // Custom package name
              "nonstandard-imagemin-package-name",
              { myOptions: true },
            ],
          ],
        },
      }),
    )
  }
  return basePlugins;
}

module.exports = {
  context: path.resolve(__dirname, 'source'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: `./js/${filename('js')}`,
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'app'),
    },
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },

  optimization: optimization(),

  devtool: isProd ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'src/js/postcss.config.js'
              }
            } 
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
          loader: MiniCssExtractPlugin.loader,
          options: {
              publicPath: (resoursePath, context) => {
                return path.relative(path.dirname(resoursePath), context) + '/';
              }
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ico|gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `img/${filenameForAccets('[ext]')}`,
        },
      },
      {
        test: /\.woff2$/i,
        type: 'asset/resource',
        generator: {
          filename: `fonts/${filenameForAccets('[ext]')}`,
        },
      }
    ],
  },

  plugins: plugins(),
}
