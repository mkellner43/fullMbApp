import axios from "axios";

export const getFriends = async() => {
  try{
     const { data } = await axios.get('friend_requests/friends')
     return data
  } catch (error) {
    return error
  }
}

export const getSuggestions = async() => {
  try {
    const { data } = await axios.get('friend_requests/suggestions')
    return data
  } catch (error) {
    return error
  }
}


export const getPendingRequests = async() => {
  try {
    const { data } = await axios.get('friend_requests/pending')
    return data
  } catch (error) {
    return error
  }
}

export const sendFriendRequest = async(id) => {
  try {
    const { data } = await axios.post(`friend_requests/${id}`)
    return data
  } catch (error) {
    return error
  }
}

export const acceptFriend = async(id) => {
  try {
    const { data } = await axios.post(`friend_requests/accept/${id}`)
    return data
  } catch (error) {
    return error
  }
}


export const declineFriend = async(id) => {
  try {
    const { data } = axios.delete(`friend_requests/${id}`)
    return data
  } catch (error) {
    return error
  }
}
