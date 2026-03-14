# 🛡️ Defensive Prompt Template (Lomda Architecture)

This template is designed to force AI code agents to write production-ready, distributed-safe code. 
Copy the structure below and fill in the bracketed `[ ]` areas before sending your prompt.

---

**1. System Context**
The code will run in a Node.js backend for the Lomda microservices architecture.
- State and sessions are managed exclusively via a centralized Redis cluster (No In-Memory local state).
- The primary database is a relational SQL database.
- The service runs on multiple instances behind a Load Balancer.

**2. The Task**
Write an async function that:
[תאר כאן את הפונקציונליות הנדרשת: מה הפונקציה צריכה לעשות, אילו פרמטרים היא מקבלת ומה היא מחזירה. תאר את הלוגיקה העסקית בדיוק כפי שהיית מבקש בדרך כלל].

**3. Strict Constraints (Boundaries)**
- **Security:** [הגדר אילוצי אבטחה. למשל: "אל תקבל adminId כפרמטר, אלא חלץ אותו מתוך req.user" או "בצע Sanitization לכל קלט טקסט"].
- **Data Integrity:** [הגדר אילוצי נתונים. למשל: "חובה לעטוף כל כתיבה ליותר מטבלה אחת בתוך DB Transaction עם Rollback מלא"].
- **Architecture:** [הגדר איסורים. למשל: "אסור לפנות ישירות ל-Database של שירות אחר. השתמש רק ב-API הפנימי"].

**4. Error Handling & Sad Path**
Do not write optimistic code. You must assume failures:
- **Network:** [למשל: "הנח ששירות המיילים יפול. עטוף אותו ב-Try/Catch נפרד עם Timeout של 3000ms"].
- **Resilience:** [למשל: "אם הקריאה נכשלת, רשום ל-Logger המרכזי, אל תקריס את הפונקציה, והחזר הודעת אזהרה למשתמש"].