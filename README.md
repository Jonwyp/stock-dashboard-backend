# Stockuote (Backend)- A stock dashboard app

## Table of Contents

- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Setup](#Setup)
- [Environment Variables](#Environment-Variables)
- [Availble Scripts](#Available-Scripts)
- [Availblve Routes](#Available-Routes)

## Introduction

An app that allows users to search for U.S listed stocks and find detailed information (including price charts, stock information, and latest news) about the selected stock. Link to React frontend: https://github.com/Jonwyp/stock-dashboard-react

## Technologies

- JavaScript ES6
- MongoDB
- Express: 4.17.1
- Mongoose: 5.9.1
- bcryptjs: 2.4.3
- cookie-parser: 1.4.4
- cors: 2.8.5
- dotenv: 8.2.0
- jsonwebtoken: 8.5.1
- uuid: 3.4.0

## Setup

To run this project, git clone and install it locally using npm:

```bash
$ cd ../
$ git clone https://github.com/Jonwyp/stock-dashboard-backend.git
$ npm install
$ npm start
```

## Environment Variables

- JWT_SECRET_KEY: secret key to use with JsonWebToken

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

```js
npm start // runs the app in development mode
npm rund startd // runs the app in nodemon
npm test // runs test runner in interactive watch mode
npm run testc // runs test coverage without watch mode
npm run startdb // runs monogod with dbpath set as ~/data/db
```

## Available Routes

```json
    "0": "GET /",
    "1": "GET /stocks",
    "2": "POST /stocks",
    "3": "GET /stocks/:quote",
    "4": "GET /stocks/:quote/forecast",
    "5": "POST/stocks/:quote/forecast",
    "6": "PATCH/stocks/:quote/forecast/:id",
    "7": "DELETE /stocks/:quote/forecast/:id",
    "8": "GET /users/:username",
    "9": "POST /users/register",
    "10": "POST /users/login",
    "11": "POST /users/logout"
```
