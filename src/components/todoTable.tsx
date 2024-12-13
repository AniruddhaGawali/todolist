'use client';

import { Button, message, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useMediaQuery } from 'react-responsive';

type Props = {
  setEditTodo: (todo: TodoType) => void;
  data: TodoType[];
  setOpen: (open: boolean) => void;
  deleteTodo: (todo: TodoType) => Promise<boolean>;
  updateTodo: (todo: TodoType) => Promise<boolean>;
};

function TodoTable({
  data,
  setEditTodo,
  setOpen,
  deleteTodo,
  updateTodo,
}: Props) {
  // Use media queries to determine screen size
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const columns: TableProps<TodoType>['columns'] = [
    {
      title: 'Sno',
      key: 'sno',
      width: 50,
      render: (_, record) => <span>{data.indexOf(record) + 1}</span>,
      responsive: ['md'], // Only show on medium and larger screens
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true, // Add ellipsis for long titles
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
      responsive: ['md'], // Only show on medium and larger screens
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
        <Space
          size={isMobile ? 'small' : 'middle'}
          direction={isMobile ? 'vertical' : 'horizontal'}
        >
          {record.isDone ? (
            <Button
              size={isMobile ? 'small' : 'middle'}
              onClick={async () => {
                record.isDone = false;
                await updateTodo({
                  ...record,
                  isDone: false,
                });
              }}
            >
              Mark Pending
            </Button>
          ) : (
            <Button
              size={isMobile ? 'small' : 'middle'}
              type="primary"
              onClick={async () => {
                record.isDone = true;
                await updateTodo({
                  ...record,
                  isDone: true,
                });
              }}
            >
              Mark Completed
            </Button>
          )}

          <Button
            size={isMobile ? 'small' : 'middle'}
            type="primary"
            onClick={() => {
              setEditTodo(record);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size={isMobile ? 'small' : 'middle'}
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
    <div className="w-full overflow-x-auto">
      <Table<TodoType>
        columns={columns}
        dataSource={data}
        className="rounded-lg"
        bordered
        scroll={{ x: isMobile ? 800 : undefined }} // Enable horizontal scroll on mobile
        pagination={{
          responsive: true, // Responsive pagination
          showSizeChanger: !isMobile, // Show page size changer on larger screens
          pageSizeOptions: [5, 10, 20],
          defaultPageSize: isMobile ? 5 : 10,
        }}
      />
    </div>
  );
}

export default TodoTable;
