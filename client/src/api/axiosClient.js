import axios from "axios";

import { baseURL } from "../constants";

const API = axios.create({ baseURL: baseURL });


export default API