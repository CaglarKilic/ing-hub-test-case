import { initRouter } from './router.js';
import './localization-service.js';

const outlet = document.getElementById('outlet')!;
initRouter(outlet);