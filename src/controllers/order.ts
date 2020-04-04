import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Order, OrderDocument } from "../models/Order";
import { UserDocument } from "../models/User";


/**
 * GET /order
 * Order form page.
 */
export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    Order.find({}, (err, orders) => {
        if (err) next(err);
        else {
            res.render("orders", {
                title: "Orders",
                orders
            });
        }
    });
};

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const isAdmin = user.isAdmin;
    const query = { id: req.params.orderId } as OrderDocument;
    if (!isAdmin) {
        query.user = user;
    }
    Order.findOne(query, (err, order) => {
        if (err) next(err);
        else {
            res.render("order", {
                title: `Order #${order.id}`,
                order,
                isAdmin
            });
        }
    });
};

export const updateOrder = (req: Request, res: Response, next: NextFunction) => {
    Order.findByIdAndRemove(req.params.orderId, (err, order) => {
        if (err) next(err);
        else {
            req.flash(`Update order #${req.params.orderId} successful!`);
            res.redirect(`/order/${order.id}`);
        }
    });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    await check("name", "Name cannot be blank").not().isEmpty().run(req);
    await check("email", "Email is not valid").isEmail().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/order");
    }

    const order = new Order({
        user: req.user,
        items: req.body.items,
        collectionDate: req.body.collectionDate
    });

    order.save((err) => {
        if (err) { return next(err); }
        req.flash("success", { msg: "Order was submitted successfully!" });
        res.redirect(`/order/${order.id}`);
    });
};
