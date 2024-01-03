import { NodeProps as FlowNodeProps, useEdges } from "reactflow";
import { NodeSpecJSON } from "behave-graph";
import InputSocket from "./InputSocket";
import NodeContainer from "./NodeContainer";
import OutputSocket from "./OutputSocket";
import { useChangeNodeData } from "../hooks/useChangeNodeData";
import { isHandleConnected } from "../util/isHandleConnected";
import { useEffect, useState } from "react";

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
};

const getPairs = <T, U>(arr1: T[], arr2: U[]) => {
  const max = Math.max(arr1.length, arr2.length);
  const pairs = [];
  for (let i = 0; i < max; i++) {
    const pair: [T | undefined, U | undefined] = [arr1[i], arr2[i]];
    pairs.push(pair);
  }
  return pairs;
};

export const Node = ({ id, data, spec, selected }: NodeProps) => {
  let count = 0
  let first = null
  const [pairs, setpairs] = useState([]);
  useEffect(() => {
    if (first !== data['variables']) {
      count = 0
    }
    if (count === 0) {
      if (spec.type == "code_snippet" && data['variables'] && !isNaN(data['variables']) && Number(data['variables']) > 0) {
        spec.inputs = spec.inputs.filter(input => !input.name
          .includes('variable') || input.name === "variables")
        for (let i = 0; i < Number(data['variables']); i++) {
          spec.inputs.push(
            { name: `variable${i + 1}`, valueType: 'string', defaultValue: ' ' })
        }
      }
      count++
      first = data['variables']
      setpairs(getPairs(spec.inputs, spec.outputs))
    }
  }, [data['variables']]);
  const edges = useEdges();
  const handleChange = useChangeNodeData(id);

  return (
    <NodeContainer
      title={spec.label}
      category={spec.category}
      selected={selected}
    >
      {pairs.map(([input, output], ix) => (
        <div
          key={ix}
          className="flex flex-row justify-between gap-8 relative px-2"
        >
          {input && (
            <InputSocket
              {...input}
              value={data[input.name] ?? input.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, input.name, "target")}
            />
          )}
          {output && (
            <OutputSocket
              {...output}
              connected={isHandleConnected(edges, id, output.name, "source")}
            />
          )}
        </div>
      ))}
    </NodeContainer>
  );
};
