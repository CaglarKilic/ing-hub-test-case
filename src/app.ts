import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { localized, msg } from '@lit/localize'
import { makeData } from './makeData'
import { provide } from '@lit/context'
import { employeeContext, type Person, type EmployeeContextValue } from './employee-context'
import { STORAGE_KEY } from './makeData'
import { Router } from '@vaadin/router'

@customElement('app-root')
@localized()
export class App extends LitElement {
  static styles = css`
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 4rem;
    }
    .header-left {
      font-weight: bold;
      font-size: 1.25rem;
      color: #ff6200;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header-btn {
      background: none;
      border: none;
      font: inherit;
      font-weight: 500;
      font-size: 1rem;
      color: #ff6200;
      cursor: pointer;
    }
    h1 {
      margin-left: 2rem;
      margin-top: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #ff6200; 
    }
  `

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

  @state()
  private _currentRoute = ''

  connectedCallback() {
    super.connectedCallback()
    this._updateRoute()
    window.addEventListener('vaadin-router-location-changed', this._updateRoute.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('vaadin-router-location-changed', this._updateRoute.bind(this))
  }

  private _updateRoute() {
    const path = window.location.pathname
    this._currentRoute = path
  }

  private _getPageTitle(): string {
    switch (this._currentRoute) {
      case '/edit':
        return msg('Edit Employee')
      case '/create':
        return msg('Add Employee')
      default:
        return ''
    }
  }

  private getCurrentPath() {
    return window.location.pathname
  }

  private goToEmployees() {
    if (this.getCurrentPath() !== '/') Router.go('/')
  }

  private goToCreate() {
    if (this.getCurrentPath() !== '/create') Router.go('/create')
  }

  render() {
    return html`
      <header>
        <div class="header-left">ING</div>
        <div class="header-right">
          <button
            class="header-btn"
            @click=${this.goToEmployees}
          >
            ${msg('Employees')}
          </button>
          <button
            class="header-btn"
            @click=${this.goToCreate}
          >
            ${msg('+ Add New')}
          </button>
        </div>
      </header>
      <main>
        <h1>${this._getPageTitle()}</h1>
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
