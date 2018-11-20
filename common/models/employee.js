'use strict';
const esClient = require('../../env').esClient;

module.exports = function(Employee) {
  Employee.observe('after save', (ctx, next) => {
    console.log('after save being run');
    console.log(ctx.instance);

    const id = ctx.instance.id;
    delete ctx.instance.id;

    esClient.create({
      index: 'employee',
      type: 'docs',
      body: ctx.instance,
      id: id.toString(),
    }).then(resp => {
      console.log('ok from es', resp);
      next();
    }).catch(err => {
      throw new Error(err);
    });
  });

  Employee.observe('before delete', (ctx, next) => {
    console.log('before delete run');
    console.log(ctx.where);

    esClient.deleteByQuery({
      index: 'employee',
      body: {
        'query': {
          'ids': {
            'type': 'docs',
            'values': ctx.where.id.inq,
          },
        },
      },
    }).then(() => {
      next();
    }).catch(err => {
      throw new Error(err);
    });
  });

  Employee.remoteMethod('search', {
    accepts: {
      arg: 'text',
      type: 'string',
    },
    returns: {
      arg: 'result',
      type: 'Object',
    },
    http: {
      verb: 'get',
    },
  });

  Employee.search = (text, cb) => {
    console.log(`Employee search: ${text}`);
    esClient.search({
      index: 'employee',
      type: 'docs',
      q: text,
    }).then(resp =>{
      cb(null, resp);
    });
  };
};
