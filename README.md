
# Admin Dashboard

This directory contains the frontend for the Admin Dashboard application. It is built using Next.js, React, and Tailwind CSS.

The backend for this project is avaiable [here](https://github.com/ViragJain3010/Admin-Dashboard) 

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)

## Getting Started

First, install the dependencies:

```sh
npm install
```

## Configuration

Create a `.env.local` file in the root directory to configure the API base URL and other environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Replace the URL with the backend server's URL when deploying to production.

## Running the Development Server

To start the development server, run:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file.

## Building for Production

To build the application for production, run:

```sh
npm run build
```

This will create an optimized production build in the `.next` folder.

## Project Structure

```
admin_dashboard/
├── .eslintrc.json
├── .gitignore
├── .next/
├── components/
├── hooks/
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── public/
├── README.md
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── services/
├── tailwind.config.js
```

- `src/app`: Contains the main application files, including layout and page definitions.
- `src/components`: Contains reusable React components.
- `src/hooks`: Contains custom React hooks.
- `src/lib`: Contains utility functions.
- `src/services`: Contains API service files.

