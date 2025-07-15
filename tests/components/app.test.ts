import { fixture, html } from '@open-wc/testing'
import { App } from '../../src/app'
import { STORAGE_KEY } from '../../src/makeData'

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}))

describe('App', async () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const mockLocation = (pathname: string = '/create', search: string = '') => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname,
        search,
        href: `http://localhost${pathname}${search}`
      },
      writable: true
    })
  }

  const { Router } = await import('@vaadin/router')

  it('renders the header and main structure', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)
    expect(el).to.exist

    const shadow = el.shadowRoot
    expect(shadow?.querySelector('header')).to.exist
    expect(shadow?.querySelector('main')).to.exist
    expect(shadow?.querySelector('.header-left')?.textContent).to.include('ING')
    expect(shadow?.querySelector('.header-right')).to.exist
    expect(shadow?.querySelector('select.language-select')).to.exist
  })

  it('persists employees to localStorage using persistToStorage', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)
    const testEmployees = [
      { firstName: 'A', lastName: 'B', dateOfEmployment: new Date(), dateOfBirth: new Date(), phoneNumber: '', email: '', department: '', position: '' }
    ]

    // @ts-ignore: Accessing private method for test
    el.persistToStorage(testEmployees)

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).to.exist

    const parsed = JSON.parse(stored!, (key, value) => {
      if (key === 'dateOfEmployment' || key === 'dateOfBirth') {
        return new Date(value)
      }
      return value
    })

    expect(parsed).to.deep.equal(testEmployees)
  })

  it('adds employee to context and persists to storage', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)
    const newEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: new Date('2023-01-15'),
      dateOfBirth: new Date('1990-05-20'),
      phoneNumber: '+1-555-0123',
      email: 'john.doe@example.com',
      department: 'Tech',
      position: 'Senior'
    }

    // @ts-ignore: Accessing private property for test
    const initialCount = el._employeeContext.employees.length

    // @ts-ignore: Accessing private property for test
    el._employeeContext.addEmployee(newEmployee)
    await el.updateComplete

    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees.length).to.equal(initialCount + 1)
    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees[0]).to.deep.equal(newEmployee)

    // Check localStorage was updated
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).to.exist
    const parsed = JSON.parse(stored!, (key, value) => {
      if (key === 'dateOfEmployment' || key === 'dateOfBirth') {
        return new Date(value)
      }
      return value
    })
    expect(parsed[0]).to.deep.equal(newEmployee)
  })

  it('updates employee at specific index and persists to storage', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)

    // @ts-ignore: Accessing private property for test
    const initialEmployees = el._employeeContext.employees
    const updateIndex = 0
    const updatedEmployee = {
      firstName: 'Updated',
      lastName: 'Employee',
      dateOfEmployment: new Date('2023-06-15'),
      dateOfBirth: new Date('1985-10-10'),
      phoneNumber: '+1-555-9999',
      email: 'updated@example.com',
      department: 'HR',
      position: 'Manager'
    }

    // @ts-ignore: Accessing private property for test
    el._employeeContext.updateEmployee(updateIndex, updatedEmployee)
    await el.updateComplete

    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees[updateIndex]).to.deep.equal(updatedEmployee)
    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees.length).to.equal(initialEmployees.length)

    // Check localStorage was updated
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).to.exist
    const parsed = JSON.parse(stored!, (key, value) => {
      if (key === 'dateOfEmployment' || key === 'dateOfBirth') {
        return new Date(value)
      }
      return value
    })
    expect(parsed[updateIndex]).to.deep.equal(updatedEmployee)
  })

  it('deletes employee at specific index and persists to storage', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)

    // @ts-ignore: Accessing private property for test
    const initialEmployees = el._employeeContext.employees
    const deleteIndex = 1
    const employeeToDelete = initialEmployees[deleteIndex]

    // @ts-ignore: Accessing private property for test
    el._employeeContext.deleteEmployee(deleteIndex)
    await el.updateComplete

    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees.length).to.equal(initialEmployees.length - 1)
    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees[deleteIndex]).to.not.deep.equal(employeeToDelete)

    // Check localStorage was updated
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).to.exist
    const parsed = JSON.parse(stored!, (key, value) => {
      if (key === 'dateOfEmployment' || key === 'dateOfBirth') {
        return new Date(value)
      }
      return value
    })
    expect(parsed.length).to.equal(initialEmployees.length - 1)
    expect(parsed[deleteIndex]).to.not.deep.equal(employeeToDelete)
  })

  it('deletes multiple employees at specified indices and persists to storage', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)

    // @ts-ignore: Accessing private property for test
    const initialEmployees = el._employeeContext.employees
    const deleteIndices = [0, 2, 4] // Delete employees at indices 0, 2, and 4
    const employeesToDelete = deleteIndices.map(index => initialEmployees[index])

    // @ts-ignore: Accessing private property for test
    el._employeeContext.deleteEmployees(deleteIndices)
    await el.updateComplete

    // @ts-ignore: Accessing private property for test
    expect(el._employeeContext.employees.length).to.equal(initialEmployees.length - deleteIndices.length)

    // Verify deleted employees are no longer in the array
    employeesToDelete.forEach(deletedEmployee => {
      // @ts-ignore: Accessing private property for test
      expect(el._employeeContext.employees).to.not.include(deletedEmployee)
    })

    // Check localStorage was updated
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).to.exist
    const parsed = JSON.parse(stored!, (key, value) => {
      if (key === 'dateOfEmployment' || key === 'dateOfBirth') {
        return new Date(value)
      }
      return value
    })
    expect(parsed.length).to.equal(initialEmployees.length - deleteIndices.length)

    // Verify deleted employees are not in localStorage
    employeesToDelete.forEach(deletedEmployee => {
      expect(parsed).to.not.include(deletedEmployee)
    })
  })

  it('Navigates to create page', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)
    const addNewButton = el.shadowRoot?.querySelector('.header-right > button:nth-child(2)') as HTMLButtonElement
    expect(addNewButton).to.exist

    const routerGoSpy = vi.mocked(Router.go)

    addNewButton?.dispatchEvent(new Event('click'))
    expect(routerGoSpy).toHaveBeenCalledWith('/create')
  })

  it('Navigates to home page from another location', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)
    mockLocation('/edit?id=0')

    const employeesButton = el.shadowRoot?.querySelector('.header-right > button:nth-child(1)') as HTMLButtonElement
    expect(employeesButton).to.exist

    const routerGoSpy = vi.mocked(Router.go)

    employeesButton?.dispatchEvent(new Event('click'))
    expect(routerGoSpy).toHaveBeenCalledWith('/')

  })

  it('Should render the correct text by path', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)

    // @ts-ignore: Accessing private property for test
    el._currentRoute = '/edit'
    await el.updateComplete

    const pageHeaderText = el.shadowRoot?.querySelector('h1')
    expect(pageHeaderText).to.exist
    expect(pageHeaderText?.textContent).to.eq('Edit Employee')

    // @ts-ignore: Accessing private property for test
    el._currentRoute = '/create'
    await el.updateComplete

    expect(pageHeaderText?.textContent).to.eq('Add Employee')

    // @ts-ignore: Accessing private property for test
    el._currentRoute = '/'
    await el.updateComplete

    expect(pageHeaderText?.textContent).to.eq("")
  })

  it('should switch language and updates state and localStorage and changes texts', async () => {
    const el = await fixture<App>(html`<app-root></app-root>`)

    // @ts-ignore: Accessing private property for test
    expect(el._currentLocale).to.equal('en')
    expect(localStorage.getItem('preferredLocale')).to.be.null

    // Create a simple mock event
    const mockEvent = {
      target: { value: 'tr' }
    } as Event & { target: HTMLSelectElement }

    // @ts-ignore: Accessing private method for test
    await el.switchLanguage(mockEvent)
    await el.updateComplete

    // @ts-ignore: Accessing private property for test
    expect(el._currentLocale).to.equal('tr')

    // Check that localStorage contains the Turkish preference
    expect(localStorage.getItem('preferredLocale')).to.equal('tr')

    const headerEmployeeButton = el.shadowRoot?.querySelector('button.header-btn:nth-child(1)') as HTMLButtonElement
    expect(headerEmployeeButton.textContent?.trim()).to.eq('Çalışanlar')
  })
})
