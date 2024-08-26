'use server'
import { Task } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function addOrUpdateTask(task: Task) {
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
        console.log(error, data)
    return { data, error }
}