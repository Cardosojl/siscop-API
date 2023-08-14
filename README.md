# siscop-API
REST API Developed with Node.js, Express, Typescript and Mongoose to provide datas from a Mongodb database to a Front-End application.

[![Author](http://img.shields.io/badge/author-@Cardosojl-blue.svg)](https://www.linkedin.com/in/jorge-luiz-cardoso-215914235/) ![GitHub license](https://img.shields.io/github/license/maitraysuthar/rest-api-nodejs-mongodb.svg)


The idea of this application is to provide the relationship between the Siscop-REACT application with the database MongoDB,
where the data, necessary for the perfect functioning of that application, are kept.


## Features
+ User's passwords go through a password hashing process.
+ Sessions are managed by express-session and kept in database for 30 minutes.

## Requirements
+ Mongodb database with replica set

## How to install
### Clone the project to your machine
  ```bash
  git clone https://github.com/Cardosojl/siscop-API.git ./siscopApi
  ```
### Install the dependencies
  ```bash
  cd siscopApi
  npm install
  ```
### Create the environment file
  ```bash
  touch .env
  ```
### Fill in the .env with the necessary information
1. PORT= (port value the API will run on)
2. HOST= (api host)
3. dbURI= (mongodb uri) ex: `mongodb://username:password@host:port/database?options`
4. SECRET= (session secret)
5. ORIGIN= (origins that will be allowed in cors. They need to be separated by commas ',')
