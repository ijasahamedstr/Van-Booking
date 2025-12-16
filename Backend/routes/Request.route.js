import express from "express";
import {createRequest,getAllRequests} from "../controller/RequestController.js";

const Requestrouter = express.Router();

/* ---------------- ROUTES ---------------- */
Requestrouter.post("/", createRequest);
Requestrouter.get("/", getAllRequests);

export default Requestrouter;
