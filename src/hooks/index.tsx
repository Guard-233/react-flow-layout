import Dagre from '@dagrejs/dagre';
import { useMemoizedFn } from 'ahooks';
import React, { Dispatch, RefObject, useEffect, useLayoutEffect } from 'react';
import {
  Edge,
  Node,
  Position,
  useNodeId,
  useNodesInitialized,
  useReactFlow,
  useStore,
} from 'reactflow';

const dagreGraph = new Dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutElements = (
  nodes: Node[],
  edges: Edge[],
  options: {
    direction: 'TB' | 'LR';
    defaultNodeWidth: number;
    defaultNodeHeight: number;
  },
) => {
  const isHorizontal = options.direction === 'LR';
  dagreGraph.setGraph({ rankdir: options.direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || options.defaultNodeWidth,
      height: node.height || options.defaultNodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - (node?.width || options.defaultNodeWidth) / 2,
      y: nodeWithPosition.y - (node?.height || options.defaultNodeHeight) / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const useLayout = <T extends any, K extends any>({
  setEdges,
  setNodes,
  defaultNodeHeight = 100,
  defaultNodeWidth = 100,
}: {
  setNodes: Dispatch<React.SetStateAction<Node<T>[]>>;
  setEdges: Dispatch<React.SetStateAction<Edge<K>[]>>;
  defaultNodeWidth?: number;
  defaultNodeHeight?: number;
}) => {
  const getNodes = useStore((store) => store.getNodes);
  const edges = useStore((store) => store.edges);
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  const onLayout = useMemoizedFn(({ direction }) => {
    const newNodes = getNodes();
    const { edges: layoutEdges, nodes: layoutNodes } = getLayoutElements(
      newNodes,
      edges,
      {
        direction,
        defaultNodeWidth,
        defaultNodeHeight,
      },
    );

    setNodes(layoutNodes);
    setEdges(layoutEdges);

    window.requestAnimationFrame(() => fitView());
  });

  useEffect(() => {
    if (!nodesInitialized) return;
    onLayout({ direction: 'LR', useInitialNodes: true });
  }, [nodesInitialized]);

  return {
    onLayout,
  };
};

export const useNodeTypeLayout = <T extends HTMLElement>(ref: RefObject<T>) => {
  const nodes = useStore((state) => state.getNodes());
  const nodeId = useNodeId();
  const setNodes = useStore((state) => state.setNodes);

  const resetNode = useMemoizedFn((size: { width: number; height: number }) => {
    const newNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          style: { width: size.width, height: size.height },
        };
      } else {
        return node;
      }
    });

    setNodes(newNodes);
  });

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const size = ref.current.getClientRects();
    resetNode({
      width: size[0].width,
      height: size[0].height,
    });
  }, []);
};
