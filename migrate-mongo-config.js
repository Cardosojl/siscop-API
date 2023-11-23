// In this file you can configure migrate-mongo
require('dotenv/config');

const config = {
    mongodb: {
        url: process.env.dbURI,

        // TODO Change this to your database name:
        databaseName: 'siscop01',

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        },
    },

    migrationsDir: './src/migrations',

    changelogCollectionName: 'test_changelog',

    migrationFileExtension: '.ts',

    useFileHash: false,

    moduleSystem: 'commonjs',
};

module.exports = config;
