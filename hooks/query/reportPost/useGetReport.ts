import { getReport } from "@/api/reportPostAPI";
import { useQuery } from "@tanstack/react-query";

const useGetReport = ({
  reportId,
  reportType,
}: {
  reportId: string;
  reportType: string;
}) => {
  return useQuery(["report", reportId], () =>
    getReport({ reportId, reportType })
  );
};

export default useGetReport;
