'use client'
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Settings } from 'lucide-react';
import { useKanbanStore } from '@/store/kanbanStore';

function ProfileButton() {
    const { setIsOpenProfileDialog } = useKanbanStore();
    return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => { setIsOpenProfileDialog(true); }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
        </DropdownMenuItem>
    )
}

export default ProfileButton