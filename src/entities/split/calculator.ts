import type { Receipt } from '@/entities/receipt/model'
import type { Person } from '@/stores/people'

export interface PersonTotal {
  person: Person

  subtotal: number
  serviceCharge: number
  pb1: number

  total: number
}

export function calculateSplit(receipt: Receipt, people: Person[]): PersonTotal[] {
  const result: PersonTotal[] = people.map((person) => ({
    person,

    subtotal: 0,
    serviceCharge: 0,
    pb1: 0,

    total: 0,
  }))

  for (const item of receipt.items) {
    if (!item.assignedTo.length) {
      continue
    }

    const share = item.price / item.assignedTo.length

    for (const personId of item.assignedTo) {
      const person = result.find((x) => x.person.id === personId)

      if (!person) {
        continue
      }

      person.subtotal += share
    }
  }

  for (const person of result) {
    person.serviceCharge = (person.subtotal * (receipt.serviceCharge ?? 0)) / 100

    const taxable = person.subtotal + person.serviceCharge

    person.pb1 = (taxable * (receipt.pb1 ?? 0)) / 100

    person.total = taxable + person.pb1
  }

  return result
}
