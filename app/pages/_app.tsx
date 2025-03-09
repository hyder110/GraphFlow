import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactFlowProvider>
      <Component {...pageProps} />
    </ReactFlowProvider>
  );
}

export default MyApp; 