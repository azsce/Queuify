// rying to draw vertical lines for each occurrence in the timeline graphs (arrival, service, and departure) within the combined graph using the Line component instead of the ReferenceLine component. This approach can be tricky because the Line component is typically used for plotting continuous data points rather than discrete vertical lines.

// Here are a few points to consider:

// In the Recharts library, there isn't a built-in component specifically designed to draw vertical lines from y1 to y2 at a point x. However, you can achieve this by using the Line component creatively. By providing two data points with the same x value but different y values, you can draw a vertical line.

// Here's a step-by-step approach to achieve this:

// Prepare Data: Create a dataset where each vertical line is represented by two points with the same x value but different y values.

// Use Line Component: Use the Line component to draw these vertical lines by mapping over the prepared dataset.

// Example
// Let's assume you have a dataset where you want to draw vertical lines at specific x values from y1 to y2.

// Data Preparation
// const verticalLinesData = [
//   { x: 1, y1: 0, y2: 100 },
//   { x: 2, y1: 0, y2: 100 },
//   // ... more lines
// ];

// Using Line Component

// {verticalLinesData.map((line, index) => (
//   <Line
//     key={`vertical-line-${index}`}
//     data={[
//       { x: line.x, y: line.y1 },
//       { x: line.x, y: line.y2 },
//     ]}
//     dataKey="y"
//     stroke="#000" // or any color you prefer
//     dot={false}
//     strokeWidth={2}
//   />
// ))}

// Full Example in a Recharts Chart
// import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const verticalLinesData = [
//   { x: 1, y1: 0, y2: 100 },
//   { x: 2, y1: 0, y2: 100 },
//   // ... more lines
// ];

// const VerticalLinesChart = () => {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="x" />
//         <YAxis />
//         <Tooltip />
//         {verticalLinesData.map((line, index) => (
//           <Line
//             key={`vertical-line-${index}`}
//             data={[
//               { x: line.x, y: line.y1 },
//               { x: line.x, y: line.y2 },
//             ]}
//             dataKey="y"
//             stroke="#000" // or any color you prefer
//             dot={false}
//             strokeWidth={2}
//           />
//         ))}
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default VerticalLinesChart;

// Summary
// Data Preparation: Create a dataset with two points for each vertical line.
// Line Component: Use the Line component to draw vertical lines by mapping over the dataset.
// This approach allows you to draw vertical lines from y1 to y2 at specific x values using the Recharts library.
