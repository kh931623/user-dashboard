const handleErrorDecorator = (func) => {
  return async (...props) => {
    try {
      return await func(...props)
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data)
      } else {
        alert(error.message)
      }
    }
  }
}

const updateName = handleErrorDecorator(async (name) => {
  return axios.patch('/users', {
    name,
  })
})

const resetPassword = handleErrorDecorator(async (payload) => {
  return axios.post('/users/reset-password', payload)
})

const logout = handleErrorDecorator(async () => {
  return axios.post('/users/logout')
})

const login = handleErrorDecorator(async (payload) => {
  return axios.post('/users/login', payload)
})

const signup = handleErrorDecorator(async (payload) => {
  return axios.post('/users/signup', payload)
})

const getDashboard = handleErrorDecorator(async () => {
  return axios.get('/users/dashboard').then(res => res.data)
})