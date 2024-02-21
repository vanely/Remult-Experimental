import express from "express"
import session from 'cookie-session';
import { api } from "./api"
import { auth } from "./auth";

const app = express()
// session authentication middleware
app.use(session({
  secret: process.env["SESSION_SECRET"] || 'my secret',
}));
app.use(auth)
app.use(api)

// app.get("*", (req, res) => res.send(`api Server - path: "${req.path}"`))
app.listen(3002, () => console.log("Server started"))
