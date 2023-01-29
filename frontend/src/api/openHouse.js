import request from "./request"

const endpoint = "/open-house"

const createOpenHouse = (openHouse) => {
  return request.post(endpoint, openHouse)
}

const deleteOpenHouse = (id) => {
  return request.delete(`${endpoint}/${id}`)
}

const listOpenHouse = (limit, page, property, upcoming) => {
  return request.get(endpoint, { limit, page, property, upcoming })
}

const updateOpenHouse = (id, openHouse) => {
  return request.put(`${endpoint}/${id}`, openHouse)
}

export default {
  createOpenHouse,
  deleteOpenHouse,
  listOpenHouse,
  updateOpenHouse,
}
