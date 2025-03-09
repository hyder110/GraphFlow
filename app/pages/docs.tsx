import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import components for better performance
const GettingStartedGuide = dynamic(() => import('../components/docs/GettingStartedGuide'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>,
  ssr: true
});

const CreatingGraphsGuide = dynamic(() => import('../components/docs/CreatingGraphsGuide'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>,
  ssr: true
});

const RunningGraphsGuide = dynamic(() => import('../components/docs/RunningGraphsGuide'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>,
  ssr: true
});

const APIReference = dynamic(() => import('../components/docs/APIReference'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>,
  ssr: false // API reference is less critical for initial load
});

export default function Docs() {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div className="space-y-8">
      <Head>
        <title>Documentation - GraphFlow</title>
        <meta name="description" content="Learn how to use GraphFlow to build and run LangGraph workflows" />
      </Head>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn how to use GraphFlow to build and run LangGraph workflows visually.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('getting-started')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'getting-started'
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Getting Started
          </button>
          <button
            onClick={() => setActiveTab('creating-graphs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'creating-graphs'
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Creating Graphs
          </button>
          <button
            onClick={() => setActiveTab('running-graphs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'running-graphs'
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Running Graphs
          </button>
          <button
            onClick={() => setActiveTab('api-reference')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'api-reference'
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            API Reference
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'getting-started' && <GettingStartedGuide />}
        {activeTab === 'creating-graphs' && <CreatingGraphsGuide />}
        {activeTab === 'running-graphs' && <RunningGraphsGuide />}
        {activeTab === 'api-reference' && <APIReference />}
      </div>
    </div>
  );
} 