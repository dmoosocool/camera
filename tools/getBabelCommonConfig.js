'use strict';

module.exports = (modules) => {

  // 默认需要引用的一些 babel 插件.
  let defaultBabelPlugin = [
    'es3-member-expression-literals',
    'es3-property-literails',
    'object-assign',
    'class-properties',
    'object-rest-spread'
  ];
 
  // babel 插件集合
  let plugins = [];
  let babelPluginPrefix = 'babel-plugin-transform-';

  // 将这些插件放入集合中.
  defaultBabelPlugin.forEach(function(plugin){
    plugins.push(require.resolve(babelPluginPrefix + plugin));
  });

  // 单独设置 runtime 插件不需要 babel polyfill 挡板.
  plugins.push([require.resolve(babelPluginPrefix + 'runtime'), {
    polyfill: false
  }]);

  return {
    presets: [
      require.resolve('babel-preset-vue'),
      [require.resolve('babel-preset-env'),{
        modules,
        targets: {
          browsers: [
            'last 2 versions',
            'Firefox ESR',
            '> 1%',
            'ie >= 9',
            'iOS >= 8',
            'Android >=4'
          ]
        }
      }]
    ],
  };
};