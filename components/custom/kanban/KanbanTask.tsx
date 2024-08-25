'use client'
import { cn } from '@/lib/utils'
import { DragOverlay, useDraggable, UseDraggableArguments } from '@dnd-kit/core'
import React from 'react'

interface Props {
    id: number
    data?: UseDraggableArguments['data']
}
const KanbanTask = ({children, id, data}: React.PropsWithChildren<Props>) => {
    const { attributes, listeners, setNodeRef, active } = useDraggable({
        id,
        data
    })
    return (
        <div className='relative'>
            <div ref={setNodeRef} {...attributes} {...listeners} className={cn("rounded-lg relative cursor-grab", active ? (active.id === id ? "opacity-100" : "opacity-50") : "opacity-100")}>
                {active?.id === id && <DragOverlay zIndex={999}>
                    <div className='rounded-lg shadow-lg cursor-grabbing'>
                        {children}
                    </div>
                    </DragOverlay>}
                {children}
            </div>
        </div>
    )
}

export default KanbanTask