import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import "./SearchConfigPopup.css";

const SearchConfigPopup = ({ open, onClose, onSave, existingSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (existingSearch) {
			setSearchTerm(existingSearch.searchTerm);
		} else{
			setSearchTerm("");
		}
	}, [existingSearch]);

    const handleSave = () => {
        const newSearch = {
			searchTerm: searchTerm,
			isActive: existingSearch ? existingSearch.isActive : true,
		};

		onSave(newSearch);

		setSearchTerm("");
		onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
			<DialogTitle>Add New Search</DialogTitle>
			<DialogContent className="dialog-content">
				<Grid container>
                <Grid item>
						<TextField
							fullWidth
							label="Search Term"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							disabled={!!existingSearch}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
								  handleSave();
								}
							  }}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
        </DialogActions>
		</Dialog>
    );
};

export default SearchConfigPopup;
