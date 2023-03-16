const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  //Number is used to convert the string to a number
  // const note = notes.find(note => {
  //   console.log(note.id, typeof note.id, id, typeof id, note.id === id)

  //   return note.id === id
  // })
  const note = notes.find(note => note.id === id)
  console.log("Note", note.content)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
  return maxId + 1
}


app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    importent: body.importent || false,
    id: generateId()
  }

  notes = notes.concat(note)
  response.json(note)


})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

