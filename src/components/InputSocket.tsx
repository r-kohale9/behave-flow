import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Connection, Handle, Position, useReactFlow } from "reactflow";
import cx from "classnames";
import { colors, valueTypeColorMap } from "../util/colors";
import { InputSocketSpecJSON } from "behave-graph";
import { isValidConnection } from "../util/isValidConnection";
import { AutoSizeInput } from "./AutoSizeInput";
import { AutoSizeTextarea } from "./AutoSizeTextarea";

export type InputSocketProps = {
  connected: boolean;
  value: any | undefined;
  type: string;
  onChange: (key: string, value: any) => void;
} & InputSocketSpecJSON;

export default function InputSocket({
  connected,
  value,
  onChange,
  name,
  valueType,
  defaultValue,
  type
}: InputSocketProps) {
  const instance = useReactFlow();
  const isFlowSocket = valueType === "flow";

  let colorName = valueTypeColorMap[valueType];
  if (colorName === undefined) {
    colorName = "red";
  }

  const [backgroundColor, borderColor] = colors[colorName];
  const showName = isFlowSocket === false || name !== "flow";

  return (
    <div className="flex grow items-center justify-start h-auto">
      {isFlowSocket && (
        <FontAwesomeIcon icon={faCaretRight} color="#ffffff" size="lg" />
      )}
      {showName && <div className="capitalize mr-2">{name}</div>}
      {isFlowSocket === false && connected === false && (
        <>
          {(valueType === "string" || type === "string") && (
            <AutoSizeInput
              type="text"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "textarea" || type === "textarea") && (
            <AutoSizeTextarea
              type="textarea"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "object" || type === "object") && (
            <AutoSizeInput
              type="text"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "number" || type === "number") && (
            <AutoSizeInput
              type="number"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "float" || type === "float") && (
            <AutoSizeInput
              type="number"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "integer" || type === "integer") && (
            <AutoSizeInput
              type="number"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
          )}
          {(valueType === "boolean" || type === "boolean") && (
            <input
              type="checkbox"
              className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
              value={String(value) ?? String(defaultValue) ?? ""}
              onChange={(e) => onChange(name, e.currentTarget.checked)}
            />
          )}
        </>
      )}
      <Handle
        id={name}
        type="target"
        position={Position.Left}
        className={cx(borderColor, connected ? backgroundColor : "bg-gray-800")}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance)
        }
      />
    </div>
  );
}
