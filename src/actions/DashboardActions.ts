'use server'
import { createClient } from "@/utils/supabase/server";
import { Task } from "@root/types";
import dayjs from "dayjs";

export async function addOrUpdateTask(task: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('tasks')
        .upsert(task);
    return { data, error }
}

export async function deleteTask(taskId: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
    return { data, error }
}

export async function fetchTasks(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('userId', userId)
        .order('endDate', { ascending: true });

    return { data, error };
};