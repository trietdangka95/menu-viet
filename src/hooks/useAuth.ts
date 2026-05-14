import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const setUserRole = useCartStore((state) => state.setUserRole);
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      authApi.setToken(data.token);
      // BE returns role in uppercase (ADMIN, STAFF, KITCHEN)
      const role = data.role.toLowerCase() as any;
      setUserRole(role);
      
      if (data.role === 'ADMIN') {
        router.push("/admin");
      } else if (data.role === 'KITCHEN') {
        router.push("/admin/kitchen");
      } else if (data.role === 'STAFF') {
        router.push("/admin/tables"); // Staff usually goes to table management
      } else {
        router.push("/");
      }
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: authApi.getUsers,
  });
};

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string, newPassword: string }) => 
      authApi.updateOtherUserPassword(userId, newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
