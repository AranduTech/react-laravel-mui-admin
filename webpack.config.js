// const ChunksWebpackPlugin = require('chunks-webpack-plugin');
var path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    'components/CsrfToken': './src/components/CsrfToken',
    'components/DialogProvider': './src/components/DialogProvider',
    'components/Icon': './src/components/Icon',
    'components/Link': './src/components/Link',
    'components/Loading': './src/components/Loading',
    'components/RecursiveList': './src/components/RecursiveList',
    'components/RecursiveMenu': './src/components/RecursiveMenu',
    'components/SideMenuLayout': './src/components/SideMenuLayout',
    'components/Suspense': './src/components/Suspense',
    'components/Form/AsyncModelForm': './src/components/Form/AsyncModelForm',
    'components/Form/ModelForm': './src/components/Form/ModelForm',
    'components/Form/Form': './src/components/Form/Form',
    'components/Form/FormField': './src/components/Form/FormField',
    'components/RepositoryIndex/index': './src/components/RepositoryIndex',
    'components/ToastProvider/index': './src/components/ToastProvider',
  },
  output: {
    path: path.resolve('lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
        // {
        //     test: /\.ts?/,
        //     use: 'ts-loader',
        //     exclude: /node_modules/,
        // },
        {
          test: /\.tsx|.ts?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
              },
            },
          ],
        },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        // {
        //     test: /\.css$/,
        //     loader: "style-loader!css-loader"
        // }
    ]
  },
  externals:[ 
    {
      axios: 'axios',
      i18next: 'i18next',
      'i18next-browser-languagedetector': 'i18next-browser-languagedetector',
      lodash: 'lodash',
      react: 'react',
      'react-dom': 'react-dom',
      'react-i18next': 'react-i18next',
      'react-router-dom': 'react-router-dom',
      'react-jsx-runtime': 'react-jsx-runtime',
      uuid: 'uuid'
    },
    /@mui\/.*/,
    /@emotion\/react\/.*/,
    /@emotion\/styled\/.*/,




  ],
  // plugins: [new ChunksWebpackPlugin()],
};

// /** Callbacks with global UMD-name of material-ui imports */
// function externalMaterialUI (_, module, callback) {
//   var isMaterialUIComponent = /^@mui\/material\/([^/]+)$/;
//   var match = isMaterialUIComponent.exec(module);
//   if (match !== null) {
//       var component = match[1];
//       return callback(null, `window["mui"].${component}`);
//   }
//   callback();
// }