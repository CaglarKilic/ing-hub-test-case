import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'


@customElement('table-employee')
export class App extends LitElement {

  render() {
    return html`
    <h1>Table</h1>
    `
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'table-employee': App
  }
}
