const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const {
  GenerateSW
} = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: 'scripts/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{
          from: path.resolve(__dirname, 'src/public/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
        {
          from: path.resolve(__dirname, 'src/public/data'),
          to: path.resolve(__dirname, 'dist/data'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new GenerateSW({
      swDest: 'service-worker.js', // Nama file SW yang akan dihasilkan
      clientsClaim: true, // Aktifkan SW untuk semua klien
      skipWaiting: true, // Lewati langkah menunggu untuk mengaktifkan SW baru
      runtimeCaching: [{
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            },
          },
        },
        {
          urlPattern: /\.(?:css|js)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          },
        },
        {
          urlPattern: /^https:\/\/restaurant-api\.dicoding\.dev\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 24 * 60 * 60, // 1 hari
            },
          },
        },
      ],
    }),
  ],
};