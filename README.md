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

### Initiate DataBase with initial values
 ```bash
 npm run dbInit
 ```
## How to Use
### Run the application
  ```bash
  npm start
  ```
### Login
+ To be able to make requests, you must log in. Login is by accessing the URL `HOST:PORT/login` and in the body of the request it is necessary to pass the parameters `"name": "ADM"` `"password": "123456"`
  
### Collections

  + **Login**  -  Used to log in (necessary to use the application)
  
  + **Users**  -  Manage application users
  
  + **Processes**  -  Manage application process
  
  + **Process States**  -  Manage processes states
  
  + **Sections**  -  Manage the sections present in the Entity/Company
  
  + **Years**  -  Manage processes years
  
  + **Acquisition Ways**  -  Manage the kind of processes
  
  + **Messages**  -  Manage received messages
  
  + **Messages Sent**  -  Manage Sent messages
  
  + **Messages Archived**  -  Manage Archived messages
  
  + **Files**  -  Manage processes files
  
### To make requests use

  1. **Index** - Displays all collection elements:  ***GET*** `HOST:PORT/users`
     
  2. **Show** - Displays only one element from the collection (It is necessary to use some search filter): ***GET*** `HOST:PORT/users/user?name=ADM`
     
  3. **Store** - Saves an element within the collection (It is necessary send the body request): ***POST*** `HOST:PORT/users`
     
  4. **Update** - Update a collection element (It is necessary send the body request and a search filter): ***PUT*** `HOST:PORT/users?name=ADM`
     
  5. **Delete** - Delete an element from the collection (It is necessary to use some search filter): ***DELETE*** `HOST:PORT/users?name=ADM`

<div style="display: inline">
<img src="https://lh3.googleusercontent.com/pw/ADCreHfSxs70Y9oqZy0HMoACmCdQnhNy4X1xGE08s5bdHXRZNQQPj3XUO8EJfDuPlOrl7Mbv3c2v47jPDH5Kdhu1ObDtAtQHuQIKdq2QZEwx4eG4ApxVBTcKpZfP7FyPjAUDUAZeNsk8BwLppczSps0SLg=w1358-h701-s-no?authuser=1" width="400px" />
<img src="https://lh3.googleusercontent.com/pw/ADCreHc8Ord5eg8AH7s9MHqpS2xzmT22Vu80N_ptVQC-BqhX1eazkWKA0oAtIFYKTfVq_sPB0fIi6EVBCQTwYOYK21Me142olKdd0CnVvN-6RdY73xJd59WB-W_V8SA2aR_0D-BQNFsOR4ydOw4uj5YN-Q=w1358-h701-s-no?authuser=1" width="400px" />  
</div>