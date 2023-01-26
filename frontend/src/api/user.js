import request from "./request"

const endpoint = "/user"

const listUser = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

export default {
  listUser,
}
