import { fixture, expect, html } from '@open-wc/testing'
import { EmployeeCard } from '../../src/card.js'
import type { Person } from '../../src/employee-context.js'

describe('EmployeeCard', () => {
  const mockPerson: Person = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: new Date('2023-01-15'),
    dateOfBirth: new Date('1990-05-20'),
    phoneNumber: '+1-555-0123',
    email: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior'
  }

  it('renders with employee data', async () => {
    const el = await fixture<EmployeeCard>(html`
      <employee-card .employee=${mockPerson} .index=${0}></employee-card>
    `)

    expect(el).to.exist
    expect(el.employee).to.equal(mockPerson)
    expect(el.index).to.equal(0)
  })
})
