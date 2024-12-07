
"use client"

import React from 'react';

interface MM1GraphContainerProps {
  width?: number | string;
  height?: number | string;
}

const MM1GraphContainer: React.FC<MM1GraphContainerProps> = ({ 
  width = "100%",
  height = 400
}) => {
  return (
    <div 
      className="w-full rounded-lg border bg-card p-6 flex items-center justify-center" 
      style={{ height }}
    >
      <h3 className="text-lg font-semibold text-muted-foreground">Graph Area</h3>
    </div>
  );
};

export default MM1GraphContainer;