"use client";

import { toast } from "sonner";
import { useState, useTransition, useRef, ElementRef } from "react";
import { createIngress } from "@/actions/ingress"; // Server Action của bạn
import { AlertTriangle } from "lucide-react";
// TUYỆT ĐỐI KHÔNG import bất cứ thứ gì từ "livekit-server-sdk" ở đây
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Các giá trị số này tương ứng với IngressInput.RTMP_INPUT và IngressInput.WHIP_INPUT
// từ livekit-server-sdk.
// IngressInput.RTMP_INPUT thường là 0
// IngressInput.WHIP_INPUT thường là 1
// Hãy kiểm tra lại tài liệu của livekit-server-sdk nếu bạn không chắc.
const INGRESS_TYPE_RTMP_VALUE = 0;
const INGRESS_TYPE_WHIP_VALUE = 1;

// Chuyển đổi các giá trị số này thành chuỗi để dùng cho Select component
const RTMP_SELECT_VALUE = String(INGRESS_TYPE_RTMP_VALUE); // Sẽ là "0"
const WHIP_SELECT_VALUE = String(INGRESS_TYPE_WHIP_VALUE); // Sẽ là "1"

// Định nghĩa kiểu cho state ingressType (sẽ là "0" hoặc "1")
type IngressTypeString = typeof RTMP_SELECT_VALUE | typeof WHIP_SELECT_VALUE;

export const ConnectModal = () => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    // Khởi tạo state với giá trị string tương ứng (ví dụ: RTMP là mặc định)
    const [ingressType, setIngressType] = useState<IngressTypeString>(RTMP_SELECT_VALUE);

    const onSubmit = () => {
        startTransition(() => {
            // Chuyển đổi giá trị string ("0" hoặc "1") từ Select thành số nguyên (0 hoặc 1)
            // Server action `createIngress` sẽ nhận được giá trị số này.
            const numericIngressType = parseInt(ingressType);

            createIngress(numericIngressType) // Gửi giá trị số đến server action
                .then((data) => {
                    toast.success("Ingress created successfully!");
                    // console.log("Ingress data from server:", data);
                    closeRef.current?.click();
                })
                .catch((error: any) => {
                    console.error("Error creating ingress (client-side):", error);
                    toast.error(error.message || "Something went wrong. Please check server logs.");
                });
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">
                    Generate connection
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate connection</DialogTitle>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType} // value của Select là string ("0" hoặc "1")
                    onValueChange={(value: IngressTypeString) => setIngressType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* value của SelectItem cũng là string ("0" hoặc "1") */}
                        <SelectItem value={RTMP_SELECT_VALUE}>RTMP</SelectItem>
                        <SelectItem value={WHIP_SELECT_VALUE}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        This action will reset all active streams using the current connection.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isPending}
                        onClick={onSubmit}
                        variant="primary"
                    >
                        Generate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
