const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        'path': path.resolve(__dirname, 'dist/'),
        'filename': 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '...'],
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: '/node_modules/',
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    }
}