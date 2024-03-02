var express = require("express");
var router = express.Router();

const { isAuthenticated } = require('../middlewares/authMiddleware');
const {sendChat} = require('../utils/sendChat')

const UserRegistration = require("../models/UserRegistration");

router.post('/prompt', isAuthenticated, async(req, res)=>{
    const username = req.username
    const statement = req.body.prompt
    const param = {count:10, statement:statement}
    try {
        const result = await sendChat(param)
        const user = await UserRegistration.findOneAndUpdate({username:username}, { $push: { history:result} }, { new: true } )
        // Use Scrapper for scapping the data
        // Use Scrapper from the utils folder
        // return the data
        res.send("sent prompt")
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})


router.get('/', isAuthenticated, async(req, res)=>{
    const username = req.username
    
    try {
        const history = await UserRegistration.findOne({username:username})
        res.status(200).json(history.history)
    } catch (error) {
        res.status(404).send({error:"Failed To fetch the history"})
    }
})

router.get("/get-chat", (req, res) => {
    res.send(`
        <form method="POST" action="/chat/prompt">
        <input type="text" name="prompt" placeholder="prompt" />
        <input type="submit" value="Submit">
    </form>
    `)
})


module.exports = router;