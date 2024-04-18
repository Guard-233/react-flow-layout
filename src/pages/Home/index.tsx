import { useCallback, useRef } from 'react';
import ReactFlow, {
  Handle,
  Panel,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { initialEdges, initialNodes } from './nodes-edges';

import { useLayout, useNodeTypeLayout } from '@/hooks';
import { Button } from 'antd';
import 'reactflow/dist/style.css';

const Test = () => {
  const ref = useRef<HTMLDivElement>(null);

  useNodeTypeLayout(ref);

  return (
    <div
      style={{ height: '300px', width: '200px', background: 'red' }}
      ref={ref}
    >
      <Handle type="target" position={Position.Top} />

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};
const Test1 = () => {
  const ref = useRef<HTMLDivElement>(null);

  useNodeTypeLayout(ref);

  return (
    <div
      style={{ height: '300px', width: '400px', background: 'blue' }}
      ref={ref}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};

const Test2 = () => {
  const ref = useRef<HTMLDivElement>(null);

  useNodeTypeLayout(ref);

  return (
    <div
      style={{ height: '30px', width: '30px', background: 'green' }}
      ref={ref}
    >
      <Handle type="target" position={Position.Top} />

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const { onLayout } = useLayout({
    setEdges,
    setNodes,
    defaultNodeWidth: 150,
    defaultNodeHeight: 50,
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{
        test: Test,
        test1: Test1,
        test2: Test2,
      }}
      fitView
    >
      <Panel position="top-right">
        <>
          <Button onClick={() => onLayout({ direction: 'LR' })} key={1}>
            vertical layout
          </Button>

          <Button onClick={() => onLayout({ direction: '' })} key={2}>
            horizontal layout
          </Button>
        </>
      </Panel>
    </ReactFlow>
  );
}

export default () => (
  <div
    style={{
      width: '100%',
      height: '100vh',
    }}
  >
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  </div>
);
