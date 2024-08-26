import { Button } from '@/components/ui/button'
import { PlusSquareIcon } from 'lucide-react'
import React from 'react'

type Props = {
    onClick: () => void
}

const KanbanAddButton = ({ children, onClick }: React.PropsWithChildren<Props>) => {
    return (
        <Button className='flex gap-2 items-center justify-center'><PlusSquareIcon className='w-5 h-5' />
            {children ?? <span className='text-md'>Add new task</span>}
        </Button>
    )
}

export default KanbanAddButton