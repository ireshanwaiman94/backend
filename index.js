const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

//meka use karanne doule folder eka athule thiyana 
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(cors())
app.use(express.json())
app.use(requestLogger)
//meka use karanne Front end kea buld karala api back end ekata dagannawane eka run karanna thamai me code line eka use karanne
app.use(express.static('build'))


// var morgan = require('morgan')
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })

})


app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


// Find data older code
// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//Number is used to convert the string to a number
// const note = notes.find(note => {
//   console.log(note.id, typeof note.id, id, typeof id, note.id === id)

//   return note.id === id
// })
//   const note = Note.find(note => note.id === id)
//   console.log("Note", note.content)
//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })

app.delete('/api/notes/:id', (request, response) => {
  // const id = Number(request.params.id)
  // Note = Note.filter(note => note.id !== id)
  // response.status(204).end()
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...Note.map(note => note.id)) : 0
  return maxId + 1
}


app.use(requestLogger)

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  //older code
  // const note = {
  //   content: body.content,
  //   importent: body.importent || false,
  //   id: generateId()
  // }

  note.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))
  //older code
  // Note = Note.concat(note)
  // console.log(Note)
  // response.json(note)


})

app.put('/api/notes/:id', (request, response, next) => {
  // const body = request.body
  const { content, important } = request.body

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }

  Note.findByIdAndUpdate(request.params.id, { content, important },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

