import axios from "axios";

export const getPosts = async(pageParam) => {
  try {
    const { data } = await axios.get(`posts?page=${pageParam}`)
    return data
  } catch (error) {
    return error    
  }
}

export const sendPost = async(object) => {
  try {
    const { data } = await axios.post(`posts`, object)
    return data
  } catch (error) {
    return error    
  }
}

export const deletePost = async(id) => {
  try {
    const { data } = await axios.delete(`posts/${id}`)
    return data
  } catch (error) {
    return error    
  }
}

export const postLike = async({object}) => {
  try {
    const { data } = await axios.post(`posts/like/${object._id}`)
    return data
  } catch (error) {
    return error    
  }
}

export const postComment = async({object, comment}) => {
  try {
    const { data } = await axios.post(`comments/${object._id}`, {comment_body: comment})
    return data
  } catch (error) {
    return error    
  }
}

export const getPostComments = async(id, limit=10, skip=0) => {
  try {
    const { data } = await axios.get(`comments/${id}/?limit=${limit}&skip=${skip}`)
    return data
  } catch (error) {
    return error    
  }
}


//look into Axios because apparently fetch is 🗑️

// export const getPosts = () => {
//   return fetch('http://localhost:3000/api/v1/posts', {
//     method: 'get',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json'
//     },
//     credentials: 'include'
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//     throw new Error('log in required')
//   })
//   .then(data => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const sendPost = (object) => {
//   console.log(object)
//   return fetch('http://localhost:3000/api/v1/posts', {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     credentials: 'include',
//     body: object
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//    throw new Error('Something went wrong :(')
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const deletePost = (id) => {
//   return fetch(`http://localhost:3000/api/v1/posts/${id}`, {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     credentials: 'include',
//   })
//     .then(res => {
//       if(res.ok) return res.json()
//       document.cookie = 'access_token= ; max-age=0'
//       sessionStorage.clear()
//     })
//     .then(data => {
//       return data
//     })
//     .catch(error => {
//       return Promise.reject(error)
//     })
// }

// export const postLike = ({object}) => {
//   return fetch(`http://localhost:3000/api/v1/posts/like/${object._id}`, {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     credentials: 'include',
//   })
//   .then(res => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then(data => data)
//   .catch(error => {
//     return Promise.reject(error)
//   })
// };


// export const postComment = ({object, comment}) => {
//   return fetch(`http://localhost:3000/api/v1/comments/${object._id}`, {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     credentials: 'include',
//     body: JSON.stringify({comment_body: comment})
//   })
//     .then(res => {
//       if(res.ok) return res.json()
//       document.cookie = 'access_token= ; max-age=0'
//       sessionStorage.clear()
//     })
//     .then(data => data)
//     .catch(error => {
//       return Promise.reject(error)
//     })
// }

// export const getPostComments = (id, limit=2, skip=0) => {
//   return fetch(`http://localhost:3000/api/v1/comments/${id}/?limit=${limit}&skip=${skip}`,{
//     method: 'get',
//     headers: {
//       'Accept': 'application/json'
//     },
//     credentials: 'include'
//   })
//   .then(res => res.json())
//   .then(data => data)
//   .catch(err => {
//     return Promise.reject(err)
//   })
// }
