import axios from "axios";

let baseURL = 'http://localhost:3008/api';


const instance = axios.create({ baseURL });

export const baseurl = baseURL;

export default instance;
