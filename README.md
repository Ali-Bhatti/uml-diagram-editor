# UML Diagram Editor

A modern, browser-based UML diagram editor built with Vue 3, Pinia, and Vue Flow.

## Features
- Drag-and-drop UML node palette (Use Case, Activity, etc.)
- Custom node types: Actor, Use Case, Start, End, Action, Decision
- Diagram persistence in browser localStorage
- Edit and delete diagrams and nodes
- Modal dialogs for creating and editing diagrams/nodes
- Responsive, clean UI

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Install dependencies
```bash
npm install
# or
yarn install
```

### Start the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `src/components/` – Vue components (Palette, DiagramCanvas, Header, modals, nodes)
- `src/stores/diagramStore.js` – Pinia store for state management
- `src/App.vue` – Main application shell

## Persistence
All diagrams and node data are stored in browser localStorage. No backend required.

