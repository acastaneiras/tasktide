import { Column } from "@/types";
import { List, Hammer, Search, CheckCircle } from "lucide-react";

export const kanbanColumns = [
    {
        id: 1,
        title: "To Do",
        icon: List,
    },
    {
        id: 2,
        title: "Working",
        icon: Hammer,
    },
    {
        id: 3,
        title: "Reviewing",
        icon: Search,
    },
    {
        id: 4,
        title: "Completed",
        icon: CheckCircle,
    }
] as Column[];