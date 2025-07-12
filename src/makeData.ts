import { faker } from '@faker-js/faker'

faker.seed(1)

export type Person = {
  firstName: string
  lastName: string
  dateOfEmployment: Date
  dateOfBirth: Date
  phoneNumber: string
  email: string
  department: 'Analytics' | 'Tech'
  position: 'Junior' | 'Medior' | 'Senior'
}

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
  return Array.from({ length: count }, () => newPerson())
}