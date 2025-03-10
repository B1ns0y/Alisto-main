
import React, { useState, useEffect } from 'react';
import { Task, Project } from '../types';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/dashboard/TaskList';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  // Get tasks and projects from localStorage or use default values
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
      { id: 'school', name: 'School', count: 0 },
      { id: 'home', name: 'Home', count: 0 },
      { id: 'random', name: 'Random', count: 0 },
      { id: 'friends', name: 'Friends', count: 0 },
    ];
  });
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'today';
  });
  
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
        projectCounts[task.project] = (projectCounts[task.project] || 0) + 1;
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
      important: false 
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
      important: task.important || false
    });
    setIsEditMode(true);
    setShowTaskModal(true);
    setShowTaskMenu(null);
  };

  const toggleTaskCompletion = (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    
    // Show toast based on completion status
    if (taskToUpdate && !taskToUpdate.completed) {
      toast({
        title: "Task completed",
        description: `"${taskToUpdate.title}" has been marked as completed.`,
      });
    }
  };

  const toggleTaskImportance = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, important: !task.important } : task
    );
    
    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    setTasks(updatedTasks);
    setShowTaskMenu(null);
    
    // Show deletion toast
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
        variant: "destructive",
      });
    }
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
    
    // Apply tab filter
    return filtered.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      if (taskDate) {
        taskDate.setHours(0, 0, 0, 0);
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
        setShowAddTaskModal={startAddTask}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        uncompletedTasksCount={uncompletedTasksCount}
        upcomingTasksCount={upcomingTasksCount}
        importantTasksCount={importantTasksCount}
        todayTasksCount={todayTasksCount}
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
        />
      )}
    </div>
  );
};

export default Dashboard;
