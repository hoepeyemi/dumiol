// @ts-nocheck - Skip all type checking for this file
import dynamic from 'next/dynamic';
import React from 'react';

// This is a higher-order component that disables server-side rendering for its children
const NoSSR = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

// Export a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
}); 