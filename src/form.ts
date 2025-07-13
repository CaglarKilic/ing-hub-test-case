import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { employeeContext, type Person, type EmployeeContextValue } from "./employee-context";
import { consume } from "@lit/context";
import { Router } from "@vaadin/router";

@customElement('create-modify-form')
export class Form extends LitElement {
  static styles = css`
    form {
      display: flex;
      gap: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
    } 
  `

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname
    this._mode = pathname === '/edit' ? 'edit' : 'create'
    if (this._mode === 'edit') {
      this._recordId = Number(params.get('id')!);
      this._employee = this._employeeContext.employees[this._recordId]
    }
  }

  private _recordId!: number
  private _mode!: 'edit' | 'create'

  @consume({ context: employeeContext })
  private _employeeContext!: EmployeeContextValue

  @state()
  private _employee!: Person

  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const employee: Person = Object.fromEntries(formData.entries()) as unknown as Person
    employee.dateOfBirth = new Date(employee.dateOfBirth)
    employee.dateOfEmployment = new Date(employee.dateOfEmployment)
    if (this._mode === 'edit') this._employeeContext.updateEmployee(this._recordId, employee)
    if (this._mode === 'create') this._employeeContext.addEmployee(employee)
    Router.go('/')
  }

  render() {
    const { firstName, lastName, dateOfEmployment, dateOfBirth, phoneNumber, email, department, position } = this._employee ?? {}

    return html`
    ${firstName && html`<p>You are editing ${firstName} ${lastName}</p>`}
    <form @submit=${this.handleSubmit}>
      <label for="firstName">
        First Name
        <input type="text" id="firstName" name="firstName" value=${firstName} required />
      </label>

      <label for="lastName">
        Last Name
        <input type="text" id="lastName" name="lastName" value=${lastName}  required />
      </label>

      <label for="dateOfEmployment">
        Date of Employment
        <input type="date" id="dateOfEmployment" name="dateOfEmployment" value=${dateOfEmployment?.toISOString().split('T')[0]} required />
      </label>

      <label for="dateOfBirth">
        Date of Birth
        <input type="date" id="dateOfBirth" name="dateOfBirth" value=${dateOfBirth?.toISOString().split('T')[0]} required />
      </label>

      <label for="phoneNumber">
        Phone Number
        <input type="tel" id="phoneNumber" name="phoneNumber" value=${phoneNumber} required />
      </label>

      <label for="email">
        Email
        <input type="email" id="email" name="email" value=${email} required />
      </label>

      <label for="department">
        Department
        <select id="department" name="department" required>
          <option ?selected=${department === 'Analytics'} value="Analytics">Analytics</option>
          <option ?selected=${department === 'Tech'} value="Tech">Tech</option>
        </select>
      </label>

      <label for="position">
        Position
          <select id="position" name="position" required>
            <option ?selected=${position === "Junior"} value="Junior">Junior</option>
            <option ?selected=${position === "Medior"} value="Medior">Medior</option>
            <option ?selected=${position === "Senior"} value="Senior">Senior</option>
          </select>
        </label>

      <input type='submit' value='Save' />
      <button @click=${() => Router.go('/')} type='button'>Cancel</button>
      </form>
    `
  }
}