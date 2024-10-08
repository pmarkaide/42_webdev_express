const express = require('express')
const fs = require('fs')
const app = express()
const port = 3001

app.use(express.json())

function saveDataToFile() {
  fs.writeFileSync('database.json', JSON.stringify(todoData, null, 2), 'utf-8');
}

let todoData = JSON.parse(fs.readFileSync('database.json', 'utf-8'))


//// GET requests ////

// return all todos
app.get('/', (req, res) => {
  res.send(todoData)
})

// return one todo
app.get('/:id', (req, res) => {
  const todoId = parseInt(req.params.id)
  const todo = todoData.find((todo) => todo.id === todoId)
  res.send(todo)
})

// get completed tasks
app.get('/filter/completed', (req, res) => {
  const completedTodos = todoData.filter(todo => todo.completed)
  res.send(completedTodos)
})

// get uncompleted tasks
app.get('/filter/incomplete', (req, res) => {
  const incompleteTodos = todoData.filter(todo => !todo.completed)
  res.send(incompleteTodos)
})

// search tasks
// GET request to search todos by text using query parameter (case-insensitive)
app.get('/search', (req, res) => {
  const searchText = req.query.text ? req.query.text.toLowerCase() : ''
  console.log(`Search text (query): ${searchText}`)
  const filteredTodos = todoData.filter(todo => todo.text.toLowerCase().includes(searchText))
  console.log(`Filtered todos (query): ${JSON.stringify(filteredTodos)}`)
  res.send(filteredTodos)
})

// GET /search?text=yourSearchTerm
app.get('/search/:text', (req, res) => {
  const searchText = req.params.text.toLowerCase()
  const filteredTodos = todoData.filter(todo => todo.text.toLowerCase().includes(searchText))
  res.send(filteredTodos)
})

//// POST requests ////
// add a new todo
app.post('/', (req, res) => {
  const todo = req.body.text
  const newTodo = {
    id: Date.now(),
    text: todo,
    completed: false
  }
  todoData.push(newTodo)
  saveDataToFile()
  res.send(todoData)
})

//// DELETE requests ////
// delete one todo
app.delete('/delete/:id', (req, res) => {
  const todoId = parseInt(req.params.id)
  todoData = todoData.filter((todo) => todo.id !== todoId)
  saveDataToFile()
  res.send(todoData)
})

// delete all todos
app.delete('/delete/all', (req, res) => {
  todoData = []
  saveDataToFile()
  res.send(todoData)
})

//// PUT requests ////
// update text
app.put('/update/:id/text', (req, res) => {
  const todoId = parseInt(req.params.id)
  const newText = req.body.text
  
  todoData = todoData.map((todo) => {
    if(todo.id === todoId){
      return {...todo, text: newText }
    }
    return todo
  })
  saveDataToFile()
  res.send(todoData)
})

// update completed status
app.put('/update/:id/completed', (req, res) => {
  const todoId = parseInt(req.params.id)
  const newCompleted = req.body.completed
  
  todoData = todoData.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, completed: newCompleted }
    }
    return todo
  })
  saveDataToFile()
  res.send(todoData)
})

//// PATCH requests ////
// update any field
app.patch('/update/:id', (req, res) => {
  const todoId = parseInt(req.params.id)
  const updates = req.body

  todoData = todoData.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, ...updates }
    }
    return todo
  })
  saveDataToFile()
  res.send(todoData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})