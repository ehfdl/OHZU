import { getUser } from "@/api/userAPI";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id: string) => {
  return useQuery(["user", id], () => getUser(id));
};
