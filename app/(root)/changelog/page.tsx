import StateUI from "@/components/shared/state-ui"
import { Construction } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Changelog page',
}

const ChangelogPage = () => {
  return (
    <StateUI
      title="This page is under development"
      description="The changelog page is currently under development. Please check back later for updates and new features."
      icon={<Construction />}
      className="border-none"
    />
  )
}

export default ChangelogPage