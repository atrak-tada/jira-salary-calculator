'use strict';

const Koa = require('koa');
const logging = require('@kasa/koa-logging');
const requestId = require('@kasa/koa-request-id');
const apmMiddleware = require('./middlewares/apm');
const bodyParser = require('./middlewares/body-parser');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');
const corsConfig = require('./config/cors');
const logger = require('./logger');
const router = require('./routes');
const session = require('koa-session');
const views = require('koa-views');
const render = require('koa-ejs');
const path = require('path');
var JiraClient = require('jira-client');
var jwt = require('jsonwebtoken');
var key = require('./config/sk');

class App extends Koa {
  constructor(...params) {
    super(...params);

    // Trust proxy
    this.proxy = true;
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development';

    this.servers = [];

    this._configureMiddlewares();

    this._configureRoutes();

  }

  _configureMiddlewares() {   
    this.use(errorHandler());
    this.use(apmMiddleware());
    this.use(requestId());
    
    this.use(logging({
      logger,
      overrideSerializers: false
    }));
    
    this.use(
      bodyParser()
    );
    
    this.use(
      cors({
        origins: corsConfig.origins,
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
      })

    );
    this.use(session({ signed: false },this))
    render(this, {
      root: path.join(__dirname, '/views'),
      layout: 'template',
      viewExt: 'ejs',
      cache: false,
      debug: true,
      async:true
    });
    this.use(async function (ctx, next) {
      if (ctx.request.method == "POST" || ctx.request.method == "GET") {
                let token = ctx.session.authorization
        
        let auth = {}
        let jira = {}
        if (token) {
          auth = jwt.verify(token, key.secret)
        }
        
        
        else if (ctx.request.body.username && ctx.request.body.password) {

          auth = {
            username: ctx.request.body.username,
            password: ctx.request.body.password
          }
          token = jwt.sign(auth, key.secret)
          // ctx.jwtToken = token
          // console.log(token);
          
          ctx.session.authorization = token
        }

        if (auth) {
          jira = new JiraClient({
            protocol: 'http',
            host: 'jira.ham-sun.com',
            username: auth.username,
            password: auth.password,
            apiVersion: '2',
            strictSSL: false
          });
          ctx.jira = jira
        }
        return await next(ctx)
      }

    })
    
  }

  _configureRoutes() {
    // Bootstrap application router
    this.use(router.routes());

    this.use(router.allowedMethods());
  }

  listen(...args) {
    const server = super.listen(...args);
    this.servers.push(server);
    return server;
  }

  async terminate() {
    // TODO: Implement graceful shutdown with pending request counter
    for (const server of this.servers) {
      server.close();
    }

  }
}

module.exports = App;