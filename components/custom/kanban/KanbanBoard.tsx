'use client'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core'
import React from 'react'

type Props = {
  onDragEnd?: (event: DragEndEvent) => void
}

const sensorsConfig = {
  activationConstraint: {
    distance: 5,
  }
}

const KanbanBoard = ({ children, onDragEnd }: React.PropsWithChildren<Props>) => {
  const mouseSensor = useSensor(MouseSensor, sensorsConfig);
  const touchSensor = useSensor(TouchSensor, sensorsConfig);

  const sensors = [mouseSensor, touchSensor];

  return (
    <DndContext onDragEnd={onDragEnd} sensors={sensors}>
      {children}
    </DndContext>
  )
}

export default KanbanBoard