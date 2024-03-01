// App.js
import React, { useEffect } from "react";
import "./App.css";

import SavedSearches from "./components/SavedSearches";
import ItemFeed from "./components/ItemFeed";
import { AppProvider } from './state/AppContext';

function App() {
	useEffect(() => {
        const openLinkExternally = (event) => {
            let element = event.target;
            while (element && element.tagName !== 'A') {
                element = element.parentElement;
            }
            if (element && element.href.startsWith('http')) {
                event.preventDefault();
				console.log(element.href);
                window.electronAPI.openExternalLink(element.href);
            }
        };

		window.addEventListener("click", openLinkExternally);

		return () => {
			window.removeEventListener("click", openLinkExternally);
		};
	}, []);

	return (
		<AppProvider>
			<div className="App">
				<div>
					<SavedSearches />
				</div>
				<div className="feed">
					<ItemFeed />
				</div>
			</div>
		</AppProvider>
	);
}

export default App;
