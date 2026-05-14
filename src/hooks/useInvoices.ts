import { useQuery } from "@tanstack/react-query";
import { tablesApi } from "@/api/tables";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: tablesApi.getInvoices,
  });
};
