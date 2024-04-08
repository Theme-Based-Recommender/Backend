var express = require("express");
var router = express.Router();
const {getProductSearch} = require('../utils/scraper')
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {sendChat} = require('../utils/sendChat')

const UserRegistration = require("../models/UserRegistration");

router.post('/prompt', isAuthenticated, async(req, res)=>{
    const username = req.username
    const statement = req.body.prompt
    const param = {count:10, statement:statement}
    try {
        const result = await sendChat(param)
        console.log(result)
        const user = await UserRegistration.findOneAndUpdate({username:username}, { $push: { history:result} }, { new: true } )
        const items = result.split(',');
        console.log(items);
        const output = await getProductSearch(items[0])
        const output1 = await getProductSearch(items[1])
        const output2 = await getProductSearch(items[2])
        const arr = [];
        for(let i =0; i<output.length;i++){
            let item = output[i];
            let item1 = output1[i];
            let item2 = output2[i];
            arr.push([item, item1, item2])
        }



        console.log(arr)
        // Use Scrapper for scapping the data
        // Use Scrapper from the utils folder
        // return the data
        res.send(arr);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

router.post('/product_data', async(req, res)=>{
    const statement = req.body.prompt
    const param = {count:10, statement:statement}
    try {
        const result = await sendChat(param)
        console.log(result)
        const items = result.split(',');
        console.log(items);
        const output = await getProductSearch(items[0])
        const output1 = await getProductSearch(items[1])
        const output2 = await getProductSearch(items[2])
        const arr = [];
        
        arr.push({"name": items[0], "res" :output}, {"name": items[1], "res" :output1}, {"name": items[2], "res" :output2})

        console.log(arr)
        // Use Scrapper for scapping the data
        // Use Scrapper from the utils folder
        // return the data
        res.send(arr);
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
        <form method="POST" action="/chat/product_data">
        <input type="text" name="prompt" placeholder="prompt" />
        <input type="submit" value="Submit">
    </form>
    `)
})


module.exports = router;