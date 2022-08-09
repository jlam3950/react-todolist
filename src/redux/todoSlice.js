import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk(
    'todos/getTodosAsync',
//thunk is a function that returns another function
    async () => {
    const response = await fetch('http://localhost:8800/todos')
    if(response.ok){
        const todos = await response.json();
             return { todos }; //part of the payload
    }
})

export const addTodoAsync = createAsyncThunk(
    'todos/addTodoAsync', 
    async(payload) =>{
    const response = await fetch('http://localhost:8800/todos', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title: payload.title})
        })

        if(response.ok){
            const todo = await response.json();
            return { todo };
        }
})

export const deleteTodoAsync = createAsyncThunk(
    'todos/deleteTodoAsync',
    async(payload) => {
        const response = await fetch(`http://localhost:8800/todos/${payload.id}`,{
            method: 'DELETE',
            });
        
        if(response.ok){
            return { id: payload.id }
        }
    }
);

export const toggleCompleteAsync = createAsyncThunk(
    'todos/completeTodoAsync', 
    async(payload) =>{
    const response = await fetch(`http://localhost:8800/todos/${payload.id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({completed: payload.completed})
    })
    if(response.ok){
        const todo = await response.json();
        return { todo };
    }
})

const todoSlice = createSlice({
    name: 'todos',
    initialState: [
        { id:1, title: 'todo1', completed: false },
        { id:2, title: 'todo2', completed: false },
        { id:3, title: 'todo3', completed: true },
    ],
    reducers: {
        addTodo: (state,action) => {
            const newTodo = {
                id: Date.now(),
                title: action.payload.title,
                completed: false,
            };
            state.push(newTodo);
        },
        toggleComplete: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id
            );
            state[index].completed = action.payload.completed;
       },
       deleteTodo: (state, action) => {
            return state.filter((todo)=> todo.id !== action.payload.id);
       },
    },
    extraReducers: {
        [getTodosAsync.pending]: (state, action) => {
            console.log('fetching data...')
        },
        [getTodosAsync.fulfilled]: (state, action) => {
            console.log('fetched data successfully!')
            return action.payload.todos;
        },
        [addTodoAsync.fulfilled]: (state,action) => {
            state.push(action.payload.todo);
        },
        [toggleCompleteAsync.fufilled]: (state,action) =>{
            const index = state.findIndex(
                (todo) => todo.id === action.payload.id
            );
            state[index].completed = action.payload.completed;
        },
        [deleteTodoAsync.fufilled]: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload.id);
        }
        //fulfilled when thunk completed
    }
});

export const { 
    addTodo,
    toggleComplete,
    deleteTodo,  
} = todoSlice.actions; 

export default todoSlice.reducer; 

//slice gives us a way to store a slice of data, and also gives us way to retreive that data 
