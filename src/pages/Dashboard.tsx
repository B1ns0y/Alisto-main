import React, { useState, useEffect } from 'react';
import { Task, Project } from '../types';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/dashboard/TaskList';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Update this if necessary

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<string>('today');
  const [taskData, setTaskData] = useState<any>({
    title: '',
    description: '',
    project: '',
    dueDate: null as Date | null,
    dueTime: '',
    important: false
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddTask = async () => {
    if (taskData.title.trim() === '') return;

    try {
      if (isEditMode && taskData.id) {
        // Update existing task
        const response = await fetch(`${API_BASE_URL}/tasks/${taskData.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          fetchTasks();
          toast({ title: "Task updated", description: `"${taskData.title}" has been updated.` });
        }
      } else {
        // Add new task
        const response = await fetch(`${API_BASE_URL}/tasks/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskData, completed: false }),
        });

        if (response.ok) {
          fetchTasks();
          toast({ title: "Task added", description: `"${taskData.title}" has been added.` });
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }

    resetTaskForm();
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !taskToUpdate.completed }),
      });

      if (response.ok) {
        fetchTasks();
        toast({
          title: taskToUpdate.completed ? "Task marked as incomplete" : "Task completed",
          description: `"${taskToUpdate.title}" has been updated.`,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const toggleTaskImportance = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ important: !taskToUpdate.important }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating importance:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, { method: 'DELETE' });

      if (response.ok) {
        fetchTasks();
        toast({ title: "Task deleted", description: "Task has been removed.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const resetTaskForm = () => {
    setTaskData({
      title: '',
      description: '',
      project: '',
      dueDate: null,
      dueTime: '',
      important: false
    });
    setShowTaskModal(false);
    setIsEditMode(false);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    return filtered.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      if (taskDate) taskDate.setHours(0, 0, 0, 0);

      switch (activeTab) {
        case 'today':
          return taskDate && taskDate.getTime() === today.getTime() && !task.completed;
        case 'upcoming':
          return taskDate && taskDate.getTime() > today.getTime() && !task.completed;
        case 'completed':
          return task.completed;
        case 'important':
          return task.important && !task.completed;
        default:
          if (activeTab.startsWith('project-')) {
            const projectId = activeTab.replace('project-', '');
            return task.project === projectId && !task.completed;
          }
          return !task.completed;
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        projects={projects}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddTaskModal={() => setShowTaskModal(true)} completedTasksCount={0} totalTasksCount={0} uncompletedTasksCount={0} upcomingTasksCount={0} importantTasksCount={0} todayTasksCount={0}      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} />

        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          <TaskList
            activeTab={activeTab}
            filteredTasks={getFilteredTasks()}
            toggleTaskCompletion={toggleTaskCompletion}
            toggleTaskImportance={toggleTaskImportance}
            deleteTask={deleteTask} projects={[]} showTaskMenu={''} setShowTaskMenu={function (id: string | null): void {
              throw new Error('Function not implemented.');
            } } editTask={function (task: Task): void {
              throw new Error('Function not implemented.');
            } }          />
        </main>
      </div>

      {showTaskModal && (
        <AddTaskModal
          isEditMode={isEditMode}
          taskData={taskData}
          setTaskData={setTaskData}
          handleSubmit={handleAddTask}
          closeModal={resetTaskForm}
          projects={projects}
        />
      )}
    </div>
  );
};

export default Dashboard;
