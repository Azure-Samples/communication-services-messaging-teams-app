// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

createRoot(domNode).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <div className="wrapper">
        <App />
      </div>
    </FluentProvider>
  </React.StrictMode>
);
