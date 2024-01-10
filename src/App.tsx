import { MouseEvent as ReactMouseEvent, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  OnConnectStartParams,
  useEdgesState,
  useNodesState,
  XYPosition
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { behaveToFlow } from './transformers/behaveToFlow';
import { customNodeTypes } from './util/customNodeTypes';
import Controls from './components/Controls';
import rawGraphJSON from './graph.json';
import { GraphJSON } from 'behave-graph';
import NodePicker from './components/NodePicker';
import { getNodePickerFilters } from './util/getPickerFilters';
import { calculateNewEdge } from './util/calculateNewEdge';
import useGraphqlCall from './hooks/useGraphqlCall';

const graphJSON = rawGraphJSON as GraphJSON;

const [initialNodes, initialEdges] = behaveToFlow(graphJSON);

function Flow(props) {
  const [nodePickerVisibility, setNodePickerVisibility] = useState<XYPosition>();
  const [lastConnectStart, setLastConnectStart] = useState<OnConnectStartParams>();
  const [nodes, setN, onNodesChange] = useNodesState(props.initialNodes ?? initialNodes);
  const [edges, setE, onEdgesChange] = useEdgesState(props.initialEdges ?? initialEdges);

  useEffect(() => {
    props.initialNodes && setN(props.initialNodes);
    props.initialEdges && setE(props.initialEdges);
  }, [props.initialNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === null) return;
      if (connection.target === null) return;

      const newEdge = {
        id: uuidv4(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle
      };
      onEdgesChange([
        {
          type: 'add',
          item: newEdge
        }
      ]);
    },
    [onEdgesChange]
  );

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker();
      const newNode = {
        id: uuidv4(),
        type: nodeType,
        position,
        data: {}
      };
      onNodesChange([
        {
          type: 'add',
          item: newNode
        }
      ]);

      if (lastConnectStart === undefined) return;

      // add an edge if we started on a socket
      const originNode = nodes.find(node => node.id === lastConnectStart.nodeId);
      if (originNode === undefined) return;
      onEdgesChange([
        {
          type: 'add',
          item: calculateNewEdge(originNode, nodeType, newNode.id, lastConnectStart)
        }
      ]);
    },
    [lastConnectStart, nodes, onEdgesChange, onNodesChange]
  );

  const handleStartConnect = (e: ReactMouseEvent, params: OnConnectStartParams) => {
    setLastConnectStart(params);
  };

  const handleStopConnect = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    if (element.classList.contains('react-flow__pane')) {
      setNodePickerVisibility({ x: e.clientX, y: e.clientY });
    } else {
      setLastConnectStart(undefined);
    }
  };

  const closeNodePicker = () => {
    setLastConnectStart(undefined);
    setNodePickerVisibility(undefined);
  };

  const handlePaneClick = () => closeNodePicker();

  const handlePaneContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setNodePickerVisibility({ x: e.clientX, y: e.clientY });
  };

  return (
    <ReactFlow
      nodeTypes={customNodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={handleStartConnect}
      onConnectEnd={handleStopConnect}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
    >
      <Controls />
      <Background variant={BackgroundVariant.Lines} color="#2a2b2d" style={{ backgroundColor: '#1E1F22' }} />
      {nodePickerVisibility && (
        <NodePicker
          position={nodePickerVisibility}
          filters={getNodePickerFilters(nodes, lastConnectStart)}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
        />
      )}
      <MiniMap nodeStrokeWidth={3} />
    </ReactFlow>
  );
}

const App = props => {
  const href = decodeURI(window.location.href).split('/');
  const figmaContextId = href[href.length - 1];
  const { data } = useGraphqlCall(figmaContextId);
  const graph = JSON.parse(data?.other_generic_data[0]?.data ?? '{}')?.behaveGraph;
  if (figmaContextId && graph) {
    const [initialNodes, initialEdges] = behaveToFlow(graph);
    return <Flow {...props} initialNodes={initialNodes} initialEdges={initialEdges} />;
  }
  return <Flow {...props} />;
};

export default App;
