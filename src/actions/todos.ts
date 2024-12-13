import axios from 'axios';

export const fetchTodos = async () => {
  const response = await axios.get('api/todo');
  return response.data;
};

export const pushTodo = async (todo: TodoType) => {
  console.log(todo);
  const response = await axios.post('api/todo', todo);
  return response.data;
};

export const putTodo = async (todo: any) => {
  const response = await axios.put(`api/todo`, todo);
};

export const dropTodo = async (todo: any) => {
  try {
    const response = await axios.delete('api/todo/', {
      params: { id: todo.id },
    });
  } catch (error) {
    console.log(error);
  }
};
