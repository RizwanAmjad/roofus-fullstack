import { create } from "apisauce"
import auth from "../auth"
import config from "../config.json"

const baseURL = config.API_BASE_URL
const AUTH_HEADER = "x-auth-token"

const api = create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.addRequestTransform((req) => {
  const user = auth.user()
  if (user) req.headers[AUTH_HEADER] = auth.user()
})

export default {
  delete: api.delete,
  get: api.get,
  post: api.post,
  put: api.put,
}
