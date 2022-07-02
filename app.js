const express = require("express");
const https = require("https");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { rmSync } = require("fs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mailchimp.setConfig({
    apiKey: "a523c021dbca39d8076eb4ffb9618b870-us8",
    server: "us8",
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const listId = "b281ca57e5";
    const subscribingUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName,
                },
            });

            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});
