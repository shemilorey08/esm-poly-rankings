// ==========================================
// ESM POLY RANKINGS
// SUPABASE DATABASE CONNECTION
// ==========================================

const ESM_CONFIG = {
    url: "https://bydyckdwrghoenullebg.supabase.co",
    key: "sb_publishable_KnsZ8YMlI1XgjLNWigdKMw_5DHF8vIg"
};

let esmSupabase = null;


// ==========================================
// CONNECT TO DATABASE
// ==========================================

async function connectESMDatabase() {

    const status = document.createElement("div");

    status.id = "esm-database-status";

    status.style.cssText = `
        position: fixed;
        bottom: 15px;
        right: 15px;
        z-index: 99999;
        padding: 12px 18px;
        border-radius: 6px;
        background: #192540;
        color: white;
        font-size: 13px;
        font-weight: bold;
    `;

    status.textContent = "Connecting to ESM database...";

    document.body.appendChild(status);

    try {

        if (!window.supabase) {
            throw new Error("Supabase library failed to load.");
        }

        esmSupabase = window.supabase.createClient(
            ESM_CONFIG.url,
            ESM_CONFIG.key
        );

        window.esmSupabase = esmSupabase;

        const response = await esmSupabase
            .from("states")
            .select("name")
            .limit(1);

        if (response.error) {
            throw response.error;
        }

        status.textContent = "✓ ESM Database Connected";
        status.style.background = "#167a45";

        console.log("ESM database connected successfully.");

    } catch (error) {

        status.textContent = "Database Connection Failed";
        status.style.background = "#a52a2a";

        console.error("ESM DATABASE ERROR:", error.message);
    }
}


// ==========================================
// START DATABASE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    connectESMDatabase
);
