const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const fetch = require("node-fetch");

require("dotenv").config();

let mainWindow;

let database = new Database("./database.db");
console.log("Connected to the SQLite database.");

database
	.prepare(
		`CREATE TABLE IF NOT EXISTS saved_searches (
        id TEXT PRIMARY KEY,
        search_term TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 0
    )`
	)
	.run();

database
	.prepare(
		`CREATE TABLE IF NOT EXISTS ebayItems (
        id TEXT PRIMARY KEY,
        searchTerm TEXT NOT NULL,
        itemData TEXT NOT NULL,
        seen BOOLEAN NOT NULL DEFAULT 0
    )`
	)
	.run();

const createWindow = async () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			devTools: true,
		},
		fullscreen: true,
	});

	// Dynamic import
	const isDev = (await import("electron-is-dev")).default;

	if (isDev) {
		// Development mode
		mainWindow.loadURL("http://localhost:3000");
	} else {
		// Production mode
		mainWindow.loadFile(path.join(__dirname, "client/build/index.html"));
	}
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

//IPC Main Functions Exposed to React App
ipcMain.on("open-external-link", (_event, url) => {
	console.log(url);
	shell.openExternal(url);
});

function removeEbayItemsBySearch(search) {
	try {
		const stmt = database.prepare(
			"DELETE FROM ebayItems WHERE searchTerm = ?"
		);
		stmt.run(search.searchTerm);
	} catch (err) {
		console.error(
			`Error removing items for ${search.searchTerm}:`,
			err.message
		);
	}
}

function storeEbayItems(data, searchTerm) {
	const items = data.itemSummaries || [];

	const insert = database.prepare(
		`INSERT INTO ebayItems (id, searchTerm, seen, itemData) VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET itemData = excluded.itemData`
	);

	try {
		for (const item of items) {
			insert.run(item.itemId, searchTerm, 0, JSON.stringify(item));
		}
	} catch (err) {
		console.error(
			`Error storing items for search term ${searchTerm}:`,
			err.message
		);
	}
}

ipcMain.on("get-saved-searches", (event) => {
	try {
		const rows = database.prepare("SELECT * FROM saved_searches").all();
		const savedSearches = rows.map((row) => ({
			id: row.id,
			searchTerm: row.search_term,
			isActive: Boolean(row.is_active),
		}));

		event.returnValue = savedSearches;
	} catch (err) {
		console.error(err.message);
		event.returnValue = { error: err.message };
	}
});

ipcMain.on("get-ebay-items", (event) => {
	try {
		const query = `
            SELECT ebayItems.* 
            FROM ebayItems 
            INNER JOIN saved_searches 
            ON ebayItems.searchTerm = saved_searches.search_term 
            WHERE saved_searches.is_active = 1`;

		const rows = database.prepare(query).all();
		const activeEbayItems = rows.map((row) => ({
			id: row.id,
			seen: row.seen,
			itemData: JSON.parse(row.itemData),
		}));

		event.returnValue = activeEbayItems;
	} catch (err) {
		console.error(err.message);
		event.returnValue = { error: err.message };
	}
});

ipcMain.on("set-ebay-items-seen", (event, items) => {
    try {
        let stmt = database.prepare(`UPDATE ebayItems SET seen = ? WHERE id = ?`);

        database.transaction(() => {
            items.forEach((item) => {
                stmt.run(item.seen, item.id);
            });
        })();

        event.returnValue = { success: true };
    } catch (err) {
        console.error(err.message);
        event.returnValue = { error: err.message };
    }
});

ipcMain.on("upsert-saved-search", (event, search) => {
	try {
		const hash = crypto
			.createHash("md5")
			.update(search.searchTerm)
			.digest("hex");
		let stmt = database.prepare(
			`INSERT INTO saved_searches (id, search_term, is_active) VALUES (?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET is_active = excluded.is_active`
		);
		stmt.run(hash, search.searchTerm, search.isActive ? 1 : 0);
		event.returnValue = { success: true };
	} catch (err) {
		console.error(err.message);
		event.returnValue = { error: err.message };
	}
});

ipcMain.on("delete-saved-search", (event, search) => {
	try {
		const deleteStmt = database.prepare(
			"DELETE FROM saved_searches WHERE id = ?"
		);
		deleteStmt.run(search.id);

		removeEbayItemsBySearch(search);
		event.returnValue = { success: true };
	} catch (err) {
		console.error(err.message);
		event.returnValue = { error: err.message };
	}
});

ipcMain.on("run-all-searches", (event) => {
	runAllSearchesSync((error, success) => {
		if (error) {
			event.returnValue = { success: false, error: error.message };
		} else {
			event.returnValue = { success: true };
		}
	});
});

function runAllSearchesSync(callback) {
	runAllSearches()
		.then(() => {
			callback(null, true);
		})
		.catch((error) => {
			callback(error, false);
		});
}

async function runAllSearches() {
	try {
		// Retrieve all active searches
		const activeSearches = database
			.prepare("SELECT * FROM saved_searches WHERE is_active = 1")
			.all();

		// Create an array of promises for each active search
		const searchPromises = activeSearches.map((search) =>
			fetchEbayItems(search)
		);

		// Wait for all promises to resolve
		await Promise.all(searchPromises);
		console.log("All searches have been updated.");
	} catch (error) {
		console.error("Error running all searches:", error);
	}
}

async function fetchEbayItems(search) {
	try {
		const response = await fetch(
			`https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
				search.search_term
			)}&limit=10`,
			{
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_EBAY_API_TOKEN}`,
					"X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
					"X-EBAY-C-ENDUSERCTX":
						"affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>",
				},
			}
		);

		const data = await response.json();
		storeEbayItems(data, search.search_term);
	} catch (error) {
		console.error(`Error fetching data for ${search.search_term}:`, error);
	}
}
