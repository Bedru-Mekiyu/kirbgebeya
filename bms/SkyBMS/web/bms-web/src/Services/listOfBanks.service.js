import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const ListOfBanksService = {
  getAllBanks: async () => {
    try {
      const response = await apiService.get("/list-of-banks");
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default ListOfBanksService;
