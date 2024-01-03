import { NodeSpecJSON, registerCoreProfile, registerSceneProfile, Registry, writeNodeSpecsToJSON } from 'behave-graph';

let nodeSpecJSON: NodeSpecJSON[] | undefined = undefined;

export const getNodeSpecJSON = (): NodeSpecJSON[] => {
  if (nodeSpecJSON === undefined) {
    const registry = new Registry();
    registerCoreProfile(registry);
    registerSceneProfile(registry);
    nodeSpecJSON = writeNodeSpecsToJSON(registry);
  }
  nodeSpecJSON.push(...newNode);
  return nodeSpecJSON;
};

export const newNode: NodeSpecJSON[] = [
  {
    type: 'publish_event',
    category: 'Action',
    label: 'Publish event',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      }
    ]
  },
  {
    type: 'listen_event',
    category: 'Action',
    label: 'Listen event',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      }
    ]
  },
  {
    type: 'play_sound',
    category: 'Action',
    label: 'play sound',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'name',
        valueType: 'string',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
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
    type: 'on_click',
    category: 'Event',
    label: 'on Click',
    inputs: [
      {
        name: 'frame_id',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'on_drag',
    category: 'Event',
    label: 'on Drag',
    inputs: [
      {
        name: 'frame_id',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'on_drag_start',
    category: 'Event',
    label: 'on Drag Start',
    inputs: [
      {
        name: 'frame_id',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'on_drop',
    category: 'Event',
    label: 'on Drop',
    inputs: [
      {
        name: 'frame_id',
        valueType: 'string',
        defaultValue: ' '
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
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'variable',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'increment',
    category: 'Action',
    label: 'Increment value',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'variable',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'increment_by',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'decrement',
    category: 'Action',
    label: 'Decrement value',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'variable',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'decrement_by',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'get_value_at_path',
    category: 'Action',
    label: 'get value at path',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'object/array',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'path',
        valueType: 'string',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'set_value_at_path',
    category: 'Action',
    label: 'set value at path',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'object/array',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'path',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'value',
        valueType: 'object',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'get_value_at_index',
    category: 'Action',
    label: 'get value at path',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'array',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'index',
        valueType: 'string',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'set_value_at_index',
    category: 'Action',
    label: 'set value at path',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'array',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'index',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'value',
        valueType: 'object',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'set_value',
    category: 'Action',
    label: 'set value',
    inputs: [
      {
        name: ' ',
        valueType: 'flow',
        defaultValue: ''
      },
      {
        name: 'object',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'value',
        valueType: 'object',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'get_value_in_table',
    category: 'Action',
    label: 'get value in table',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'table',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'row',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'col',
        valueType: 'string',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'scroll_to_frame',
    category: 'Action',
    label: 'get value in table',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'frame_id',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'set_value_in_table',
    category: 'Action',
    label: 'set value in table',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'table',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'row',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'col',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'value',
        valueType: 'object',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
      }
    ]
  },
  {
    type: 'table_row_count',
    category: 'Action',
    label: 'get table row count',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'table',
        valueType: 'object',
        defaultValue: ' '
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
    type: 'table_col_count',
    category: 'Action',
    label: 'get table col count',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'table',
        valueType: 'object',
        defaultValue: ' '
      },
      {
        name: 'row_index',
        valueType: 'string',
        defaultValue: ' '
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
    type: 'code_snippet',
    category: 'Action',
    label: 'code snippet',
    inputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'code',
        valueType: 'string',
        defaultValue: ' '
      },
      {
        name: 'variables',
        valueType: 'string',
        defaultValue: ' '
      }
    ],
    outputs: [
      {
        name: ' ',
        valueType: 'flow'
      },
      {
        name: 'output',
        valueType: 'object'
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
      },
      {
        name: 'value',
        valueType: 'string',
        defaultValue: ''
      },
      {
        name: 'defaultValue',
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
    type: 'variable_object',
    category: 'Variable',
    label: 'Object Variable',
    inputs: [
      {
        name: 'name',
        valueType: 'object',
        defaultValue: ''
      },
      {
        name: 'value',
        valueType: 'object',
        defaultValue: ''
      },
      {
        name: 'defaultValue',
        valueType: 'object',
        defaultValue: ''
      }
    ],
    outputs: [
      {
        name: 'result',
        valueType: 'object'
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
