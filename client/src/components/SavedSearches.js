import React, { useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SearchPopup from "./SearchPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfirmationDialog from "./ConfirmationDialog";

import { green, grey } from "@mui/material/colors";
import "./SavedSearches.css";

const SavedSearches = ({ activeSearchTerms, setActiveSearchTerms }) => {
	const [savedSearches, setSavedSearches] = useState([]);
	const [showSearchPopup, setShowSearchPopup] = useState(false);
	const [existingSearch, setExistingSearch] = useState(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [searchToDelete, setSearchToDelete] = useState(null);

	const toggleActiveSearch = (event, search) => {
		event.stopPropagation();
		console.log(
			"Current search terms: " + activeSearchTerms.map((term) => term.id)
		);
		if (activeSearchTerms.includes(search)) {
			setActiveSearchTerms(
				activeSearchTerms.filter(
					(existingSearch) => existingSearch.id !== search.id
				)
			);
		} else {
			setActiveSearchTerms([...activeSearchTerms, search]);
		}
	};

	const handleEdit = (event, search) => {
		event.stopPropagation();
		setExistingSearch(search);
		setShowSearchPopup(true);
	};

	const handleDeleteClick = (event, search) => {
		event.stopPropagation();
		setSearchToDelete(search);
		setDeleteConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		setSavedSearches(
			savedSearches.filter((search) => search.id !== searchToDelete.id)
		);
		setActiveSearchTerms(
			activeSearchTerms.filter(
				(search) => search.id !== searchToDelete.id
			)
		);
		setDeleteConfirmOpen(false);
		setSearchToDelete(null);
	};

	const handleCancelDelete = () => {
		setDeleteConfirmOpen(false);
		setSearchToDelete(null);
	};

	const handleSaveSearch = (newSearch, existingSearch) => {
		console.log("New Term: " + JSON.stringify(newSearch));
		console.log("Existing Term: " + JSON.stringify(existingSearch));
		if (!existingSearch) {
			// This is a new search if the existingSearch was set to
			setSavedSearches([...savedSearches, newSearch]);
		} else if (newSearch.id !== existingSearch.id) {
			// This is an existing search that was edited, remove the existing from active/total search terms
			setSavedSearches(
				savedSearches.filter(
					(search) => search.id !== existingSearch.id
				)
			);
			setActiveSearchTerms(
				activeSearchTerms.filter(
					(search) => search.id !== existingSearch.id
				)
			);
			setSavedSearches([newSearch]);
		}
		setExistingSearch(null);
		setShowSearchPopup(false);
	};

	return (
		<div className="SavedSearches">
			<div className="addSearchButton">
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setShowSearchPopup(true)}
				>
					Add Search
				</Button>
			</div>
			<SearchPopup
				open={showSearchPopup}
				onClose={() => setShowSearchPopup(false)}
				onSave={handleSaveSearch}
				existingSearch={existingSearch}
			/>
			<Divider className="thickDivider"/>
			<ConfirmationDialog
				open={deleteConfirmOpen}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				message="Are you sure you want to delete this search?"
			/>
			<List>
				{savedSearches.map((search) => (
					<ListItem
						className="SavedSearch"
						key={search.id}
						disablePadding
					>
						<ListItemButton>
							<ListItemText
								primary={search.term}
								secondary={
									"Every " +
									search.hoursBetweenRuns +
									" hour(s)"
								}
							/>
							<IconButton
								onClick={(event) =>
									toggleActiveSearch(event, search)
								}
								edge="end"
							>
								<CheckCircleOutlineIcon
									style={{
										color: activeSearchTerms.includes(
											search
										)
											? green[500]
											: grey[500],
									}}
								/>
							</IconButton>
							<IconButton
								onClick={(event) => handleEdit(event, search)}
								edge="end"
							>
								<EditIcon />
							</IconButton>
							<IconButton
								onClick={(event) =>
									handleDeleteClick(event, search)
								}
								edge="end"
							>
								<DeleteIcon />
							</IconButton>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default SavedSearches;
