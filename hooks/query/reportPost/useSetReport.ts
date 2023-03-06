import { setReport } from "@/api/reportPostAPI";
import { useMutation } from "@tanstack/react-query";

const useSetReport = () => {
  return useMutation(["setReport"], (body: any) => setReport(body), {
    onSuccess: () => {
      // console.log("신고 추가성공");
    },
    onError: (err) => {
      console.log("신고 추가실패", err);
    },
  });
};

export default useSetReport;
