module.exports = function(io){
    var usernames = [];

    io.sockets.on("connection", function(socket){
        console.log('Have a new user connected!');

        // lang nghe su kien addUser tu client gui len (chat.ejs)
        socket.on('adduser', function(username){ 
            socket.username = username; //luu username lai tren server
            usernames.push(username);

            //thong bao den nguoi vua tham gia chat 
            var data = {
                sender: 'Server',
                message: 'You have joned chat room'
            };
            socket.emit('update_message', data);

            //thong bao den cac user khac trong chat room
            var data = {
                sender: 'Server',
                message: username + ' has joined chat room'
            };
            socket.broadcast.emit('update_message', data);
        }); 

        //lang nghe su kien send_message
        socket.on('send_message', function(message){
            //gui tn den chinh ban than
            var data = {
                sender: 'You',
                message: message
            };
            socket.emit('update_message', data);

            //gui tn den cac user khac
            var data = {
                sender: socket.username,
                message: message
            };
            socket.broadcast.emit('update_message', data);
        });

        //lang nghe su kien disconnect
        socket.on('disconnect', function(){
            //xoa nguoi dung vua thoat
            for(var i = 0; i < usernames.length; i++){
                if(usernames[i] == socket.username){
                    usernames.splice(i, 1);
                }
            }

            //thong bao cho moi nguoi biet co nguoi vua thoat
            var data = {
                sender: 'Server',
                message: socket.username + ' has left chat room'
            }
            socket.broadcast.emit('update_message', data);
        });

    });
}