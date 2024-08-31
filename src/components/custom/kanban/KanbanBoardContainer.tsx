import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import React from 'react'

const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='relative flex flex-col w-full h-full'>
      <ScrollArea className='w-full h-full flex flex-col p-8 overflow-x-auto horizontal-scroll'>
          <div className='flex h-full'>
          {children}
          </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  )
}

export default KanbanBoardContainer