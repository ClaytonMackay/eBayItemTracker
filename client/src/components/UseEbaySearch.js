import { useState, useEffect } from "react";

const useEbaySearch = (activeSearchTerms) => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!activeSearchTerms || activeSearchTerms.length === 0) {
			console.log("No search terms provided");
			setItems([]);
			return;
		}

		const handleResponse = (event, response) => {
			if (response.error) {
				setError(response.error);
			} else {
				console.log(`ItemIds for term: ` + response.itemSummaries.map((summary) => summary.itemId).join(", "));
				setItems((prevItems) => {
					const prevItemIds = new Set(
						prevItems.map((item) => item.itemId)
					);
					const newItems = response.itemSummaries || [];
					const filteredNewItems = newItems.filter(
						(newItem) => !prevItemIds.has(newItem.itemId)
					);
					return [...prevItems, ...filteredNewItems];
				});
			}
			setLoading(false);
		};

		setLoading(true);
		window.electronAPI.onFetchItemsResponse(handleResponse);

		activeSearchTerms.forEach((searchTerm) => {
			window.electronAPI.fetchItems(searchTerm.term);
		});

		// Cleanup
		return () => {
			window.electronAPI.removeFetchItemsResponseListener();
		};
	}, [activeSearchTerms]); // Depend on activeSearchTerms

	return { items, loading, error };
};

export default useEbaySearch;
