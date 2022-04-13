import axios from "axios";

/* set credentials for all axios requests */
axios.defaults.withCredentials = true;

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;// || "http://localhost:5005";

export async function getCsrfToken() {
  const { data } = await axios.get(API_BASE_URL + "/getCsrfToken");
  /* we attach csrf-token to headers - which attackers cannot do */
  axios.defaults.headers.post["X-CSRF-Token"] = data.csrfToken;
  axios.defaults.headers.put["X-CSRF-Token"] = data.csrfToken;
  axios.defaults.headers.patch["X-CSRF-Token"] = data.csrfToken;
  axios.defaults.headers.delete["X-CSRF-Token"] = data.csrfToken;
}