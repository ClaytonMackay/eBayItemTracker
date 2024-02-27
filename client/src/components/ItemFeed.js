import ItemCard from "./ItemCard";
import "./ItemFeed.css";
import useEbaySearch from "./UseEbaySearch";

const ItemFeed = ({ activeSearchTerms }) => {
	const { items, loading, error } = useEbaySearch(activeSearchTerms);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	return (
		<div className="ebay-feed-container">
			{items.map((item) => (
				<ItemCard key={item.itemId} itemData={item} />
			))}
		</div>
	);
};

export default ItemFeed;
