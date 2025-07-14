import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { localized, msg } from '@lit/localize'
import { makeData, STORAGE_KEY } from './makeData'
import { provide } from '@lit/context'
import { employeeContext, type Person, type EmployeeContextValue } from './employee-context'
import { Router } from '@vaadin/router'
import { setLocale } from './localization-service.js'

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
    .language-select {
      border: none;
      background: none;
      font-size: 1.25rem;
      cursor: pointer;
      outline: none;
    }
    .language-select:focus {
      outline: none;
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

  @state()
  private _currentLocale = localStorage.getItem('preferredLocale') || 'en';

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

  private async switchLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    const locale = select.value;

    try {
      await setLocale(locale);
      localStorage.setItem('preferredLocale', locale);
      this._currentLocale = locale;
      console.log('Language switched to:', locale);
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
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
          <select 
            class="language-select"
            .value=${this._currentLocale}
            @change=${this.switchLanguage}
          >
            <option value="en">🇺🇸</option>
            <option value="tr">🇹🇷</option>
          </select>
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
