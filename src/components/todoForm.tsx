'use client';

import type { FormProps } from 'antd';
import { Button, Modal, DatePicker, Form, Input, Radio, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';

// Priority options
const priority = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

type Props = {
  addTodo: (todo: TodoType) => Promise<boolean>;
  updateTodo: (todo: TodoType) => Promise<boolean>;
  todo: TodoType | null;
  setOpen: (open: boolean) => void;
  open: boolean;
  setEditTodo: (todo: TodoType | null) => void;
};

function TodoForm({
  addTodo,
  todo,
  updateTodo,
  open,
  setOpen,
  setEditTodo,
}: Props) {
  const [form] = Form.useForm<TodoType>();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const onFinish: FormProps<TodoType>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      if (todo) {
        values.id = todo.id;
        values.isDone = todo.isDone;
        values.dueDate = dayjs(values.dueDate).toDate();
        await updateTodo(values);
        message.success('Todo updated successfully!');
        setOpen(false);
        form.resetFields();
        setEditTodo(null);
        return;
      }

      await addTodo(values);
      message.success('Todo added successfully!');
      form.resetFields();
      setOpen(false);
    } catch (error) {
      message.error('An error occurred, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<TodoType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);

    message.error('Please fill in all required fields');
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  if (todo) {
    form.setFieldsValue({
      title: todo.title,
      priority: todo.priority,
      dueDate: dayjs(todo.dueDate),
    });
  }

  return (
    <>
      <button
        onClick={showModal}
        className="text-7xl shadow-2xl w-fit py-2 px-6 bg-gradient-to-br from-primary via-secondary to-accent text-background rounded-2xl fixed bottom-8 right-8"
      >
        +
      </button>
      <Modal
        title="Add Todo"
        open={open}
        onCancel={handleCancel}
        footer={null} // Remove default footer to use form's submit button
        confirmLoading={loading}
      >
        <Form
          form={form} // Pass form instance
          name="todoForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<TodoType>
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please add a todo title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<TodoType>
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please set priority' }]}
          >
            <Radio.Group
              options={priority}
              optionType="button"
            />
          </Form.Item>

          <Form.Item<TodoType>
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: 'Please set the due date' }]}
          >
            <DatePicker
              format={dateFormat}
              minDate={dayjs(Date.now(), dateFormat)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              {todo ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TodoForm;
