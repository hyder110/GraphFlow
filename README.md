# GraphFlow

GraphFlow is a visual, drag-and-drop interface for constructing and managing agent workflows powered by [LangGraph](https://github.com/langchain-ai/langgraph). It allows you to visually configure various LangGraph-based agent architectures, store them in a database, and deploy them with a simple API.

## Features

- **Visual Graph Editor**: Drag-and-drop interface for creating LangGraph workflows
- **Node Types**: Support for various node types (LLM, tools, human-in-the-loop, transformations)
- **Persistence**: Store graph definitions in a PostgreSQL database
- **Execution**: Run graphs with a simple API endpoint
- **Templates**: Pre-built templates for common agent architectures

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Graph Visualization**: ReactFlow
- **Backend**: FastAPI
- **Database**: PostgreSQL
- **Agent Framework**: LangGraph

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL (optional, SQLite is used by default for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/graphflow.git
   cd graphflow
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/graphflow
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Application

1. Start the frontend development server:
   ```bash
   npm run dev
   ```

2. Start the backend server:
   ```bash
   cd app/api
   uvicorn main:app --reload
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Create a New Graph**: Click on "Create New Graph" on the home page
2. **Add Nodes**: Drag node types from the sidebar onto the canvas
3. **Connect Nodes**: Click and drag from one node's handle to another to create connections
4. **Configure Nodes**: Click on a node to open its configuration panel
5. **Save Graph**: Click the "Save" button to store your graph
6. **Run Graph**: Navigate to the "Run" page to execute your graph with custom inputs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [LangGraph](https://github.com/langchain-ai/langgraph) for the agent framework
- [ReactFlow](https://reactflow.dev/) for the graph visualization
- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API 