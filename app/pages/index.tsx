import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';

interface Graph {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export default function Home() {
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/graphs');
        setGraphs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching graphs:', err);
        setError('Failed to load graphs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphs();
  }, []);

  return (
    <div className="space-y-12">
      <Head>
        <title>GraphFlow - Visual LangGraph Builder</title>
        <meta name="description" content="Build and manage LangGraph workflows visually" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Build AI Agent Workflows Visually
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            GraphFlow provides a visual, drag-and-drop interface to construct and manage agent workflows powered by LangGraph.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/graph/new" className="btn bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105">
              Create New Graph
            </Link>
            <Link href="/templates" className="btn bg-indigo-700 text-white hover:bg-indigo-800 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105">
              Explore Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Visual Graph Editor</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Drag-and-drop interface for creating LangGraph workflows with various node types and connections.
            </p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Persistent Storage</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save your graph definitions to a database and retrieve them later for editing or execution.
            </p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Instant Execution</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Run your graphs with a simple API endpoint and see the results in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Graphs Section */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Graphs</h2>
          <Link href="/graph/new" className="btn btn-primary">
            Create New Graph
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : graphs.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No graphs found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't created any graphs yet. Get started by creating a new graph or using a template.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/graph/new" className="btn btn-primary">
                Create New Graph
              </Link>
              <Link href="/templates" className="btn btn-secondary">
                Use a Template
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphs.map((graph) => (
              <div key={graph.id} className="card hover:shadow-lg transition-all duration-200">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{graph.name}</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {graph.description || 'No description provided'}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Created: {format(new Date(graph.created_at), 'MMM d, yyyy')}
                    {graph.updated_at && graph.updated_at !== graph.created_at && (
                      <span> · Updated: {format(new Date(graph.updated_at), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Link href={`/graph/${graph.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                      Edit Graph
                    </Link>
                    <Link href={`/graph/${graph.id}/run`} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
                      Run Graph
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 