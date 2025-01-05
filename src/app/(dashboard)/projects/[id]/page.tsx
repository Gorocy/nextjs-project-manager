'use client';

import { useEffect, useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { Project } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TaskItem } from '@/components/TaskItem';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { fetchWithAuth } = useApi();

  const fetchProject = useCallback(async () => {
    try {
      const data = await fetchWithAuth(`/api/projects/${params.id}`);
      setProject(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth, params.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleDeleteProject = async () => {
    try {
      await fetchWithAuth(`/api/projects/${params.id}`, {
        method: 'DELETE',
      });
      router.push('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError('Failed to delete project');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="flex space-x-4">
          <Link href={`/projects/${params.id}/tasks/new`}>
            <Button>Add Task</Button>
          </Link>
          <Button 
            variant="danger"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Project
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        {project.tasks && project.tasks.length > 0 ? (
          <div className="grid gap-4">
            {project.tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusChange={fetchProject}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tasks yet.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will delete all tasks associated with this project."
      />
    </div>
  );
} 