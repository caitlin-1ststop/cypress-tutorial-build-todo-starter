import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import { saveTodo, loadTodos, destroyTodo, updateTodo } from '../lib/service';
import { filterTodos } from '../lib/utils';


export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      todos: [],
      currentTodo:''
    }
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this)
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount () {
      loadTodos()
        .then(({data}) => {
            this.setState({
                todos: data
            })
        })
        .catch(() => {
            this.setState({error: true})
        })
  }

  handleNewTodoChange (event) {
    this.setState({currentTodo: event.target.value})
  }

  handleTodoSubmit (event) {
      event.preventDefault();
      const newTodo = {name: this.state.currentTodo, isComplete: false}
      saveTodo(newTodo)
        .then(({data}) => {
            this.setState({
                todos: this.state.todos.concat(data),
                currentTodo: ''
            })
        })
        .catch(() => {
            this.setState({ error: true })
        })
  }

  handleToggle (id) {
      const targetTodo = this.state.todos.find(todo => { return todo.id === id})
      const updated = {
          ...targetTodo, isComplete: !targetTodo.isComplete
      }
      updateTodo(updated)
        .then(({data}) => {
            const updatedTodos = this.state.todos.map(todo => {
                return todo.id === data.id ? updated : todo
            })
            this.setState({
                todos: updatedTodos
            })
        })
  }

  handleDelete (id) {
      destroyTodo(id)
        .then((res) => {
            this.setState({
                todos: this.state.todos.filter(todo => {
                    return todo.id !== id
                })
            })
        })
  }

  render () {
    const remaining = this.state.todos.filter(todo => {
        return !todo.isComplete
    }).length
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className='error'>Oh no!</span> : null}
            <TodoForm 
                currentTodo={this.state.currentTodo}
                handleNewTodoChange={this.handleNewTodoChange}
                handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
          <Route path='/:filter?' render={({match}) => {
                return (
                    <TodoList 
                        todos={filterTodos(match.params.filter, this.state.todos)} 
                        handleDelete={this.handleDelete} 
                        handleToggle={this.handleToggle}
                    />
                )
          }}/>
          </section>
          <Footer remaining={remaining}/>
        </div>
      </Router>
    )
  }
}
