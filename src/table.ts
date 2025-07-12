import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  TableController,
} from '@tanstack/lit-table'
import { makeData, type Person } from './makeData'

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
  }
]

const data = makeData(100)

@customElement('table-employee')
export class TableEmployee extends LitElement {

  private tableController = new TableController<Person>(this)

  @state()
  private _rowSelection: Record<string, boolean> = {}

  protected render(): unknown {
    const table = this.tableController.table({
      data,
      columns,
      globalFilterFn: 'includesString',
      state: {
        rowSelection: this._rowSelection,
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
      <input
        name="search"
        type="search"
        @input=${(e: InputEvent) => table.setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Search..."
      />
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
        .rows.slice(0, 10)
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
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
          border-collapse: collapse;
          width: 100%;
          text-align: center;
        }

        tbody {
          border-bottom: 1px solid lightgray;
        }

        th {
          padding: 8px;
        }

        tr {
          border: 1px solid lightgray;
        }

        td {
          padding: 8px;
        }

        .page-controls {
          display: flex;
          place-content: center;
          gap: 10px;
          padding: 4px 0;
          
          strong {
            display: flex;
            align-items: center;
          }
        }
      </style>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-employee': TableEmployee
  }
}
