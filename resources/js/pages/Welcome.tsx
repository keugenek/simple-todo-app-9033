import React, { useState } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Props extends SharedData {
    todos: Todo[];
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth, todos } = usePage<Props>().props;
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        router.post(route('todos.store'), { title: newTodoTitle.trim() }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setNewTodoTitle('');
            }
        });
    };

    const handleToggleComplete = (todo: Todo) => {
        router.patch(route('todos.update', todo.id), { completed: !todo.completed }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDeleteTodo = (todo: Todo) => {
        router.delete(route('todos.destroy', todo.id), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    return (
        <>
            <Head title="Todo App">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[800px] text-sm">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="w-full max-w-[800px] flex-1">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Todo App</h1>
                        <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                            Organize your tasks and get things done
                        </p>
                    </div>

                    {/* Add new todo form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Task
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddTodo} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter a new task..."
                                    value={newTodoTitle}
                                    onChange={(e) => setNewTodoTitle(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={!newTodoTitle.trim()}>
                                    Add Task
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tasks list */}
                    <div className="space-y-6">
                        {/* Pending tasks */}
                        {pendingTodos.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#1b1b18] dark:text-[#EDEDEC]">
                                        Pending Tasks ({pendingTodos.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pendingTodos.map((todo) => (
                                            <div
                                                key={todo.id}
                                                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Checkbox
                                                    checked={todo.completed}
                                                    onCheckedChange={() => handleToggleComplete(todo)}
                                                />
                                                <span className="flex-1 text-[#1b1b18] dark:text-[#EDEDEC]">
                                                    {todo.title}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTodo(todo)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Completed tasks */}
                        {completedTodos.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Completed Tasks ({completedTodos.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {completedTodos.map((todo) => (
                                            <div
                                                key={todo.id}
                                                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Checkbox
                                                    checked={todo.completed}
                                                    onCheckedChange={() => handleToggleComplete(todo)}
                                                />
                                                <span className="flex-1 text-[#706f6c] line-through dark:text-[#A1A09A]">
                                                    {todo.title}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTodo(todo)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Empty state */}
                        {todos.length === 0 && (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <div className="mb-4 text-4xl">📝</div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                        No tasks yet
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Add your first task above to get started!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <footer className="mt-12 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        Built with ❤️ by{' '}
                        <a
                            href="https://app.build"
                            target="_blank"
                            className="font-medium text-[#f53003] hover:underline dark:text-[#FF4433]"
                        >
                            app.build
                        </a>
                    </footer>
                </main>
            </div>
        </>
    );
}