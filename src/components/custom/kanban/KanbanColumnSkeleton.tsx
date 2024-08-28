import { Skeleton } from "@/components/ui/skeleton";

const KanbanColumnSkeleton = () => (
  <div className='flex flex-col px-4 md:max-w-xl min-w-80 h-full w-full'>
    <div className='py-3 px-4'>
      <div className='flex justify-between w-full flex-col'>
        <Skeleton className='w-full h-10' />
      </div>
    </div>
    <div className='py-3 px-4 h-full gap-4 flex flex-col'>
      <Skeleton className='w-full h-40' />
      <Skeleton className='w-full h-40' />
      <Skeleton className='w-full h-40' />
      <Skeleton className='w-full h-40' />
    </div>
  </div>
);

export default KanbanColumnSkeleton