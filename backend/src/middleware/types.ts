import { Request } from "express";
import { User } from "../user/types";

// Define a new interface that extends the existing Request interface
export interface RequestWithUser extends Request {
  user?: User;
}

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
