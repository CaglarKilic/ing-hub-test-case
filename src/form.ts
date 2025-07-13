import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { localized, msg } from '@lit/localize';
import { employeeContext, type Person, type EmployeeContextValue } from "./employee-context";
import { consume } from "@lit/context";
import { Router } from "@vaadin/router";

@customElement('create-modify-form')
@localized()
export class Form extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
      margin: 2rem; 
    }

    p {
      font-weight: 500;
      margin-bottom: 2rem;
      color: #222;
    }

    form {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem 2rem;
      align-items: end;
      flex-wrap: wrap;
    }

    label {
      display: flex;
      flex-direction: column;
      font-size: 1rem;
      color: #444;
      gap: 0.5rem;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="date"],
    select {
      padding: 0.7rem 1rem;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      background: #fafbfc;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: border 0.2s;
      outline: none;
    }
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    input[type="date"]:focus,
    select:focus {
      border-color: #ff6600;
      background: #fff;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(0.5) sepia(1) saturate(5) hue-rotate(10deg);
      cursor: pointer;
    }

    /* Button styles */
    input[type="submit"] {
      grid-column: 1 / 2;
      margin-top: 2rem;
      padding: 0.9rem 0;
      background: #ff6600;
      color: #fff;
      font-weight: 600;
      font-size: 1.1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      width: 100%;
    }
    input[type="submit"]:hover {
      background: #e65c00;
    }

    button[type="button"] {
      grid-column: 2 / 3;
      margin-top: 2rem;
      padding: 0.9rem 0;
      background: #fff;
      color: #5a4ca7;
      font-weight: 500;
      font-size: 1.1rem;
      border: 2px solid #bdb7e5;
      border-radius: 8px;
      cursor: pointer;
      transition: border 0.2s, color 0.2s;
      width: 100%;
    }
    button[type="button"]:hover {
      border-color: #5a4ca7;
      color: #3d347a;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }
    input[type="submit"], button[type="button"] {
      margin-top: 0;
      width: 220px;
      max-width: 100%;
      grid-column: unset;
    }
    /* Responsive styles */
    @media (max-width: 900px) {
      form {
        grid-template-columns: 1fr 1fr;
      }
      .form-actions {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      input[type="submit"], button[type="button"] {
        width: 100%;
        max-width: 350px;
      }
    }
    @media (max-width: 600px) {
      :host {
        padding: 0.5rem;
      }
      form {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .form-actions {
        gap: 0.5rem;
      }
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
    ${firstName && html`<p>${msg('You are editing')} ${firstName} ${lastName}</p>`}
    <form @submit=${this.handleSubmit}>
      <label for="firstName">
        ${msg('First Name')}
        <input type="text" id="firstName" name="firstName" title="Only characters and no spaces" pattern="[a-zA-Z]+" value=${firstName} required />
      </label>

      <label for="lastName">
        ${msg('Last Name')}
        <input type="text" id="lastName" name="lastName" value=${lastName} title="Only characters and no spaces" pattern="[a-zA-Z]+" required />
      </label>

      <label for="dateOfEmployment">
        ${msg('Date of Employment')}
        <input type="date" id="dateOfEmployment" name="dateOfEmployment" value=${dateOfEmployment?.toISOString().split('T')[0]} required />
      </label>

      <label for="dateOfBirth">
        ${msg('Date of Birth')}
        <input type="date" id="dateOfBirth" name="dateOfBirth" value=${dateOfBirth?.toISOString().split('T')[0]} required />
      </label>

      <label for="phoneNumber">
        ${msg('Phone Number')}
        <input type="tel" id="phoneNumber" name="phoneNumber" title="International format required +XXXXXXXX" pattern="\\+[0-9]+" value=${phoneNumber} pattern="" required />
      </label>

      <label for="email">
        ${msg('Email')}
        <input type="email" id="email" name="email" value=${email} required />
      </label>

      <label for="department">
        ${msg('Department')}
        <select id="department" name="department" required>
          <option ?selected=${department === 'Analytics'} value="Analytics">${msg('Analytics')}</option>
          <option ?selected=${department === 'Tech'} value="Tech">${msg('Tech')}</option>
        </select>
      </label>

      <label for="position">
        ${msg('Position')}
          <select id="position" name="position" required>
            <option ?selected=${position === "Junior"} value="Junior">${msg('Junior')}</option>
            <option ?selected=${position === "Medior"} value="Medior">${msg('Medior')}</option>
            <option ?selected=${position === "Senior"} value="Senior">${msg('Senior')}</option>
          </select>
        </label>

      <div class="form-actions">
        <input type='submit' value=${msg('Save')} />
        <button @click=${() => Router.go('/')} type='button'>${msg('Cancel')}</button>
      </div>
      </form>
    `
  }
}