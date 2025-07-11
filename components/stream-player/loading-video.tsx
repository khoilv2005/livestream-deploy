import { Loader } from "lucide-react";

interface LoadingVideoProps {
    label: string;
};

export const LoadingVideo = ({ label }: LoadingVideoProps) => {
    return (
        <div className="flex flex-col space-y-4 items-center justify-center h-full">
            <Loader className="w-10 h-10 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">
                {label}
            </p>
        </div>
    );   
}