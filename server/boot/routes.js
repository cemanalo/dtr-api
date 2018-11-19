'use strict';

const KeycloakConnect = require('keycloak-connect');
const env = require('../../env');
const keycloakConfig = env.keycloakConfig;
const session = require('express-session');
const memoryStore = new session.MemoryStore();
const jwt = require('jsonwebtoken');

const keycloak = new KeycloakConnect({
  store: memoryStore,
}, keycloakConfig);

module.exports = function(app) {
  app.use(session({
    secret: 'dtr-namba-1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  }));

  app.use(keycloak.middleware());

  app.get('/healthz', function(req, res) {
    res.sendStatus(200);
  });

  /**
   * keycloak login
   * accounts: peter, fury, thanos
   * password: test1234
   */
  app.get('/auth/login', keycloak.protect(), (req, res) => {
    const token = JSON.parse(req.session['keycloak-token']);
    const decode = jwt.decode(token.access_token);

    const userName = decode.preferred_username;
    const email = decode.email;
    const givenName = decode.given_name;
    const familyName = decode.family_name;
    const password = 'password';

    app.models.employee.findOrCreate({
      where: {
        email: email,
      },
    },
      {
        username: userName,
        email: email,
        firstName: givenName,
        lastName: familyName,
        password: password,
      },
    (err, data) => {
      if (err) return err;
      console.log(data);
    });

    const loginCallback = `${env.frontendBaseUrl}/login/callback`;

    app.models.employee.login({
      email: email,
      password: password,
    }, (err, token) => {
      if (err) return err;
      res.redirect(`${loginCallback}?user=${token.userId}&token=${token.id}`);
    });
  });
};
