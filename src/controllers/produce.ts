import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Produce, ProduceDocument } from "../models/Produce";
import { UserDocument } from "../models/User";


/**
 * GET /order
 * Order form page.
 */
export const getProduce = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const isAdmin = user.isAdmin || false;
    Produce.find({}, (err, produce) => {
        if (err) next(err);
        else {
            if (req.query.json) res.json(produce);
            else res.render("produce",
            {
                produce,
                isAdmin
            });
        } 
    });
};

/**
 * POST /produce
 * Add produce entries
 */
export const postProduce = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/order");
    }


    const produce = req.body as [ProduceDocument];

    Produce.insertMany(produce, (err, results) => {
        if (err) next(err);
        else {
            req.flash("success", { message: `Items ${results.map(r => r.name).join(", ")} have been added` });
            res.redirect("/produce");
        }
    });
};

export const getSingleProduce = (req: Request, res: Response, next: NextFunction) => {
    Produce.findById(req.params.produceId, (err, produce) => {
        if (err) next(err);
        else {
            res.json(produce);
        }
    });
};

export const addProduce = (req: Request, res: Response, next: NextFunction) => {
    const produce = req.body as ProduceDocument;
    produce.save((err, produce) => {
        if (err) next(err);
        else {
            req.flash("success", { message: `Successfully added ${produce.name}`});
            res.redirect("/produce");
        }
    });
};

export const updateProduce = (req: Request, res: Response, next: NextFunction) => {
    Produce.findByIdAndUpdate(req.params.produceId, 
        req.body,
        {new: true}, 
        (err, produce) => {
            if (err) next(err);
            else res.json(produce);
    });
};

export const deleteProduce = (req: Request, res: Response, next: NextFunction) => {
    Produce.findByIdAndDelete(req.params.produceId,(err, produce) => {
        if (err) next(err);
        else res.json({ message: `Successfully delete ${produce.name}` });
    });
};