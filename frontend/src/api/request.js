import { create } from "apisauce"

const baseURL = "http://localhost:3000/api"

const api = create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export default {
  delete: api.delete,
  get: api.get,
  post: api.post,
  put: api.put,
}
