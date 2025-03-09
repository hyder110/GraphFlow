import React from 'react';
import Link from 'next/link';

const RunningGraphsGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Running Graphs in GraphFlow</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This guide explains how to run graphs in GraphFlow, monitor their execution, and interpret the results.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Running a Graph</h3>
        <p className="text-gray-600 dark:text-gray-400">
          There are two ways to run a graph in GraphFlow:
        </p>
        <ol className="list-decimal pl-5 space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">From the Graph List</h4>
              <p>
                On the home page, find the graph you want to run and click the "Run Graph" button.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">From the Graph Editor</h4>
              <p>
                While editing a graph, click the "Run" button in the top toolbar.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The Run Interface</h3>
        <p className="text-gray-600 dark:text-gray-400">
          The run interface consists of several components:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><span className="font-medium">Input Panel</span>: Where you provide input values for the graph</li>
          <li><span className="font-medium">Run Button</span>: Starts the execution of the graph</li>
          <li><span className="font-medium">Graph Visualization</span>: Shows the graph structure and highlights the current node during execution</li>
          <li><span className="font-medium">Output Panel</span>: Displays the results of the graph execution</li>
          <li><span className="font-medium">Logs Panel</span>: Shows detailed logs of the execution process</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Providing Input</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Before running a graph, you need to provide the necessary input values:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>In the Input Panel, you'll see input fields for each required input</li>
          <li>Fill in the values for each input field</li>
          <li>For text inputs, simply type the text</li>
          <li>For structured inputs (like JSON), make sure to use the correct format</li>
        </ol>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Inputs</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Simple Text Input</h5>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-x-auto mt-1">
                What is the capital of France?
              </pre>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Input</h5>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-x-auto mt-1">
                {`{
  "question": "What is the capital of France?",
  "context": "France is a country in Western Europe."
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Monitoring Execution</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Once you start the execution, you can monitor its progress:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>The current node being executed is highlighted in the graph visualization</li>
          <li>The Logs Panel shows real-time updates of the execution process</li>
          <li>For long-running executions, a progress indicator shows the overall status</li>
          <li>If the execution gets stuck or takes too long, you can click the "Stop" button to cancel it</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Interpreting Results</h3>
        <p className="text-gray-600 dark:text-gray-400">
          After the graph execution completes, you can view and interpret the results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>The Output Panel displays the final output of the graph</li>
          <li>For text outputs, the result is shown directly</li>
          <li>For structured outputs (like JSON), the result is formatted for readability</li>
          <li>You can expand or collapse sections of structured outputs</li>
          <li>The Logs Panel shows the complete execution history, including intermediate results</li>
        </ul>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Output</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Simple Text Output</h5>
              <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 mt-1">
                <p className="text-gray-800 dark:text-gray-200">The capital of France is Paris.</p>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Output</h5>
              <pre className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm overflow-x-auto mt-1">
                {`{
  "answer": "The capital of France is Paris.",
  "confidence": 0.98,
  "sources": [
    "https://en.wikipedia.org/wiki/Paris"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Saving and Sharing Results</h3>
        <p className="text-gray-600 dark:text-gray-400">
          GraphFlow provides several options for saving and sharing the results of graph executions:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><span className="font-medium">Copy to Clipboard</span>: Click the "Copy" button to copy the output to your clipboard</li>
          <li><span className="font-medium">Download as JSON</span>: Click the "Download" button to save the output as a JSON file</li>
          <li><span className="font-medium">Save Run</span>: Click the "Save Run" button to store the execution in the database for future reference</li>
          <li><span className="font-medium">Share Link</span>: Click the "Share" button to generate a shareable link to the execution results</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Troubleshooting</h3>
        <p className="text-gray-600 dark:text-gray-400">
          If you encounter issues while running a graph, here are some common problems and solutions:
        </p>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Execution Fails Immediately</h4>
            <p className="text-gray-600 dark:text-gray-400">
              This usually indicates a configuration issue with the graph:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>Check that all required inputs are provided</li>
              <li>Verify that all node configurations are correct</li>
              <li>Ensure that all connections between nodes are properly set up</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Execution Gets Stuck</h4>
            <p className="text-gray-600 dark:text-gray-400">
              If the execution seems to hang or take too long:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>Check the Logs Panel to see which node is currently executing</li>
              <li>For LLM nodes, complex prompts might take longer to process</li>
              <li>For tool nodes, external services might be slow or unavailable</li>
              <li>Click the "Stop" button to cancel the execution and try again with simpler inputs</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Unexpected Results</h4>
            <p className="text-gray-600 dark:text-gray-400">
              If the graph produces unexpected or incorrect results:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>Review the Logs Panel to see the intermediate results at each step</li>
              <li>Check the prompt templates in LLM nodes for clarity and specificity</li>
              <li>Verify that the correct keys are being used for input and output in each node</li>
              <li>Consider adding transform nodes to format data between steps</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-between">
        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center" onClick={() => document.querySelector('button[data-tab="creating-graphs"]')?.click()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Creating Graphs
        </Link>
        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center" onClick={() => document.querySelector('button[data-tab="api-reference"]')?.click()}>
          API Reference
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RunningGraphsGuide; 