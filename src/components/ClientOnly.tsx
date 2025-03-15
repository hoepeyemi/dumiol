// @ts-nocheck - Skip all type checking for this file
'use client';

import { useEffect, useState } from 'react';

// This component ensures its children are only rendered on the client side
export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
} 