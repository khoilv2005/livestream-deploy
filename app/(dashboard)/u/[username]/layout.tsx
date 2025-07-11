import { getSelfByUsername } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";

interface CreateLayoutProps {
    children: React.ReactNode;
    params: Promise<{ // <<< --- THAY ĐỔI 1: params bây giờ là một Promise
        username: string;
    }>;
}

const CreateLayout = async ({
    children,
    params: paramsPromise, // <<< --- THAY ĐỔI 2: Đổi tên để rõ ràng đây là Promise
}: CreateLayoutProps) => {
    // THAY ĐỔI 3: Await paramsPromise để lấy object params thực sự
    const resolvedParams = await paramsPromise;
    const { username } = resolvedParams; // Destructure username từ object đã được giải quyết

    // Đoạn code này dùng để lấy thông tin của người dùng mà dashboard này thuộc về (chủ sở hữu dashboard)
    const self = await getSelfByUsername(username);

    // Nếu không tìm thấy người dùng (chủ sở hữu dashboard) theo username từ URL,
    // hoặc có thể bạn muốn kiểm tra thêm quyền truy cập ở đây.
    // Ví dụ: người dùng hiện tại có phải là 'self' không?
    // const loggedInUser = await currentUser(); // Lấy người dùng hiện tại từ Clerk
    // if (!self || !loggedInUser || loggedInUser.id !== self.externalUserId) {
    //     redirect("/");
    // }
    if (!self) {
        // Nếu không tìm thấy người dùng có username này, có thể chuyển hướng hoặc báo lỗi
        redirect("/"); // Hoặc notFound();
    }

    return (
        <>
            <Navbar />
            <div className="flex h-full pt-20"> {/* Giả sử pt-20 là chiều cao navbar cố định */}
                <Sidebar />
                <Container>
                    {children}
                </Container>
            </div>
        </>
    );
}

export default CreateLayout;