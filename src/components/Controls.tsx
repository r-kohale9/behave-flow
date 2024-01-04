import {
  DefaultLogger,
  Engine,
  ManualLifecycleEventEmitter,
  readGraphFromJSON,
  registerCoreProfile,
  registerSceneProfile,
  Registry
} from 'behave-graph';
import { useState } from 'react';
import { ClearModal } from './ClearModal';
import { HelpModal } from './HelpModal';
import {
  faDownload,
  faPlay,
  faQuestion,
  faTrash,
  faUpload,
  faLayerGroup,
  faObjectUngroup,
  faCodeMerge,
  faRemove
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';

import { LoadModal } from './LoadModal';
import { SaveModal } from './SaveModal';
import { flowToBehave } from '../transformers/flowToBehave';
import { useReactFlow, Controls, ControlButton, useNodes } from 'reactflow';
import { sleep } from '../util/sleep';
import { useOnPressKey } from '../hooks/useOnPressKey';

const CustomControls = () => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const instance = useReactFlow();
  const nodes = useNodes();
  const showGroup = nodes?.filter(node => node.selected)?.length > 1;
  const showUnGroup = nodes?.find(node => node.selected && node.type === 'group');
  const showAddToGroup = nodes?.filter(node => node.selected && node.type === 'group').length == 1 && showGroup;
  const showRemoveFromGroup =
    nodes?.filter(node => node.selected && node.type !== 'group' && node.parentNode).length == 1 && !showUnGroup;

  const handleRun = async () => {
    const registry = new Registry();
    const logger = new DefaultLogger();
    const manualLifecycleEventEmitter = new ManualLifecycleEventEmitter();
    registerCoreProfile(registry, logger, manualLifecycleEventEmitter);
    registerSceneProfile(registry);

    const nodes = instance.getNodes();
    const edges = instance.getEdges();
    const graphJson = flowToBehave(nodes, edges);
    const graph = readGraphFromJSON(graphJson, registry);

    const engine = new Engine(graph);

    if (manualLifecycleEventEmitter.startEvent.listenerCount > 0) {
      manualLifecycleEventEmitter.startEvent.emit();
      await engine.executeAllAsync(5);
    }

    if (manualLifecycleEventEmitter.tickEvent.listenerCount > 0) {
      const iterations = 20;
      const tickDuration = 0.01;
      for (let tick = 0; tick < iterations; tick++) {
        manualLifecycleEventEmitter.tickEvent.emit();
        engine.executeAllSync(tickDuration);
        await sleep(tickDuration);
      }
    }

    if (manualLifecycleEventEmitter.endEvent.listenerCount > 0) {
      manualLifecycleEventEmitter.endEvent.emit();
      await engine.executeAllAsync(5);
    }
  };
  function findParentRectangle(squares) {
    // If there are no squares, return null or handle accordingly
    if (squares.length === 0) {
      return null;
    }
    // Determine the initial values using the position of the first square
    let parentX = squares[0].position.x;
    let parentY = squares[0].position.y;
    let maxX = squares[0].position.x + squares[0].width;
    let maxY = squares[0].position.y + squares[0].height;
    // Update values based on the remaining squares
    for (let i = 1; i < squares.length; i++) {
      const square = squares[i];
      parentX = Math.min(parentX, square.position.x);
      parentY = Math.min(parentY, square.position.y);
      maxX = Math.max(maxX, square.position.x + square.width);
      maxY = Math.max(maxY, square.position.y + square.height);
    }
    const parentWidth = maxX - parentX;
    const parentHeight = maxY - parentY;
    return {
      x: parentX,
      y: parentY,
      width: parentWidth,
      height: parentHeight
    };
  }
  function getChildCoordinatesRelativeToParent(parentX, parentY, child) {
    const childXRelativeToParent = child.position.x - parentX;
    const childYRelativeToParent = child.position.y - parentY;
    return {
      x: childXRelativeToParent,
      y: childYRelativeToParent
    };
  }
  function getAbsoluteCoordinates(parentX, parentY, child) {
    const childXAbsolute = parentX + child.position.x;
    const childYAbsolute = parentY + child.position.y;
    return {
      x: childXAbsolute,
      y: childYAbsolute
    };
  }
  const setGroupProps = (node, grpDimension, group) => {
    const dimension = getChildCoordinatesRelativeToParent(grpDimension.x - 10, grpDimension.y - 10, node);
    node.parentNode = group.id;
    node.extent = 'parent';
    node.zIndex = 1;
    node.selected = false;
    node.position.x = dimension.x;
    node.position.y = dimension.y;
    return node;
  };

  function handleAddToGroup() {
    const allNodes = instance?.getNodes();
    const selectedNodes = allNodes?.filter(node => node.selected && node.type !== 'group');
    const grpDimension = findParentRectangle([
      ...selectedNodes,
      ...allNodes
        .filter(node => node.parentNode === showUnGroup.id)
        .map(node => {
          const dimension = getAbsoluteCoordinates(showUnGroup.position.x, showUnGroup.position.y, node);
          return { ...node, position: { ...node.position, x: dimension.x, y: dimension.y } };
        })
    ]);
    const nodes = selectedNodes.map(node => setGroupProps(node, grpDimension, showUnGroup));
    instance.setNodes(nds =>
      nds.concat(...nodes, {
        ...showUnGroup,
        position: { x: grpDimension.x - 10, y: grpDimension.y - 10 },
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: grpDimension.width + 20, height: grpDimension.height + 20 }
      })
    );
  }

  function handleRemoveFromGroup() {
    const allNodes = instance?.getNodes();
    const selectedNode = allNodes?.find(node => node.selected && node.parentNode);
    const group = allNodes?.find(node => node.id === selectedNode.parentNode);
    const grpNodes = allNodes
      .filter(node => node.parentNode === selectedNode.parentNode && node.id !== selectedNode.id)
      .map(node => {
        const dimension = getAbsoluteCoordinates(group.position.x, group.position.y, node);
        return { ...node, position: { ...node.position, x: dimension.x, y: dimension.y } };
      });
    const grpDimension = findParentRectangle([...grpNodes]);
    const nodes = grpNodes.map(node => setGroupProps(node, grpDimension, group));
    const dimension = getAbsoluteCoordinates(group.position.x, group.position.y, selectedNode);
    const newSelectedNode = {
      ...selectedNode,
      position: { ...selectedNode.position, x: dimension.x, y: dimension.y }
    };
    delete newSelectedNode.parentNode;
    delete newSelectedNode.extent;
    instance.setNodes(nds =>
      nds.concat(
        ...nodes,
        {
          ...group,
          position: { x: grpDimension.x - 10, y: grpDimension.y - 10 },
          style: {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            width: grpDimension.width + 20,
            height: grpDimension.height + 20
          }
        },
        newSelectedNode
      )
    );
  }

  function handleUnGroup() {
    const nonGroupNodes = instance?.getNodes()?.filter(node => node.id !== showUnGroup.id);
    const nodes = nonGroupNodes.map(node => {
      if (node.parentNode === showUnGroup.id) {
        const dimension = getAbsoluteCoordinates(showUnGroup.position.x, showUnGroup.position.y, node);
        node.position.x = dimension.x;
        node.position.y = dimension.y;
        delete node.parentNode;
      }
      return node;
    });
    instance.setNodes(nodes);
  }

  function handleGroup() {
    // get nodes
    const selectedNodes = instance?.getNodes()?.filter(node => node.selected);
    const grpDimension = findParentRectangle(selectedNodes);
    const group = {
      id: uuid(),
      type: 'group',
      data: {
        label: null,
        resizable: true
      },
      selected: true,
      position: { x: grpDimension.x - 10, y: grpDimension.y - 10 },
      className: 'light',
      style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: grpDimension.width + 20, height: grpDimension.height + 20 }
    };
    // Check if there are nodes selected
    if (selectedNodes?.length) {
      selectedNodes.forEach(node => setGroupProps(node, grpDimension, group));
      instance.setNodes(nds => {
        return nds?.filter(node => !node.selected).concat(...selectedNodes, group);
      });
    }
  }

  useOnPressKey('none', () => {}, true);
  return (
    <>
      <Controls>
        <ControlButton title="Help" onClick={() => setHelpModalOpen(true)}>
          <FontAwesomeIcon icon={faQuestion} />
        </ControlButton>
        <ControlButton title="Load" onClick={() => setLoadModalOpen(true)}>
          <FontAwesomeIcon icon={faUpload} />
        </ControlButton>
        <ControlButton title="Save" onClick={() => setSaveModalOpen(true)}>
          <FontAwesomeIcon icon={faDownload} />
        </ControlButton>
        <ControlButton title="Clear" onClick={() => setClearModalOpen(true)}>
          <FontAwesomeIcon icon={faTrash} />
        </ControlButton>
        <ControlButton title="Run" onClick={() => handleRun()}>
          <FontAwesomeIcon icon={faPlay} />
        </ControlButton>
        {showGroup && (
          <ControlButton title="Group" onClick={handleGroup}>
            <FontAwesomeIcon icon={faLayerGroup} />
          </ControlButton>
        )}
        {showUnGroup && (
          <ControlButton title="UnGroup" onClick={handleUnGroup}>
            <FontAwesomeIcon icon={faObjectUngroup} />
          </ControlButton>
        )}
        {showAddToGroup && (
          <ControlButton title="Add to group" onClick={handleAddToGroup}>
            <FontAwesomeIcon icon={faCodeMerge} />
          </ControlButton>
        )}
        {showRemoveFromGroup && (
          <ControlButton title="Remove from group" onClick={handleRemoveFromGroup}>
            <FontAwesomeIcon icon={faRemove} />
          </ControlButton>
        )}
      </Controls>
      <LoadModal open={loadModalOpen} onClose={() => setLoadModalOpen(false)} />
      <SaveModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
      <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <ClearModal open={clearModalOpen} onClose={() => setClearModalOpen(false)} />
    </>
  );
};

export default CustomControls;
