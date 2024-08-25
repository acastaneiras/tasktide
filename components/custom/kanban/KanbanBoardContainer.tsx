import React from 'react'

const KanbanBoardContainer = ({children} : React.PropsWithChildren) => {
  return (
    <div className='relative flex flex-col w-full h-full'>
        <div className='w-full h-full flex p-8 overflow-x-scroll'>
            {children}
        </div>
    </div>
  )
}

export default KanbanBoardContainer