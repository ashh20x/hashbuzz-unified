import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";


// Paths
export const p = {
	get: "/all",
	add: "/add",
	update: "/update",
	delete: "/delete/:id",
} as const;