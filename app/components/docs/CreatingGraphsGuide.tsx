import React from 'react';
import Link from 'next/link';

const CreatingGraphsGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Creating Graphs in GraphFlow</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This guide will walk you through the process of creating graphs in GraphFlow, from simple linear flows to complex conditional workflows.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The Graph Editor</h3>
        <p className="text-gray-600 dark:text-gray-400">
          The graph editor is the main interface for creating and editing graphs. It consists of:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><span className="font-medium">Canvas</span>: The main area where you place and connect nodes</li>
          <li><span className="font-medium">Node Toolbar</span>: A panel with buttons to add different types of nodes</li>
          <li><span className="font-medium">Properties Panel</span>: A panel that appears when you select a node, allowing you to configure its properties</li>
          <li><span className="font-medium">Controls</span>: Buttons for zooming, panning, and other canvas operations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Creating a Simple Linear Flow</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start by creating a simple linear flow with an LLM node and a transform node:
        </p>
        <ol className="list-decimal pl-5 space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Add an LLM node</h4>
              <p>
                Click the "Add LLM Node" button in the node toolbar. A new LLM node will appear on the canvas.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">LLM Node Configuration</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">Model Name</span>: Choose the LLM model (e.g., "gpt-3.5-turbo", "gpt-4")</li>
                  <li><span className="font-medium">Temperature</span>: Set the creativity level (0.0 for deterministic, higher for more creative)</li>
                  <li><span className="font-medium">Prompt Template</span>: Define the prompt template with input variables in curly braces (e.g., "Answer this question: {input}")</li>
                  <li><span className="font-medium">Input Key</span>: Specify which state key to use as input (default: "input")</li>
                  <li><span className="font-medium">Output Key</span>: Specify where to store the output in the state (default: "output")</li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Add a Transform node</h4>
              <p>
                Click the "Add Transform Node" button in the node toolbar. A new Transform node will appear on the canvas.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Transform Node Configuration</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">Transform Type</span>: Choose the type of transformation (e.g., "extract_json")</li>
                  <li><span className="font-medium">Input Key</span>: Specify which state key to use as input (should match the output key of the previous node)</li>
                  <li><span className="font-medium">Output Key</span>: Specify where to store the output in the state (e.g., "final_output")</li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Connect the nodes</h4>
              <p>
                Click and drag from the output handle of the LLM node to the input handle of the Transform node to create a connection.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Connect to START and END</h4>
              <p>
                Every graph needs connections from the START node to the first node, and from the last node to the END node.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Connect the START node to the LLM node</li>
                <li>Connect the Transform node to the END node</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Creating a Conditional Flow</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Conditional flows allow your graph to take different paths based on certain conditions. Here's how to create one:
        </p>
        <ol className="list-decimal pl-5 space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Create a decision node</h4>
              <p>
                Add an LLM node that will make a decision based on the input. Configure it to output a specific format that can be used for routing.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Example Prompt Template</h5>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                  {`Based on the input, decide which action to take next. Respond with one of the following: "search", "calculate", or "answer".

Input: {input}

Action:`}
                </pre>
              </div>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Add destination nodes</h4>
              <p>
                Add the nodes that will be the destinations for different conditions. For example:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>A search tool node for the "search" condition</li>
                <li>A calculator node for the "calculate" condition</li>
                <li>An answer generation node for the "answer" condition</li>
              </ul>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Create conditional edges</h4>
              <p>
                Create edges from the decision node to each destination node, and configure them as conditional edges:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Click on the decision node to select it</li>
                <li>Click the "Add Conditional Edge" button</li>
                <li>Select the condition type (e.g., "key_value")</li>
                <li>Specify the key to check (e.g., "action")</li>
                <li>Define the value map (e.g., "search" → search node, "calculate" → calculator node, "answer" → answer node)</li>
                <li>Set a default destination for cases that don't match any condition</li>
              </ol>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Complete the flow</h4>
              <p>
                Connect the remaining nodes to complete the flow:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Connect the START node to the decision node</li>
                <li>Connect each destination node to the appropriate next node or to the END node</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Saving and Managing Graphs</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Once you've created your graph, you can save it for future use:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Click the "Save Graph" button</li>
          <li>Enter a name and description for your graph</li>
          <li>Click "Save" to store the graph in the database</li>
        </ol>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          You can manage your saved graphs from the home page:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>View a list of all your graphs</li>
          <li>Edit existing graphs</li>
          <li>Delete graphs you no longer need</li>
          <li>Run graphs to execute the workflows</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Techniques</h3>
        <p className="text-gray-600 dark:text-gray-400">
          As you become more comfortable with GraphFlow, you can explore these advanced techniques:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><span className="font-medium">Cycles and Loops</span>: Create graphs with cycles to implement iterative processes</li>
          <li><span className="font-medium">Complex Routing</span>: Use multiple conditional edges to create sophisticated decision trees</li>
          <li><span className="font-medium">Tool Integration</span>: Incorporate external tools and APIs into your workflows</li>
          <li><span className="font-medium">Human-in-the-Loop</span>: Add human nodes to allow for manual intervention in automated processes</li>
        </ul>
      </section>

      <div className="mt-8 flex justify-between">
        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center" onClick={() => document.querySelector('button[data-tab="getting-started"]')?.click()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Getting Started
        </Link>
        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center" onClick={() => document.querySelector('button[data-tab="running-graphs"]')?.click()}>
          Running Graphs
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CreatingGraphsGuide; 