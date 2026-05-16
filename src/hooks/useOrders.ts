import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders";
import { tablesApi } from "@/api/tables";
import { OrderStatus } from "@/types/api";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getOrders,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.confirmOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useClearTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tableNumber: string) => tablesApi.clearTable(tableNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useTableOrders = (tableNumber: string) => {
  return useQuery({
    queryKey: ["orders", "table", tableNumber],
    queryFn: () => ordersApi.getOrdersByTable(tableNumber),
    enabled: !!tableNumber,
  });
};
