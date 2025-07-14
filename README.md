# Overview

This project is built with a modern web technology stack including:

- **Lit**: A lightweight library for building web components
- **TypeScript**: For type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **TanStack Table**: Powerful table component for data display
- **Lit/Context**: For state management across components
- **Vaadin Router**: Client-side routing solution
- **Lit Localize**: For internationalization and localization support

For data persistence, the application uses **local storage** to store employee data, user's language preference, and view mode (card/table view). The **Faker.js** library is included as a regular dependency (not dev dependency) for demo purposes. When local storage is empty on first run, the application will automatically generate sample employee data and store it in local storage.

## Installation

### Using pnpm (recommended)
```bash
pnpm i
```

### Using npm
If pnpm is not installed on your system, remove the `pnpm-lock.yaml` file and use npm instead:

```bash
rm pnpm-lock.yaml
npm install
```

**Note**: Localization folders are prebuilt and included in the repository. If you need to add new translations, you can use:
```bash
pnpm localize:extract  # Extract translatable strings
# Add your translations to the xliff files
pnpm localize:build    # Build the localization files
```

Or with npm:
```bash
npm run localize:extract  # Extract translatable strings
# Add your translations to the xliff files
npm run localize:build    # Build the localization files
```

## Running

### Development
#### Using pnpm
```bash
pnpm dev
```

#### Using npm
```bash
npm run dev
```

Then open your browser and go to [http://localhost:5173](http://localhost:5173)

### Production Build
#### Using pnpm
```bash
pnpm build
pnpm preview
```

#### Using npm
```bash
npm run build
npm run preview
```
