var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'andonfonte',
  description: 'Fonte Tablet',
  script: 'C:\\andon-jfa-fonte-oficial\\andon-jfa-fonte-oficial\\andon-jfa-master\\src\\app\\express.js'
});
console.log("teste")
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();