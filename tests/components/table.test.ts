import { fixture, html } from '@open-wc/testing'
import { TestProvider } from '../test-provider.js'
import { TableEmployee } from '../../src/table.js'

describe('Table', async () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Renders table view with 30 employees - 10 employees per page', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider> 
      `)

    expect(el).to.exist

    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    const firstPageRows = table.shadowRoot?.querySelectorAll('tbody tr')
    expect(firstPageRows).to.length(10)

    const pagination = table.shadowRoot?.querySelector('.page-controls strong')
    expect(pagination?.textContent).to.match(/1 \/ 3/)
  })

  it('Renders card view with 30 employees - 10 employees per page', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider> 
      `)

    expect(el).to.exist

    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    // @ts-expect-error - Accessing private property for testing
    table.viewMode = 'card'
    await table.updateComplete

    const cards = table.shadowRoot?.querySelectorAll('employee-card')
    expect(cards).to.length(10)

    const pagination = table.shadowRoot?.querySelector('.page-controls strong')
    expect(pagination?.textContent).to.match(/1 \/ 3/)
  })

  it('Filters employees when searching on table view', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider> 
      `)

    expect(el).to.exist

    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    const searchInput = table.shadowRoot?.querySelector('input') as HTMLInputElement
    expect(searchInput).to.exist

    searchInput.value = 'John'
    searchInput.dispatchEvent(new InputEvent('input'))
    await table.updateComplete

    const filteredRows = table.shadowRoot?.querySelectorAll('tbody tr')
    expect(filteredRows).to.length(1)
  })

  it('Filters employees when searching on card view', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider> 
      `)

    expect(el).to.exist

    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    // @ts-expect-error - Accessing private property for testing
    table.viewMode = 'card'
    await table.updateComplete

    const searchInput = table.shadowRoot?.querySelector('input') as HTMLInputElement
    expect(searchInput).to.exist

    searchInput.value = 'John'
    searchInput.dispatchEvent(new InputEvent('input'))
    await table.updateComplete

    const filteredRows = table.shadowRoot?.querySelectorAll('employee-card')
    expect(filteredRows).to.length(1)
  })

  it('calls handleDelete and opens the dialog', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider>
    `)
    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    // Find and mock showModal BEFORE calling handleDelete
    const dialog = table.shadowRoot?.querySelector('dialog') as HTMLDialogElement
    expect(dialog).to.exist
    dialog.showModal = function () { this.open = true }

    // @ts-expect-error - Accessing private method for test coverage
    table.handleDelete(0)
    await table.updateComplete

    // Dialog should be open
    expect(dialog.open).to.be.true
  })

  it('calls handleEdit and navigates', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider>
    `)
    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    // Mock Router.go
    const routerGo = vi.spyOn(require('@vaadin/router').Router, 'go')

    // @ts-expect-error - Accessing private method for test coverage
    table.handleEdit(0)
    expect(routerGo).toHaveBeenCalledWith('/edit?id=0')
  })

  it('calls deleteSelectedRows and clears selection', async () => {
    const el = await fixture<TestProvider>(html`
      <test-provider>
        <table-employee></table-employee>
      </test-provider>
    `)
    const table = el.querySelector('table-employee') as TableEmployee
    expect(table).to.exist

    // @ts-expect-error - Accessing private property for test coverage
    table._rowSelection = { 0: true, 1: true }

    const dialog = table.shadowRoot?.querySelector('dialog') as HTMLDialogElement
    expect(dialog).to.exist
    dialog.close = function () { this.open = false }

    // @ts-expect-error - Accessing private method for test coverage
    table.deleteSelectedRows()
    await table.updateComplete

    // @ts-expect-error - Accessing private property for test coverage
    expect(Object.keys(table._rowSelection)).to.have.length(0)
  })
})
