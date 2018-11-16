'use strict';

module.exports = {
  'keycloakConfig': {
    'realm': 'dtr',
    'auth-server-url': 'http://keycloak-cycle.qa.ecs.aop.cambridge.org:8367/auth',
    'ssl-required': 'external',
    'resource': 'dtr-qa',
    'public-client': true,
    'confidential-port': 0,
  },
  'frontendBaseUrl': 'http://dtr.qa.aop.cambridge.org',
};
