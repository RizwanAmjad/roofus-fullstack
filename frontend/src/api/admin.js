import request from "./request"

const endpoint = "/admin"

const adminAuth = ({ email, password }) => {
  return request.post(endpoint + "/auth", { email, password })
}

export default {
  adminAuth,
}
