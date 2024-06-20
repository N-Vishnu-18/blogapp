import axios from "axios";

// Create axios instance with token
export function createAxiosWithToken() {
    const token = localStorage.getItem('token');
    return axios.create({
        headers: { Authorization: `Bearer ${token}` }
    });
}
