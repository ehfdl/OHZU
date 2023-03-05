import { getPost } from "@/api/postAPI";
import { useQuery } from "@tanstack/react-query";

const useGetPost = (id: string) => {
  return useQuery(["post", id], () => getPost(id));
};

export default useGetPost;
