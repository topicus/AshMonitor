var page = require('webpage').create(),
    system = require('system'),
    address,
    time_response;


if (system.args.length === 1) {
    console.log('Usage: monitor.js <some URL>');
    phantom.exit(1);
} else {
    address = system.args[1];
    console.log("INICIANDO...");
    check();   
    setInterval(check, 10000);
}
function check(){
    var eventTriggered = false;
    time_response = Date.now();
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        }else if(!eventTriggered && status == 'success'){        
            time_response = Date.now() - time_response;
            console.log("Tiempo de respuesta: " + time_response + " milisegundos");     
            eventTriggered = true;
        }             
    });            
}