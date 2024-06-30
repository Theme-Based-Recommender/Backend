var express = require("express");
var router = express.Router();
const {getProductSearch} = require('../utils/scraper')
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {sendChat} = require('../utils/sendChat')
const {getAmazonProductSearch} = require('../utils/googleScraper')
const {query} = require("../utils/chatLlama")

const UserRegistration = require("../models/UserRegistration");
// const defResult = ['laptop', 'smartphone', 'headphones']
router.post('/prompt', async(req, res)=>{
    // const username = req.username
    const statement = req.body.prompt
    const param = {count:10, statement:statement}
    try {
        const result = await sendChat(param)
        // const result = await query({"inputs": `List 4 single word product names as list that could be relevant for: ${statement}`})
        // console.log(result)
        // //const user = await UserRegistration.findOneAndUpdate({username:username}, { $push: { history:result} }, { new: true } )
        // const items = result
        const output = await getAmazonProductSearch(result)
        console.log(output);
            
        res.send(output);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

router.post('/scraper', async(req, res)=>{
    // const username = req.username
    const statement = req.body.prompt
    const param = {count:10, statement:statement}
    try {
        const result = await sendChat(param)
        console.log(result)
        //const user = await UserRegistration.findOneAndUpdate({username:username}, { $push: { history:result} }, { new: true } )
        const items = result.split(',');
        console.log(items);
        const output = await getProductSearch(items[0])
        const output1 = await getProductSearch(items[1])
        const output2 = await getProductSearch(items[2])
        const output3 = await getProductSearch(items[3])
        const arr = {};
        const bundleArr = []
        for(let i =0; i<output.length;i++){
            
            let item = output[i];
            let item1 = output1[i];
            let item2 = output2[i];
            let item3 = output3[i];
            bundleArr.push([item, item1, item2, item3])
            
        }
        arr.bundles=bundleArr
        arr.products = [{"name": items[0], "res" :output}, {"name": items[1], "res" :output1}, {"name": items[2], "res" :output2}, {"name": items[3], "res" :output3}]

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
        <form method="POST" action="/chat/prompt">
        <input type="text" name="prompt" placeholder="prompt" />
        <input type="submit" value="Submit">
    </form>
    `)
})


module.exports = router;