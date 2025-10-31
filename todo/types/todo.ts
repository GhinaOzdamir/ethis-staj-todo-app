
export type TodoStatus = 'todo' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface TodosResponse {
  data: Todo[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
}

export interface FilterParams {
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}