// requiring the express module.
var express = require('express');

// Requiring the http module.
var http = require('http');

// Since Express is a framework of nodejs, here 'express()' is creating an express object and it is stored in variable 'app'.
var app = express();

// In this line a server is created using the method 'createServer' .
var server = http.createServer(app);

//Requiring the socket.io module and creating a new instance of the socket.io by passing the http server object.
var io = require('socket.io')(server);

// This array will hold the objects of the users containing the socketid and name of the user.
var users = [];


//Here we are handling the route for the '/' when a get request is made for this route and we are sending the html page as a response for the above get request. 
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');

});

//Here we are listening for the connection event that will be fired for each incoming sockets for this server.
io.on('connection',(socket)=>{
    
    //This object will contain the details of each socket connetion.
    var connections = {};

    //This array will contain the list of the rooms that each socket is connected to.
    var roomsLinked = [];

    //Here the socket handles the register_user event that will be fired when a new user will be logged in and here the socket receives a object named 'data' that contains the current user name and it's socket id.
    socket.on('register_user',data=>{
        
        //Here we check that whether the array containing the list of connected user is empty or not, if it is not empty then it will go inside the if condition otherwise it will go in the else condition.
        if(users.length !== 0){
            
            //Here traversing of the users array is done.
            for(let i in users){

                //If any name from the users array matches to the name of the user that want to login then the socket will fire a event 'username_already' and along with this event, the socket send the data object and this event will be handled on the client side and after this it will break the for in loop.
                if(users[i].name === data.uid){
                    socket.emit('username_already',data);
                    break;
                }

                //If the if condition mentioned above doesn't satisfies then the following code will run.
                
                //here we are creating a new property named 'socketID' in the connections object and assign it the socketid of the current user. 
                connections.socketID = data.sid;

                //here again a new property named 'name' is created for the connections object and the name of the current user is assigned to it.
                connections.name = data.uid;
                
                //here a new property named 'inbox' is created for the connections object and a blank array named 'roomsLinked' is assigned to it. 
                connections.inbox = roomsLinked;
                
                //here the connections object is added to the users array.
                users.push(connections);

                //Here the instance of socket.io module (io) will fire an event named 'new_user' for all the sockets along with the users array and it will be handled on the client side. 
                io.emit('new_user',users);
            }
            
        }
        else{

            //here we are creating a new property named 'socketID' in the connections object and assign it the socketid of the current user. 
            connections.socketID = data.sid;

            //here again a new property named 'name' is created for the connections object and the name of the current user is assigned to it.
            connections.name = data.uid;

            //here a new property named 'inbox' is created for the connections object and a blank array named 'roomsLinked' is assigned to it. 
            connections.inbox = roomsLinked;

            //here the connections object is added to the users array.
            users.push(connections);

            //Here the instance of socket.io module (io) will fire an event named 'new_user' for all the sockets along with the users array and it will be handled on the client side. 
            io.emit('new_user',users);
        }
    });

    //Here the socket handles the handle_new_user event that will be fired when the current user tries to connect to one of the user from the online users list.
    socket.on('handle_new_user',data=>{
        
    });

    //Here the socket handles the chat event that will be fired when the current user sends a message to another user.
    socket.on('chat',data=>{
        
    });

});

//Here the server is using the listen method to listen each incoming request for this server. It takes two arguments first a number(PORT NUMBER) and the second is a callback function that will run when the server will start listening at the specified port number.
server.listen(3000,()=>{
    //When the server is start listening then the following string will be printed in the console.
    console.log('Server is listening at 3000 port');
});








