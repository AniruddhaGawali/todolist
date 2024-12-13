type TodoType = {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  isDone: boolean;
};
