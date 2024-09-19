'use server'
import { createClient } from "@/utils/supabase/server";

export async function addOrUpdateTask(task: any) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('upsert_task_with_dependencies', {
        task_data: task
    });

    if (error) {
        console.error('Error:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function deleteTask(taskId: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
    return { data, error }
}

export async function addOrUpdateProject(project: any) {
    const supabase = createClient();
    console.log(project);
    const { data, error } = await supabase.rpc('upsert_project', {
        project_data: project
    });

    return { data, error: null };
}

export async function deleteProject(projectId: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
    return { data, error }
}