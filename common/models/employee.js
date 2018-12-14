'use strict';
const esClient = require('../../env').esClient;

module.exports = function(Employee) {
  Employee.observe('after save', async (ctx, next) => {
    console.log('after save being run');
    console.log(ctx.instance);

    const id = ctx.instance.id;
    delete ctx.instance.id;

    const exists = await esClient.exists({
      index: 'employee',
      type: 'docs',
      id: id.toString(),
    });

    let method = 'update';
    const payload = {
      index: 'employee',
      type: 'docs',
      body: {},
      id: id.toString(),
    };

    if (exists) {
      payload.body.doc = ctx.instance;
    } else {
      method = 'create';
      payload.body = ctx.instance;
    }

    esClient[method](payload).then(resp => {
      console.log('ok from es', resp);
      next();
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
    accepts: [
      {
        arg: 'q',
        type: 'string',
      },
      {
        arg: 'from',
        type: 'string',
      },
      {
        arg: 'size',
        type: 'string',
      },
    ],
    returns: {
      arg: 'result',
      type: 'Object',
    },
    http: {
      verb: 'get',
    },
  });

  Employee.search = (q = '*', from = 0, size = 25, cb) => {
    console.log(`Employee search: ${q}, page: ${from}, size=${size}`);
    esClient.search({
      index: 'employee',
      type: 'docs',
      q,
      from,
      size,
      body: {
        sort: [{'lastName': 'asc'}],
      },
    }).then(resp =>{
      cb(null, resp);
    });
  };
};
