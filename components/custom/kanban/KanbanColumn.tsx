'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useDroppable, UseDroppableArguments } from '@dnd-kit/core';
import { CirclePlus } from 'lucide-react';
import React from 'react';

type Props = {
  id: string;
  title: string;
  description?: string;
  count: number;
  data?: UseDroppableArguments['data'];
  onAddClick?: (args: { id: string }) => void;
}

const KanbanColumn = ({ children, id, title, description, count, data, onAddClick }: React.PropsWithChildren<Props>) => {
  const { isOver, setNodeRef, over } = useDroppable({ id, data })

  const handleAddClick = () => {
    onAddClick?.({ id })
  }
  return (
    <div ref={setNodeRef} className='flex flex-col px-4 md:max-w-xl w-full'>
      <div className='py-3 px-4'>
        <div className='flex justify-between w-full'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className='text-lg font-semibold whitespace-nowrap flex gap-3 items-center'>{title}
                  {!!count && <Badge className='h-6 w-6 p-0 flex items-center justify-center text-sm font-semibold'>{count}</Badge>}

                </h2>
              </TooltipTrigger>
              <TooltipContent>
                <p>{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


          <Button variant="none" onClick={handleAddClick}>
            <CirclePlus className='h-6 w-6' />
          </Button>
        </div>
        <p className='text-sm'>{description}</p>
      </div>
      <div className={cn('flex-1 rounded border-dashed border-2 border-transparent px-4', over ? 'overflow-y-hidden' : 'overflow-y-scroll', isOver ? 'border-primary/60' : 'border-transparent')}>
        <div className='flex flex-col mt-3 gap-2'>{children}</div>
      </div>
    </div>
  )
}

export default KanbanColumn;