'use client'
import React from 'react'
import { DndContext } from '@dnd-kit/core'

const KanbanBoard = ({children}: React.PropsWithChildren) => {
  return (
    <DndContext>
        {children}
    </DndContext>
  )
}

export default KanbanBoard