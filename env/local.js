'use strict';
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: 'http://localhost:9200',
});

module.exports = {
  'keycloakConfig': {
    'realm': 'dtr',
    'auth-server-url': 'http://keycloak-cycle.qa.ecs.aop.cambridge.org:8367/auth',
    'ssl-required': 'external',
    'resource': 'dtr-local',
    'public-client': true,
    'confidential-port': 0,
  },
  'frontendBaseUrl': 'http://localhost:8080',
  'esClient': esClient,
};
