import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Clapperboard, LogOut } from "lucide-react";
export const Actions = async() => {
    const user = await currentUser();

    return (
        <div className="flex items-center justify-end gap-x-2">
            <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
            >
                
                <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Exit
                </Link>
            </Button>
        </div>
    );
}