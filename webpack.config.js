const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const sourcePath = './src/';
const outputPath = './dist/';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(templateDir).filter(file => file.substr(-5) === '.html');
    const template1 =  templateFiles.map(file => 
        new HtmlWebpackPlugin({
            favicon: './favicon.ico',
            template: `./${file}`,
            filename: `${file}`,
            hash: true,
            inject: 'body',
            chunks: ['ui'],
        })
    );

    /*
        서브페이지 여러개 구성일 경우
        1. fs.readdirSync('./src/pages1/') 부분 경로 확인 필요
        2. template: `./pages1/${file}`,  부분 경로 확인 필요
            filename: `pages1/${file}`,
    */
    const templateFiles2 = fs.readdirSync('./src/pages1/').filter(file => file.substr(-5) === '.html');
    const template2 =  templateFiles2.map(file => 
        new HtmlWebpackPlugin({
            favicon: './favicon.ico',
            template: `./pages1/${file}`,
            filename: `pages1/${file}`,
            hash: true,
            inject: 'body',
            chunks: ['ui'],
        })
    );

    /*
        서브페이지 단일 구성일 경우
        template: `./pages2/pages2.html`, 부분 경로 확인 필요
        filename: `pages2/pages2.html`,
    */
    const template3 =  [
            new HtmlWebpackPlugin({
                favicon: './favicon.ico',
                template: `./pages2/pages2.html`,
                filename: `pages2/pages2.html`,
                hash: true,
                inject: 'body',
                chunks: ['ui'],
            }),
    ];

    // 서브페이지 있다면 push로 추가 ( 컨트롤 + F 변수 확인 필요 ex: template2 )
    template1.push(...template2);
    template1.push(...template3);

    return template1;
}

module.exports = (env) => {
    // Webpack 플러그인
    const plugins = [
        new CleanWebpackPlugin([outputPath]),
        new CopyWebpackPlugin([
            {
                from: './libs/**/*',
                force: true,
            },
            { // HTML 에 img 태그 사용으로 이미지 넣을 시 경로
                from: 'img/test',
                to: 'img/test'
            },
            {
                from: './Src/img/**',
                to: './img',
                flatten: true
            },
            {
                from: './favicon.ico',
                to: 'favicon.ico'
            }
        ]),
        new ExtractTextPlugin('css/style.css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ];

    // html의 개수에 따라 HtmlWebpackPlugin 생성
    const htmlList = generateHtmlPlugins(sourcePath);

    // HtmlWebpackPlugin 확장 플러그인
    const htmlPlugins = [
        new HtmlBeautifyPlugin({
            config: {
                html: {
                    indent_size: 2,
                    end_with_newline: true,
                    preserve_newlines: true,
                    unformatted: ['p', 'i', 'b', 'span'],
                },
            },
        }),
    ];

    console.log(env.NODE_ENV);

    return {
        context: path.resolve(__dirname, sourcePath),
        entry: {
            ui: [
                './css/style.scss',
                './js/ui.js'
            ],
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, outputPath),
        },
        devServer: {
            open: true,
            contentBase: path.resolve(__dirname, outputPath),
            watchContentBase: true,
            inline: true,
        },
        devtool: env.NODE_ENV === 'development' ? 'source-map' : false,
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: env.NODE_ENV === 'production',
                            },
                        }, {
                            loader: 'sass-loader',
                        }],
                        fallback: 'style-loader',
                        publicPath: '../',
                    }),
                },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    exclude: /node_modules/,
                    loader: 'url-loader',
                    options: {
                        // name: env.NODE_ENV === 'development' ? '[name].[ext]' : '[name].[ext]?[hash]',
                        // outputPath: `./img/`,
                        name: env.NODE_ENV === 'development' ? '[path][name].[ext]' : '[path][name].[ext]?[hash]',
                        limit: 1000,
                    },
                },
                /*{
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                },*/
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'babel-preset-env'
                        ],
                    },
                },
            ],
        },
        plugins: plugins.concat(htmlList).concat(htmlPlugins),
    };
};
