import userService from "@services/user-service";
import StatusCodes from "http-status-codes";
import JSONBigInt from "json-bigint";
import {Request, Response, Router} from "express";

const {CREATED, OK} = StatusCodes;

const getAllUser = async (_: Request, res: Response) => {
	const users = await userService.getAll();
	return res
		.status(OK)
		.json({users: JSONBigInt.parse(JSONBigInt.stringify(users))});
};
export default {
	getAllUser,
} as const;
