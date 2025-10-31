'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';

// Type definitions
interface Todo {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  status: string[];
  priority: string[];
  sort: string;
}

interface NotificationType {
  message: string;
  type: 'success' | 'error';
}

const TodoStatus = {
  TODO: 'todo' as const,
  IN_PROGRESS: 'in_progress' as const,
  DONE: 'done' as const
};

const TodoPriority = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const
};

// ✅ NEW: Real API service connecting to Laravel
const todoService = {
  async getTodos(filters = {}) {
    try {
      // Build query string
      const params = new URLSearchParams();
      
      if (filters.status && filters.status.length > 0) {
        params.append('status', filters.status.join(','));
      }
      if (filters.priority && filters.priority.length > 0) {
        params.append('priority', filters.priority.join(','));
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }

      const url = `/api/todos${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const result = await response.json();
      return { data: result.data || [], total: result.meta?.total || 0 };
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  async createTodo(todo) {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  async updateTodo(id, updates) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  async deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
};

const validateTodo = (todo) => {
  const errors = {};
  if (!todo.title || todo.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  if (todo.title && todo.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }
  if (!todo.status || !Object.values(TodoStatus).includes(todo.status)) {
    errors.status = 'Valid status is required';
  }
  if (!todo.priority || !Object.values(TodoPriority).includes(todo.priority)) {
    errors.priority = 'Valid priority is required';
  }
  return errors;
};

const TodoForm = ({ todo, onSave, onCancel }) => {
  const [formData, setFormData] = useState(todo || {
    title: '',
    description: '',
    status: TodoStatus.TODO,
    priority: TodoPriority.MEDIUM,
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validationErrors = validateTodo(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {todo ? 'Edit Todo' : 'Create New Todo'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter todo title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              rows={3}
              placeholder="Enter description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value={TodoStatus.TODO}>To Do</option>
                <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                <option value={TodoStatus.DONE}>Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value={TodoPriority.LOW}>Low</option>
                <option value={TodoPriority.MEDIUM}>Medium</option>
                <option value={TodoPriority.HIGH}>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {todo ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TodoCard = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case TodoPriority.HIGH: return 'bg-red-100 text-red-800';
      case TodoPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case TodoPriority.LOW: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TodoStatus.DONE: return 'bg-green-100 text-green-800';
      case TodoStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case TodoStatus.TODO: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg flex-1">{todo.title}</h3>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(todo)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {todo.description && (
        <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
          {todo.status.replace('_', ' ')}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
          {todo.priority}
        </span>
        {todo.dueDate && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <select
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value={TodoStatus.TODO}>To Do</option>
          <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
          <option value={TodoStatus.DONE}>Done</option>
        </select>
      </div>
    </div>
  );
};

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    priority: [],
    sort: 'createdAt:desc'
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadTodos();
  }, [filters]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const result = await todoService.getTodos(filters);
      setTodos(result.data);
    } catch (error) {
      showNotification('Failed to load todos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async (todoData) => {
    try {
      await todoService.createTodo(todoData);
      showNotification('Todo created successfully');
      setShowForm(false);
      loadTodos();
    } catch (error) {
      showNotification('Failed to create todo', 'error');
    }
  };

  const handleUpdate = async (todoData) => {
    try {
      await todoService.updateTodo(editingTodo.id, todoData);
      showNotification('Todo updated successfully');
      setShowForm(false);
      setEditingTodo(null);
      loadTodos();
    } catch (error) {
      showNotification('Failed to update todo', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        showNotification('Todo deleted successfully');
        loadTodos();
      } catch (error) {
        showNotification('Failed to delete todo', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await todoService.updateTodo(id, { status: newStatus });
      showNotification('Status updated successfully');
      loadTodos();
    } catch (error) {
      showNotification('Failed to update status', 'error');
    }
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(v => v !== value)
        : [...currentFilter, value];
      return { ...prev, [filterType]: newFilter };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Todo Application</h1>
            <button
              onClick={() => {
                setEditingTodo(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              New Todo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(TodoStatus).map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.status.includes(status)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(TodoPriority).map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter('priority', priority)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.priority.includes(priority)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="dueDate:asc">Due Date (Earliest)</option>
              <option value="dueDate:desc">Due Date (Latest)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No todos found</p>
            <p className="text-gray-400 text-sm mt-2">Create your first todo to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={(todo) => {
                  setEditingTodo(todo);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSave={editingTodo ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
        />
      )}

      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        } text-white font-medium z-50`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}