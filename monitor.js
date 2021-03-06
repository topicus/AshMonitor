var phantom = require('phantom'),
    nodemailer = require("nodemailer"),
    config = require('./config'),
    page = null,
    time_response,
    server_state = 'up';

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: config.gmail.email,
        pass: config.gmail.password
    }
});
var downMessage = {
    from: config.gmail.name + " <"+config.gmail.email+">", // sender address
    to: config.recipients.join(), // list of receivers
    subject: "Volvio ASH", // Subject line
    text: "", // plaintext body
    html: "" // html body
}
var upMessage = {
    from: config.gmail.name + " <"+config.gmail.email+">", // sender address
    to: config.recipients.join(), // list of receivers
    subject: "Volvio ASH", // Subject line
    text: "", // plaintext body
    html: "" // html body
}
phantom.create(function(ph) {
  return ph.createPage(function(p) {
    page = p;
    check();
  });
});

function check(){
    var eventTriggered = false;
    time_response = Date.now();    
    page.open(config.site, function(status) {
        if(!eventTriggered){
            if (status !== 'success') {
                console.log('DOWN SERVER');
                state('down');
            }else if(status == 'success'){        
                time_response = Date.now() - time_response;
                console.log("Response time: " + time_response + " miliseconds");     
                state('up');
            }
            eventTriggered = true;            
            setTimeout(check, 10000);            
        }
    });    
}
function state(s){
    if(server_state=='up' && s == 'down')
        sendMail(downMessage);
    else if(server_state == 'down' && s == 'up')
        sendMail(upMessage);

    server_state = s
}
function sendMail(message){
    console.log(message);
    smtpTransport.sendMail(message, function(error, response){
        if(error)
            console.log(error);
        else
            console.log("Message sent: " + response.message);
    });    
}