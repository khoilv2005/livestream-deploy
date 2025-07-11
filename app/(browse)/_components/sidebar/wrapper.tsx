"use client";
import { useSidebar } from '@/store/use-sidebar';
import {cn} from '@/lib/utils'; 
interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({ children }: WrapperProps) => {
    const { collapsed } = useSidebar((state: { collapsed: boolean }) => state);
    return (
        <aside
        className={cn(
            // Class cơ bản
            "fixed left-0 flex flex-col h-full bg-background border-r border-[#2D2E35] z-50",
            // Thêm transition
            "transition-all duration-300 ease-in-out",
            // Sửa logic width: chỉ phụ thuộc vào collapsed
            collapsed ? "w-[70px]" : "w-60"
        )}
    >
            {children}
        </aside>
    );
}