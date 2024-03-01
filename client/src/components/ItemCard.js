import React from "react";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Link,
	Button,
} from "@mui/material";

const ItemCard = ({ item, setEbayItemsSeen }) => {
	const handleSeenChange = () => {
		setEbayItemsSeen([item]);
	};

	return (
		<Card
			sx={{
				maxWidth: 240,
				margin: 4,
				position: "relative",
				opacity: Boolean(item.seen) ? 0.3 : 1,
			}}
		>
			<Link
				href={item.itemData.itemWebUrl}
				target="_blank"
				rel="noopener noreferrer"
				underline="hover"
			>
				<CardMedia
					component="img"
					image={
						item.itemData.image?.imageUrl ||
						item.itemData.thumbnailImages?.[0]?.imageUrl
					}
					alt={item.itemData.title}
				/>
			</Link>
			<CardContent>
				<Link
					href={item.itemData.itemWebUrl}
					target="_blank"
					rel="noopener noreferrer"
					underline="hover"
				>
					<Typography gutterBottom variant="body3" component="div">
						{item.itemData.title}
					</Typography>
				</Link>
				<Typography variant="body2">
					Price: ${item.itemData.price.value}{" "}
					{item.itemData.price.currency} <br />
					Condition: {item.itemData.condition}
				</Typography>
				{item.itemData.shippingInfo && (
					<Typography variant="body2">
						Shipping: {item.itemData.shippingInfo}
					</Typography>
				)}
			</CardContent>
			<Button
				onClick={handleSeenChange}
				style={{
					bottom: 10,
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: Boolean(item.seen) ? "red" : "green",
					color: Boolean(item.seen) ? "white" : "white",
				}}
			>
				{Boolean(item.seen) ? "Seen" : "Unseen"}
			</Button>
		</Card>
	);
};

export default ItemCard;
