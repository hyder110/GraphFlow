import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const GettingStartedGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started with GraphFlow</h2>
        <p className="text-gray-600 dark:text-gray-400">
          GraphFlow is a visual interface for building and managing agent workflows powered by LangGraph.
          This guide will help you get started with creating your first graph.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Prerequisites</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>An OpenAI API key for LLM nodes</li>
          <li>Basic understanding of LLMs and agent workflows</li>
          <li>Familiarity with graph-based structures</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Concepts</h3>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nodes</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Nodes represent individual components in your agent workflow. GraphFlow supports several types of nodes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li><span className="font-medium text-indigo-600 dark:text-indigo-400">LLM Nodes</span>: Use large language models to generate text or make decisions</li>
            <li><span className="font-medium text-green-600 dark:text-green-400">Tool Nodes</span>: Perform specific actions like web searches or calculations</li>
            <li><span className="font-medium text-yellow-600 dark:text-yellow-400">Human Nodes</span>: Allow for human input in the workflow</li>
            <li><span className="font-medium text-purple-600 dark:text-purple-400">Transform Nodes</span>: Process and transform data between other nodes</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Edges</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Edges connect nodes and define the flow of data and control in your graph. There are two types of edges:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li><span className="font-medium text-gray-900 dark:text-white">Standard Edges</span>: Direct connections between nodes</li>
            <li><span className="font-medium text-gray-900 dark:text-white">Conditional Edges</span>: Connections that depend on conditions or routing logic</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Graphs</h4>
          <p className="text-gray-600 dark:text-gray-400">
            A graph is a collection of nodes and edges that define a complete workflow. Graphs can be saved, loaded, and executed.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Start</h3>
        
        <ol className="list-decimal pl-5 space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Create a new graph</h4>
              <p>
                From the home page, click on "Create New Graph" or use one of our templates to get started quickly.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Add nodes to your graph</h4>
              <p>
                Use the node toolbar to add different types of nodes to your graph. Configure each node with the appropriate settings.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Connect nodes with edges</h4>
              <p>
                Click and drag from one node's handle to another to create connections between nodes.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Save your graph</h4>
              <p>
                Give your graph a name and description, then click "Save" to store it in the database.
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Run your graph</h4>
              <p>
                Navigate to the "Run" page for your graph, provide any required inputs, and click "Run" to execute the workflow.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Next Steps</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Now that you understand the basics, you can:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Learn how to <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline" onClick={() => document.querySelector('button[data-tab="creating-graphs"]')?.click()}>create more complex graphs</Link></li>
          <li>Explore our <Link href="/templates" className="text-indigo-600 dark:text-indigo-400 hover:underline">templates</Link> for common agent architectures</li>
          <li>Read the <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline" onClick={() => document.querySelector('button[data-tab="api-reference"]')?.click()}>API reference</Link> to understand how to integrate with your own applications</li>
        </ul>
      </section>
    </div>
  );
};

export default GettingStartedGuide; 