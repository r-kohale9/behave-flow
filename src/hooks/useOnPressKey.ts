import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useReactFlow } from 'reactflow';

export const useOnPressKey = (key: string, callback: (e: KeyboardEvent) => void, enableCopyPaste = false) => {
  const reactFlowInstance = useReactFlow();
  let keyMap = {};
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === key) {
        callback(e);
        return;
      }
      if (
        Object.keys(keyMap)
          .filter(i => keyMap[i])
          .join('+') === key
      ) {
        return;
      }
      keyMap[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keyMap = {};
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const setFlowData = (nodes, edges) => {
      reactFlowInstance.setNodes(nds => {
        nds.forEach(node => {
          node.selected = false;
        });
        return nds.concat(...nodes);
      });
      reactFlowInstance.setEdges(nds => {
        nds.forEach(edge => {
          edge.selected = false;
        });
        return nds.concat(...edges);
      });
    };

    if (enableCopyPaste) {
      document.oncopy = async function (e) {
        // get nodes
        let selectedNodes = reactFlowInstance?.getNodes()?.filter(node => node.selected);
        // get edges
        let selectedEdges = reactFlowInstance?.getEdges()?.filter(edge => edge.selected);
        // Check if there are nodes selected
        if (selectedNodes?.length) {
          // make original nodes deselected
          selectedNodes.forEach(node => {
            node.selected = false;
          });
          // make original edges deselected
          selectedEdges.forEach(edge => {
            edge.selected = false;
          });
          // set new nodes and edges p
          const data = { selectedNodes, selectedEdges };
          navigator.clipboard.writeText(JSON.stringify(data));
          setFlowData(selectedNodes, selectedEdges);
        }
      };

      document.onpaste = function (e) {
        const text = JSON.parse(e.clipboardData.getData('text') || '{}');
        if (!text) return false;
        const { selectedNodes, selectedEdges } = text;
        if (!selectedNodes || !selectedEdges) return false;
        // duplicate these nodes
        const idMap = {};
        let duplicateNodes = selectedNodes.map(node => {
          // append dup id
          node = JSON.parse(JSON.stringify(node));
          idMap[node.id] = uuid();
          node.id = idMap[node.id];
          node.selected = true;
          return node;
        });
        // duplicate the edges
        let duplicateEdges = selectedEdges.map(edge => {
          // append dup id
          edge = JSON.parse(JSON.stringify(edge));
          edge.source = idMap[edge.source];
          edge.target = idMap[edge.target];
          edge.id = uuid();
          edge.selected = true;
          return edge;
        });
        setFlowData(duplicateNodes, duplicateEdges);
      };
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [key, callback]);
};
