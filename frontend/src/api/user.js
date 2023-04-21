import axios from "axios";

export const login = async (credentials, navigate) => {
  try {
    const { data } = await axios.post(`users/login`, credentials);
    sessionStorage.setItem("user", JSON.stringify(data));
    navigate("/");
    return data;
  } catch (error) {
    if (error.response.status === 401)
      return Promise.reject("Invalid username or password.");
    return Promise.reject(error.message);
  }
};

export const createUser = async (user) => {
  try {
    const { data } = await axios.post(`users/registration`, user);
    return data;
  } catch (error) {
    return error;
  }
};

export const profile = async (id, pageParam) => {
  try {
    const { data } = await axios.get(`posts/profile/${id}?page=${pageParam}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateAvatar = async (avatar) => {
  try {
    const { data } = await axios.put(`users/avatar`, { avatar });
    return data;
  } catch (error) {
    return error;
  }
};

// export const createUser = (data) => {
//   return fetch(`http://localhost:3000/api/v1/users/registration`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: data
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     if(res.status === 409) throw new Error('This user already exists, please log in.')
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error.message)
//   })
// }

// export const login = async (credentials, navigate) => {
//   return fetch('http://localhost:3000/api/v1/users/login', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Credentials': 'true'
//     },
//     credentials: 'include',
//     body: credentials
//   })
//   .then(res => {
//     if(res.ok) return res.json()
//     throw new Error('Incorrect username or password')
//   })
//   .then(data => {
//     if(data) {
//       sessionStorage.setItem('user', JSON.stringify(data))
//       navigate('/')
//     }
//     return data
//   })
//   .catch((err) => {
//     return Promise.reject(err.message)
//   })
// }

// export const profile = (id) => {
//   return fetch(`http://localhost:3000/api/v1/posts/profile/${id}`, {
//     method: 'get',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json'
//     },
//     credentials: 'include'
//   })
//   .then(res => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then(data => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const updateAvatar = (avatar) => {
//   const sendableAvatar = JSON.stringify({avatar: avatar})
//     return fetch('http://localhost:3000/api/v1/users/avatar', {
//       method: 'put',
//       mode: 'cors',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//       body: sendableAvatar
//     })
//     .then((res) => {
//       if(res.ok) return res.json()
//       document.cookie = 'access_token= ; max-age=0'
//       sessionStorage.clear()
//       throw new Error("something went wrong :(")
//     })
//     .then((data) => {
//       sessionStorage.setItem('user', JSON.stringify(data))
//       return data
//     })
//     .catch((error) => {
//       return Promise.reject(error)
//     })
//   }
