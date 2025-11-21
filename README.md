# WeCode

A collaborative coding platform for study plans and jam sessions.

## Running with Docker Compose

### Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd WeCode
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the backend and frontend Docker images
   - Start both services
   - Expose the backend on `http://localhost:3000`
   - Expose the frontend on `http://localhost:5050`

3. **Access the application**:
   - Frontend: http://localhost:5050
   - Backend API: http://localhost:3000