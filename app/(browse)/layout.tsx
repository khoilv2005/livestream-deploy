import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";
import { Suspense } from "react";
const BrowseLayout = ({ children, }: { children: React.ReactNode }) => {
  return (
    <>
        <Navbar />
        <div className="flex mt-6">
          
          <Sidebar />
          
          <Container>
              {children}
          </Container>
        </div>
    </>
  )
}
export default BrowseLayout;