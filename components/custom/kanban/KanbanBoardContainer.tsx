import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import React from 'react'

const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='relative flex flex-col w-full h-full'>
      <ScrollArea className='w-full h-full flex p-8'>
          {children}
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  )
}

export default KanbanBoardContainer