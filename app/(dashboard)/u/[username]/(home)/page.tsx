import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation"; // Thêm import này nếu bạn muốn dùng notFound()

interface CreatorPageProps {
    params: Promise<{ // <<< THAY ĐỔI 1: params là một Promise
        username: string;
    }>;
}

const CreatorPage = async (props: CreatorPageProps) => { // Nhận props đầy đủ
    // THAY ĐỔI 2: Await props.params để lấy object params đã được giải quyết
    const resolvedParams = await props.params;
    const { username } = resolvedParams; // Bây giờ mới destructure username

    const externalUser = await currentUser(); // Lấy người dùng hiện tại đã đăng nhập (Clerk)
    const user = await getUserByUsername(username); // Lấy thông tin người dùng của trang profile đang xem

    // Kiểm tra phân quyền và sự tồn tại của stream
    if (
        !user || // Người dùng của trang profile không tồn tại
        !user.externalUserId || // Thiếu externalUserId để so sánh
        !externalUser || // Người dùng hiện tại chưa đăng nhập
        user.externalUserId !== externalUser.id || // Người xem không phải chủ nhân của dashboard này
        !user.stream // Người dùng của trang profile không có stream
    ) {
        // Bạn có thể dùng notFound() để hiển thị trang 404 chuẩn của Next.js
        // notFound();
        // Hoặc throw lỗi để Next.js bắt và hiển thị trang lỗi (Error Boundary)
        throw new Error("Unauthorized or stream not found for this user.");
    }

    // Tạo user object đúng type
    const customUser = {
        ...user,
        username: user.username || "",
        _count: {
            followedBy: 0
        },
        stream: null
    };

    // Tạo stream object đúng type
    const customStream = {
        id: user.stream.id,
        isChatEnabled: user.stream.isChatEnabled,
        isChatDelayed: user.stream.isChatDelayed,
        isChatFollowersOnly: user.stream.isChatFollowersOnly,
        isLive: user.stream.isLive,
        thumbnail: user.stream.thumbnailUrl,
        title: user.stream.name
    };

    return (
        <div className="h-full">
            <StreamPlayer
                user={customUser}
                stream={customStream}
                isFollowing
            />
        </div>
    );
}

export default CreatorPage;