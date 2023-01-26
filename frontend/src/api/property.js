import request from "./request"

const endpoint = "/property"

const createProperty = (user) => {
  return request.post(endpoint, user)
}

const deleteProperty = (id) => {
  return request.delete(`${endpoint}/${id}`)
}

const listProperty = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

const updateProperty = (id, user) => {
  return request.put(`${endpoint}/${id}`, user)
}

export default {
  createProperty,
  deleteProperty,
  listProperty,
  updateProperty,
}
