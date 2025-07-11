    import Image from "next/image";
    import { Poppins } from "next/font/google";
    import {cn} from "@/lib/utils";
    import Link from "next/link";
    const font = Poppins({
        subsets: ["latin"],
        weight: ["200","300", "400", "500", "600", "700", "800"]
        }); 

    export const Logo = () => {
        return(
            <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-x-4 hover:opacity-75 transition">
                <div className="bg-white rounded-full p-1 mr-10 shrink-0
                lg:mr-0 lg:shrink-0">
                <Image
                    src="/playing-cat.png"
                    alt="Kitten Stream"
                    width="50"
                    height="50"
                />
                </div>
                <div className={cn("hidden lg:block",font.className)}>
                    <p className="text-lg font-semibold text-white">
                        Kitten Stream
                    </p>
                    <p className="text-xs text-white">
                        Creator Dashboard
                    </p>
                </div>
            </div>
            </Link>
        );
    };