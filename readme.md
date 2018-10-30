# Clickstream analysis

> This application find out key measures of a website, which help you to know the visitors' behavior in the website.

Some measures are:

- views number per page
- unique visitors
- average of the visit duration time

## Prerequisites

- NodeJS v8
- MYSQL 5.7+

## Configuring, installing and running

Please follow all the steps in the order below

### 1. Importing database

First create database.

Inside the sql folder you will find a sql file, use it to generate the database

```
$ mysql -u root -p [your-database-name] < [root-path]/sql/database.sql
```

> Remember: Use Mysql 5.7 +

### 2. Install dependencies

with npm

```
$ npm install
```

with yarn

```
$ yarn
```

### 3. Setting envars

_First copy .env.example to .env file_

Replace values according to their own environment

```
DB_HOST=<your-database-host>
DB_USER=<your-database-user>
DB_PASSWORD=<your-database-password>
DB_CONNECTION_LIMIT=<min:1, max:10>
DB_DATABASE=<your-database-name>
DB_PORT=<your-database-port>
DB_DEBUG=<true|false>

PORT=<your-node-server-port>
```

### 4. Running server

Run in your terminal

with npm

```
$ npm run start
```

with yarn

```
$ yarn start
```

## About testing data

further data will be generated after importing the database, use them for testing purposes

    user email:raul@example.com
    user password:123456
    secret:3a719bcc-d02c-4d16-a9e3-c93231f57001

    site client id:123456789
    site domain:localhost
