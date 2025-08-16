import API from "@/lib/axios.js"

//login
export const login = (data) => API.post("/login", data);
export const getUser = () => API.get("/user");
