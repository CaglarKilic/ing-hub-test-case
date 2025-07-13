// src/employee-card.ts
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { localized, msg } from '@lit/localize'
import type { Person } from './employee-context'

@customElement('employee-card')
@localized()
export class EmployeeCard extends LitElement {
  static styles = css`
  :host {
    display: flex;
  }
   p {
    margin: 0;
   } 
   .card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
    display: flex;
    flex-wrap: wrap;
    row-gap: 2rem;
    column-gap: 1rem;
    max-width: 560px;
    padding: 2rem;
   }
   .field {
    width: calc(50% - 0.5rem);
   }
   .label {
    color: #9e9e9e;
    font-weight: 400;
    font-size: 12px;
   }
   .value {
    color: #222;
    font-weight: 500;
    font-size: 1rem;
   }
   .actions {
    display: flex;
    gap: 1rem;
    width: 100%;
   }
   .edit-btn, .delete-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    border-radius: 8px;
    padding: 0.7rem;
    font-weight: 600;
    cursor: pointer;
   }
   .edit-btn {
    background: #4B3DFE;
    color: #fff;
   }
   .edit-btn p {
    margin: 0;
   }
   .delete-btn {
    background: #FF6A00;
    color: #fff;
   }
   .delete-btn p {
    margin: 0;
   }
  `

  @property({ type: Object }) employee!: Person
  @property({ type: Number }) index!: number

  render() {
    const e = this.employee
    return html`
      <div class="card">
          <div class="field">
            <p class="label">${msg('First Name:')}</p>
            <p class="value">${e.firstName}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Last Name:')}</p>
            <p class="value">${e.lastName}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Date of Employment')}</p>
            <p class="value">${e.dateOfEmployment.toLocaleDateString('en-GB')}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Date of Birth')}</p>
            <p class="value">${e.dateOfBirth.toLocaleDateString('en-GB')}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Phone')}</p>
            <p class="value">${e.phoneNumber}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Email')}</p>
            <p class="value">${e.email}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Department')}</p>
            <p class="value">${e.department}</p>
          </div>
          <div class="field">
            <p class="label">${msg('Position')}</p>
            <p class="value">${e.position}</p>
          </div>
        <div class="actions">
          <button class="edit-btn" @click=${() => this.dispatchEvent(new CustomEvent('edit', { detail: this.index, bubbles: true, composed: true }))}>
            <span>
              <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
              </svg>
            </span>
            ${msg('Edit')}
          </button>
          <button class="delete-btn" @click=${() => this.dispatchEvent(new CustomEvent('delete', { detail: this.index, bubbles: true, composed: true }))}>
            <span>
              <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </span>
            ${msg('Delete')}
          </button>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'employee-card': EmployeeCard
  }
}
