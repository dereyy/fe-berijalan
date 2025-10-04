"use client";
import { FC, useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import {
  useClaimQueue,
  useReleaseQueue,
} from "../../services/queue/wrapper.service";
import { useCounterAppStore } from "@/stores/global-states/counter/counter-app.store";
import toast from "react-hot-toast";

interface QueueTicketProps {
  className?: string;
}

const QueueTicketPage: FC<QueueTicketProps> = ({ className }) => {
  const [isClaimSuccess, setIsClaimSuccess] = useState(false);
  const { claimedQueue, setClaimedQueue } = useCounterAppStore();
  const { mutate: claimQueue } = useClaimQueue();
  const { mutate: releaseQueue } = useReleaseQueue();
  const [debugQueue, setDebugQueue] = useState<
    | null
    | import("@/interfaces/services/queue.interface").ICurrentQueuesResponse[]
    | import("@/interfaces/services/queue.interface").IClaimQueueResponse
  >(null);

  const handleRefreshQueue = async () => {
    try {
  const res = await import("@/services/queue/api.service").then((m) => m.apiGetCurrentQueues());
  // apiGetCurrentQueues returns APIBaseResponse<T> or an error shape. Normalize to data array when possible
  const normalized = (res && (res as any).data) ? (res as any).data : res;
  setDebugQueue(normalized || null);
  console.log("Current queue:", normalized);
    } catch (e) {
      setDebugQueue(null);
    }
  };

  const handleClaim = () => {
    claimQueue(undefined, {
      onSuccess: (res: import("@/interfaces/api.interface").APIBaseResponse<import("@/interfaces/services/queue.interface").IClaimQueueResponse> | undefined) => {
        if (!res || res.status === false || !res.data) {
          return setIsClaimSuccess(false);
        }
        const data = res.data as import("@/interfaces/services/queue.interface").IClaimQueueResponse;
        setClaimedQueue({
          counterId: data.counterId,
          counterName: data.counterName,
          estimatedWaitTime: data.estimatedWaitTime,
          position: data.positionInQueue,
          queueNumber: data.queueNumber,
        });
        setIsClaimSuccess(true);
      },
    });
  };

  const handleReleaseQueue = () => {
    if (!claimedQueue?.counterId) return toast.error("No queue to release");
    if (!claimedQueue?.queueNumber) return toast.error("No queue to release");

    releaseQueue(
      {
        counter_id: claimedQueue.counterId,
        queue_number: claimedQueue.queueNumber,
      },
      {
        onSuccess: (res: import("@/interfaces/api.interface").APIBaseResponse<{ success: boolean }> | undefined) => {
          if (!res || res.status === false) return;
          setIsClaimSuccess(false);
          setClaimedQueue(null);
        },
      }
    );
  };

  return (
    <Card className={className}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Antrian</h2>

        {!isClaimSuccess ? (
          <div className="flex flex-col items-center w-full">
            <p className="text-gray-600 mb-8 text-center">
              Ambil nomor antrian Anda dengan menekan tombol di bawah ini
            </p>
            <Button
              size="lg"
              fullWidth
              onClick={handleClaim}
              leftIcon={
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
              }
            >
              Ambil Nomor Antrian
            </Button>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleRefreshQueue}
            >
              Debug: Refresh Data Antrian
            </Button>
            {debugQueue && (
              <pre className="text-xs bg-gray-100 rounded p-2 mt-2 w-full overflow-auto max-h-40">
                {JSON.stringify(debugQueue, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="text-gray-600 mb-2">Nomor Antrian Anda</div>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {claimedQueue?.queueNumber}
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-2">
              Counter Tujuan:{" "}
              <span className="text-blue-700">{claimedQueue?.counterName}</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posisi:</span>
                <span className="font-medium">{claimedQueue?.position}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Estimasi waktu tunggu:</span>
                <span className="font-medium">
                  {claimedQueue?.estimatedWaitTime} menit
                </span>
              </div>
            </div>

            <Button variant="outline" onClick={handleReleaseQueue}>
              Ambil Nomor Baru
            </Button>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleRefreshQueue}
            >
              Debug: Refresh Data Antrian
            </Button>
            {debugQueue && (
              <pre className="text-xs bg-gray-100 rounded p-2 mt-2 w-full overflow-auto max-h-40">
                {JSON.stringify(debugQueue, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QueueTicketPage;
