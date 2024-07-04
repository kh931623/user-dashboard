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