
const { subDays, startOfDay, endOfDay } = require('date-fns');
const cron = require('node-cron');
const connectionRequestModel = require('../models/connectionRequest');
const sendEmail = require("./sendEmail")

// This job will run 8 am in morning everyday
cron.schedule("0 8 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1)
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequests = await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New Friend Request pending for "+  email , "Please login to portal to accept or reject");
            }
            catch(err){
                console.error(err)
            }

        }

    }
    catch (err) {
        console.error(err)
    }

})