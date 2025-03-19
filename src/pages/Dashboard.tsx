// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Task, Project } from '../types';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/dashboard/TaskList';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useTodos,useDeleteTodo, useUpdateTodo } from '@/hooks/tanstack/todos/useQueryTodos';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '@/services/axiosClient';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTodos();
  const updateTaskMutation = useUpdateTodo(); 
  const deleteTaskMutation = useDeleteTodo();
  const projectMapping = {
    '1': 'school',  
    '2': 'home',
    '3': 'random',
    '4': 'friends'
  };

  useEffect(() => {
    
    if (data) {
      const formattedTasks = data.map((task: any) => {
        let projectValue = task.project;
        
        if (typeof task.project === 'string' && !projectMapping[task.project]) {
          projectValue = getBackendProjectId(task.project);
        }
        else if (projectMapping[String(task.project)]) {
          projectValue = projectMapping[String(task.project)];
        }
        
   
        let dueDate = null;
        let dueTime = '';
        
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          dueDate = deadlineDate;
          
          const hours = deadlineDate.getHours();
          const minutes = deadlineDate.getMinutes();
          if (hours !== 0 || minutes !== 0) {
            dueTime = deadlineDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
          }
        }
        
        return {
          ...task,
          dueDate: dueDate,
          dueTime: dueTime,
          completed: task.is_completed,
          important: task.is_important,
          project: projectValue
        };
      });
      
      setTasks(formattedTasks);
    }
  }, [data]);

  const deleteTask = (id: string) => {
    console.log("deleteTask called with ID:", id);
  
    if (!id) {
      toast({
        title: "Error",
        description: "Cannot delete task: Invalid ID",
        variant: "destructive",
      });
      return;
    }
  
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) {
      console.error("Task not found with ID:", id);
      return;
    }
  
    setShowTaskMenu(null);
  
    toast({
      title: "Deleting task...",
      description: `"${taskToDelete.title}" is being removed.`,
    });
  
    // Call the delete mutation
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        console.log("Task successfully deleted from backend");
  
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  
        toast({
          title: "Task deleted",
          description: `"${taskToDelete.title}" has been removed successfully.`,
        });
      },
      onError: (error) => {
        console.error("Failed to delete task:", error);
        
        toast({
          title: "Deletion failed",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
 
    
  // Add user data state
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('user_data');
    return savedUserData ? JSON.parse(savedUserData) : {
      username: '',
      profilePicture: ''
    };
  });

  // Get tasks and projects from localStorage 
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    })) : [];
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [
      { id: '1', name: 'School', count: 0 },  
      { id: '2', name: 'Home', count: 0 },   
      { id: '3', name: 'Random', count: 0 }, 
      { id: '4', name: 'Friends', count: 0 },  
    ];
  });
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'today';
  });
  const { user, isAuthenticated } = useAuth();
  const [taskData, setTaskData] = useState<any>({
    title: '',
    description: '',
    project: '',
    dueDate: null as Date | null,
    dueTime: '',
    important: false,
    priority: 1,
    userId: user?.id || ''
  });
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/Home');
          return;
        }
        
        const response = await axiosClient.get(`/users/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const user = {
          username: response.data.username,
          profilePicture: response.data.profilePicture || ''
        };
        
        setUserData(user);
        localStorage.setItem('user_data', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to load user data. Please log in again.",
          variant: "destructive",
        });
        navigate('/Home');
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  // Calculate task statistics
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const uncompletedTasksCount = totalTasksCount - completedTasksCount;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTasksCount = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length;

  const upcomingTasksCount = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate).getTime() > Date.now() && !task.completed
  ).length;
  const importantTasksCount = tasks.filter(task => task.important && !task.completed).length;

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('activeTab', activeTab);
  }, [tasks, projects, activeTab]);

  // Update project counts whenever tasks change
  useEffect(() => {
    updateProjectCounts(tasks);
  }, [tasks]);

  const updateProjectCounts = (updatedTasks: Task[]) => {
    const projectCounts: { [key: string]: number } = {};
    updatedTasks.forEach(task => {
      if (task.project && !task.completed) {
        // Convert task.project to string
        const projectKey = String(task.project);
        projectCounts[projectKey] = (projectCounts[projectKey] || 0) + 1;
      }
    });
    
    setProjects(prev => prev.map(project => ({
      ...project,
      count: projectCounts[project.id] || 0
    })));
  };

  const handleAddTask = () => {
    if (taskData.title.trim() === '') return;
    
    if (isEditMode && taskData.id) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === taskData.id ? { ...taskData, completed: task.completed } : task
      );
      setTasks(updatedTasks);
      
      toast({
        title: "Task updated",
        description: `"${taskData.title}" has been updated.`,
      });
    } else {
      // Add new task
      const newTaskItem: Task = { 
        ...taskData, 
        id: Date.now().toString(), 
        completed: false 
      };
      
      const updatedTasks = [...tasks, newTaskItem];
      setTasks(updatedTasks);
      
      toast({
        title: "Task added",
        description: `"${taskData.title}" has been added to your tasks.`,
      });
    }
    
    // Reset form and close modal
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setTaskData({ 
      title: '', 
      description: '', 
      project: '', 
      dueDate: null, 
      dueTime: '',
      important: false,
      priority: 1,
    });
    
    setIsEditMode(false);
    setShowTaskModal(false);
  };

  const startAddTask = () => {
    resetTaskForm();
    setIsEditMode(false);
    setShowTaskModal(true);
  };

  const startEditTask = (task: Task) => {
    setTaskData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      project: task.project || '',
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || '',
      important: task.important || false,
    });
    setIsEditMode(true);
    setShowTaskModal(true);
    setShowTaskMenu(null);
  };

  const toggleTaskCompletion = (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
  
    // Convert project to the correct format
    let projectId = taskToUpdate.project;
    if (typeof projectId === 'string') {
      projectId = getBackendProjectId(projectId) || projectId;
    }
  
    // Make sure to include the deadline in the update data
    const updateData = {
      id: id,
      is_completed: !taskToUpdate.completed,
      title: taskToUpdate.title,
      description: taskToUpdate.description || "",
      deadline: taskToUpdate.dueDate ? new Date(taskToUpdate.dueDate).toISOString() : null,
      is_important: taskToUpdate.important || false,
      project: projectId ? parseInt(projectId, 10) : null// Convert to integer if not null
    };
  
    console.log("Sending update data:", updateData);
  
    updateTaskMutation.mutate(updateData, {
      onSuccess: (data) => {
        // Rest of your code remains the same
        const updatedTasks = tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        
        setTasks(updatedTasks);
        
        if (!taskToUpdate.completed) {
          toast({
            title: "Task completed",
            description: `"${taskToUpdate.title}" has been marked as completed.`,
          });
        } else {
          toast({
            title: "Task reopened",
            description: `"${taskToUpdate.title}" has been marked as incomplete.`,
          });
        }
      },
      onError: (error) => {
        // Error handling remains the same
        toast({
          title: "Update failed",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to update task:", error);
      }
    });
  };
  
  const toggleTaskImportance = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, important: !task.important } : task
    );
    
    setTasks(updatedTasks);
  };


  // Filter tasks based on active tab and search query
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply search filter if query exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    
    // For debugging
    console.log("Active Tab:", activeTab);
    console.log("Tasks before filtering:", filtered);
    
    // Apply tab filter
    return filtered.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      if (taskDate) {
        taskDate.setHours(0, 0, 0, 0);
      }
      
      // For debugging project-specific tasks
      if (activeTab.startsWith('project-')) {
        const projectId = activeTab.replace('project-', '');
        console.log(`Looking for tasks with project ID: ${projectId}`);
        console.log(`Current task project ID: ${task.project} (${typeof task.project})`);
        
        // Convert both to the same type (string) for comparison
        return String(task.project) === String(projectId) && !task.completed;
      }
      
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
          return !task.completed;
      }
    });
  };

  const getBackendProjectId = (frontendProjectId) => {
    // Convert frontend project ID to backend ID
    for (const [backendId, frontendId] of Object.entries(projectMapping)) {
      if (frontendId === frontendProjectId) {
        return backendId;
      }
    }
    return null;
  };
  

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        projects={projects}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddTaskModal={startAddTask}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        uncompletedTasksCount={uncompletedTasksCount}
        upcomingTasksCount={upcomingTasksCount}
        importantTasksCount={importantTasksCount}
        todayTasksCount={todayTasksCount}
        userData={userData}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-auto p-6 animate-fade-in">
        <TaskList 
          activeTab={activeTab}
          filteredTasks={getFilteredTasks()}
          projects={projects}
          showTaskMenu={showTaskMenu}
          setShowTaskMenu={setShowTaskMenu}
          toggleTaskCompletion={toggleTaskCompletion}
          toggleTaskImportance={toggleTaskImportance}
          deleteTask={deleteTask}
          editTask={startEditTask}
        />
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
          userId={user?.id || ''} 
        />
      )}
    </div>
  );
};

export default Dashboard;