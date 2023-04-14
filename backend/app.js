const createError = require('http-errors');
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

//socket io 
// const io = require('socket.io')(8900, {
//   cors: {
//     origin: process.env.FRONT_END_URL,
//   }
// });
// io.on('connection', async (socket) => {
//   socket.join(socket.handshake.auth.userID)
//   socket.on('send message', ({id, thread}) => {
//     socket.to(id).emit('message received', thread)
//   })
//   socket.on('typing', (id) => {
//     socket.to(id).emit('typing')
//     setTimeout(() => {
//       socket.to(id).emit('not typing')
//     }, 1000 * 50)
//   })
//   socket.on('not typing', (id) => {
//     socket.to(id).emit('not typing')
//   })
//   socket.on('notification', ({to_id, type, msg}) => {
//     socket.to(to_id).emit('notification', msg)
//   })
//   let users = [];
//   for (let [id, socket] of io.of("/").sockets) {
//     users.push(socket.handshake.auth.userID);
//   }
//   users = users.filter((value, index, array) => array.indexOf(value) === index)

//   io.emit('onlineFriends', users)

//   socket.on('logOut', (id) => {
//     users = users.filter(user => user !== id)
//     io.emit('onlineFriends', users)
//   })

//   socket.on('reconnect', () => {
//     for (let [id, socket] of io.of("/").sockets) {
//       users.push(socket.handshake.auth.userID);
//     }
//     users = users.filter((value, index, array) => array.indexOf(value) === index)
//     io.emit('onlineFriends', users)
//   })

//   socket.on('disconnect', () => {
//     const online = users.filter(user => user !== socket.handshake.auth.userID)
//     io.emit('onlineFriends', online) })
// })

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const postRouter = require('./routes/post');
const friendRequestRouter = require('./routes/friend_request');
const messageRouter = require('./routes/message');

const app = express();

app.use(cors({origin: process.env.FRONT_END_URL, credentials: true}))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: '50mb' ,extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/friend_requests', friendRequestRouter);
app.use('/api/v1/messages', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.json({error: err.message});
});


app.listen(process.env.PORT || 3000)

// need to restructure controller to improve efficency, it is not currently optimized.