import axios from "axios";

export const getFriends = async(pageParam) => {
  try{
     const { data } = await axios.get(`friend_requests/friends?page=${pageParam}`)
     return data
  } catch (error) {
    return error
  }
}

export const getSuggestions = async(pageParam) => {
  try {
    const { data } = await axios.get(`friend_requests/suggestions?page=${pageParam}`)
    return data
  } catch (error) {
    return error
  }
}


export const getPendingRequests = async(pageParam) => {
  try {
    const { data } = await axios.get(`friend_requests/pending?page=${pageParam}`)
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
