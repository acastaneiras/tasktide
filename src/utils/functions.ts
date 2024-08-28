import dayjs from "dayjs";

export const getDateColor = (args: {
    date: string;
    defaultColor?: string;
}): string => {
    const date = dayjs(args.date);
    const now = dayjs();

    if (date.isBefore(now)) {
        return "error";
    }

    if (date.isBefore(now.add(3, "day"))) {
        return "warning";
    }

    return args.defaultColor ?? "outline";
};

export const getDateText = (args: {
    start: dayjs.Dayjs | null;
    end: dayjs.Dayjs | null;
    completedDate?: dayjs.Dayjs | null;
}): string => {
    if (args.completedDate) return `Done ${args.completedDate.format("MMM DD")}`;
    if (!args.start && !args.end) return "No date";
    if (!args.end) return `Starts on ${args.start?.format("MMM DD")}`;
    return `Due by ${args.end?.format("MMM DD")}`;
}