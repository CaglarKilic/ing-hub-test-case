import { LitElement, html } from 'lit'
import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { employeeContext, type EmployeeContextValue, type Person } from '../src/employee-context.js'
import { makeData } from '../src/makeData.js'

const data = makeData(29)

// Create a test provider using the existing context
export class TestProvider extends LitElement {
  @provide({ context: employeeContext })
  @state()
  public _employeeContext: EmployeeContextValue = {
    employees: [
      {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: new Date('2023-01-15'),
        dateOfBirth: new Date('1990-05-20'),
        phoneNumber: '+1-555-0123',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
      } as Person,
      ...data
    ],
    addEmployee: () => { },
    updateEmployee: () => { },
    deleteEmployee: () => { },
    deleteEmployees: () => { }
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('test-provider', TestProvider) 