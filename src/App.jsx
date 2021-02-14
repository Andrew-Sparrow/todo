import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import {
  Container,
} from '@material-ui/core';

import AddNewTaskContainer from './components/AddNewTaskContainer';

import Header from './components/Header';
import Tasks from './components/Tasks';
import NoTasks from './components/NoTasks';
import Footer from './components/Footer';
import About from './components/About';

const App = () => {
  const [tasks, setTasks] = useState([]);

  const containerStyle = {
    backgroundColor: '#CDDFF1',
    border: 'solid 1px black',
    borderRadius: '5px',
    padding: '50px',
    paddingBlockStart: '25px',
  };

  const fetchTasks = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/tasks`);
    const tasksFromServer = await response.json();

    return tasksFromServer;
  };

  const fetchTask = async (id) => {
    // const response = await fetch(`http://localhost:5000/tasks/${id}`);
    const response = await fetch(`${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/tasks/${id}`);
    const task = await response.json();

    return task;
  };

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  const addTask = async (task) => {
    const isCompleted = false;
    const newTask = { isCompleted, ...task };

    const response = await fetch(`${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/tasks`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    const taskFromServer = await response.json();

    setTasks([...tasks, taskFromServer]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });

    setTasks(tasks.filter((task) => id !== task.id));
  };

  const toggleCompleted = async (id, isChecked) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, isCompleted: isChecked };

    const response = await fetch(`${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    const taskFromServer = await response.json();

    setTasks(tasks.map(
      (task) => (task.id === id
        ? { ...task, isCompleted: taskFromServer.isCompleted }
        : task),
    ));
  };

  const editTaskText = async (id, taskText) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, text: taskText };

    const response = await fetch(`${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    const taskFromServer = await response.json();

    setTasks(tasks.map(
      (task) => (task.id === id
        ? { ...task, text: taskFromServer.text }
        : task),
    ));
  };

  return (
    <Router>
      <Container
        component="div"
        maxWidth="sm"
        style={containerStyle}
      >
        <Header />
        <Route
          path="/"
          exact
          render={() => (
            <>
              <AddNewTaskContainer onAdd={addTask} />
              {tasks.length > 0
                ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggleCompleted={toggleCompleted}
                    editTaskText={editTaskText}
                  />
                )
                : <NoTasks />}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </Container>
    </Router>
  );
};

export default App;
