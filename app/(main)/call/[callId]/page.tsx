import { getCallData } from "@/actions/call"
import CallRoom from "@/components/call-room"
import { redirect } from "next/navigation"
import { toast } from "sonner"

const CallPage = async({params}: any) => {
    const {callId} = await params

    const result = await getCallData(callId)

    if(result.error === "Unauthorized") {
        toast.error("You must be signed in.")
        redirect("/")
    }

    if(result.error === "User not found") {
        toast.error("User not found.")
        redirect("/")
    }

    if(result.error === "Call not found") {
        toast.error("Call not found.")
        redirect("/")
    }

    if(result.error === "No booking found") {
        toast.error("No booking found.")
        redirect("/")
    }

    if(result.error === "Forbidden") {
        toast.error("You are not allowed to access this call.")
        redirect("/")
    }

    if(result.error) {
        toast.error(result.error as string)
        redirect("/")
    }

    const {
        token,
        isInterviewer,
        currentUser,
        booking
    } = result

  return (
    <CallRoom 
        token={token} 
        isInterviewer={isInterviewer} 
        currentUser={currentUser} 
        booking={booking} 
        callId={callId}
        apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
    />
  )
}

export default CallPage