'use client';

import { Button, message, Space, Table, Tag, Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';

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
  // State to track screen size breakpoints
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  // Use media queries to determine screen size
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Small mobile devices
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // Tablets and larger mobile devices

  // Update screen size state
  useEffect(() => {
    if (isMobile) setScreenSize('mobile');
    else if (isTablet) setScreenSize('tablet');
    else setScreenSize('desktop');
  }, [isMobile, isTablet]);

  const columns: TableProps<TodoType>['columns'] = [
    {
      title: 'Sno',
      key: 'sno',
      width: 80,
      render: (_, record) => <span>{data.indexOf(record) + 1}</span>,
      responsive: screenSize === 'desktop' ? ['md'] : [], // Only show on desktop
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div className="flex flex-col">
          <span className="font-semibold">{title}</span>
          {screenSize !== 'desktop' && (
            <div className="flex flex-wrap items-center gap-1 mt-1">
              <Tag
                color={
                  record.priority === 'low'
                    ? 'green'
                    : record.priority === 'medium'
                    ? 'orange'
                    : 'red'
                }
              >
                {record.priority}
              </Tag>
              <span>{new Date(record.dueDate).toLocaleDateString()}</span>
              <Tag color={record.isDone ? 'green' : 'red'}>
                {record.isDone ? 'Completed' : 'Pending'}
              </Tag>
            </div>
          )}
        </div>
      ),
      ellipsis: true,
      width: screenSize === 'mobile' ? 150 : undefined,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
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
      responsive: screenSize === 'desktop' ? ['md'] : [],
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 150,
      render: (dueDate) => new Date(dueDate).toLocaleDateString(),
      responsive: screenSize === 'desktop' ? ['md'] : [],
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'isDone',
      width: 100,
      render: (isDone) => (
        <Tag color={isDone ? 'green' : 'red'}>
          {isDone ? 'Completed' : 'Pending'}
        </Tag>
      ),
      responsive: screenSize === 'desktop' ? ['md'] : [],
    },
    {
      title: 'Action',
      key: 'action',
      width: screenSize === 'mobile' ? 120 : undefined,
      render: (_, record) => (
        <div className="flex items-center gap-2 w-full">
          {record.isDone ? (
            <Button
              size={screenSize === 'mobile' ? 'small' : 'middle'}
              block
              onClick={async () => {
                record.isDone = false;
                await updateTodo({
                  ...record,
                  isDone: false,
                });
                message.success('Todo marked as pending');
              }}
            >
              Mark Pending
            </Button>
          ) : (
            <Button
              size={screenSize === 'mobile' ? 'small' : 'middle'}
              type="primary"
              block
              onClick={async () => {
                record.isDone = true;
                await updateTodo({
                  ...record,
                  isDone: true,
                });
                message.success('Todo marked as completed');
              }}
            >
              Mark Completed
            </Button>
          )}

          <Button
            size={screenSize === 'mobile' ? 'small' : 'middle'}
            type="primary"
            block
            onClick={() => {
              setEditTodo(record);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this todo?"
            onConfirm={async () => {
              await deleteTodo(record);
              message.success('Todo deleted successfully!');
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size={screenSize === 'mobile' ? 'small' : 'middle'}
              danger
              block
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-2 md:p-4">
      <Table<TodoType>
        columns={columns}
        dataSource={data}
        className="rounded-lg"
        bordered
        scroll={{
          x: screenSize === 'mobile' ? 800 : undefined,
          y: screenSize === 'mobile' ? 400 : undefined,
        }}
        pagination={{
          responsive: true,
          showSizeChanger: screenSize !== 'mobile',
          pageSizeOptions: [5, 10, 20],
          defaultPageSize: screenSize === 'mobile' ? 5 : 10,
          size: screenSize === 'mobile' ? 'small' : 'default',
        }}
      />
    </div>
  );
}

export default TodoTable;
