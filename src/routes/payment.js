const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payments");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user")

paymentRouter.post("/payments/create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user;
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100, //500 rs
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                emailId,
                memberShipType: membershipType
            }
        })

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })
        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    const webhookSignature = req.get("X-Razorpay-Signature")
    try {
        const isWebHookValid = validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
        if (!isWebHookValid) {
            return res.status(400).json({ message: "webHook is not valid!!" });
        }
        // update status in DB
        //return success response to RazorPay

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();
        console.log(payment)

        const user = await User.findOne({ _id: payment.userId });
        console.log(user)
        user.isPremium = true;
        user.memberShipType = paymentDetails.notes.memberShipType;
        await user.save();
        // if (req.body.event === "payment.captured") {

        // }
        // if (req.body.event === "payment.failed") {

        // }

        return res.status(200).json({ msg: "Webhook Received Successfully" })

    }
    catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

paymentRouter.get("/premium/verify",userAuth, async (req,res)=>{
    const user = req.user;
    if(user.isPremium){
        return res.json({isPremium : true})
    }
    else{
        return res.json({isPremium: false})
    }
})


module.exports = paymentRouter;