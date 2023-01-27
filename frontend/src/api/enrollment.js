import request from "./request"

const endpoint = "/enrollment"

const createEnrollment = (enrollment) => {
  return request.post(endpoint, enrollment)
}

const deleteEnrollment = (id) => {
  return request.delete(`${endpoint}/${id}`)
}

const listEnrollments = (limit, page) => {
  return request.get(endpoint, { limit, page })
}

const updateEnrollments = (id, enrollment) => {
  return request.put(`${endpoint}/${id}`, enrollment)
}

export default {
  createEnrollment,
  deleteEnrollment,
  listEnrollments,
  updateEnrollments,
}
