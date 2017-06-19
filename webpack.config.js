const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');

const production = process.env.NODE_ENV == 'production';

const pkg = require('./package.json');

console.log(`Running ${production ? 'production' : 'dev'} app`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);

var plugins = [];

var rules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
    }
];

if (production) {
    rules = [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    }
                ],
            })
        }
    ];
  
    plugins = plugins.concat([
        new webpack.LoaderOptionsPlugin({
            debug: !production
        }),

        new ExtractTextPlugin({
            filename: 'simplebar.css',
            allChunks: true
        }),
    
        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            sourceMap: false,
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),

        new webpack.BannerPlugin({
            banner: `
            ${pkg.title || pkg.name} - v${pkg.version}
            ${pkg.description}
            ${pkg.homepage}
            
            Made by ${pkg.author}
            Under ${pkg.licenses[0].type} License
        `
        }),
  
    ]);

}

module.exports = {
    devtool: production ? false : 'source-map',
  
    entry: './src/simplebar',
  
    devServer: {
        contentBase: './demo'
    },
  
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'simplebar.js',
        libraryTarget: 'umd',
        library: 'SimpleBar'
    },
  
    module: {
        rules
    },
  
    plugins
};
