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