export const filterTodos = (filterParam, todos) => {
    if (filterParam === 'completed') {
        return todos.filter(todo => {
            return todo.isComplete
        })
    }
    else if (filterParam === 'active') {
        return todos.filter(todo => {
            return !todo.isComplete
        })
    }
    return todos
}