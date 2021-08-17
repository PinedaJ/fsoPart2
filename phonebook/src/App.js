import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ isSuccessful, setIsSuccessful ] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personNames = persons.map(person => person.name.toLowerCase()) // case insensitive
    if (personNames.includes(newName.toLowerCase())) { // if name exists in phonebook already
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const pers = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        const changedPerson = { ...pers, number: newNumber}
        personService
          .update(pers.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== pers.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${returnedPerson.name}'s number`)
            setIsSuccessful(true)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessage(`Information of ${changedPerson.name} has already been removed from server`)
            setIsSuccessful(false)
            setPersons(persons.filter(person => person.id !== pers.id))
            console.log('failed to update, person has been deleted')
          })
      }
      return
    } // else create new person object for phonebook
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${returnedPerson.name}`)
        setIsSuccessful(true)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilteredSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const removePersonOf = (id) => {
    const personToRemove = personsToShow.find(person => person.id === id)
    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      personService.remove(id)
      setPersons(persons.filter(person => person.id !== id))
      setMessage(`Deleted ${personToRemove.name}`)
      setIsSuccessful(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isSuccessful={isSuccessful} />
      <Filter searchTerm={searchTerm} handleFilteredSearch={handleFilteredSearch} />
  
      <h3>add a new</h3>

      <PersonForm
        newName={newName} newNumber={newNumber} addPerson={addPerson}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      {personsToShow.map(person => 
        <Persons
          key={person.name}
          person={person} 
          removePerson={() => removePersonOf(person.id)}
        />
      )}
    </div>
  )
}

export default App