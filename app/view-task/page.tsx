'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Task {
  id: number;
  name: string;
  dueDate: string;
  category: string;
}

const TaskDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(searchParams.get('id'));

  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Omit<Task, 'id'>>({
    name: '',
    dueDate: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch task from database
  useEffect(() => {
    if (!id) {
      setError('Invalid task ID');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`/api/tasks/${id}`)
      .then(async res => {
        if (res.ok) {
          return res.json();
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch task');
        }
      })
      .then(data => {
        setTask(data);
        setEditData({
          name: data.name,
          dueDate: data.dueDate.slice(0, 10),
          category: data.category,
        });
        setError('');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete task');
      }
    } catch {
      alert('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
        setIsEditing(false);
        setError('');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update task');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'Personal': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'Urgent': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading task...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-8 px-4">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
          <div className="text-red-600 dark:text-red-300 text-lg mb-4">⚠️ {error}</div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-lg mx-auto mt-8 px-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <div className="text-gray-600 dark:text-gray-300 text-lg mb-4">Task not found</div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Details</h1>
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
          >
            ← Back to Tasks
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                required
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleEditChange}
                required
                min={today}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={editData.category}
                onChange={handleEditChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setEditData({
                    name: task.name,
                    dueDate: task.dueDate.slice(0, 10),
                    category: task.category,
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {task.name}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium w-24">Due Date:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatDate(task.dueDate)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium w-24">Category:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Edit Task
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Task'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap TaskDetails in Suspense for useSearchParams
export default function ViewTaskPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskDetails />
    </Suspense>
  );
}
