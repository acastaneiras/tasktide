import { Column } from "@/types";
import { Eye } from "lucide-react";
export const kanbanColumns = [
    {
        id: 1,
        title: "To Do",
        icon: Eye,
    },
    {
        id: 2,
        title: "Working",
        icon: Eye,
    },
    {
        id: 3,
        title: "Reviewing",
        icon: Eye,
    },
    {
        id: 4,
        title: "Completed",
        icon: Eye,
    }
] as Column[];