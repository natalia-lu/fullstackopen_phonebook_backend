const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length > 3 && process.argv.length !== 5) {
  console.log('Please provide the password, the name and the number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
} else {
  const password = process.argv[2]

  const url =
    `mongodb+srv://fullstack:${password}@cluster0.3pxcd.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 3) {
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, ' ', person.number)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {
    const newContact = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })
    newContact.save().then(() => {
      console.log(`added ${newContact.name} number ${newContact.number} to phonebook`)
      mongoose.connection.close()
    })
  }
}