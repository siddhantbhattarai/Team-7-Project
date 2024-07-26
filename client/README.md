# ISMT Hub

ISMT Hub is a web application designed to improve communication between the college administration and students at ISMT. This project includes features such as event calendars, job vacancies, and Job application filteration with sharable links. It also supports role-based authentication.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

First, make sure you have [Yarn](https://yarnpkg.com/) installed. If not, you can install it via npm:

```bash
npm install -g yarn
```

Then, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/ismt-hub.git
cd ismt-hub
yarn install
```

## Scripts

Here are the scripts defined in `package.json`:

- `dev`: Runs the development server on port 8081.
- `start`: Starts the application in production mode.
- `build`: Builds the application for production.
- `lint`: Lints the code using ESLint.
- `lint:fix`: Lints the code and fixes any fixable issues.
- `prettier`: Formats the code using Prettier.
- `clear-all`: Removes the `node_modules`, `.next`, `out`, `dist`, and `build` directories.
- `re-start`: Clears all directories, reinstalls dependencies, and starts the development server.
- `re-build`: Clears all directories, reinstalls dependencies, and builds the application for production.

## Environment Variables

Create a `.env` file in the root directory of your project. You can use the `.env.example` file as a reference:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration.

## Running the Project

To run the project in development mode:

```bash
yarn dev
```

To build the project for production:

```bash
yarn build
```

To start the project in production mode:

```bash
yarn start
```

## Folder Structure

Here is an overview of the folder structure:

```
.
├── node_modules
├── public
│   └── assets
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── styles
│   └── utils
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── next.config.js
├── package.json
├── README.md
└── yarn.lock
```

- `public`: Contains static assets such as images, fonts, etc.
- `src/components`: Contains React components.
- `src/pages`: Contains Next.js pages.
- `src/services`: Contains services for API calls.
- `src/styles`: Contains global and component-specific styles.
- `src/utils`: Contains utility functions.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Commit your changes with a clear message.
5. Push your changes to your forked repository.
6. Create a pull request to the `main` branch of the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
