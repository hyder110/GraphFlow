// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock reactflow
jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  ReactFlow: ({ children, nodes, edges, onNodesChange, onEdgesChange, onConnect }) => (
    <div className="react-flow">
      <div className="react-flow__renderer">{children}</div>
      <div data-testid="nodes-count">{nodes.length}</div>
      <div data-testid="edges-count">{edges.length}</div>
    </div>
  ),
  Background: () => <div className="react-flow__background" />,
  Controls: () => <div className="react-flow__controls" />,
  MiniMap: () => <div className="react-flow__minimap" />,
  Panel: ({ children }) => <div className="react-flow__panel">{children}</div>,
  useNodesState: () => [[], jest.fn()],
  useEdgesState: () => [[], jest.fn()],
  addEdge: jest.fn((edgeParams, edges) => [...edges, { ...edgeParams, id: `${edgeParams.source}-${edgeParams.target}` }]),
  getConnectedEdges: jest.fn(() => []),
}));

// Mock axios
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// Global setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: React.createElement') ||
      args[0].includes('Warning: Each child in a list'))
  ) {
    return;
  }
  originalConsoleError(...args);
}; 