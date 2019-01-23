const path = require('path');
const webpack = require('webpack'); 
const webpackBar = require('webpackbar'); // 实现类似 webpack 进度条的工具. https://github.com/nuxt/webpackbar
const extractTextPlugin = require('extract-text-webpack-plugin'); // 将所有入口中引用的.css文件, 移动到独立的分离的 css 文件. https://webpack.js.org/plugins/extract-text-webpack-plugin/
const caseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'); // 解决大小写问题, 导致有可能 Linux 编译失败. https://github.com/Urthen/case-sensitive-paths-webpack-plugin
const replaceLib = require('./replaceLib'); // 替换为 es 模式引入以便支持 tree-shaking.

modulu.exports = (modules) => {

  // 获取 package.json
  const pkg = require(path.join(process.cwd(), 'package.json'));

  // 获取 babel 配置.
  const babelConfig = require('./getBabelCommonConfig')(modules || false);

  // 组件库 按需加载.
  const pluginImportOptions = [
    {
      style: true,
      libraryName: pkg.name,
      libraryDirectory: 'components',
    }
  ];

  // 如果不是 antd 的项目则自动引用 antd.
  // if (pkg.name !== 'antd') {
  //   pluginImportOptions.push({
  //     style: 'css',
  //     libraryDirectory: 'es',
  //     libraryName: 'antd',
  //   });
  // }

  // https://github.com/ant-design/babel-plugin-import
  babelConfig.plugins.push([
    require.resolve('babel-plugin-import'),
    pluginImportOptions
  ]);

  if(modules === false) {
    babelConfig.plugins.push(replaceLib);
  }

  const config = {
    devtool: 'source-map',

    output: {
      path: path.join(process.cwd(), './dist/'),
      filename: '[name].js',
    },

    resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
      ],
      alias: {
        [pkg.name]: process.cwd(),
      },
    },

    node: [
      'child_process',
      'cluster',
      'dgram',
      'dns',
      'fs',
      'module',
      'net',
      'readline',
      'repl',
      'tls',
    ].reduce((acc, name) => Object.assign({}, acc, { [name]: 'empty' }), {}),

    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: babelConfig,
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: extractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          use: extractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
      ],
    },

    plugins: [
      new extractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true,
      }),
      new caseSensitivePathsPlugin(),
      new webpack.BannerPlugin(`
${pkg.name} v${pkg.version}

Copyright 2015-present, Alipay, Inc.
All rights reserved.
      `),
      new webpackBar({
        name: '🚚  Ant Design Tools',
      }),
    ],
  };

  if (process.env.RUN_ENV === 'PRODUCTION') {
    const entry = ['./index'];
    config.entry = {
      [`${pkg.name}.min`]: entry,
    };
    config.externals = {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    };
    config.output.library = pkg.name;
    config.output.libraryTarget = 'umd';

    const uncompressedConfig = deepAssign({}, config);

    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        output: {
          ascii_only: true,
        },
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ]);

    uncompressedConfig.entry = {
      [pkg.name]: entry,
    };

    uncompressedConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }));

    return [config, uncompressedConfig];
  }

  return config;

};