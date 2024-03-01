import React from 'react';
import ItemCard from "./ItemCard";
import "./ItemFeed.css";
import { useAppContext } from '../state/AppContext';

const ItemFeed = () => {
    const { ebayItems, setEbayItemsSeen} = useAppContext();
    
    return (
        <div className="ebay-feed-container">
            {ebayItems.map((item) => (
                <ItemCard key={item.id} item={item} setEbayItemsSeen={setEbayItemsSeen} />
                ))}
        </div>
    );
};

export default ItemFeed;