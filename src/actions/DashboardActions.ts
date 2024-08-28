'use server'
import { createClient } from "@/utils/supabase/server";

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