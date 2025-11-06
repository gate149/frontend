# Gate

![Next.js](https://img.shields.io/badge/Next.js-15.1.2-black?logo=next.js)
![Mantine](https://img.shields.io/badge/Mantine-7.17.0-blue?logo=mantine)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.66.7-green)
![KaTeX](https://img.shields.io/badge/KaTeX-0.16.21-blue)
![PrismJS](https://img.shields.io/badge/PrismJS-1.30.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![PostCSS](https://img.shields.io/badge/PostCSS-8.5.2-blue)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
[![OpenAPI v3](https://img.shields.io/badge/OpenAPI-v3-green)](https://swagger.io/specification/)

The Gate Frontend is the user interface for the Gate system, built with modern web technologies for a responsive and
interactive experience. This repository contains the frontend source code, leveraging Next.js for rendering, Mantine for
UI components, and TanStack Query for data fetching.

For understanding the architecture, see the [documentation](https://github.com/Vyacheslav1557/docs).

## Features

- **Dynamic Rendering**: Powered by Next.js for server-side and client-side rendering.
- **UI Components**: Utilizes Mantine for a consistent design system.
- **Data Management**: Integrates TanStack Query for efficient API interactions.
- **Math Rendering**: Supports mathematical expressions with KaTeX.
- **Syntax Highlighting**: Displays code with PrismJS.
- **Styling**: Employs PostCSS with Mantine presets for modern CSS processing.
- **Type Safety**: Built with TypeScript for robust development.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Version 8 or higher.

## Configuration

Create a `.env.local` file in the root directory with the following variables:

### Local Development (with Oathkeeper)

```dotenv
# Oathkeeper Gateway URL - used for API calls through the proxy
NEXT_PUBLIC_GATEWAY_URL=http://localhost:4455
```

### Production

```dotenv
# Replace with your production Oathkeeper/API gateway URL
NEXT_PUBLIC_GATEWAY_URL=https://api.yourdomain.com
```

**Note**: The API client automatically detects localhost and defaults to `http://localhost:4455` if `NEXT_PUBLIC_GATEWAY_URL` is not set.

## Installation

```bash
git clone https://github.com/your-org/gate.git
cd gate
```

Install dependencies:

```bash
npm install
```

Generate API clients (if needed):

```bash
npm run gen
```

### Scripts

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run production server:

```bash
npm run start
```

Run linter:

```bash
npm run lint
```

Generate API clients:

```bash
npm run gen
```

## Key Dependencies

- next: React framework for SSR and SSG.
- @mantine/core: UI component library for styling and layout.
- @tanstack/react-query: Data fetching and caching.
- katex: Math rendering library.
- prismjs: Lightweight syntax highlighter.
- typescript: Type-safe JavaScript.
- postcss: CSS processing with Mantine presets.
