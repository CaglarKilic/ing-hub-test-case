import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { makeData } from './makeData'
import { provide } from '@lit/context'
import { employeeContext, type Person, type EmployeeContextValue } from './employee-context'
import { STORAGE_KEY } from './makeData'

@customElement('app-root')
export class App extends LitElement {

  private persistToStorage = (employees: Person[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  }

  @provide({ context: employeeContext })
  @state()
  private _employeeContext: EmployeeContextValue = {
    employees: makeData(50),
    addEmployee: (employee: Person) => {
      const newEmployees = [employee, ...this._employeeContext.employees]
      this._employeeContext = {
        ...this._employeeContext,
        employees: newEmployees
      }
      this.persistToStorage(newEmployees)
    },
    updateEmployee: (index: number, employee: Person) => {
      const updatedEmployees = [...this._employeeContext.employees]
      updatedEmployees[index] = employee
      this._employeeContext = {
        ...this._employeeContext,
        employees: updatedEmployees
      }
      this.persistToStorage(updatedEmployees)
    },
    deleteEmployee: (index: number) => {
      const filteredEmployees = this._employeeContext.employees.filter((_, i) => i !== index)
      this._employeeContext = {
        ...this._employeeContext,
        employees: filteredEmployees
      }
      this.persistToStorage(filteredEmployees)
    },
    deleteEmployees: (indices: number[]) => {
      const filteredEmployees = this._employeeContext.employees.filter((_, i) => !indices.includes(i))
      this._employeeContext = {
        ...this._employeeContext,
        employees: filteredEmployees
      }
      this.persistToStorage(filteredEmployees)
    }
  }

  render() {
    return html`
      <header>ING</header>
      <main>
        <slot></slot>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': App
  }
}
