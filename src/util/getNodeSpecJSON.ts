import { NodeSpecJSON, registerCoreProfile, registerSceneProfile, Registry, writeNodeSpecsToJSON } from 'behave-graph';

let nodeSpecJSON: NodeSpecJSON[] | undefined = undefined;

export const getNodeSpecJSON = (): NodeSpecJSON[] => {
  if (nodeSpecJSON === undefined) {
    const registry = new Registry();
    registerCoreProfile(registry);
    registerSceneProfile(registry);
    nodeSpecJSON = writeNodeSpecsToJSON(registry);
    console.log(nodeSpecJSON);
  }
  nodeSpecJSON.push(...newNode);
  return nodeSpecJSON;
};

export const newNode: NodeSpecJSON[] = [
  {
    type: 'publish_event',
    category: 'Event',
    label: 'Publish event',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'last event',
        valueType: 'event',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'event'
      }
    ]
  },
  {
    type: 'event',
    category: 'Event',
    label: 'Event',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'type',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'function node',
        valueType: 'function',
        defaultValue: ''
      },
      {
        name: 'last event',
        valueType: 'flow',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'event'
      }
    ]
  },
  {
    type: 'interaction',
    category: 'Action',
    label: 'Interaction',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'type',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'event'
      }
    ]
  },
  {
    type: 'on_click',
    category: 'Action',
    label: 'on Click',
    inputs: [
      {
        name: 'frame_id',
        valueType: 'flow',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'flow'
      }
    ]
  },
  {
    type: 'toggle_value',
    category: 'Action',
    label: 'toggle value',
    inputs: [
      {
        name: 'input',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'variables',
        valueType: 'string'
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'string'
      }
    ]
  },
  {
    type: 'variable',
    category: 'Variable',
    label: 'Variable',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'string'
      }
    ]
  },
  {
    type: 'Frame_id',
    category: 'Variable',
    label: 'Frame Id',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'flow'
      }
    ]
  },
  {
    type: 'function',
    category: 'Logic',
    label: 'Function',
    inputs: [
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'compute function',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'variables',
        valueType: 'flow'
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'function'
      }
    ]
  }
];
