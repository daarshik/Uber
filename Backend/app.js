const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);

module.exports = app;

// In Short:
// Click → React triggers a fetch()

// Browser checks CORS (is it safe to request another server?)

// Backend replies: "Yes, you're allowed."

// Actual request sent

// Backend processes it

// Frontend receives data and uses it in UI

// What is CORS?
// By default, browsers follow the same-origin policy.

// This means:

// A webpage (frontend) can only make requests to the same origin it was loaded from.

// "Origin" = protocol + domain + port

// For example:

// Frontend: http://localhost:3000

// Backend: http://localhost:5000

// Even though both are running on localhost, the ports are different (3000 ≠ 5000), so the browser considers them different origins.

// Problem Without CORS:
// If your frontend (React at port 3000) tries to make an API call to your backend (5000), you get an error like:

// csharp
// Copy
// Edit
// Access to fetch at 'http://localhost:5000/api' from origin 'http://localhost:3000' has been blocked by CORS policy...

// What’s Actually Happening Behind the Scenes?
// When a cross-origin request is made, the browser sends a CORS preflight request (an OPTIONS request) to your backend.

// If your backend responds with appropriate CORS headers, like:

// http
// Copy
// Edit
// Access-Control-Allow-Origin: http://localhost:3000
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// ...then the actual request is allowed.

// The cors middleware automatically handles all this for you.

// Why webpages can only request from same origin by default
// 🔐 It's all about security — protecting users
// Imagine this:

// You're logged into your bank account at https://mybank.com

// You visit a malicious website like https://evil.com

// That website has JavaScript trying to do this:

// js
// Copy
// Edit
// fetch("https://mybank.com/transfer?to=hacker&amount=10000");
// If cross-origin requests were allowed by default, that malicious site could:

// Send requests to your bank using your session cookies

// Access your private data

// Trick you into doing things without your knowledge

// ✅ Same-Origin Policy (SOP) prevents this
// So browsers enforce a rule called the Same-Origin Policy:

// A web page can only make requests to the same origin it was loaded from — meaning the same protocol, host, and port.
// CORS is a way for servers to safely allow certain cross-origin requests while keeping the same-origin policy in place.

// First, what are session cookies?
// When you log in to a site (like your bank), the server gives your browser a session cookie, something like:

// http
// Copy
// Edit
// Set-Cookie: session_id=abc123; HttpOnly; Secure
// Your browser saves it and automatically includes it in every request to that domain:

// http
// Copy
// Edit
// GET /dashboard HTTP/1.1
// Host: mybank.com
// Cookie: session_id=abc123
// 🔒 This cookie proves you're logged in.

// ⚠️ Now imagine...
// You're logged in to your bank (https://mybank.com), and you visit a shady website (https://evil.com). That site has malicious JavaScript like this:

// js
// Copy
// Edit
// fetch("https://mybank.com/transfer?to=hacker&amount=10000");
// Here's the dangerous part:
// The browser automatically attaches your cookies to that request — including session_id=abc123.

// So from the server’s perspective, it’s you making the request.

// 😱 Even though you never clicked "send ₹10,000," the hacker’s script tricked your browser into doing it.

// 😌 This is exactly what Same-Origin Policy prevents.
// By default, browsers block https://evil.com from making requests to https://mybank.com, even though the browser has your session cookie.

// ✅ Unless the server uses CORS to allow it (which banks never do), the request is blocked by the browser.

// 🛡 That's why SOP + CORS = Security & Flexibility
// SOP = Safety net → Protects your cookies and login sessions

// CORS = Controlled override → For dev/API scenarios, not sensitive sites
