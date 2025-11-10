# ControlSage

ControlSage is a modern, AI-enhanced platform for managing IT and Information Security controls. It provides a centralized system for tracking assets, managing security controls, monitoring compliance, and auditing system activities. Built with a modern tech stack, it's designed to be both powerful and easy to use.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit)
- **Containerization:** [Docker](https://www.docker.com/)

## Screenshots

![ControlSage Dashboard](https://storage.googleapis.com/gemini-studio-assets/project-emblem-images/control-sage-dashboard.png)

## Features

- **Centralized Dashboard:** Get an at-a-glance overview of your security posture, including asset counts, compliance status, and risk distribution.
- **Asset Management:** A comprehensive inventory of your organization's IT assets. Define relationships between assets to map your system architecture.
- **Control Library:** Browse, create, and manage a library of security controls, mapped to popular frameworks like ISO 27001, NIST, and CIS.
- **Role-Based Access Control:** Differentiates between Admins and other user roles to secure administrative actions.
- **Audit Logging:** A chronological log of all significant activities within the system.
- **AI-Powered Suggestions:** Leverage Genkit to receive intelligent recommendations for security controls based on an asset's profile.

## Getting Started

You can run this project locally using Node.js and npm, or with Docker.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Docker](https://www.docker.com/products/docker-desktop/) (for containerized setup)

---

### Installation & Setup (Local)

1.  **Clone the repository**
    ```sh
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Firebase Configuration**
    The project is configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`. Ensure these values are correct for your Firebase project. For local development, Firebase App Hosting's automatic initialization will not be available, so this file is critical.

4.  **Seed the Database (Optional)**
    To populate your Firestore database with initial sample data (assets, controls, etc.), run the following command while your development server is running. You can do this by navigating to the API route in your browser or using a tool like `curl`.
    ```sh
    # In a separate terminal
    curl http://localhost:3000/api/seed
    ```
    This will create a dummy user and associate the sample data with it.

### Running the Application (Local)

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will start the Next.js application on `http://localhost:3000`.

2.  **Start the Genkit development server (for AI features):**
    For the AI Control Suggester to work, you need to run the Genkit server in a separate terminal.
    ```sh
    npm run genkit:dev
    ```
    This will start the Genkit flow server, typically on `http://localhost:4000`. Your Next.js app will communicate with this server for AI functionality.

---

### Installation & Setup (Docker)

If you have Docker installed, you can build and run the application in a container.

1.  **Build the Docker image**
    From the root of the project directory, run the following command:
    ```sh
    docker build -t controlsage .
    ```

2.  **Run the Docker container**
    Once the image is built, run it with the following command. This will start the application and map port 3000 from the container to your local machine.
    ```sh
    docker run -p 3000:3000 controlsage
    ```

3.  **Access the application**
    You can now access the application in your browser at `http://localhost:3000`.

    **Note on AI Features:** The Docker container runs the production build of the Next.js app, which communicates with Genkit flows directly on the server side. Ensure that any required API keys (e.g., for Google AI) are available as environment variables in your deployment environment.

## Application Structure

- `src/app/`: Main application pages using the Next.js App Router.
- `src/components/`: Shared React components, including UI components from ShadCN (`/ui`) and application-specific components (`/app`).
- `src/firebase/`: Firebase configuration, hooks (`useDoc`, `useCollection`), and providers.
- `src/ai/`: Contains Genkit flows for generative AI features.
- `src/lib/`: Shared utilities, type definitions, and static data.
- `firestore.rules`: Security rules for the Firestore database.
- `Dockerfile`: Defines the container for deploying the application.