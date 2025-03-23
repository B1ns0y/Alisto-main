import React, { useState, useEffect } from 'react';
import { ITask } from '@/interface/interfaces';
import Sidebar from '@/components/ui/sidebar';
import AddTaskModal from '../components/modals/AddTaskModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/dashboard/TaskList';
import { useToast } from '@/hooks/use-toast';
import useMutationTodo from '@/hooks/tanstack/todos/useQueryTodos';
import { useQueryUser } from '@/hooks/tanstack/getUser/useQueryUser';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { data: userData } = useQueryUser();
  
  // Todo operations with TanStack Query
  const { useTodos, useUpdateTodo, useDeleteTodo } = useMutationTodo();
  const { data, isLoading, isError } = useTodos();
  const { mutate: updateTaskMutation } = useUpdateTodo();
  const { mutate: deleteTaskMutation } = useDeleteTodo();

  // Add user data state as fallback
  const [userDataState, setUserDataState] = useState(() => {
    const savedUserData = localStorage.getItem('user_data');
    return savedUserData ? JSON.parse(savedUserData) : {
      username: '',
      profilePicture: ''
    };
  });

  // Update local user data when query data changes
  useEffect(() => {
    if (userData) {
      setUserDataState(userData);
    }
  }, [userData]);

  // State management
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'today';
  });
  
  const [taskData, setTaskData] = useState<any>({
    title: '',
    description: '',
    dueDate: null as Date | null,
    dueTime: '',
    important: false,
    priority: 1,
    userId: localStorage.getItem("user_id") || ''
  });
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Process todos data when it arrives
  useEffect(() => {
    if (data) {
      const formattedTasks = data.map((task: any) => {
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
          important: task.is_important
        };
      });
      
      setTasks(formattedTasks);
    }
  }, [data]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Delete task handler
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
    deleteTaskMutation(id, {
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

  // Add/Edit task handler
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
      const newTaskItem: ITask = { 
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

  // Reset task form
  const resetTaskForm = () => {
    setTaskData({ 
      title: '', 
      description: '', 
      dueDate: null, 
      dueTime: '',
      important: false,
      priority: 1,
      userId: localStorage.getItem("user_id") || ''
    });
    
    setIsEditMode(false);
    setShowTaskModal(false);
  };

  // Open modal for adding a task
  const startAddTask = () => {
    resetTaskForm();
    setIsEditMode(false);
    setShowTaskModal(true);
  };

  // Open modal for editing a task
  const startEditTask = (task: ITask) => {
    setTaskData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || '',
      important: task.important || false,
      userId: localStorage.getItem("user_id") || ''
    });
    setIsEditMode(true);
    setShowTaskModal(true);
    setShowTaskMenu(null);
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
  
    // Make sure to include the deadline in the update data
    const updateData = {
      id: id,
      is_completed: !taskToUpdate.completed,
      title: taskToUpdate.title,
      description: taskToUpdate.description || "",
      deadline: taskToUpdate.dueDate ? new Date(taskToUpdate.dueDate).toISOString() : null,
      is_important: taskToUpdate.important || false
    };
  
    console.log("Sending update data:", updateData);
  
    updateTaskMutation(updateData, {
      onSuccess: () => {
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
        toast({
          title: "Update failed",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to update task:", error);
      }
    });
  };
  
  // Toggle task importance
  const toggleTaskImportance = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, important: !task.important } : task
    );
    
    setTasks(updatedTasks);
  };

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

  // Loading state
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading tasks...</div>;
  }

  // Error state
  if (isError) {
    return <div className="flex h-screen items-center justify-center">Error loading tasks. Please try again.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddTaskModal={startAddTask}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        uncompletedTasksCount={uncompletedTasksCount}
        upcomingTasksCount={upcomingTasksCount}
        importantTasksCount={importantTasksCount}
        todayTasksCount={todayTasksCount}
        userData={userData || userDataState}
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
          userId={localStorage.getItem("user_id") || ''}
        />
      )}
    </div>
  );
};

export default Dashboard;