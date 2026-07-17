import { api } from "./api";
import { type ICategory } from "../types/service.types";

export const categoryApi = {
  list: async (): Promise<{ success: boolean; data: ICategory[] }> =>
    api.get("/categories"),
};
