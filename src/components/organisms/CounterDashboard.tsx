"use client";
import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useGetCurrentQueues } from "@/services/queue/wrapper.service";
import Card from "../atoms/Card";
import CounterCard from "../molecules/CounterCard";
import { ICounter } from "@/interfaces/services/counter.interface";

const CounterDashboard: React.FC = () => {
  const { data: metrics } = useGetCurrentQueues();

  const counters = metrics?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Counter</h2>
        <p className="text-gray-600 mt-1">Ringkasan status counter dan antrean saat ini</p>
      </div>

      {counters.length === 0 ? (
        <Card variant="outline" className="py-8 text-center text-gray-500">
          Tidak ada counter aktif atau data antrean masih kosong.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters
            .filter((c: any) => c.isActive === true)
            .map((counter: any) => {
              const id = counter.counterId ?? counter.id;
              const baseCounter: ICounter = {
                id,
                name: counter.counterName ?? counter.name ?? `Counter ${id}`,
                isActive: !!counter.isActive,
                maxQueue: counter.maxQueue ?? 0,
                currentQueue: counter.currentQueue ?? 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
              } as unknown as ICounter;

              return (
                <CounterCard
                  key={id}
                  counter={baseCounter}
                  currentQueue={counter.currentQueue ?? counter.currentQueueNumber ?? null}
                  queueStatus={counter.nextQueueStatus ?? null}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CounterDashboard;
