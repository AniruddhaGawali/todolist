'use client';

import { Button, message, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

type Props = {
  setEditTodo: (todo: TodoType) => void;
  data: TodoType[];
  setOpen: (open: boolean) => void;
  deleteTodo: (todo: TodoType) => Promise<void>;
  updateTodo: (todo: TodoType) => Promise<boolean>;
};

function TodoTable({
  data,
  setEditTodo,
  setOpen,
  deleteTodo,
  updateTodo,
}: Props) {
  const columns: TableProps<TodoType>['columns'] = [
    {
      title: 'Sno',
      key: 'sno',
      width: 50,
      render: (_, record) => <span>{data.indexOf(record) + 1}</span>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag
          color={
            priority === 'low'
              ? 'green'
              : priority === 'medium'
              ? 'orange'
              : 'red'
          }
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => new Date(dueDate).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'isDone',
      render: (isDone) => (
        <Tag color={isDone ? 'green' : 'red'}>
          {isDone ? 'Completed' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.isDone ? (
            <Button
              onClick={async () => {
                record.isDone = false;
                await updateTodo({
                  ...record,
                  isDone: false,
                });
              }}
            >
              Mark as Pending
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={async () => {
                record.isDone = true;
                await updateTodo({
                  ...record,
                  isDone: true,
                });
              }}
            >
              Mark as Completed
            </Button>
          )}

          <Button
            type="primary"
            onClick={() => {
              setEditTodo(record);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={async () => {
              await deleteTodo(record);
              message.success('Todo deleted successfully!');
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table<TodoType>
        columns={columns}
        dataSource={data}
        className="rounded-lg"
        bordered
      />
    </div>
  );
}

export default TodoTable;
