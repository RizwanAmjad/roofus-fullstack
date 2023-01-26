import request from "./request"

const endpoint = "/user"

const createUser = (user) => {
  return request.post(endpoint, user)
}

const deleteUser = (id) => {
  return request.delete(`${endpoint}/${id}`)
}

const listUser = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

export default {
  createUser,
  deleteUser,
  listUser,
}
