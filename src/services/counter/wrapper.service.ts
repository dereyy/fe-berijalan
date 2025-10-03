"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateCounter,
  apiDeleteCounter,
  apiGetCounterById,
  apiGetAllCounters,
  apiUpdateCounter,
} from "./api.service";
import {
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import toast from "react-hot-toast";
import { APIBaseResponse } from "@/interfaces/api.interface";
type APIError = { message?: string };

const COUNTER_KEYS = {
  all: ["counters"] as const,
  byId: (id: number) => ["counters", id] as const,
};

export const useGetAllCounters = () => {
  return useQuery({
    queryKey: COUNTER_KEYS.all,
    queryFn: () => apiGetAllCounters(),
    refetchOnWindowFocus: false,
  });
};

export const useGetCounterById = (id: number) => {
  return useQuery({
    queryKey: COUNTER_KEYS.byId(id),
    queryFn: () => apiGetCounterById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCounterRequest) => apiCreateCounter(data),
    onSuccess: (response: APIBaseResponse | undefined) => {
      if (response && response.error) {
        const errMsg = (response.error as APIError)?.message;
        toast.error(errMsg || "Gagal membuat counter");
        return;
      }

      if (response && response.status === true) {
        toast.success("Counter berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: COUNTER_KEYS.all }); 
      } else {
        toast.error(response?.message || "Gagal membuat counter");
      }
    },
    onError: (error: unknown) => {
      toast.error((error as APIError)?.message || "Gagal membuat counter");
    },
  });
};

export const useUpdateCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateCounterRequest) => apiUpdateCounter(data),
    onSuccess: (response: APIBaseResponse | undefined, variables: IUpdateCounterRequest) => {
      if (response && response.error) {
        const errMsg = (response.error as APIError)?.message;
        toast.error(errMsg || "Gagal memperbarui counter");
        return;
      }

      if (response && response.status === true) {
        toast.success("Counter berhasil diperbarui");
        queryClient.invalidateQueries({ queryKey: COUNTER_KEYS.all });
        if (variables && typeof variables.id === "number") {
          queryClient.invalidateQueries({ queryKey: COUNTER_KEYS.byId(variables.id) });
        }
      } else {
        toast.error(response?.message || "Gagal memperbarui counter");
      }
    },
    onError: (error: unknown) => {
      toast.error((error as APIError)?.message || "Gagal memperbarui counter");
    },
  });
};

export const useDeleteCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteCounter(id),
    onSuccess: (response: APIBaseResponse | undefined) => {
      if (response && response.error) {
        const errMsg = (response.error as APIError)?.message;
        toast.error(errMsg || "Gagal menghapus counter");
        return;
      }

      if (response && response.status === true) {
        toast.success("Counter berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: COUNTER_KEYS.all });
      } else {
        toast.error(response?.message || "Gagal menghapus counter");
      }
    },
    onError: (error: unknown) => {
      toast.error((error as APIError)?.message || "Gagal menghapus counter");
    },
  });
};
