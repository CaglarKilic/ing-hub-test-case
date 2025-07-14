import { fixture, html } from '@open-wc/testing'
import { Form } from '../../src/form.js'
import { TestProvider } from '../test-provider.js'

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}))

describe('Form', async () => {
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

  it('renders form in create mode with all required fields', async () => {
    mockLocation('/create')

    const el = await fixture<Form>(html`
      <create-modify-form></create-modify-form>
    `)

    expect(el).to.exist

    const form = el.shadowRoot?.querySelector('form')
    expect(form).to.exist

    expect(el.shadowRoot?.querySelector('#firstName')).to.exist
    expect(el.shadowRoot?.querySelector('#lastName')).to.exist
    expect(el.shadowRoot?.querySelector('#dateOfEmployment')).to.exist
    expect(el.shadowRoot?.querySelector('#dateOfBirth')).to.exist
    expect(el.shadowRoot?.querySelector('#phoneNumber')).to.exist
    expect(el.shadowRoot?.querySelector('#email')).to.exist
    expect(el.shadowRoot?.querySelector('#department')).to.exist
    expect(el.shadowRoot?.querySelector('#position')).to.exist

    const editMessage = el.shadowRoot?.querySelector('p')
    expect(editMessage).to.not.exist

    expect(el.shadowRoot?.querySelector('input[type="submit"]')).to.exist
    expect(el.shadowRoot?.querySelector('button[type="button"]')).to.exist
  })

  it('renders form in edit mode with pre-filled data', async () => {
    mockLocation('/edit', '?id=0')

    const el = await fixture<TestProvider>(html`
      <test-provider>
        <create-modify-form></create-modify-form>
      </test-provider>
    `)

    const form = el.querySelector('create-modify-form') as Form
    expect(form).to.exist

    const formElement = form.shadowRoot?.querySelector('form')
    expect(formElement).to.exist

    expect(form.shadowRoot?.querySelector('#firstName')).to.exist
    expect(form.shadowRoot?.querySelector('#lastName')).to.exist
    expect(form.shadowRoot?.querySelector('#dateOfEmployment')).to.exist
    expect(form.shadowRoot?.querySelector('#dateOfBirth')).to.exist
    expect(form.shadowRoot?.querySelector('#phoneNumber')).to.exist
    expect(form.shadowRoot?.querySelector('#email')).to.exist
    expect(form.shadowRoot?.querySelector('#department')).to.exist
    expect(form.shadowRoot?.querySelector('#position')).to.exist

    const editMessage = form.shadowRoot?.querySelector('p')
    expect(editMessage).to.exist
    expect(editMessage?.textContent).to.contain('You are editing')

    const firstNameInput = form.shadowRoot?.querySelector('#firstName') as HTMLInputElement
    const lastNameInput = form.shadowRoot?.querySelector('#lastName') as HTMLInputElement
    const dateOfEmploymentInput = form.shadowRoot?.querySelector('#dateOfEmployment') as HTMLInputElement
    const dateOfBirthInput = form.shadowRoot?.querySelector('#dateOfBirth') as HTMLInputElement
    const phoneInput = form.shadowRoot?.querySelector('#phoneNumber') as HTMLInputElement
    const emailInput = form.shadowRoot?.querySelector('#email') as HTMLInputElement
    const departmentSelect = form.shadowRoot?.querySelector('#department') as HTMLSelectElement
    const positionSelect = form.shadowRoot?.querySelector('#position') as HTMLSelectElement

    expect(firstNameInput?.value).to.equal('John')
    expect(lastNameInput?.value).to.equal('Doe')
    expect(dateOfEmploymentInput?.value).to.equal('2023-01-15')
    expect(dateOfBirthInput?.value).to.equal('1990-05-20')
    expect(phoneInput?.value).to.equal('+1-555-0123')
    expect(emailInput?.value).to.equal('john.doe@example.com')
    expect(departmentSelect?.value).to.equal('Tech')
    expect(positionSelect?.value).to.equal('Senior')

    expect(form.shadowRoot?.querySelector('input[type="submit"]')).to.exist
    expect(form.shadowRoot?.querySelector('button[type="button"]')).to.exist
  })

  it('handles form submission in create mode', async () => {
    mockLocation('/create')

    const el = await fixture<TestProvider>(html`
      <test-provider>
        <create-modify-form></create-modify-form>
      </test-provider>
      `)

    const addEmployeeSpy = vi.spyOn(el._employeeContext, 'addEmployee')
    const routerGoSpy = vi.mocked(Router.go)

    const form = el.querySelector('create-modify-form') as Form
    const formElement = form.shadowRoot?.querySelector('form') as HTMLFormElement

    const firstNameInput = form.shadowRoot?.querySelector('#firstName') as HTMLInputElement
    const lastNameInput = form.shadowRoot?.querySelector('#lastName') as HTMLInputElement
    const dateOfEmploymentInput = form.shadowRoot?.querySelector('#dateOfEmployment') as HTMLInputElement
    const dateOfBirthInput = form.shadowRoot?.querySelector('#dateOfBirth') as HTMLInputElement
    const phoneInput = form.shadowRoot?.querySelector('#phoneNumber') as HTMLInputElement
    const emailInput = form.shadowRoot?.querySelector('#email') as HTMLInputElement
    const departmentSelect = form.shadowRoot?.querySelector('#department') as HTMLSelectElement
    const positionSelect = form.shadowRoot?.querySelector('#position') as HTMLSelectElement

    firstNameInput.value = 'Jane'
    lastNameInput.value = 'Smith'
    dateOfEmploymentInput.value = '2024-01-01'
    dateOfBirthInput.value = '1995-06-15'
    phoneInput.value = '+1-555-9999'
    emailInput.value = 'jane.smith@example.com'
    departmentSelect.value = 'Analytics'
    positionSelect.value = 'Medior'

    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    formElement.dispatchEvent(submitEvent)

    expect(addEmployeeSpy).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfEmployment: new Date('2024-01-01'),
      dateOfBirth: new Date('1995-06-15'),
      phoneNumber: '+1-555-9999',
      email: 'jane.smith@example.com',
      department: 'Analytics',
      position: 'Medior'
    })

    expect(routerGoSpy).toHaveBeenCalledWith('/')
  })

  it('handles form submission in edit mode', async () => {
    mockLocation('/edit', '?id=0')

    const el = await fixture<TestProvider>(html`
      <test-provider>
        <create-modify-form></create-modify-form>
      </test-provider>
      `)

    const updateEmployeeSpy = vi.spyOn(el._employeeContext, 'updateEmployee')
    const routerGoSpy = vi.mocked(Router.go)

    const form = el.querySelector('create-modify-form') as Form
    const formElement = form.shadowRoot?.querySelector('form') as HTMLFormElement

    //Edited fields
    const phoneInput = form.shadowRoot?.querySelector('#phoneNumber') as HTMLInputElement
    const emailInput = form.shadowRoot?.querySelector('#email') as HTMLInputElement
    const departmentSelect = form.shadowRoot?.querySelector('#department') as HTMLSelectElement
    const positionSelect = form.shadowRoot?.querySelector('#position') as HTMLSelectElement

    phoneInput.value = '+905438430358'
    emailInput.value = 'kilicalicaglar@gmail.com'
    departmentSelect.value = 'Tech'
    positionSelect.value = 'Medior'

    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    formElement.dispatchEvent(submitEvent)

    expect(updateEmployeeSpy).toHaveBeenCalledWith(0, {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: new Date('2023-01-15'),
      dateOfBirth: new Date('1990-05-20'),
      phoneNumber: '+905438430358',
      email: 'kilicalicaglar@gmail.com',
      department: 'Tech',
      position: 'Medior'
    })

    expect(routerGoSpy).toHaveBeenCalledWith('/')
  })
})
