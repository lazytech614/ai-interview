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

  return (
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

        <div className="flex flex-wrap gap-2">
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
            onChange={(e) => setForm((prev: any) => ({...prev, bio: e.target.value}))}
        />
    </div>
  )
}

export default InterviewerOnboardingForm