import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Person {
  id: string
  name: string
}

export const usePeopleStore = defineStore('people', () => {
  const people = ref<Person[]>([])

  function addPerson(name: string) {
    people.value.push({
      id: crypto.randomUUID(),
      name,
    })
  }

  function removePerson(id: string) {
    people.value = people.value.filter((person) => person.id !== id)
  }

  return {
    people,
    addPerson,
    removePerson,
  }
})
