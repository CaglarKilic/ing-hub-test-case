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

export type EmployeeContextValue = {
  employees: Person[]
  addEmployee: (employee: Person) => void
  updateEmployee: (index: number, employee: Person) => void
  deleteEmployee: (index: number) => void
  deleteEmployees: (indices: number[]) => void
}

export const employeeContext = createContext<EmployeeContextValue>('employee-context')