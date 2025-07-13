import { createContext } from "@lit/context";

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

export const employeeContext = createContext<Person[]>('employee-context')