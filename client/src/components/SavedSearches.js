import React, { useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SearchConfigPopup from "./SearchConfigPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAppContext } from "../state/AppContext";
import { green, grey } from "@mui/material/colors";

import "./SavedSearches.css";

const SavedSearches = () => {
	const {
		savedSearches,
		upsertSavedSearch,
		deleteSavedSearch,
		runAllSearches
	} = useAppContext();

	const [existingSearch, setExistingSearch] = useState(null);
	const [termToDelete, setTermToDelete] = useState(null);

	const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
	const [showSearchPopup, setShowSearchPopup] = useState(false);

	const toggleActiveSearch = (event, existingSearch) => {
		event.stopPropagation();

		existingSearch.isActive = !existingSearch.isActive;

		upsertSavedSearch(existingSearch);
	};

	const handleSaveSearch = (savedSearch) => {
		upsertSavedSearch(savedSearch);
	};

	const handleEdit = (event, search) => {
		event.stopPropagation();
		setExistingSearch(search);
		setShowSearchPopup(true);
	};

	const handleDeleteClick = (event, search) => {
		event.stopPropagation();
		setTermToDelete(search);
		setShowConfirmationPopup(true);
	};

	const handleConfirmDelete = (savedSearch) => {
		deleteSavedSearch(savedSearch);
		setTermToDelete(null);
		setShowConfirmationPopup(false);
	};

	const handleCancelDelete = () => {
		setTermToDelete(null);
		setShowConfirmationPopup(false);
	};

	const onCloseSearchPopup = () => {
		setShowSearchPopup(false);
		setExistingSearch("");
	}

	return (
		<div className="SavedSearches">
			<div className="runAllSearchesButton">
				<Button
					variant="contained"
					startIcon={<SearchIcon />}
					onClick={runAllSearches}
				>
					Run Searches
				</Button>
			</div>
			<div className="addSearchButton">
				<Button
					style={{ backgroundColor: 'green', color: 'white' }}
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setShowSearchPopup(true)}
				>
					Add Search
				</Button>
			</div>
			<SearchConfigPopup
				open={showSearchPopup}
				onClose={onCloseSearchPopup}
				onSave={handleSaveSearch}
				existingSearch={existingSearch}
			/>
			<Divider className="thickDivider" />
			{termToDelete && (
				<ConfirmationDialog
					open={showConfirmationPopup}
					onClose={handleCancelDelete}
					onConfirm={handleConfirmDelete}
					message="Are you sure you want to delete this search?"
					subject={termToDelete}
				/>
			)}
			<List>
				{savedSearches.map((search) => (
					<ListItem
						className="SavedSearch"
						key={search.id}
						disablePadding
					>
						<ListItemButton>
							<ListItemText
								primary={search.searchTerm}
							/>
							<IconButton
								onClick={(event) =>
									toggleActiveSearch(event, search)
								}
								edge="end"
							>
								<CheckCircleOutlineIcon
									style={{
										color: search.isActive
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
