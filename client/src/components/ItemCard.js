import React from "react";
import { Card, CardMedia, CardContent, Typography, Link } from "@mui/material";

const ItemCard = ({ itemData }) => {
	return (
		<Card sx={{ maxWidth: 240, margin: 4 }}>
			<Link
				href={itemData.itemUrl}
				target="_blank"
				rel="noopener noreferrer"
				underline="hover"
			>
				<CardMedia
					component="img"
					image={
						itemData.image?.imageUrl ||
						itemData.thumbnailImages?.[0]?.imageUrl
					}
					alt={itemData.title}
				/>
			</Link>
			<CardContent>
				<Link
					href={itemData.itemUrl}
					target="_blank"
					rel="noopener noreferrer"
					underline="hover"
				>
					<Typography gutterBottom variant="body3" component="div">
						{itemData.title}
					</Typography>
				</Link>
				<Typography variant="body2">
					Price: ${itemData.price.value} {itemData.price.currency}{" "}
					<br />
					Condition: {itemData.condition}
				</Typography>
				{itemData.shippingInfo && (
					<Typography variant="body2">
						Shipping: {itemData.shippingInfo}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default ItemCard;
