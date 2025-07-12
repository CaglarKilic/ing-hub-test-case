import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'


@customElement('app-root')
export class App extends LitElement {

  render() {
    return html`
      <header>ING</header>
      <main>
        <slot></slot>
      </main>
    `
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': App
  }
}
