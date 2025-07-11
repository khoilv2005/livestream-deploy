"use client";
import qs from "query-string";
import { useState } from "react"; // Sắp xếp lại import cho gọn
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Search = () => {
    const router = useRouter();
    const [value, setValue] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value) {
            return;
        }
        // Giữ nguyên logic submit của bạn (điều hướng tới "/")
        const url = qs.stringifyUrl({
            url: "/search", // URL đích khi submit
            query: { term: value },
        }, { skipEmptyString: true });
        router.push(url);
    };

    const onClear = () => {
        setValue("");
    };

    return (
        <form
            onSubmit={onSubmit}
            className="relative w-full lg:w-[400px] flex items-center"
        >
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tìm kiếm"
                // 1. Sửa rounding: bỏ bo góc phải để liền với nút search
                // 2. Thêm padding phải (pr-10) để chữ không bị che bởi nút X
                // 3. Giữ lại text/placeholder màu trắng như yêu cầu trước
                // 4. Bỏ các class focus-visible tùy chỉnh để dùng mặc định của Shadcn (tốt hơn cho accessibility)
                className="rounded-r-none pr-10 text-white placeholder:text-gray-300 h-9" // Thêm h-9 hoặc chiều cao mong muốn
                // Đảm bảo màu nền của Input hoặc cha của nó đủ tối để thấy chữ trắng
            />

            {/* 5. Tạo Button bao quanh icon X để có thể click và style */}
            {value && (
                <Button
                    type="button" // Quan trọng: Để không submit form
                    variant="ghost" // Kiểu trong suốt
                    size="sm" // Kích thước nhỏ
                    onClick={onClear} // Gắn hàm xóa
                    // Định vị tuyệt đối bên trong form, căn giữa dọc, đặt bên phải input
                    // Điều chỉnh right-12 hoặc right-14 tùy theo kích thước nút search
                    className="absolute top-1/2 right-12 transform -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-white"
                >
                    <X className="h-4 w-4" /> {/* Giảm kích thước icon X một chút */}
                </Button>
            )}

            {/* 6. Nút Search: giữ nguyên size="sm", bỏ bo góc trái */}
            <Button
                type="submit"
                size="sm" // Giữ size sm
                variant="secondary"
                // Bỏ bo góc trái để liền với input
                className="rounded-l-none h-9" // Thêm h-9 để cùng chiều cao với Input
            >
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
        </form>
    );
}