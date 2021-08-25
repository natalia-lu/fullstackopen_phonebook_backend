const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('post-body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

let persons = [
  { 
	"id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)	
})

app.get("/info", (request, response) => {
  const date = new Date() 
  response.send(`<div>Phonebook has info for ${persons.length} people</div> 
				 <div style="margin-top: 10px;">${date}</div>`)	
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
	response.json(person)  
  } else {
	response.status(404).end()  
  }	  
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)  
  response.status(204).end()  	  
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
	let subject = ""  
    if (!body.name && !body.number) subject = "name and number"
    else if (!body.name) subject = "name"
    else subject = "number" 	
     		
    return response.status(400).json({error: `${subject} missing`})
  }
  if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
	return response.status(400).json({error: "name must be unique"})  
  }	  
  const newContact = {
	id: Math.floor(Math.random() * 100000) + 1,
	name: body.name,
	number: body.number
  }	  
  persons = persons.concat(newContact)
  response.json(newContact)  
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)