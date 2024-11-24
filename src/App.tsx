import { createRoot } from 'react-dom/client';
import React from 'react';

const App: React.FC = () => {
  return <div>Hello World</div>;
};

createRoot(document.getElementById('root')!).render(<App />);
