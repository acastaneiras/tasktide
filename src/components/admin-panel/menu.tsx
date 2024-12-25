"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/store/kanbanStore";
import { EllipsisVertical, Eye, Plus, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { set } from "date-fns";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const { setIsDeleteProjectDialogOpen, setSelectedEditProject, setIsProjectDialogOpen, projects, selectedProjectId, setSelectedProjectId } = useKanbanStore();
  const handleAddProjectClick = () => {
    setIsProjectDialogOpen(true);
    setSelectedEditProject(null);
  }

  const handleEdit = (projectId: number) => {
    if (!projects || projects.length === 0) return;
    setSelectedEditProject(projects.find(project => project.id === projectId) ?? null);
    setIsProjectDialogOpen(true);
  }

  const handleDelete = (projectId: number) => {
    setSelectedEditProject(projects.find(project => project.id === projectId) ?? null);
    setIsDeleteProjectDialogOpen(true);
  }

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-36px)] lg:min-h-[calc(100vh-32px-40px-36px)] items-start space-y-1 px-2">
          <li className="w-full">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn("w-full mb-2 justify-start cursor-pointer", {
                      "px-4": isOpen,
                    })}
                    asChild
                    onClick={handleAddProjectClick}
                  >
                    <div>
                      <span className={cn(isOpen ? "mr-2" : "")}>
                        <Plus size={18} />
                      </span>
                      <p
                        className={cn(
                          "max-w-[200px] truncate",
                          isOpen === false
                            ? "-translate-x-96 opacity-0"
                            : "translate-x-0 opacity-100"
                        )}
                      >
                        New Project
                      </p>
                    </div>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">New Project</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>


          {/* Group of projects */}
          <li className={cn("w-full", "pt-5")}>
            <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
              Projects
            </p>
            {projects.length ? (
              projects.map((project, index) => (
                <div key={index}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div className="relative w-full">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <div
                              onClick={() => {
                                setSelectedProjectId(project.id);
                              }}
                              className={cn(
                                selectedProjectId === project.id ? "bg-accent" : "",
                                "cursor-pointer inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 w-full justify-start h-10 mb-1"
                              )}
                            >
                              <span className={cn(isOpen === false ? "" : "mr-4")}>
                                <div
                                  className="w-3 h-3 rounded-full ml-1"
                                  style={{ backgroundColor: project.color }}
                                ></div>
                              </span>
                              <p
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100 pr-2"
                                )}
                              >
                                {project.name}
                              </p>
                            </div>
                          </Button>

                          {isOpen && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="absolute right-0 mr-2 top-1/2 transform -translate-y-1/2 focus:outline-none">
                                  <EllipsisVertical className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className={cn("flex items-center cursor-pointer gap-2 text-primary")} onClick={() => handleEdit(project.id)}>
                                  <Eye className='w-4 h-4' />View
                                </DropdownMenuItem>
                                <DropdownMenuItem className={cn("flex items-center cursor-pointer gap-2", "text-destructive dark:hover:text-primary hover:text-white hover:bg-destructive/90 focus:bg-destructive/90 focus:text-white")} onClick={() => handleDelete(project.id)}>
                                  <Trash className='w-4 h-4' /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TooltipTrigger>
                      {isOpen === false && (
                        <TooltipContent side="right">{project.name}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                No projects
              </p>
            )}

          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
