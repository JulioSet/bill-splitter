# Split It Right

A modern, responsive web app to effortlessly split bills and track expenses with friends. Stop the mental math and settle up faster!

## Features

- **Dynamic Group Expenses**: Add items, assign costs to specific people, or split evenly.
- **Visual Spending Overview**: See who owes whom with an interactive summary graph.
- **Responsive Design**: Built with Vue 3 and Tailwind CSS for a seamless experience on desktop or mobile.
- **Easy Navigation**: Simple, intuitive interface to manage your group's expenses.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bill-splitter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (the port may vary).

### Build for Production

To create a production build:

```bash
npm run build
```

### Lint

To check the code style:

```bash
npm run lint
```

---

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
