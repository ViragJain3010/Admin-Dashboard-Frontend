# Admin Dashboard

This directory contains the frontend for the Admin Dashboard application. It is built using Next.js, React, and Tailwind CSS.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, install the dependencies:

```sh
npm install
```

## Running the Development Server
To start the development server, run:
```sh
npm run dev
```

Open [http://localhost:3000] with your browser to see the result.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file.

## Project Structure

admin_dashboard/
  [.eslintrc.json](http://_vscodecontentref_/2)
  .gitignore
  .next/
  [components.json](http://_vscodecontentref_/3)
  [jsconfig.json](http://_vscodecontentref_/4)
  [next.config.mjs](http://_vscodecontentref_/5)
  [package.json](http://_vscodecontentref_/6)
  [postcss.config.mjs](http://_vscodecontentref_/7)
  public/
  [README.md](http://_vscodecontentref_/8)
  src/
    app/
      [globals.css](http://_vscodecontentref_/9)
      [layout.js](http://_vscodecontentref_/10)
      [page.js](http://_vscodecontentref_/11)
    components/
      ...
    hooks/
      ...
    lib/
      ...
    services/
      ...
  [tailwind.config.js](http://_vscodecontentref_/12)

src/app: Contains the main application files.
src/components: Contains the React components used in the application.
src/hooks: Contains custom hooks.
src/lib: Contains utility functions.
src/services: Contains API service files.