import { getInterviewers } from "@/actions/explore"
import ExploreGrid from "@/components/explore-grid"
import PageHeader from "@/components/reusables"

const ExplorePage = async() => {

    const interviewers = await getInterviewers()

  return (
    <div className="min-h-screen ">
        <PageHeader
            label="Explore"
            gray="Find your"
            gold="expert interviewer"
            description="Book 1:1 mock interviews with senior engineers from top companies."
        />

        <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10">
            <ExploreGrid interviewers={interviewers} />
        </div>
    </div>
  )
}

export default ExplorePage