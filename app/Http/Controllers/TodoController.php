<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todos = Todo::orderBy('completed', 'asc')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Welcome', [
            'todos' => $todos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        Todo::create($request->validated());

        $todos = Todo::orderBy('completed', 'asc')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Welcome', [
            'todos' => $todos
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $todo->update($request->validated());

        $todos = Todo::orderBy('completed', 'asc')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Welcome', [
            'todos' => $todos
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $todo->delete();

        $todos = Todo::orderBy('completed', 'asc')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Welcome', [
            'todos' => $todos
        ]);
    }
}