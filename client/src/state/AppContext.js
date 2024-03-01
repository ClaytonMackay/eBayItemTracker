import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
	const [savedSearches, setSavedSearches] = useState([]);
	const [ebayItems, setEbayItems] = useState([]);

	useEffect(() => {
		getEbayItems();
		getSavedSearches();
	}, []);

	const getEbayItems = () => {
		console.log("Getting eBay items");
		try {
			const response = window.electronAPI.getEbayItems();
			if (response.error) {
				console.error(new Error(response.error));
			} else {
				setEbayItems(response);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getSavedSearches = () => {
		console.log("Getting saved searches");
		try {
			const response = window.electronAPI.getSavedSearches();
			if (response.error) {
				console.error(new Error(response.error));
			} else {
				console.log("Received response: " + JSON.stringify(response));
				setSavedSearches(response);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const upsertSavedSearch = (savedSearch) => {
		try {
			const response = window.electronAPI.upsertSavedSearch(savedSearch);
			if (response.error) {
				console.error(new Error(response.error));
			} else {
				console.log("Returned from addSavedSearch");
				getSavedSearches();
				getEbayItems();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const deleteSavedSearch = (savedSearch) => {
		try {
			const response = window.electronAPI.deleteSavedSearch(savedSearch);
			if (response.error) {
				console.error(new Error(response.error));
			} else {
				console.log("Returned from deleteSavedSearch");
				getSavedSearches();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const runAllSearches = () => {
		try {
			const response = window.electronAPI.runAllSearches();
			if (response.success) {
				console.log("All searches were successfully run.");
				getEbayItems();
			} else {
				console.error("Error running searches:", response.error);
			}
		} catch (err) {
			console.error("IPC Error:", err);
		}
	};

	const setEbayItemsSeen = (items) => {
		const newItems = items.map((item) => {
			return { ...item, seen: !item.seen ? 1 : 0};
		});

		console.log("items: " + JSON.stringify(newItems))

		try {
			const response = window.electronAPI.setEbayItemsSeen(newItems);
			if (response.success) {
				console.log("All items set");
				getEbayItems();
			} else {
				console.error("Error running searches:", response.error);
			}
		} catch (err) {
			console.error("IPC Error:", err);
		}
	};

	return (
		<AppContext.Provider
			value={{
				savedSearches,
				ebayItems,
				upsertSavedSearch,
				deleteSavedSearch,
				runAllSearches,
				setEbayItemsSeen,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
