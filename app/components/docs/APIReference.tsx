import React, { useState } from 'react';
import Link from 'next/link';

const APIReference: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      id: 'get-graphs',
      method: 'GET',
      path: '/api/graphs',
      description: 'Retrieve a list of all graphs',
      parameters: [],
      responses: [
        {
          status: 200,
          description: 'A list of graphs',
          example: `[
  {
    "id": 1,
    "name": "Simple QA Agent",
    "description": "A basic question-answering agent",
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-16T14:20:00Z"
  },
  {
    "id": 2,
    "name": "Search and Summarize",
    "description": "An agent that searches for information and summarizes it",
    "created_at": "2023-06-20T08:45:00Z",
    "updated_at": null
  }
]`
        }
      ]
    },
    {
      id: 'get-graph',
      method: 'GET',
      path: '/api/graphs/{graph_id}',
      description: 'Retrieve a specific graph by ID',
      parameters: [
        {
          name: 'graph_id',
          type: 'path',
          dataType: 'integer',
          required: true,
          description: 'The ID of the graph to retrieve'
        }
      ],
      responses: [
        {
          status: 200,
          description: 'The requested graph',
          example: `{
  "id": 1,
  "name": "Simple QA Agent",
  "description": "A basic question-answering agent",
  "definition": {
    "nodes": [
      {
        "id": "llm",
        "type": "llm",
        "config": {
          "model_name": "gpt-3.5-turbo",
          "temperature": 0,
          "prompt_template": "Answer the following question: {input}",
          "input_key": "input",
          "output_key": "output"
        }
      }
    ],
    "edges": [
      {
        "source": "START",
        "target": "llm"
      },
      {
        "source": "llm",
        "target": "END"
      }
    ],
    "state_type": "dict"
  },
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-16T14:20:00Z"
}`
        },
        {
          status: 404,
          description: 'Graph not found',
          example: `{
  "detail": "Graph with ID 999 not found"
}`
        }
      ]
    },
    {
      id: 'create-graph',
      method: 'POST',
      path: '/api/graphs',
      description: 'Create a new graph',
      parameters: [
        {
          name: 'body',
          type: 'body',
          dataType: 'object',
          required: true,
          description: 'The graph definition',
          schema: `{
  "name": "string",
  "description": "string",
  "definition": {
    "nodes": [
      {
        "id": "string",
        "type": "string",
        "config": {}
      }
    ],
    "edges": [
      {
        "source": "string",
        "target": "string",
        "type": "string (optional)",
        "condition": {} (optional)
      }
    ],
    "state_type": "string"
  },
  "user_id": "integer (optional)"
}`
        }
      ],
      responses: [
        {
          status: 200,
          description: 'The created graph',
          example: `{
  "id": 3,
  "name": "New Graph",
  "description": "A newly created graph",
  "definition": {
    "nodes": [...],
    "edges": [...],
    "state_type": "dict"
  },
  "created_at": "2023-07-01T12:00:00Z",
  "updated_at": null
}`
        },
        {
          status: 422,
          description: 'Validation error',
          example: `{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}`
        }
      ]
    },
    {
      id: 'update-graph',
      method: 'PUT',
      path: '/api/graphs/{graph_id}',
      description: 'Update an existing graph',
      parameters: [
        {
          name: 'graph_id',
          type: 'path',
          dataType: 'integer',
          required: true,
          description: 'The ID of the graph to update'
        },
        {
          name: 'body',
          type: 'body',
          dataType: 'object',
          required: true,
          description: 'The updated graph definition',
          schema: `{
  "name": "string",
  "description": "string",
  "definition": {
    "nodes": [...],
    "edges": [...],
    "state_type": "string"
  }
}`
        }
      ],
      responses: [
        {
          status: 200,
          description: 'The updated graph',
          example: `{
  "id": 1,
  "name": "Updated Graph Name",
  "description": "Updated description",
  "definition": {
    "nodes": [...],
    "edges": [...],
    "state_type": "dict"
  },
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-07-02T15:45:00Z"
}`
        },
        {
          status: 404,
          description: 'Graph not found',
          example: `{
  "detail": "Graph with ID 999 not found"
}`
        }
      ]
    },
    {
      id: 'delete-graph',
      method: 'DELETE',
      path: '/api/graphs/{graph_id}',
      description: 'Delete a graph',
      parameters: [
        {
          name: 'graph_id',
          type: 'path',
          dataType: 'integer',
          required: true,
          description: 'The ID of the graph to delete'
        }
      ],
      responses: [
        {
          status: 200,
          description: 'Success message',
          example: `{
  "message": "Graph deleted successfully"
}`
        },
        {
          status: 404,
          description: 'Graph not found',
          example: `{
  "detail": "Graph with ID 999 not found"
}`
        }
      ]
    },
    {
      id: 'run-graph',
      method: 'POST',
      path: '/api/graphs/{graph_id}/run',
      description: 'Run a graph with the provided input',
      parameters: [
        {
          name: 'graph_id',
          type: 'path',
          dataType: 'integer',
          required: true,
          description: 'The ID of the graph to run'
        },
        {
          name: 'body',
          type: 'body',
          dataType: 'object',
          required: true,
          description: 'The input for the graph',
          schema: `{
  "input": "any"
}`
        }
      ],
      responses: [
        {
          status: 200,
          description: 'The result of running the graph',
          example: `{
  "output": "The capital of France is Paris.",
  "final_output": {
    "answer": "Paris",
    "confidence": 0.98
  }
}`
        },
        {
          status: 404,
          description: 'Graph not found',
          example: `{
  "detail": "Graph with ID 999 not found"
}`
        },
        {
          status: 500,
          description: 'Error running the graph',
          example: `{
  "error": "Failed to run graph: Invalid node configuration"
}`
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Reference</h2>
        <p className="text-gray-600 dark:text-gray-400">
          GraphFlow provides a RESTful API for managing and running graphs programmatically.
          This reference documents all available endpoints, their parameters, and response formats.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Authentication</h3>
        <p className="text-gray-600 dark:text-gray-400">
          All API requests require authentication using an API key. Include the API key in the request headers:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
          {`Authorization: Bearer YOUR_API_KEY`}
        </pre>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You can generate an API key in your account settings.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Base URL</h3>
        <p className="text-gray-600 dark:text-gray-400">
          All API endpoints are relative to the base URL:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
          {`https://api.graphflow.ai/v1`}
        </pre>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Endpoints</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
            <div className="sticky top-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Endpoint List</h4>
              <ul className="space-y-2">
                {endpoints.map(endpoint => (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        activeEndpoint === endpoint.id
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className={`inline-block w-16 font-mono ${
                        endpoint.method === 'GET' ? 'text-green-600 dark:text-green-400' :
                        endpoint.method === 'POST' ? 'text-blue-600 dark:text-blue-400' :
                        endpoint.method === 'PUT' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>{endpoint.method}</span>
                      <span className="font-mono">{endpoint.path}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {activeEndpoint ? (
              <div className="space-y-6">
                {endpoints.filter(e => e.id === activeEndpoint).map(endpoint => (
                  <div key={endpoint.id} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>{endpoint.method}</span>
                      <span className="font-mono text-gray-900 dark:text-white">{endpoint.path}</span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                    
                    {endpoint.parameters.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Parameters</h4>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Required</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {endpoint.parameters.map((param, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{param.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{param.type} ({param.dataType})</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{param.required ? 'Yes' : 'No'}</td>
                                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {endpoint.parameters.some(p => p.type === 'body' && p.schema) && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Body Schema</h5>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                              {endpoint.parameters.find(p => p.type === 'body')?.schema}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responses</h4>
                      <div className="space-y-4">
                        {endpoint.responses.map((response, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                response.status >= 400 && response.status < 500 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {response.status}
                              </span>
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{response.description}</span>
                            </div>
                            <div className="p-4">
                              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                                {response.example}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Request</h4>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                        {`curl -X ${endpoint.method} \\
  https://api.graphflow.ai/v1${endpoint.path.replace(/{([^}]+)}/g, '1')} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" ${endpoint.parameters.some(p => p.type === 'body') ? `\\
  -d '${JSON.stringify(JSON.parse(`{"name":"Example Graph","description":"An example graph","definition":{"nodes":[{"id":"node1","type":"llm","config":{}}],"edges":[{"source":"START","target":"node1"},{"source":"node1","target":"END"}],"state_type":"dict"}}${endpoint.id === 'run-graph' ? ',"input":"What is the capital of France?"}' : '"}'}'), null, 2)}'` : ''}`}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select an endpoint</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose an endpoint from the list to view its documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Error Handling</h3>
        <p className="text-gray-600 dark:text-gray-400">
          The API uses standard HTTP status codes to indicate the success or failure of a request:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><span className="font-medium text-green-600 dark:text-green-400">200 OK</span>: The request was successful</li>
          <li><span className="font-medium text-yellow-600 dark:text-yellow-400">400 Bad Request</span>: The request was invalid or cannot be served</li>
          <li><span className="font-medium text-yellow-600 dark:text-yellow-400">401 Unauthorized</span>: Authentication failed or user doesn't have permissions</li>
          <li><span className="font-medium text-yellow-600 dark:text-yellow-400">404 Not Found</span>: The requested resource does not exist</li>
          <li><span className="font-medium text-yellow-600 dark:text-yellow-400">422 Unprocessable Entity</span>: The request was well-formed but was unable to be followed due to semantic errors</li>
          <li><span className="font-medium text-red-600 dark:text-red-400">500 Internal Server Error</span>: Something went wrong on the server</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Error responses include a JSON object with a <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">detail</code> field that provides more information about the error.
        </p>
      </section>

      <div className="mt-8 flex justify-start">
        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center" onClick={() => document.querySelector('button[data-tab="running-graphs"]')?.click()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Running Graphs
        </Link>
      </div>
    </div>
  );
};

export default APIReference; 