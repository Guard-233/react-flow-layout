# README

## 启动项目

```bash
pnpm i

pnpm start
```

打开 localhost:8000 查看

## 如何使用自动布局

### 自定义 node

自定义 node 需要引用 useNodeTypeLayout

自定义 node 示例

```typescript
import { useNodeTypeLayout } from '@/hooks';

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
```

### ReactFlow

ReactFlow 组件需要引用 useLayout, 并且传入 setNodes 与 setEdges

```typescript
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
```
