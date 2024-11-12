var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'tabletfonte',
  description: 'Fonte Tablet',
  script: 'C:\\andon-jfa-fonte-oficial\\andon-jfa-fonte-oficial\\website-tablet\\src\\app\\express.js'
});
console.log("teste")
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();