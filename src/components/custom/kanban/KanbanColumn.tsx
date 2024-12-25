'use client'
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/components/ui/tooltip';
import { cn } from '@/lib/utils';;
import { kanbanColumns } from '@/src/utils/kanbanColumns';
import { useDroppable, UseDroppableArguments } from '@dnd-kit/core';
import { CircleHelp, CirclePlus } from 'lucide-react';
import React from 'react';

type Props = {
  id: string;
  title: string;
  description?: string;
  count: number;
  data?: UseDroppableArguments['data'];
  onAddClick?: (args: { id: string | null }) => void;
}

const KanbanColumn = ({ children, id, title, description, count, data, onAddClick }: React.PropsWithChildren<Props>) => {
  const { isOver, setNodeRef } = useDroppable({ id, data });

  const handleAddClick = () => {
    onAddClick?.({ id });
  }

  const column = kanbanColumns.find(col => col.id!.toString() === id);
  const Icon = column?.icon || CircleHelp;

  return (
    <TooltipProvider>
      <div ref={setNodeRef} className='flex flex-col px-4 min-w-[22rem] w-full'>
        <div className='py-3 px-4'>
          <div className='flex justify-between w-full'>
            <h2 className='text-lg font-semibold whitespace-nowrap flex gap-3 items-center'>
              <Icon className='h-6 w-6' />
              {title}
              {!!count && <Badge className='h-6 w-6 p-0 flex items-center justify-center text-sm font-semibold'>{count}</Badge>}
            </h2>

            <Button variant="none" onClick={handleAddClick}>
              <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                  <CirclePlus className='h-6 w-6' />
                </TooltipTrigger>
                <TooltipContent>
                  Add new task
                </TooltipContent>
              </Tooltip>
            </Button>
          </div>
          <p className='text-sm'>{description}</p>
        </div>
        <ScrollArea className={cn('flex-1 rounded border-dashed border-2 border-transparent px-4 h-full', isOver ? 'border-primary/60' : 'border-transparent')}>
          <div className='flex flex-col w-full mt-3 gap-2 h-48'>{children}</div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

export default KanbanColumn;
