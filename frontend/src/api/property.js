import request from "./request"

const endpoint = "/property"

const createProperty = (property) => {
  return request.post(endpoint, property)
}

const deleteProperty = (id) => {
  return request.delete(`${endpoint}/${id}`)
}

const getPropertyById = (id) => {
  return request.get(`${endpoint}/${id}`)
}

const listProperties = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

const updateProperty = (id, property) => {
  return request.put(`${endpoint}/${id}`, property)
}

export default {
  createProperty,
  deleteProperty,
  getPropertyById,
  listProperties,
  updateProperty,
}
