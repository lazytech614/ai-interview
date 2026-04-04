"use client"

import { useEffect, useState } from "react"
import InterviewerOnboardingForm from "../forms/interviewer-onboarding-form"
import { InterviewCategory } from "@/lib/generated/prisma/enums"
import { Button } from "../ui/button"
import useFetch from "@/hooks/use-fetch"
import { updateInterviewerProfile } from "@/actions/dashboard"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const UpdateProfileSection = ({initial}: any) => {
    const currentProfile = initial.interviewer

    const {
        loading,
        data,
        fn: updateInterviewerProfileFn,
        error
    } = useFetch(updateInterviewerProfile)

    const router = useRouter()

    const [form, setForm] = useState({
            title: currentProfile?.title || "",
            company: currentProfile?.company || "",
            yearsExp: currentProfile?.yearsExp || 0,
            bio: currentProfile?.bio || "",
            categories: currentProfile?.categories || [] as InterviewCategory[],
            sessionRates: currentProfile?.sessionRates
                ? currentProfile.sessionRates.reduce((acc: any, rate: any) => {
                    acc[rate.duration] = rate.credits;
                    return acc;
                }, { 45: 1, 60: 1, 90: 1 })
            : { 45: 1, 60: 1, 90: 1 }
        })

    const canSubmit = form.title.trim() 
                    && form.company.trim() 
                    && form.yearsExp 
                    && form.bio.trim() 
                    && form.categories.length>0

    const handleSubmit = () => {
        if(!canSubmit) return
        
        try {
            updateInterviewerProfileFn(form)
        }catch(err) {
            toast.error("Something went wrong")
            console.error("SOMETHING WENT WRONG ON ONBOARDING", err)
        }
    }

    useEffect(() => {
        if(data?.success) {
            toast.success("Profile updated successfully")
            router.refresh()
        }

        if(error) {
            toast.error("Something went wrong")
            console.error("SOMETHING WENT WRONG ON ONBOARDING", error)
        }
    }, [data, loading, error, router])

  return (
    <div className="flex flex-col gap-6">
        <InterviewerOnboardingForm form={form} setForm={setForm} />
        <Button
            variant={"gold"}
            size={"hero"}
            className="w-full"
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
        >
            {loading 
                ? "Updating..." 
                : "Update Profile"
            }
        </Button>
    </div>
  )
}

export default UpdateProfileSection