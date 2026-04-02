"use client";

import { GoldTitle, GrayTitle, SectionLabel } from "@/components/global/reusables"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, ONBOARDING_ROLES, YEARS_OPTIONS } from "@/lib/data";
import { useEffect, useState } from "react";
import { InterviewCategory } from "@/lib/generated/prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { completeOnboarding } from "@/actions/onboarding";
import { toast } from "sonner";
import InterviewerOnboardingForm from "@/components/forms/interviewer-onboarding-form";

const OnboardingPage = () => {

    const router = useRouter()
    const {
            data, 
            loading, 
            fn: onBoardingFn
        } = useFetch(completeOnboarding)

    const [role, setRole] = useState("")
    const [form, setForm] = useState({
        title: "",
        company: "",
        yearsExp: 0,
        bio: "",
        categories: [] as InterviewCategory[],
        sessionRates: {
            45: 1,
            60: 1,
            90: 1
        }
    })

    const canSubmit = role === "INTERVIEWEE" 
                        || (role === "INTERVIEWER" 
                            && form.title.trim() 
                            && form.company.trim() 
                            && form.yearsExp 
                            && form.bio.trim() 
                            && form.categories.length>0)
                            && form.sessionRates

    const handleSubmit = () => {
        if(!canSubmit) return

        try {
            onBoardingFn({
                role,
                ...(role === "INTERVIEWER" && {
                    title: form.title,
                    company: form.company,
                    yearsExp: form.yearsExp,
                    bio: form.bio,
                    categories: form.categories,
                    sessionRates: form.sessionRates
                })
            })
        }catch(err) {
            toast.error("Something went wrong")
            console.error("SOMETHING WENT WRONG ON ONBOARDING", err)
        }
    }

    useEffect(() => {
        if(data && !loading) {
            toast.success("Onboarding successful")
            
            if(role === "INTERVIEWER") {
                window.location.href = "/dashboard" 
            } else {
                router.replace("/explore")
            }
        }
    }, [data, loading, role, router])

  return (
    <div className="min-h-screen px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
            <div className="text-center mb-10">
                <SectionLabel>Welcome</SectionLabel>
                <h1 className="font-serif text-5xl leading-tight tracking-tighter mt-1">
                    <GrayTitle>How will you be</GrayTitle>
                    <br />
                    <GoldTitle>using Prept?</GoldTitle>
                </h1>
                <p className="text-sm text-stone-500 font-light mt-4 leading-relaxed">
                    This helps us personalise your experience
                    <span className="text-stone-600">
                        {" "}
                        You can&apos;t change this later
                    </span>
                </p>
            </div>

            {!role && (
                <div className="grid grid-cols-2 gap-4 w-full">
                    {ONBOARDING_ROLES.map((role) => (
                        <button 
                            key={role.title}
                            type="button"
                            onClick={() => setRole(role.value)}
                            className="text-left rounded-2xl p-4 sm:p-8 border border-white/10 bg-[#0f0f11] hover:border-amber-400/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-start"
                        >
                            <span className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex flex-col items-center justify-center text-xl mb-5">
                                {role.icon}
                            </span>
                            <h3 className="font-serif text-xl tracking-tight mb-3 text-stone-100">{role.title}</h3>
                            <p className="text-sm text-stone-400 font-light leading-relaxed">{role.desc}</p>
                        </button>
                    ))}
                </div>
            )}

            {role && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between bg-[#0f0f11] border border-white/10 rounded-2xl px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-base shrink-0">
                                {ONBOARDING_ROLES.find((r) => r.value === role)?.icon}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-stone-200">
                                    {ONBOARDING_ROLES.find((r) => r.value === role)?.title}
                                </p>
                                <p className="text-xs text-stone-600 mt-0.5">Selected Role</p>
                            </div>
                        </div>

                        <Button variant={"outline"} size={"sm"} onClick={() => setRole("")} className="text-xs">Change</Button>
                    </div>

                    {/* INTERVIEWER FORM  */}
                    {role === "INTERVIEWER" && form.sessionRates && (
                        <InterviewerOnboardingForm form={form} setForm={setForm} />
                    )}


                    <Button
                        variant={"gold"}
                        size={"hero"}
                        className="w-full"
                        disabled={!canSubmit || loading}
                        onClick={handleSubmit}
                    >
                        {loading 
                        ? "Setting up your account..."
                        : role === "INTERVIEWER"
                        ? "Create interviewer profile"
                        : "Go to dashboard"}
                    </Button>
                </div>
            )}
        </div>
    </div>
  )
}

export default OnboardingPage