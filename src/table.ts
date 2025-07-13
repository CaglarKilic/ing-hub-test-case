import { LitElement, html, css } from 'lit'
import { customElement, state, query } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type RowData,
  TableController,
} from '@tanstack/lit-table'
import { employeeContext, type Person, type EmployeeContextValue } from './employee-context'
import { consume } from '@lit/context'
import { Router } from '@vaadin/router'

declare module '@tanstack/lit-table' {
  interface TableMeta<TData extends RowData> {
    handleDelete: (index: number) => void
    handleEdit: (index: number) => void
  }
}

const columns: ColumnDef<Person, any>[] = [
  {
    id: 'select',
    header: ({ table }) => html`
      <input
        type="checkbox"
        @change=${table.getToggleAllRowsSelectedHandler()}
        .checked=${table.getIsAllRowsSelected()}
        .indeterminate=${table.getIsSomeRowsSelected()}
      />
    `,
    cell: ({ row }) => html`
      <input
        type="checkbox"
        @change=${row.getToggleSelectedHandler()}
        .checked=${row.getIsSelected()}
        ?disabled=${!row.getCanSelect()}
        .indeterminate=${row.getIsSomeSelected()}
      />
    `,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    id: 'dateOfEmployment',
    accessorFn: row => row.dateOfEmployment.toLocaleDateString('en-GB'),
    header: 'Date of Employment',
  },
  {
    id: 'dateOfBirth',
    accessorFn: row => row.dateOfBirth.toLocaleDateString('en-GB'),
    header: 'Date of Birth',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'department',
    header: 'Department'
  },
  {
    accessorKey: 'position',
    header: 'Position'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => html`
      <button class="icon-btn" @click=${() => table.options.meta?.handleEdit(row.index)} title="Edit">
        <svg width="20" height="20" fill="none" stroke="#ff6600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
        </svg>
      </button>
      <button class="icon-btn" @click=${() => table.options.meta?.handleDelete(row.index)} title="Delete">
        <svg width="20" height="20" fill="none" stroke="#ff6600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    `
  }
]

@customElement('table-employee')
export class TableEmployee extends LitElement {
  static styles = css`
    * {
      font-family: sans-serif;
      font-size: 14px;
      box-sizing: border-box;
    }

    .search-container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      margin-top: 1rem;
      margin-left: 2rem;
    }

    input[type="search"] {
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      padding: 10px 20px;
      font-size: 15px;
      outline: none;
      width: 280px;
      background: #fafafa;
      color: #222;
      transition: border 0.2s;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.01);
    }

    input[type="search"]::placeholder {
      color: #bdbdbd;
      font-size: 15px;
      opacity: 1;
    }

    input[type="search"]:focus {
      border: 1.5px solid #ff6600;
      background: #fff;
    }

    table {
      margin: 1rem auto;
      border: none;
      border-radius: 12px;
      border-collapse: separate;
      border-spacing: 0;
      width: calc(100% - 64px);
      background: #fff;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
      text-align: center;
    }

    thead tr {
      background: #fff;
    }

    th {
      color: #ff6600;
      font-weight: bold;
      padding: 18px 8px;
      border-bottom: 2px solid #f2f2f2;
      text-align: center;
    }

    tbody tr {
      background: #fff;
      transition: background 0.2s;
    }

    tbody tr:nth-child(even) {
      background: #fafafa;
    }

    td {
      color: #222;
      padding: 16px 8px;
      border-bottom: 1px solid #f2f2f2;
      text-align: center;
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .page-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 24px 0 0 0;
    }

    .page-controls button {
      border: none;
      background: transparent;
      color: #ff6600;
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-controls button[disabled] {
      color: #ccc;
      cursor: default;
    }
    
    .page-controls button.active {
      color: #fff;
      font-weight: bold;
      font-size: 1rem;
      cursor: default;
      pointer-events: none;
    }

    .icon-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .icon-btn:hover {
      background: #fff3e6;
    }
    .icon-btn svg {
      display: block;
    }

    /* Dialog styles */
    dialog {
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18);
      padding: 0;
      min-width: 380px;
      max-width: 95vw;
      background: #fff;
      position: relative;
      font-family: inherit;
      animation: fadeIn 0.18s;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px);}
      to { opacity: 1; transform: none;}
    }
    .dialog-content {
      padding: 32px 28px 24px 28px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .dialog-title {
      color: #ff6600;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
      margin-top: 0;
    }
    .dialog-desc {
      color: #444;
      font-size: 1rem;
      margin-bottom: 18px;
    }
    .dialog-list {
      margin: 0 0 18px 0;
      padding-left: 18px;
      color: #222;
      font-size: 1rem;
    }
    .dialog-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }
    .proceed-btn {
      background: #ff6600;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.5rem;
      cursor: pointer;
      width: 100%;
      margin-bottom: 0;
    }
     .proceed-btn:hover {
      background: #e65c00;
    }
    .cancel-btn {
      background: #fff;
      color: #7c5cff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      line-height: 16px;
      font-weight: 600;
      padding: 0.5rem;
      cursor: pointer;
      width: 100%;
    }
    .cancel-btn:hover {
      border-color: #7c5cff;
      color: #5636d3;
    }
    .close-x {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #ff6600;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
  `

  private tableController = new TableController<Person>(this)

  @consume({ context: employeeContext, subscribe: true })
  private _employeeContext!: EmployeeContextValue

  @state()
  private _rowSelection: Record<string, boolean> = {}

  @query('dialog')
  private dialog!: HTMLDialogElement

  private handleDelete = (index: number) => {
    this._rowSelection = { ...this._rowSelection, [index]: true }
    this.dialog.showModal()
  }

  private handleEdit = (index: number) => {
    Router.go(`/edit?id=${index}`)
  }

  private deleteSelectedRows = () => {
    const selectedIndices = Object.keys(this._rowSelection).map(Number)
    this._employeeContext.deleteEmployees(selectedIndices)
    this._rowSelection = {}
    this.dialog.close()
  }

  protected render(): unknown {
    const table = this.tableController.table({
      data: this._employeeContext.employees,
      columns,
      globalFilterFn: 'includesString',
      state: {
        rowSelection: this._rowSelection,
      },
      meta: {
        handleDelete: this.handleDelete,
        handleEdit: this.handleEdit
      },
      enableRowSelection: true,
      onRowSelectionChange: updaterOrValue => {
        if (typeof updaterOrValue === 'function') {
          this._rowSelection = updaterOrValue(this._rowSelection)
        } else {
          this._rowSelection = updaterOrValue
        }
      },
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      debugTable: true,
    })

    return html`
      <div class="search-container">
        <input
          name="search"
          type="search"
          @input=${(e: InputEvent) => table.setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Search..."
        />
      </div>
      <table>
        <thead>
          ${repeat(
      table.getHeaderGroups(),
      headerGroup => headerGroup.id,
      headerGroup => html`
              <tr>
                ${repeat(
        headerGroup.headers,
        header => header.id,
        header => html`
                    <th> 
                      ${flexRender(
          header.column.columnDef.header,
          header.getContext()
        )}
                    </th>
                  `
      )}
              </tr>
            `
    )}
        </thead>
        <tbody>
          ${table
        .getRowModel()
        .rows.slice(0, 8)
        .map(
          row => html`
                <tr>
                  ${row
              .getVisibleCells()
              .map(
                cell => html`
                        <td>
                          ${flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
                        </td>
                      `
              )}
                </tr>
              `
        )}
        </tbody>
      </table>
      <div class="page-controls">
        <button
          @click=${() => table.setPageIndex(0)}
          ?disabled="${!table.getCanPreviousPage()}"
        >
          <<
        </button>
        <button
          @click=${() => table.previousPage()}
          ?disabled=${!table.getCanPreviousPage()}
        >
          <
        </button>
          <strong>
            ${table.getState().pagination.pageIndex + 1} /
            ${table.getPageCount()}
          </strong>
        <button
          @click=${() => table.nextPage()}
          ?disabled=${!table.getCanNextPage()}
        >
          >
        </button>
        <button
          @click=${() => table.setPageIndex(table.getPageCount() - 1)}
          ?disabled="${!table.getCanNextPage()}"
        >
          >>
        </button>
      </div>
      <dialog>
        <button class="close-x" @click=${() => this.dialog.close()} title="Close">&times;</button>
        <div class="dialog-content">
          <p class="dialog-title">Are you sure?</p>
          <p class="dialog-desc">
            Selected employee record(s) will be deleted
          </p>
          <ul class="dialog-list">
            ${table.getSelectedRowModel().rows.map(row => html`<li>${row.getValue('firstName')} ${row.getValue('lastName')}</li>`)}
          </ul>
          <div class="dialog-actions">
            <button class="proceed-btn" @click=${this.deleteSelectedRows}>Proceed</button>
            <button class="cancel-btn" @click=${() => this.dialog.close()}>Cancel</button>
          </div>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-employee': TableEmployee
  }
}
