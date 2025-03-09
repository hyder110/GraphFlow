import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

interface Graph {
  id: number;
  name: string;
  description: string;
  created_at: string;
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
    <div className="min-h-screen bg-background">
      <Head>
        <title>GraphFlow - LangGraph Visual Builder</title>
        <meta name="description" content="Visual builder for LangGraph workflows" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">GraphFlow</h1>
          <p className="mt-1 text-sm text-gray-500">Visual builder for LangGraph workflows</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Graphs</h2>
            <Link href="/editor/new" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">
              Create New Graph
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : graphs.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">No graphs found</h3>
              <p className="mt-2 text-gray-500">Create your first graph to get started.</p>
              <Link href="/editor/new" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">
                Create New Graph
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {graphs.map((graph) => (
                <div key={graph.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{graph.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{graph.description || 'No description'}</p>
                    <p className="mt-2 text-xs text-gray-400">Created: {new Date(graph.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <Link href={`/editor/${graph.id}`} className="text-sm font-medium text-primary hover:text-blue-600">
                      Edit
                    </Link>
                    <Link href={`/run/${graph.id}`} className="text-sm font-medium text-green-600 hover:text-green-700">
                      Run
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GraphFlow. Powered by LangGraph.
          </p>
        </div>
      </footer>
    </div>
  );
} 