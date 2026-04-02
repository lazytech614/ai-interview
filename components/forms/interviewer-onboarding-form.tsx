import { CATEGORIES, YEARS_OPTIONS } from "@/lib/data"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const InterviewerOnboardingForm = ({ form, setForm }: any) => {

    const toggleCategory = (category: any) => {
        if (form.categories.includes(category)) {
            setForm({
                ...form,
                categories: form.categories.filter((c: any) => c !== category)
            })
        } else {
            setForm({
                ...form,
                categories: [...form.categories, category]
            })
        }
    }

    const setRate = (duration: 45 | 60 | 90, value: number) => {
        setForm((prev: any) => ({
            ...prev,
            sessionRates: {
                ...prev.sessionRates,
                [duration]: value
            }
        }))
    }

  return (
    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
        
        {/* Existing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Current Title</Label>
                <Input 
                    id="title"
                    name="title"
                    placeholder="Senior Software Engineer"
                    className="text-sm"
                    value={form.title}
                    onChange={(e) => setForm((prev: any) => ({...prev, title: e.target.value}))}
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
                    onChange={(e) => setForm((prev: any) => ({...prev, company: e.target.value}))}
                />
            </div>
        </div>

        {/* Years */}
        <div className="flex flex-wrap gap-2">
            {YEARS_OPTIONS.map((year) => (
                <button
                    key={year.value}
                    type="button"
                    onClick={() =>
                        setForm((prev: any) => ({
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

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
                if(!category.value) return null

                const active = form.categories.includes(category.value)

                return (
                    <button
                        key={category.value}
                        type="button"
                        onClick={() => toggleCategory(category.value)}
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

        {/* ✅ NEW: Session Credit Rates */}
        <div className="flex flex-col gap-4">
            <Label>Session Credit Rates</Label>

            {/* 45 mins (fixed = 1) */}
            <div>
                <p className="text-xs text-stone-400 mb-2">45 mins</p>
                <button
                    type="button"
                    className="text-xs px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-400 cursor-not-allowed"
                >
                    1 Credit (Fixed)
                </button>
            </div>

            {/* 60 mins */}
            <div>
                <p className="text-xs text-stone-400 mb-2">60 mins</p>
                <div className="flex gap-2">
                    {[1, 2, 3].map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setRate(60, val)}
                            className={`text-xs px-4 py-2 rounded-lg border ${
                                form.sessionRates?.[60] === val
                                ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                                : "border-white/10 text-stone-500"
                            }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>

            {/* 90 mins */}
            <div>
                <p className="text-xs text-stone-400 mb-2">90 mins</p>
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setRate(90, val)}
                            className={`text-xs px-4 py-2 rounded-lg border ${
                                form.sessionRates?.[90] === val
                                ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                                : "border-white/10 text-stone-500"
                            }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Bio */}
        <Textarea 
            rows={4}
            maxLength={300}
            placeholder="Tell interviewee about your background..."
            className="text-sm p-4"
            value={form.bio}
            onChange={(e) => setForm((prev: any) => ({...prev, bio: e.target.value}))}
        />
    </div>
  )
}

export default InterviewerOnboardingForm