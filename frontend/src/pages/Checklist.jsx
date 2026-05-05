import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, Circle, Clock, Plus, 
  Trash2, AlertCircle, Sparkles, Loader2,
  ChevronRight, Calendar, MessageSquare,
  Wand2, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checklist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smartInput, setSmartInput] = useState('');
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/tasks/${user._id}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [user]);

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/tasks/${taskId}`, { isCompleted: !completed });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, isCompleted: !completed } : t));
    } catch (err) {
      console.error("Toggle task failed", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  const handleSmartAdd = async (e) => {
    e.preventDefault();
    if (!smartInput.trim()) return;
    setIsSmartLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/tasks/smart-add`, {
        userInput: smartInput,
        userId: user._id,
        localDate: new Date().toISOString().split('T')[0]
      });
      setSmartInput('');
      fetchTasks();
    } catch (err) {
      console.error("Smart add failed", err);
    } finally {
      setIsSmartLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const activeTasks = tasks.filter(t => !t.isCompleted).map(t => ({
        _id: t._id,
        title: t.title,
        dueDate: t.dueDate
      }));

      await axios.post(`${BACKEND_URL}/api/tasks/smart-optimize`, {
        tasks: activeTasks,
        userId: user._id,
        localDate: new Date().toISOString().split('T')[0]
      });
      fetchTasks();
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const groupedTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const groups = {
      overdue: [],
      today: [],
      upcoming: [],
      completed: []
    };

    tasks.forEach(task => {
      if (task.isCompleted) {
        groups.completed.push(task);
      } else {
        const dueDate = task.dueDate.split('T')[0];
        if (dueDate < today) groups.overdue.push(task);
        else if (dueDate === today) groups.today.push(task);
        else groups.upcoming.push(task);
      }
    });

    return groups;
  }, [tasks]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Loading your garden tasks...</p>
    </div>
  );

  const TaskItem = ({ task }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        task.isCompleted ? 'bg-muted/10 border-border/50 opacity-60' : 'bg-surface border-border hover:border-primary/30'
      }`}
    >
      <button 
        onClick={() => toggleTask(task._id, task.isCompleted)}
        className={`transition-colors ${task.isCompleted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
      >
        {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <div className="flex-1">
        <h4 className={`font-bold ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
      <button 
        onClick={() => deleteTask(task._id)}
        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Garden Tasks</h1>
          <p className="text-muted-foreground mt-1">Keep your plants happy and healthy</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleOptimize}
                disabled={isOptimizing || groupedTasks.overdue.length === 0}
                className="bg-accent/10 text-accent font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-accent/20 transition-all disabled:opacity-50"
            >
                {isOptimizing ? <Loader2 className="animate-spin" /> : <><Wand2 size={20} /> Smart Optimize</>}
            </button>
        </div>
      </header>

      {/* Smart Add Bar */}
      <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-xl shadow-primary/5">
        <div className="flex items-center gap-3 text-primary mb-2">
            <Sparkles size={20} />
            <h3 className="font-bold">Smart Add</h3>
        </div>
        <form onSubmit={handleSmartAdd} className="flex gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              value={smartInput}
              onChange={(e) => setSmartInput(e.target.value)}
              placeholder="e.g., 'Water my roses tomorrow morning' or 'Prune basil every Sunday'"
              className="w-full bg-background border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Brain size={20} className="opacity-50" />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isSmartLoading || !smartInput.trim()}
            className="bg-primary text-primary-foreground font-bold px-8 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isSmartLoading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add Task</>}
          </button>
        </form>
        <p className="text-xs text-muted-foreground italic pl-2">
            AI will automatically detect the plant, action, and schedule.
        </p>
      </div>

      <div className="space-y-10">
        {/* Overdue */}
        {groupedTasks.overdue.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-destructive flex items-center gap-2 px-2">
              <AlertCircle size={20} /> Overdue
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {groupedTasks.overdue.map(task => <TaskItem key={task._id} task={task} />)}
            </div>
          </section>
        )}

        {/* Today */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2 px-2">
            <Calendar size={20} /> Today
          </h3>
          {groupedTasks.today.length === 0 ? (
            <div className="p-8 text-center bg-muted/5 border border-dashed border-border rounded-3xl text-muted-foreground">
                No tasks for today. You're all caught up!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {groupedTasks.today.map(task => <TaskItem key={task._id} task={task} />)}
            </div>
          )}
        </section>

        {/* Upcoming */}
        {groupedTasks.upcoming.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-secondary flex items-center gap-2 px-2">
              <Clock size={20} /> Upcoming
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {groupedTasks.upcoming.map(task => <TaskItem key={task._id} task={task} />)}
            </div>
          </section>
        )}

        {/* Completed */}
        {groupedTasks.completed.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-muted-foreground flex items-center gap-2 px-2">
              <CheckCircle2 size={20} /> Completed
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {groupedTasks.completed.map(task => <TaskItem key={task._id} task={task} />)}
            </div>
          </section>
        )}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center text-5xl">📋</div>
          <div>
            <h3 className="text-2xl font-bold">Your list is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
                Add your first task above or use the Smart Add feature to quickly build your schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
