const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto')

require("dotenv").config();

let mainWindow;

let savedSearchDb = new sqlite3.Database('./savedSearches.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the saved searches SQLite database.');
});

let ebayItemsDb = new sqlite3.Database('./ebayItems.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the ebay items SQLite database.');
});

// Create table for SavedSearches
savedSearchDb.run(`CREATE TABLE IF NOT EXISTS saved_searches (
    id INTEGER PRIMARY KEY,
    search_term TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 0
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Create table for ebayItems
savedSearchDb.run(`CREATE TABLE IF NOT EXISTS ebayItems (
    id INTEGER PRIMARY KEY,
    item TEXT NOT NULL,
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

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

//IPC Main Functions Exposed to Electron App
ipcMain.on("fetch-items", async (event, searchTerm) => {
	try {
		const response = await fetch(
			`https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
				searchTerm
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
		event.reply("fetch-items-response", data);
	} catch (error) {
		console.error(error);
		event.reply("fetch-items-response", { error: error.message });
	}
});

ipcMain.on('add-saved-search', (event, { searchTerm, frequency }) => {
    db.run(`INSERT INTO saved_searches (search_term, frequency) VALUES (?, ?)`, [searchTerm, frequency], function(err) {
        if (err) {
            return console.error(err.message);
        }
        // You can use this.lastID to get the id of the inserted row
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});