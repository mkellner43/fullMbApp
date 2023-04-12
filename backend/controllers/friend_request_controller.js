const FriendRequest = require('../models/friend_request');
const User = require('../models/user');
const Notification = require('../models/notification');

exports.new = async (req, res, next) => {
  try{
    const result = await FriendRequest.create({
      requester: req.user.user_id,
      receiver: req.params.user_id,
    })
    const requester = await User.findById(req.user.user_id)
    requester.friend_requests.push(result)
    await requester.save()
    const receiver = await User.findById(req.params.user_id, '_id username first_name last_name notifications friend_requests avatar')
    receiver.friend_requests.push(result)
    const notification = await Notification.create({
      requester: req.user.user_id,
      receiver: req.params.user_id,
      type: 'Friend Request',
      data: result,
      msg: `${req.user.username} sent you a friend request!`
    })
    receiver.notifications.push(notification)
    await receiver.save()
    res.status(200).json({request_id: result._id , user: receiver, type: 'receiver'})
  } catch(err) {
    next(err)
  }
}

exports.accept = async (req, res, next) => {
  try {
    const request = await FriendRequest.findById(req.params.id)
    .populate('requester', '_id username first_name last_name avatar')
    .populate('receiver', '_id username first_name last_name avatar')
    request.status = 'accepted'
    await request.save()
    console.log(request)
    const notification = await Notification.create({
      requester: request.receiver._id,
      receiver: req.user.user_id,
      type: 'Friend Request',
      data: request,
      msg: `${request.receiver.username} accepted your friend request!`
    })
    const requester = await User.findById(request.requester._id).exec()
    requester.notifications.push(notification)
    await requester.save()
    res.json({request_id: request._id, user: {_id: request.requester._id, username: request.requester.username, first_name: request.requester.first_name, last_name: request.requester.last_name}})
  } catch(e) {
    console.log(e)
    next(e)
  }
}

exports.delete = async(req, res, next) => {
  try{
    const [users, request] = await Promise.all([
       User.updateMany({}, { $pull: { friend_requests: req.params.id}}),
       FriendRequest.deleteOne({_id: req.params.id}).exec()
    ])
    res.json({users, request})
  } catch (error) {
    next(error)
  }
  
  
  // User.updateMany({}, { $pull: { friend_requests: req.params.id}}).exec()
  // .then(result => {
  //   console.log(result)
  //   FriendRequest.deleteOne({_id: req.params.id}).exec()
  //   .then((result) => {
  //     result.deleteOne()
  //   })
  //   .then(data => {
  //     console.log(result, data)
  //     return res.send({result, data})
  //   })
  // })
  // .catch(next)
}

exports.show_friends = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({$or: [{requester: req.user.user_id, status: 'accepted'}, {receiver: req.user.user_id, status: 'accepted'}]})
    .populate('requester', 'username first_name last_name avatar')
    .populate('receiver', 'username first_name last_name avatar')
    .sort({date: -1})
    if(requests.length > 0){
      const friends = []
       await Promise.all(requests.map(async(request) => {
        if(request.receiver.id === req.user.user_id) {
          await request.requester.populate('avatar')
          friends.push({request_id: request.id, user: request.requester})
        } else {
          await request.receiver.populate('avatar')
          friends.push({request_id: request.id, user: request.receiver})
        }}))
          res.send(friends)
      } else res.json(requests)
  } catch (e) {
    next(e)
  }
}

exports.suggestions = async (req, res, next) => {
  try {
    User.findById(req.user.user_id).select('friend_requests')
    .then( async(result) => {
      const suggestions = await User.find({$and: [{_id: { $nin: req.user.user_id}}, {friend_requests: {$nin: result.friend_requests}}]})
      .select('_id username first_name last_name avatar friend_requests')
      .populate('avatar')
      res.send(suggestions)
    })
  } catch (e) {
    next(e)
  }
}

exports.pending = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({$or: [{requester: req.user.user_id, status: 'pending'}, {receiver: req.user.user_id, status: 'pending'}]})
      .populate('requester', 'username first_name last_name avatar')
      .populate('receiver', 'username first_name last_name avatar')
      .sort({date: -1})
      
   if(requests?.length > 0){
    const friends = []
      await Promise.all(requests.map(async(request) => {
      if(request.receiver._id == req.user.user_id) {
        await request.requester.populate('avatar')
        friends.push({request_id: request.id, user: request.requester, type: 'receiver'})
      } else {
        await request.receiver.populate('avatar')
        friends.push({request_id: request.id, user: request.receiver, type: 'requester'})
      }}))
        res.send(friends)
      } else res.json(requests)
  } catch (e) {
    next(e)
  }
}