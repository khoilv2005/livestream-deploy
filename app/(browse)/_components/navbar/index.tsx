import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Logo } from "./logo";
import {Search} from "./search";
import {Actions} from "./action";
export const Navbar = () => {
return (
    <nav className="fixed top-0 w-full h-20 z-[49] bg-[#252731] px-2 lg:px-4 flex justify-between
     items-center border-b border-[#2b2d42] shadow-sm">
        <div className="flex items-center gap-4">
            <Logo />
            
        </div>
          <div className="flex items-center gap-4 " >
          <Search />
          <Actions />
         <UserButton />

        </div>
    
    </nav>
)
}