// src/useFigmaData.js
import { useState, useEffect } from "react";

function useGraphqlCall(figma_context_id) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	useEffect(() => {
		// If figma_context_id is null, return null data
		if (figma_context_id === null) {
			setData(null);
			setLoading(false);
			return;
		}

		// Define the GraphQL query and variables
		const query = `
            query ($figmaContextId: String!) {
                other_generic_data(where: {context_id: {_eq: $figmaContextId}}) {
									id
                data
                context_id
                }
            }
        `;
		const variables = {
			figmaContextId: figma_context_id,
		};

		// HASURA_ADMIN_SECRET

		// Fetch data from the GraphQL API
		fetch("https://qa.graphql.sets.hmwrk.app/v1/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET1,
			},
			body: JSON.stringify({ query, variables }),
		})
			.then((response) => {
				if (response.ok) {

					return response.json();
				} else {
					throw new Error("Network response was not ok.");
				}
			})
			.then((result) => {
				if (result.data) {
					setLoading(false);
					setData(result.data);
				}
			})
			.catch((error) => {
				setError(error);
				setLoading(false);
			});
	}, [figma_context_id]);

	return { loading, error, data };
}

export default useGraphqlCall;
