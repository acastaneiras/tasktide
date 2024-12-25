import { FolderKanban } from 'lucide-react'
import React from 'react'

const NoProjects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 px-6 pb-12 w-full"
    >
      <div className="flex flex-col items-center space-y-2">
        <FolderKanban />
        <h2 className="text-xl font-bold">No Projects</h2>
      </div>
      <p className="text-center">
        You can add new project to the board by clicking the{' '}
        <span className="font-semibold text-primary">New Project</span> button on the sidebar.
      </p>
    </div>
  )
}

export default NoProjects