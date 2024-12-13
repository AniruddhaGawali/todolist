'use client';

import { pushTodo, fetchTodos, putTodo, dropTodo } from '@/actions/todos';
import TodoForm from '@/components/todoForm';
import TodoTable from '@/components/todoTable';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [editTodo, setEditTodo] = useState<TodoType | null>(null);
  const [open, setOpen] = useState(false);

  async function addTodo(todo: TodoType) {
    if (!todo.id) {
      todo.id = (todos.length + 1).toString();
    }

    if (!todo.isDone) {
      todo.isDone = false;
    }

    setTodos([...todos, todo]);
    await pushTodo(todo);
    return true;
  }

  async function updateTodo(todo: TodoType) {
    const index = todos.findIndex((t) => t.id === todo.id);

    if (index === -1) return false;

    todos[index] = todo;
    setTodos([...todos]);
    await putTodo(todo);
    return true;
  }

  async function deleteTodo(todo: TodoType) {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index === -1) return false;

    todos.splice(index, 1);
    setTodos([...todos]);
    dropTodo(todo);

    return true;
  }

  useEffect(() => {
    fetchTodos().then((data) => {
      setTodos(data);
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <main className="max-w-screen-xl w-full h-full flex flex-col gap-8 p-8">
        <h1 className="text-5xl md:text-8xl font-bold text-center bg-gradient-to-br w-fit m-auto text-transparent bg-clip-text from-primary via-secondary to-accent">
          Todos
        </h1>
        <div className="bg-tertiary p-4 rounded-lg border-2 shadow-xl border-secondary">
          <TodoTable
            data={todos}
            setEditTodo={setEditTodo}
            setOpen={setOpen}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        </div>
      </main>
      <TodoForm
        addTodo={addTodo}
        updateTodo={updateTodo}
        todo={editTodo}
        open={open}
        setOpen={setOpen}
        setEditTodo={setEditTodo}
      />
    </div>
  );
}
