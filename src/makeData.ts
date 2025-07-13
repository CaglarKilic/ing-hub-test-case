import { faker } from '@faker-js/faker'
import type { Person } from './employee-context'

export const STORAGE_KEY = 'employee-data'

faker.seed(1)

const newPerson = (): Person => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfEmployment: faker.date.between({ from: new Date().setFullYear(2021), to: new Date().setFullYear(2024) }),
    dateOfBirth: faker.date.between({ from: new Date().setFullYear(1975), to: new Date().setFullYear(2000) }),
    phoneNumber: faker.phone.number({ style: 'international' }),
    email: faker.internet.email(),
    department: faker.helpers.arrayElement<Person['department']>(['Analytics', 'Tech']),
    position: faker.helpers.arrayElement<Person['position']>(['Junior', 'Medior', 'Senior'])
  }
}

export function makeData(count: number) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const data = JSON.parse(raw, (key, value) => {
      if (key.includes('date')) return new Date(value)
      return value
    }) as Person[]
    return data
  }
  else {
    const data = Array.from({ length: count }, () => newPerson())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  }
}