import { NodeSpecJSON } from 'behave-graph';

export const colors: Record<string, [string, string, string]> = {
  red: ['bg-orange-700', 'border-orange-700', 'text-white'],
  green: ['bg-green-600', 'border-green-600', 'text-white'],
  lime: ['bg-lime-500', 'border-lime-500', 'text-white'],
  purple: ['bg-purple-500', 'border-purple-500', 'text-white'],
  blue: ['bg-cyan-600', 'border-cyan-600', 'text-white'],
  gray: ['bg-gray-500', 'border-gray-500', 'text-white'],
  white: ['bg-white', 'border-white', 'text-gray-700'],
  yellow: ['bg-yellow', 'border-yellow-500', 'text-gray-700']
};

export const valueTypeColorMap: Record<string, string> = {
  flow: 'white',
  number: 'green',
  float: 'green',
  integer: 'lime',
  boolean: 'red',
  string: 'purple',
  object: 'yellow',
  textarea: 'blue'
};

export const categoryColorMap: Record<NodeSpecJSON['category'], string> = {
  Event: 'red',
  Logic: 'green',
  Variable: 'purple',
  Query: 'purple',
  Action: 'blue',
  Flow: 'gray',
  Time: 'gray',
  None: 'gray'
};
