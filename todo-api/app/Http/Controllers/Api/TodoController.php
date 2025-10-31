<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $query = Todo::query();

        // Filter by status (comma-separated)
        if ($request->has('status')) {
            $statuses = explode(',', $request->status);
            $query->whereIn('status', $statuses);
        }

        // Filter by priority (comma-separated)
        if ($request->has('priority')) {
            $priorities = explode(',', $request->priority);
            $query->whereIn('priority', $priorities);
        }

        // Search in title and description
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        if ($request->has('sort')) {
            $sortParts = explode(':', $request->sort);
            $field = $sortParts[0] ?? 'created_at';
            $direction = $sortParts[1] ?? 'desc';
            
            // Map frontend field names to database column names
            $fieldMap = [
                'createdAt' => 'created_at',
                'updatedAt' => 'updated_at',
                'dueDate' => 'dueDate'
            ];
            
            $dbField = $fieldMap[$field] ?? $field;
            $query->orderBy($dbField, $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginate
        $perPage = $request->get('per_page', 15);
        $todos = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $todos->items(),
            'meta' => [
                'total' => $todos->total(),
                'per_page' => $todos->perPage(),
                'current_page' => $todos->currentPage(),
                'last_page' => $todos->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'dueDate' => 'nullable|date',
        ]);

        $todo = Todo::create($validated);

        return response()->json([
            'success' => true,
            'data' => $todo,
            'message' => 'Todo created successfully'
        ], 201);
    }

    public function show($id)
    {
        $todo = Todo::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $todo
        ]);
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
            'priority' => 'sometimes|in:low,medium,high',
            'dueDate' => 'nullable|date',
        ]);

        $todo->update($validated);

        return response()->json([
            'success' => true,
            'data' => $todo->fresh(), // Get updated data
            'message' => 'Todo updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Todo deleted successfully'
        ]);
    }
}