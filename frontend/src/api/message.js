import axios from "axios";

export const sendMessage = async(to_id, message) => {
  try {
    const { data } = await axios.post('messages', {message, to_id})
    return data
  } catch (error) {
    return error
  }
}

export const getThreads = async() => {
  try {
    const { data } = await axios.get('messages')
    return data
  } catch (error) {
    return error
  }
}
            
export const getThread = async(friend_id, pageParam) => {
  try {
    const { data } = await axios.get(`messages/${friend_id}?cursor=${pageParam}`)
    return data
  } catch (error) {
    return error
  }
}
