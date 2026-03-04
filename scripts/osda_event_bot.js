(async () => {
    // --- CONFIGURATION ---
    const rawData = `
    65010001
    65010002
    `;

    // 'S' or 'H' only
    const STATUS = 'S';

    // Milliseconds
    const DELAY = 500;

    // --- SETUP ---
    const ids = rawData.trim().split(/\s+/).filter(Boolean); // Clean & Filter
    const form = document.querySelector('#addStaffModal form');

    if (!form) return console.error("[ERROR] Target form '#addStaffModal form' not found.");

    const { action: url, elements } = form;
    const token = elements['_token']?.value;

    if (!token) return console.error("[ERROR] CSRF token not found in the form.");

    console.log(`[INFO] Starting batch process... Total: ${ids.length} (Status: ${STATUS})`);
    console.time("Execution Time");

    const failedList = [];
    let successCount = 0;

    // --- EXECUTION ---
    for (const [index, id] of ids.entries()) {
        const prefix = `[${index + 1}/${ids.length}] ${id}`;
        
        try {
            const res = await fetch(url, { 
                method: 'POST', 
                body: new URLSearchParams({ _token: token, student_id: id, status: STATUS }),
                redirect: 'follow' 
            });
            
            const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
            const errorNode = doc.querySelector('.alert-danger ul li');
            
            if (errorNode) {
                const reason = errorNode.textContent.trim();
                console.warn(`[FAILED] ${prefix} - ${reason}`);
                failedList.push({ id, reason });
            } else {
                console.log(`[OK] ${prefix}`);
                successCount++;
            }
        } catch (error) {
            console.error(`[ERROR] ${prefix} - Network/Fetch Failed`, error);
            failedList.push({ id, reason: "Fetch Error" });
        }

        // Delay handling (skip on last item)
        if (index < ids.length - 1) await new Promise(r => setTimeout(r, DELAY));
    }

    // --- SUMMARY ---
    console.log("\n==================================");
    console.log("[SUMMARY] Process Completed");
    console.timeEnd("Execution Time");
    console.log(`Total: ${ids.length} | Success: ${successCount} | Failed: ${failedList.length}`);
    console.log("==================================\n");

    if (failedList.length > 0) {
        console.warn("[ACTION REQUIRED] Failed IDs to copy:");
        console.log(failedList.map(f => f.id).join('\n'));
        
        console.log("\n[FAILED DETAILS]");
        console.table(failedList);
    }
})();
