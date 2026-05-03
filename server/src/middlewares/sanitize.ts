import { Request, Response, NextFunction } from "express";

export const sanitizeInput = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (req.body?.idea) {
        req.body.idea = req.body.idea.replace(/<[^>]*>?/gm, "");
    }
    next();
};