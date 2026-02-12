# Admin Dashboard

This project is a scalable React Admin Dashboard built with Vite and Tailwind CSS.

## Folder Structure

```
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable UI components
│   ├── common/         # Generic components (Buttons, Inputs, Modals)
│   └── layout/         # Layout components (Sidebar, Header, MainLayout)
├── context/            # Global state management (Context API)
├── hooks/              # Custom React hooks
├── pages/              # Page components (views)
├── routes/             # Route definitions and configuration
├── services/           # API service calls
├── utils/              # Helper functions and utilities
├── App.jsx             # Main application component & Router setup
└── main.jsx            # Entry point
```

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Features

- **Scalable Architecture:** Organized folder structure for maintainability.
- **Routing:** Configured with `react-router-dom`.
- **Styling:** Styled with Tailwind CSS (v4).
- **Icons:** Uses `lucide-react` for modern icons.
