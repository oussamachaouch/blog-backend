const subscriber = require('../models/subscribersModel');
var SibApiV3Sdk = require('sib-api-v3-sdk');
const crypto = require('crypto');


const getSubscribers = (req,res) => {
    subscriber.find()
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        res.status(404).send("Subscribers not found");
    })
}

const getSubscriberById = (req,res) => {
    const id = req.params.id;
    subscriber.findById(id)
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        res.status(404).send("Subscriber not found");
    })
}

const addSubscriber = async (req,res) => {
   try{ 
        const { email } = req.body;

        // 1. Validate email format
        const validEmail = /\S+@\S+\.\S+/.test(email);
        if(!validEmail){
            return res.status(400).send("Invalid email format");
        }

        // 2. Check if already exists in MongoDB
        let existing = await subscriber.findOne({ email });
        if (existing) {
        return res.status(400).json("Email already exists");
        }

        // Generate unsubscribe token
        const unsubscribeToken = crypto.randomBytes(16).toString('hex');

        // 3. Add to MongoDB
        subscriber.create({ email, status: "subscribed", unsubscribeToken });
        
        // 4. Add to Brevo list
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
        const client = new SibApiV3Sdk.ContactsApi();
        const createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = email;
        createContact.listIds = [4];
        await client.createContact(createContact);
        return res.status(200).send("Subscription successful");
    }catch(error){
        console.error("Subscription error:", error.response?.body || error);
        return res.status(400).send("Email already exists or invalid");
    }
}

const updateSubscriber = async (req,res) => {
    const id = req.params.id;
    try {
        await subscriber.findByIdAndUpdate(id,req.body)
       const result = await subscriber.findById(id);
       return res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send("Error updating subscriber");
    }
}

const unsubscribe = async (req,res) => {
   try{ 
    const { token } = req.params;
    // 1. Check if subscriber exists
    const subscriberResult = await subscriber.findOne({ unsubscribeToken: token });
    if (!subscriberResult) {
      return res.status(404).json("Email not found in database.");
    }
    

    // 2. Update status in Mongo
    subscriberResult.status = "unsubscribed";
    subscriberResult.unsubscribedAt = new Date();
    await subscriberResult.save();


    // 3. Remove from Brevo list
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    const client = new SibApiV3Sdk.ContactsApi();
    await client.deleteContact(subscriberResult.email);
    return res.status(200).send("Unsubscribed successful");

    }catch(error){
        console.error("Unsubscribe error:", error.response?.body || error);
        res.status(400).send("Error deleting subscriber");
    }
}

module.exports = {
    getSubscribers,
    getSubscriberById,
    addSubscriber,
    updateSubscriber,
    unsubscribe
}