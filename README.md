# Shopify App Template

## Overview

This repository serves as a boilerplate for developing Shopify apps, combining powerful backend and frontend
technologies to streamline your development process.

## Technologies:

- **Backend:** Laravel 10, Postgres 15, Redis
- **Frontend:** React with Inertia, Vite, Polaris, Shopify App Bridge

## Prerequisites:

- **Node.js:** Node.js version > 20
- **PHP:** PHP version > 8.2

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies:

    ```bash
    yarn install
    ```

    ```bash
    cd web && composer install
    ```

4. Copy the environment configuration file:

    ```bash
    cp .env.example .env
    ```

5. Update the environment variables in the `.env` file:

    - `SHOPIFY_APP_CLIENT_ID`: Your Shopify App's client ID.
    - `SHOPIFY_APP_CLIENT_SECRET`: Your Shopify App's client secret.
    - Database information required by Laravel app.

## Development

1. Start the backend server:

    ```bash
    yarn dev
    ```

2. Open another terminal tab and navigate to the `web` directory:

    ```bash
    cd web && yarn dev
    ```

3. Start the frontend development server to begin working on your Shopify app.

## Deployment

To deploy your Shopify app, follow these general steps:

1. **Build the frontend:** Ensure your frontend assets are built for production. This can typically be done by running:

    ```bash
    cd web && yarn build
    ```

2. **Configure your environment:** Update your `.env` file with production settings, including any necessary environment
   variables specific to your deployment environment.

3. **Database migration:** If you're using a database, run any necessary migrations:

    ```bash
    php artisan migrate
    ```

4. **Set up your hosting:** Depending on your preferred hosting platform, follow their deployment guidelines to deploy
   your Laravel backend and React frontend. Common options include Heroku, AWS, DigitalOcean, and Vercel.

5. **Configure your Shopify App settings:** Update your Shopify App settings to point to your deployed application's
   URL. Ensure that the correct OAuth callback URLs are configured.

6. **Test your deployment:** After deployment, thoroughly test your Shopify app to ensure that everything is working as
   expected in a production environment.

7. **Monitor and maintain:** Regularly monitor your deployed application for performance, security, and any potential
   issues. Maintain and update your app as needed to provide the best possible experience for your users.

