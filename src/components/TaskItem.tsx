'use client';

import { Task } from '@/types';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';

const STATUS_COLORS = {
  'TODO': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'DONE': 'bg-green-100 text-green-800'
} as const;

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' }
] as const;

interface TaskItemProps {
  task: Task;
  onStatusChange?: () => void;
}

export function TaskItem({ task, onStatusChange }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { fetchWithAuth } = useApi();

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (isUpdating || newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await fetchWithAuth(`/api/projects/${task.projectId}/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...task,
          status: newStatus
        })
      });
      
      onStatusChange?.();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
      setIsSelectOpen(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            disabled={isUpdating}
            className={`px-3 py-1.5 rounded text-sm ${STATUS_COLORS[task.status]} 
              hover:opacity-80 transition-opacity cursor-pointer min-w-[100px]
              flex items-center justify-between`}
          >
            <span>{STATUS_OPTIONS.find(opt => opt.value === task.status)?.label}</span>
            <svg 
              className={`w-4 h-4 ml-1 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isSelectOpen && (
            <>
              <div 
                className="fixed inset-0 z-10 bg-black/20 transition-opacity" 
                onClick={() => setIsSelectOpen(false)}
              />
              <div 
                className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20
                  transform transition-all duration-100 origin-top-right
                  animate-in fade-in slide-in-from-top-2"
              >
                <div className="py-1" role="menu">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                        ${task.status === option.value ? 'bg-gray-50' : ''}`}
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[option.value]}`} />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 