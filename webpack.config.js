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
    'components/RepositoryIndex': './src/components/RepositoryIndex',
    'components/ToastProvider': './src/components/ToastProvider',
  },
  output: {
    path: path.resolve('lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
        {
            test: /\.tsx|.ts?/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        // {
        //     test: /\.css$/,
        //     loader: "style-loader!css-loader"
        // }
    ]
  },
  externals: {
    '@emotion/react': '@emotion/react',
    '@emotion/styled': '@emotion/styled',
    '@mui/material': '@mui/material',
    axios: 'axios',
    i18next: 'i18next',
    'i18next-browser-languagedetector': 'i18next-browser-languagedetector',
    lodash: 'lodash',
    react: 'react',
    'react-dom': 'react-dom',
    'react-i18next': 'react-i18next',
    'react-router-dom': 'react-router-dom',
    uuid: 'uuid'
  }
};