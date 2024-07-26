import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') {
      return; // Prevent adding empty todos
    }
    try {
      const response = await axios.post('http://localhost:5000/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      setEditTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h1>To-Do List</h1>
          <Form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
            <Form.Group controlId="formNewTodo">
              <Form.Control
                type="text"
                placeholder="Add new todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {todos.map((todo) => (
            <div key={todo.id} className="d-flex justify-content-between align-items-center my-2">
              {editTodo === todo.id ? (
                <Form.Control
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span>{todo.text}</span>
              )}
              <div>
                {editTodo === todo.id ? (
                  <Button variant="success" onClick={() => updateTodo(todo.id)}>
                    Save
                  </Button>
                ) : (
                  <Button variant="warning" onClick={() => { setEditTodo(todo.id); setEditText(todo.text); }}>
                    Edit
                  </Button>
                )}
                <Button variant="danger" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TodoList;
