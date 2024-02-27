import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import "./SearchPopup.css";

const NewSearchPopup = ({ open, onClose, onSave, existingSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [hoursBetweenRuns, setHoursBetweenRuns] = useState(1); // Initial value

	const handleCancel = () => {
		onClose();
	};

	useEffect(() => {
		if (existingSearch) {
			setSearchTerm(existingSearch.term);
			setHoursBetweenRuns(existingSearch.hoursBetweenRuns);
		}
	}, [existingSearch]);

	const handleSave = () => {
		const newSearch = {
			id: searchTerm + "-" + hoursBetweenRuns,
			term: searchTerm,
			hoursBetweenRuns: hoursBetweenRuns,
		};

		onSave(newSearch, existingSearch);
		setSearchTerm("");
		setHoursBetweenRuns(1);
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
						/>
					</Grid>
					<Grid item>
						<TextField
							id="outlined-number"
							label="Hours Between Runs"
							type="number"
							value={hoursBetweenRuns}
							onChange={(e) =>
								setHoursBetweenRuns(parseInt(e.target.value))
							}
							min={1}
						></TextField>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default NewSearchPopup;
