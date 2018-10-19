'use strict';

module.exports = function(app) {
  var Employee = app.models.employee;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Employee.findOne({where: {username: 'cemanalo'}}, (err, employee) => {
    if (!employee) {
      Employee.create([
        {
          firstName: 'Carlo Eugene', lastName: 'Manalo',
          username: 'cemanalo', email: 'a@a.org',
          password: '1'},
      ], function(err, users) {
        if (err) throw err;

        // create the admin role
        Role.create({
          name: 'admin',
        }, function(err, role) {
          if (err) throw err;

          // make bob an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: users[0].id,
          }, function(err, principal) {
            if (err) throw err;
          });
        });
      });
    }
  });
};
