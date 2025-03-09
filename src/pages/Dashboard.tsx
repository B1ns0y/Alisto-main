import React, { useState } from 'react';
import { Task, Project } from '../types';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/dashboard/TaskList';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 'school', name: 'School', count: 0 },
    { id: 'home', name: 'Home', count: 0 },
    { id: 'random', name: 'Random', count: 0 },
    { id: 'friends', name: 'Friends', count: 0 },
  ]);
  const [activeTab, setActiveTab] = useState('today');
  const [newTask, setNewTask] = useState({
    title: '',
    location: '',
    category: '',
    tag: '',
    project: '',
    dueDate: null as Date | null,
    dueTime: ''
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const uncompletedTasksCount = totalTasksCount - completedTasksCount;
  const upcomingTasksCount = tasks.filter(task => task.dueDate && new Date(task.dueDate).getTime() > Date.now() && !task.completed).length;

  const updateProjectCounts = (updatedTasks: Task[]) => {
    const projectCounts: { [key: string]: number } = {};
    updatedTasks.forEach(task => {
      if (task.project) {
        projectCounts[task.project] = (projectCounts[task.project] || 0) + 1;
      }
    });
    setProjects(projects.map(project => ({
      ...project,
      count: projectCounts[project.id] || 0
    })));
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.location && task.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tag && task.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (activeTab) {
      case 'inbox':
        return filtered;
      case 'today':
        return filtered.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString());
      case 'upcoming':
        return filtered.filter(task => task.dueDate && new Date(task.dueDate).getTime() > Date.now());
      case 'completed':
        return filtered.filter(task => task.completed);
      case 'important':
        return filtered.filter(task => task.tag === 'School');
      default:
        if (activeTab.startsWith('project-')) {
          const projectId = activeTab.replace('project-', '');
          return filtered.filter(task => task.project === projectId);
        }
        return filtered;
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;
    const newTaskItem: Task = { ...newTask, id: Date.now().toString(), completed: false };
    const updatedTasks = [...tasks, newTaskItem];
    setTasks(updatedTasks);
    updateProjectCounts(updatedTasks);
    setNewTask({ title: '', location: '', category: '', tag: '', project: '', dueDate: null, dueTime: '' });
    setShowAddTaskModal(false);
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(updatedTasks);
    updateProjectCounts(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    updateProjectCounts(updatedTasks);
    setShowTaskMenu(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        projects={projects}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddTaskModal={setShowAddTaskModal}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        uncompletedTasksCount={uncompletedTasksCount}
        upcomingTasksCount={upcomingTasksCount}
      />

      <div className="flex-1 flex flex-col bg-white">
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <TaskList 
            activeTab={activeTab}
            filteredTasks={getFilteredTasks()}
            projects={projects}
            showTaskMenu={showTaskMenu}
            setShowTaskMenu={setShowTaskMenu}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        </main>
      </div>

      {showAddTaskModal && (
        <AddTaskModal 
          newTask={newTask}
          setNewTask={setNewTask}
          handleAddTask={handleAddTask}
          setShowAddTaskModal={setShowAddTaskModal}
          projects={projects}
        />
      )}
    </div>
  );
};

export default Dashboard;
