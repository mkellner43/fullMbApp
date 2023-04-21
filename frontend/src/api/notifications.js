import axios from "axios";

export const readAllNotifications = async (notifications = []) => {
  if (notifications.length === 0) return;
  try {
    const { data } = await axios.post(`users/notifications/read`, {
      notifications,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const unreadAllNotifications = async (notifications = []) => {
  if (notifications.length === 0) return;
  try {
    const { data } = await axios.post(`users/notifications/unread`, {
      notifications,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const readOne = async (id) => {
  try {
    const { data } = await axios.post(`users/notifications/read/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getNotifications = async (cursor) => {
  try {
    const { data } = await axios.get(
      `users/notifications?skip=${cursor}&limit=6`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (id) => {
  try {
    const { data } = await axios.delete(`users/notifications/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// export const deleteNotification = (id) => {
//   return fetch(`http://localhost:3000/api/v1/users/notifications/${id}`, {
//     method: 'delete',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// old ewwwwww

// export const readAllNotifications = (notifications=[]) => {
//   if(notifications.length === 0) return
//   return fetch('http://localhost:3000/api/v1/users/notifications/read', {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify(notifications)
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const unreadAllNotifications = (notifications=[]) => {
//   if(notifications.length === 0) return
//   return fetch('http://localhost:3000/api/v1/users/notifications/unread', {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify(notifications)
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const readOne = (id) => {
//   return fetch(`http://localhost:3000/api/v1/users/notifications/read/${id}`, {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     document.cookie = 'access_token= ; max-age=0'
//     sessionStorage.clear()
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }

// export const getNotifications = (cursor) => {
//   return fetch(`http://localhost:3000/api/v1/users/notifications?skip=${cursor}&limit=6`, {
//     method: 'get',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//   .then((res) => {
//     if(res.ok) return res.json()
//     // document.cookie = 'access_token= ; max-age=0'
//     // sessionStorage.clear()
//   })
//   .then((data) => {
//     return data
//   })
//   .catch((error) => {
//     return Promise.reject(error)
//   })
// }
