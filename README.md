# ⚙️ KMITL UI Enhancements

> A focused collection of JavaScript snippets designed for on-the-fly execution in the browser console, aimed at tweaking and enhancing the user interface of key KMITL web services.

This repository provides **quick, client-side quality-of-life improvements** to address common usability or aesthetic issues on various KMITL platforms.

---

## 🚀 Usage Guide

These scripts are intended for power users and are executed directly in your browser's console.

1.  **Navigate to the Target Page:** Ensure you are on the specific URL/Page required by the script (check the **Target URL** column below).
2.  **Open the Browser's Developer Console:**
    * **Windows/Linux:** Press `Ctrl + Shift + I` or `F12`.
    * **macOS:** Press `Cmd + Option + I`.
3.  **Go to the `Console` tab.**
4.  **Copy & Paste:**
    * Find the desired script in the list below.
    * Click the corresponding `[View Script]` link to open the raw `.js` file.
    * Copy the *entire content* of the JavaScript file.
    * Paste it into the console and press `Enter`.
5.  **Observe:** The UI changes should take effect immediately.

---

## 🛠️ Available Scripts

Each file contains a single, self-contained JavaScript script for a specific enhancement.

| Script File | Description | Target Site | **Target URL** | Link |
| :--- | :--- | :--- | :--- | :--- |
| `group_course_sections.js` | Transforms the flat subject table into a clean, grouped list view (Accordion style), consolidating all sections under one course code. | Regis | `https://regis.reg.kmitl.ac.th/#/teach_table?*` | **[View Script: group_course_sections.js](group_course_sections.js)** |


---

## ⚠️ Disclaimer and Warning: Read Carefully!

* **Unofficial & Temporary:** These scripts are **not** supported, endorsed, or affiliated with KMITL. Changes are **only visible to you** and vanish upon page refresh or navigation.
* **Security Risk:** Running arbitrary code in your browser console is inherently risky. **NEVER** paste code from sources you do not trust. Use these scripts *at your own risk*.
* **Targeted Use Only:** Scripts are designed for specific URLs. Running a script on the wrong page may cause errors or unexpected behavior. Always verify the **Target URL** before execution.

---

## 🤝 Contribution

Contributions are highly encouraged! If you have a quick fix or an enhancement, please follow these steps:

1.  **Fork** the repository.
2.  Create a new JavaScript file (`meaningful_name.js`).
3.  Ensure your script is self-contained and ready for console execution.
4.  Include a URL check at the beginning of your script (recommended practice, see example below).
5.  Update the **Available Scripts** table in this `README.md`, including the correct **Target URL**.
6.  Submit a Pull Request!

#### Example of Recommended Safety Check within your `.js` file:
```javascript
if (!window.location.href.startsWith('https://intended.url.kmitl.ac.th/')) {
    // Optionally: console.warn('This script is intended for https://intended.url.kmitl.ac.th/'); 
    return;
}