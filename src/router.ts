import { Router } from "@vaadin/router";

export function initRouter(outlet: HTMLElement) {
  const router = new Router(outlet);
  router.setRoutes([
    {
      path: '/',
      component: 'app-root',
      action: async () => {
        await import('./app');
      },
      children: [
        {
          path: '',
          component: 'table-employee',
          action: async () => {
            await import('./table')
          }
        },
        {
          path: 'edit',
          component: 'create-modify-form',
          action: async () => {
            await import('./form')
          }
        },
        {
          path: 'create',
          component: 'create-modify-form',
          action: async () => {
            await import('./form')
          }
        }
      ]
    },
  ]);
}