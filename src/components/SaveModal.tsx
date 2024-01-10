import { FC, useMemo, useRef, useState } from 'react';
import { useEdges, useNodes } from 'reactflow';
import { flowToBehave } from '../transformers/flowToBehave';
import { Modal } from './Modal';
import useGraphqlCall from '../hooks/useGraphqlCall';

export type SaveModalProps = { open?: boolean; onClose: () => void };

export const SaveModal: FC<SaveModalProps> = ({ open = false, onClose }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const edges = useEdges();
  const nodes = useNodes();

  const flow = useMemo(() => flowToBehave(nodes, edges), [nodes, edges]);

  const jsonString = JSON.stringify(flow, null, 2);

  const href = decodeURI(window.location.href).split('/');
  const figmaContextId = href[href.length - 1];

  const { data } = useGraphqlCall(figmaContextId);
  const updateData = async variables => {
    return new Promise(function (resolve, reject) {
      // Define the GraphQL query and variables
      const query = `
            mutation ($id: Int!, $data: json) {
              update_other_generic_data_by_pk(pk_columns: {id: $id}, _set: {data: $data}) {
                id
              }
            }
        `;

      // HASURA_ADMIN_SECRET
      // Fetch data from the GraphQL API
      fetch('https://qa.graphql.sets.hmwrk.app/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_ADMIN_SECRET1
        },
        body: JSON.stringify({ query: query, variables })
      }).then(response => {
        resolve(true);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      });
    });
  };

  const onExport = async () => {
    const figmaJson = JSON.parse(data.other_generic_data[0]?.data);
    figmaJson.behaveGraph = JSON.parse(jsonString);
    await updateData({ id: data.other_generic_data[0].id, data: JSON.stringify(figmaJson) });
    onClose();
  };

  const handleCopy = () => {
    ref.current?.select();
    document.execCommand('copy');
    ref.current?.blur();
    setCopied(true);
    setInterval(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Modal
      title="Save Graph"
      actions={[
        { label: 'Cancel', onClick: onClose },
        { label: copied ? 'Copied' : 'Copy', onClick: handleCopy }
      ]}
      open={open}
      onClose={onClose}
    >
      <textarea ref={ref} className="border border-gray-300 w-full p-2 h-32" defaultValue={jsonString}></textarea>
      {figmaContextId && (
        <button className={'mt-2 border border-black p-2 w-full cursor-pointer'} onClick={onExport}>
          Export
        </button>
      )}
    </Modal>
  );
};
