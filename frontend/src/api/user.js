import request from "./request"

const endpoint = "/user"

const createUser = (user) => {
  return request.post(endpoint, user)
}

const listUser = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

export default {
  createUser,
  listUser,
}
