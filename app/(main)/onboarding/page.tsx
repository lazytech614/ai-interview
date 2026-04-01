"use client";

import { GoldTitle, GrayTitle, SectionLabel } from "@/components/reusables"
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
        categories: [] as InterviewCategory[]
    })

    const canSubmit = role === "INTERVIEWEE" 
                        || (role === "INTERVIEWER" 
                            && form.title.trim() 
                            && form.company.trim() 
                            && form.yearsExp 
                            && form.bio.trim() 
                            && form.categories.length>0)
    
    
    const toggleCategory = (category: any) => {
        if (form.categories.includes(category)) {
            setForm({
                ...form,
                categories: form.categories.filter((c) => c !== category)
            })
        } else {
            setForm({
                ...form,
                categories: [...form.categories, category]
            })
        }
    }

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
                    categories: form.categories
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
                    {role === "INTERVIEWER" && (
                        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">Current Title</Label>
                                    <Input 
                                        id="title"
                                        name="title"
                                        placeholder="Senior Software Engineer"
                                        className="text-sm"
                                        value={form.title}
                                        onChange={(e) => setForm((prev) => ({...prev, title: e.target.value}))}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input 
                                        id="company"
                                        name="company"
                                        placeholder="Google, Meta, Amazon"
                                        className="text-sm"
                                        value={form.company}
                                        onChange={(e) => setForm((prev) => ({...prev, company: e.target.value}))}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {YEARS_OPTIONS.map((year) => (
                                        <button
                                        key={year.value}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                            ...prev,
                                            yearsExp: year.value, 
                                            }))
                                        }
                                        className={`text-xs px-4 py-2 rounded-lg border ${
                                            form.yearsExp === year.value
                                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                                            : "border-white/10 text-stone-500"
                                        }`}
                                        >
                                            {year.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => {
                                    if(!category.value) return null

                                    const active = form.categories.includes(category.value)

                                    return (
                                        <button
                                        key={category.value}
                                        type="button"
                                        onClick={() =>
                                            toggleCategory(category.value)
                                        }
                                        className={`text-xs px-4 py-2 rounded-lg border ${
                                            active
                                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                                            : "border-white/10 text-stone-500"
                                        }`}
                                        >
                                            {category.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <Textarea 
                                rows={4}
                                maxLength={300}
                                placeholder="Tell interviewee about your background, what you specialise in, and what they can expect from a session with you."
                                className="text-sm p-4"
                                value={form.bio}
                                onChange={(e) => setForm((prev) => ({...prev, bio: e.target.value}))}
                            />
                        </div>
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