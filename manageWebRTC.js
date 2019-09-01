function(socket){
  console.log('a user connected');

  socket.on('offer', function(offer){
    console.log('offer: ' + offer);
    socket.broadcast.emit('offer', offer)
  });

  socket.on('answer', function(answer){
    console.log('answer: ' + answer);
    socket.broadcast.emit('answer', answer)
  });

  socket.on('candidate', function(candidate){
    console.log('candidate: ' + candidate);
    socket.broadcast.emit('candidate', candidate)
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});