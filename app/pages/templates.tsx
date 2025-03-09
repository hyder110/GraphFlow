import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

// Template definitions
const templates = [
  {
    id: 'plan-and-execute',
    name: 'Plan and Execute Agent',
    description: 'A two-step agent that first plans a sequence of actions, then executes them one by one. Useful for complex tasks that require planning.',
    difficulty: 'Intermediate',
    nodes: 3,
    edges: 3,
    image: '/templates/plan-execute.png',
    tags: ['Planning', 'Multi-step', 'Reasoning'],
    definition: {
      nodes: [
        {
          id: 'planner',
          type: 'llm',
          config: {
            model_name: 'gpt-4',
            temperature: 0.2,
            prompt_template: 'You are a planner. Given the following task, create a step-by-step plan to accomplish it.\n\nTask: {input}\n\nProvide your plan as a numbered list of steps.',
            input_key: 'input',
            output_key: 'plan'
          }
        },
        {
          id: 'executor',
          type: 'llm',
          config: {
            model_name: 'gpt-3.5-turbo',
            temperature: 0.3,
            prompt_template: 'You are an executor. Follow the plan below to accomplish the task. Provide your final answer.\n\nTask: {input}\n\nPlan:\n{plan}\n\nExecute the plan and provide your final answer:',
            input_key: 'input',
            output_key: 'output'
          }
        },
        {
          id: 'formatter',
          type: 'transform',
          config: {
            transform_type: 'extract_json',
            input_key: 'output',
            output_key: 'final_output'
          }
        }
      ],
      edges: [
        {
          source: 'START',
          target: 'planner'
        },
        {
          source: 'planner',
          target: 'executor'
        },
        {
          source: 'executor',
          target: 'formatter'
        },
        {
          source: 'formatter',
          target: 'END'
        }
      ],
      state_type: 'dict'
    }
  },
  {
    id: 'react-agent',
    name: 'ReAct Agent',
    description: 'A Reasoning and Acting agent that alternates between thinking and taking actions. Includes tool usage for search and calculations.',
    difficulty: 'Advanced',
    nodes: 5,
    edges: 6,
    image: '/templates/react.png',
    tags: ['Reasoning', 'Tool-use', 'Search'],
    definition: {
      nodes: [
        {
          id: 'thought_generator',
          type: 'llm',
          config: {
            model_name: 'gpt-4',
            temperature: 0.2,
            prompt_template: 'You are an assistant that thinks step by step before answering. Given the following input, first think about how to approach the problem.\n\nInput: {input}\n\nThought:',
            input_key: 'input',
            output_key: 'thought'
          }
        },
        {
          id: 'action_decider',
          type: 'llm',
          config: {
            model_name: 'gpt-4',
            temperature: 0.2,
            prompt_template: 'Based on your thought, decide what action to take next. You can either search for information or calculate something.\n\nInput: {input}\n\nThought: {thought}\n\nAction (choose one: "search", "calculate", "final_answer"):',
            input_key: 'input',
            output_key: 'action'
          }
        },
        {
          id: 'search_tool',
          type: 'tool',
          config: {
            tool_type: 'search',
            max_results: 3,
            input_key: 'input',
            output_key: 'search_results'
          }
        },
        {
          id: 'calculator',
          type: 'llm',
          config: {
            model_name: 'gpt-3.5-turbo',
            temperature: 0,
            prompt_template: 'You are a calculator. Perform the calculation requested in the input. Only provide the numerical answer.\n\nInput: {input}\n\nCalculation:',
            input_key: 'input',
            output_key: 'calculation'
          }
        },
        {
          id: 'final_answer',
          type: 'llm',
          config: {
            model_name: 'gpt-4',
            temperature: 0.3,
            prompt_template: 'Provide a final answer to the original question based on your thoughts and the information gathered.\n\nOriginal question: {input}\n\nThought: {thought}\n\nInformation: {information}\n\nFinal answer:',
            input_key: 'input',
            output_key: 'output'
          }
        }
      ],
      edges: [
        {
          source: 'START',
          target: 'thought_generator'
        },
        {
          source: 'thought_generator',
          target: 'action_decider'
        },
        {
          source: 'action_decider',
          target: 'search_tool',
          type: 'conditional',
          condition: {
            type: 'key_value',
            key: 'action',
            value_map: {
              'search': 'search_tool',
              'calculate': 'calculator',
              'final_answer': 'final_answer'
            },
            default: 'final_answer'
          },
          destinations: ['search_tool', 'calculator', 'final_answer']
        },
        {
          source: 'search_tool',
          target: 'thought_generator'
        },
        {
          source: 'calculator',
          target: 'thought_generator'
        },
        {
          source: 'final_answer',
          target: 'END'
        }
      ],
      state_type: 'dict'
    }
  },
  {
    id: 'qa-retrieval',
    name: 'Question Answering with Retrieval',
    description: 'A simple question-answering agent that uses retrieval to find relevant information before generating an answer.',
    difficulty: 'Beginner',
    nodes: 3,
    edges: 3,
    image: '/templates/qa-retrieval.png',
    tags: ['QA', 'Retrieval', 'Simple'],
    definition: {
      nodes: [
        {
          id: 'retriever',
          type: 'tool',
          config: {
            tool_type: 'search',
            max_results: 5,
            input_key: 'input',
            output_key: 'context'
          }
        },
        {
          id: 'answerer',
          type: 'llm',
          config: {
            model_name: 'gpt-3.5-turbo',
            temperature: 0.3,
            prompt_template: 'Answer the following question based on the provided context. If the context doesn't contain the answer, say "I don't know".\n\nQuestion: {input}\n\nContext: {context}\n\nAnswer:',
            input_key: 'input',
            output_key: 'output'
          }
        },
        {
          id: 'formatter',
          type: 'transform',
          config: {
            transform_type: 'extract_json',
            input_key: 'output',
            output_key: 'final_output'
          }
        }
      ],
      edges: [
        {
          source: 'START',
          target: 'retriever'
        },
        {
          source: 'retriever',
          target: 'answerer'
        },
        {
          source: 'answerer',
          target: 'formatter'
        },
        {
          source: 'formatter',
          target: 'END'
        }
      ],
      state_type: 'dict'
    }
  }
];

export default function Templates() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(template => 
        template.difficulty.toLowerCase() === filter || 
        template.tags.some(tag => tag.toLowerCase() === filter)
      );

  const createFromTemplate = async (templateId: string) => {
    try {
      setLoading(templateId);
      setError(null);
      
      // Find the template
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Create a new graph from the template
      const response = await axios.post('/api/graphs', {
        name: `${template.name} (from template)`,
        description: template.description,
        definition: template.definition,
        user_id: 1 // Default user ID
      });
      
      // Redirect to the graph editor
      router.push(`/graph/${response.data.id}`);
    } catch (err) {
      console.error('Error creating graph from template:', err);
      setError('Failed to create graph from template. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <Head>
        <title>Templates - GraphFlow</title>
        <meta name="description" content="Example graph templates for GraphFlow" />
      </Head>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Graph Templates</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our pre-built templates to quickly get started with common agent architectures.
          Each template can be customized to fit your specific needs.
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'all' 
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('beginner')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'beginner' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Beginner
        </button>
        <button 
          onClick={() => setFilter('intermediate')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'intermediate' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Intermediate
        </button>
        <button 
          onClick={() => setFilter('advanced')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'advanced' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Advanced
        </button>
        <button 
          onClick={() => setFilter('retrieval')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'retrieval' 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Retrieval
        </button>
        <button 
          onClick={() => setFilter('tool-use')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'tool-use' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Tool-use
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="card-header flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.difficulty === 'Beginner' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : template.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {template.difficulty}
              </span>
            </div>
            <div className="card-body">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{template.nodes} Nodes</span>
                <span>{template.edges} Edges</span>
              </div>
              <button
                onClick={() => createFromTemplate(template.id)}
                disabled={loading === template.id}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                {loading === template.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Use Template'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 