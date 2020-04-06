import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Order, OrderDocument } from "../models/Order";
import { UserDocument } from "../models/User";
import { Produce } from "../models/Produce";


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

const getNextDay = (date: Date, dayofWeek: number) => {
    const resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayofWeek - date.getDay()) % 7);

    return resultDate;
};

export const getOrderForm = (req: Request, res: Response, next: NextFunction) => {
    Produce.find({}, (err, produce) => {
        if (err) next(err);
        else {
            res.render("orderForm", { produce,
            dates: [
                getNextDay(new Date(Date.now()), 6)
            ] });
        }
    });
};

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const isAdmin = user.isAdmin;
    const query = { _id: req.params.orderId } as OrderDocument;

    if (!isAdmin) query.user = user.id;
    
    console.log(query);

    Order.findOne(query, (err, order) => {
        if (err) next(err);
        else {
            console.log(order);
            res.json(order);
            // res.render("order", {
            //     title: `Order #${order.id}`,
            //     order,
            //     isAdmin
            // });
        }
    })
    .populate("items.produce");
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
    // await check("name", "Name cannot be blank").not().isEmpty().run(req);
    // await check("email", "Email is not valid").isEmail().run(req);

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/order");
    }


    const user = req.user as UserDocument;

    const order = new Order({
        user: user.id,
        collectionDate: req.body.collectionDate,
        items: req.body.items
    }) as OrderDocument;

    order.save((err) => {
        if (err) { return next(err); }
        req.flash("success", { msg: "Order was submitted successfully!" });
        res.redirect(`/order/${order.id}`);
    });
};
