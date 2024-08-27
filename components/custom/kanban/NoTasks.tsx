import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BadgeInfoIcon } from 'lucide-react'
import React from 'react'

const NoTasks = () => {
    return (
        <Alert>
            <BadgeInfoIcon className="h-5 w-5" />
            <AlertTitle>No tasks</AlertTitle>
            <AlertDescription>
                Create a new task by clicking the button next to the title of the column
            </AlertDescription>
        </Alert>
    )
}

export default NoTasks