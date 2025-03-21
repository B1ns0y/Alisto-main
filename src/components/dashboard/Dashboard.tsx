import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from './hooks/useTask';
import { useTaskActions } from './hooks/useTaskActions';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useUserData } from './hooks/useUserData';
import { TaskStats } from '../dashboard/types';
import { ITask } from '@/interface/interfaces';
import Sidebar from '@/components/ui/sidebar';
import AddTaskModal from '../AddTaskModal/AddTaskModal';
import DashboardHeader from './DashboardHeader';
import TaskList from './TaskList';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Custom hooks
  const { userData } = useUserData({ navigate, toast });
  const { tasks, setTasks, isLoading, isError } = useTasks();
  const { 
    handleAddTask, 
    toggleTaskCompletion, 
    toggleTaskImportance, 
    deleteTask 
  } = useTaskActions({ tasks, setTasks, toast });
  const { 
    filteredTasks, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery 
  } = useTaskFilters(tasks);

  // Local state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [taskData, setTaskData] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: null as Date | null,
    dueTime: '',
    important: false,
    priority: 1,
    userId: user?.id || ''
  });

  // Calculate task statistics
  const taskStats: TaskStats = {
    completed: tasks.filter(task => task.completed).length,
    total: tasks.length,
    uncompleted: tasks.filter(task => !task.completed).length,
    today: tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    }).length,
    upcoming: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate).getTime() > Date.now() && !task.completed
    ).length,
    important: tasks.filter(task => task.important && !task.completed).length
  };

  // Task form handlers
  const resetTaskForm = () => {
    setTaskData({ 
      id: '',
      title: '', 
      description: '', 
      dueDate: null, 
      dueTime: '',
      important: false,
      priority: 1,
      userId: user?.id || ''
    });
    setIsEditMode(false);
    setShowTaskModal(false);
  };

  const startAddTask = () => {
    resetTaskForm();
    setShowTaskModal(true);
  };

  const startEditTask = (task: ITask) => {
    setTaskData({
          id: task.id,
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate || null,
          dueTime: task.dueTime || '',
          important: task.important || false,
          priority: task.priority || 1,
          userId: user?.id || ''
        });
    setIsEditMode(true);
    setShowTaskModal(true);
    setShowTaskMenu(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tasks</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddTaskModal={startAddTask}
        completedTasksCount={taskStats.completed}
        totalTasksCount={taskStats.total}
        uncompletedTasksCount={taskStats.uncompleted}
        upcomingTasksCount={taskStats.upcoming}
        importantTasksCount={taskStats.important}
        todayTasksCount={taskStats.today}
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
            filteredTasks={filteredTasks}
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
          userId={user?.id || ''} 
        />
      )}
    </div>
  );
};

export default Dashboard;