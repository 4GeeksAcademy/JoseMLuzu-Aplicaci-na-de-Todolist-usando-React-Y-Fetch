import React, { useState, useEffect } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); 
    const [editableText, setEditableText] = useState(""); 
    const createTodosUrl = "https://playground.4geeks.com/todo/todos/josemanuel";
    const getTodosUrl = "https://playground.4geeks.com/todo/users/josemanuel";
    const deleteTodoUrl = "https://playground.4geeks.com/todo/todos";
    const actualizarTodoUrl = "https://playground.4geeks.com/todo/todos";

    const addTodo = (label) => {
        const newTodo = {
            label: label,
            is_done: false
        };
        fetch(createTodosUrl, {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTodos([...todos, data]);
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };

    useEffect(() => {
        fetch(getTodosUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTodos(data.todos)
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }, []);

    const deleteTodo = (index) => {
        const todoId = todos[index].id;
        fetch(`${deleteTodoUrl}/${todoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedTodos = [...todos];
                updatedTodos.splice(index, 1);
                setTodos(updatedTodos);
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

    const editTodo = (index) => {
        setEditingIndex(index);
        setEditableText(todos[index].label); 
    };

    const saveEditedTodo = (index) => {
        // Obtener el ID del todo a editar
        const todoId = todos[index].id;
        const editedTodo = {
            label: editableText,
            is_done: todos[index].is_done
        };
        fetch(`${actualizarTodoUrl}/${todoId}`, {
            method: "PUT",
            body: JSON.stringify(editedTodo),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedTodos = [...todos];
                updatedTodos[index].label = editableText;
                setTodos(updatedTodos);
                setEditingIndex(null); 
            })
            .catch(error => {
                console.error('Error updating todo:', error);
            });
    };

    return (
        <div className="container">
            <h1 className="titulo">todos</h1>
            <div className="box">
                <ul>
                    <li>
                        <input
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                            value={inputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && inputValue.trim() !== "") {
                                    addTodo(inputValue);
                                    setInputValue("");
                                }
                            }}
                            placeholder="What needs to be done?"
                        />
                    </li>
                    {todos.map((todo, index) => (
                        <li key={index} className="tarea">
                            <h1>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={editableText}
                                        onChange={(e) => setEditableText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveEditedTodo(index);
                                            }
                                        }}
                                    />
                                ) : (
                                    <>
                                        {todo.label}
                                        <i
                                            className="fa fa-times icono-x"
                                            onClick={() => deleteTodo(index)}
                                        ></i>
                                        <i
                                            className="fa-solid fa-pencil"
                                            onClick={() => editTodo(index)}
                                        ></i>
                                    </>
                                )}
                            </h1>
                        </li>
                    ))}
                </ul>
                <div>{todos.length} items left</div>
            </div>
        </div>
    );
};

export default Home;
