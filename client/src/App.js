import React, { useState } from "react";
import "./App.css";

import SavedSearches from "./components/SavedSearches";
import ItemFeed from "./components/ItemFeed";

function App() {
	const [activeSearchTerms, setActiveSearchTerms] = useState([]);

	return (
		<div className="App">
			<div>
				<SavedSearches
					activeSearchTerms={activeSearchTerms}
					setActiveSearchTerms={setActiveSearchTerms}
				/>
			</div>
			<div className="feed">
				<ItemFeed activeSearchTerms={activeSearchTerms} />
			</div>
		</div>
	);
}

export default App;
