import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "../ui/button"
import Link from "next/link"
import Image from "next/image"
import { checkUser } from "@/lib/check.user"
import { Calendar1Icon, Users } from "lucide-react"
import RoleRedirect from "./role-redirect"
import CreditButton from "./credit-button"

const Header = async () => {
    const user = await checkUser()


  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-10 py-3 border-b border-white/70 backdrop-blur-xl">
        <Link href="/">
            <Image 
                src="/logo.png" 
                alt="logo" 
                width={100} 
                height={100} 
                className="h-11 w-auto"
            />
        </Link>

        {/* REDIRECTION LOGIC  */}
        {user && <RoleRedirect role={user.role} />}

        <div className="flex items-center gap-x-3">
            <Show when="signed-out">
                <SignInButton mode="modal">
                    <Button variant={"ghost"}>
                        Sign In
                    </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button variant={"gold"}>
                    Sign Up
                    </Button>
                </SignUpButton>
            </Show>
            <Show when="signed-in">
                {user?.role === "INTERVIEWER" && (
                    <Button variant={"ghost"} asChild>
                        <Link href={"/dashboard"}>Dashboard</Link>
                    </Button>
                )}

                {user?.role === "INTERVIEWEE" && (
                    <>
                        <Button variant={"ghost"} asChild>
                            <Link href={"/explore"}>
                                <Users size={16} />
                                <span className="hidden sm:inline">Explore</span>
                            </Link>
                        </Button>
                        <Button variant={"default"} asChild>
                            <Link href={"/appointments"}>
                                <Calendar1Icon size={16} />
                                <span className="hidden sm:inline">Appointments</span>
                            </Link>
                        </Button>
                    </>
                )}

                <CreditButton 
                    role = {user?.role === "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE"}
                    credits = {user?.role === "INTERVIEWER" ? user?.creditBalance : user?.credits ?? 0}
                />

                <UserButton />
            </Show>
        </div>
    </header>
  )
}

export default Header