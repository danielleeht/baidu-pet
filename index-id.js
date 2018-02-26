'use strict';

const ocr = require('./baidu_ocr/AipOcr')
const fs = require("fs")
const os = require('os')
let config;
try {
    config = require("./config.m")
} catch (e) {
    config = require("./config")
}
const prompt = require('prompt')
var Base64 = require('js-base64').Base64;
const axios = require("axios").create({
    headers: {
        'Cookie': config.cookie,
        'Host': 'pet-chain.baidu.com',
        'Origin': 'https://pet-chain.baidu.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Mobile Safari/537.36'
    }
});
var apiQueryPetsOnSale = 'https://pet-chain.baidu.com/data/market/queryPetsOnSale';
var apiQueryPetById = 'https://pet-chain.baidu.com/data/pet/queryPetById';
var apiTxnCreate = 'https://pet-chain.baidu.com/data/txn/create';
const apiGen = 'https://pet-chain.baidu.com/data/captcha/gen'
const exec = require('child_process').exec;
const time = new Date().getTime()

console.log(config)

const pr = (v) => {
    return new Promise(function(resolve, reject) {
        prompt.get(v, function(err, result) {
            if (err) reject(err)
            resolve(result)
        });
    })
}


const APP_ID = config.baidu_ocr.APP_ID
const API_KEY = config.baidu_ocr.API_KEY
const SECRET_KEY = config.baidu_ocr.SECRET_KEY
const client = new ocr(APP_ID, API_KEY, SECRET_KEY);

function requirements(pet) {
    if (config.show_affordable_message) {
        console.log("宠物价格为：", pet.amount, "，宠物等级为：", pet.rareDegree)
        console.log("你设置的对应等级购买阈值为：", config.threshold[pet.rareDegree])
    }
    if (pet.amount <= config.threshold[pet.rareDegree]) {
        if (config.show_affordable_message) console.log("买得起！")
        return true
    } else {
        if (config.show_affordable_message) console.log("买不起...")
        return false
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}



(async function() {
    let cnt = 0
    let query_time = 0;
    // while (true) {
    //     cnt++
    //     await sleep(3000)
        // console.log(`第${++query_time}次查询，第${cnt}页！`)
        try {

            const pets = await axios.post(apiQueryPetsOnSale, {
                "pageNo": 1,
                "pageSize": 5,
                "querySortType": "AMOUNT_ASC",//RAREDEGREE_DESC //CREATETIME_ASC //AMOUNT_ASC
                "petIds": ['08503657'],
                "lastAmount": null,
                "lastRareDegree": null,
                "requestId": time,
                "appId": 1,
                "tpl": ""
            })

            console.log(`第${++query_time}次查询！`)
            console.log("目前最低价：" + pets.data.data.petsOnSale[0].amount)
            if(config.reverse) pets.data.data.petsOnSale = pets.data.data.petsOnSale.reverse()
            for (let i = 0; i < pets.data.data.petsOnSale.length; i++) {

                let pet = pets.data.data.petsOnSale[i]

                // if (!requirements(pet)) {
                //     continue
                // }

                console.log(pet.id + " | " + pet.amount)
                // const yzm = await axios.post(apiGen, {
                //     "requestId": time,
                //     "appId": 1,
                //     "tpl": ""
                // })
                //
                // if(!yzm.data.data.img) continue;
                //
                // fs.writeFileSync('yzm.png', yzm.data.data.img, 'base64');
                // if (os.platform() == "darwin") exec('open yzm.png')
                // let yzm_res;
                // if (config.yzm_method == "baidu") {
                //     var image = fs.readFileSync("yzm.png").toString("base64")
                //     const path = __dirname + "/yzm.png"
                //     const yzm_baidu = await client.generalBasic(image, { language_type: "ENG" })
                //     yzm_res = yzm_baidu.words_result[0].words
                // }
                // if (config.yzm_method == "manual") {
                //     //
                //     prompt.start();
                //     const yzm_m = await pr("yzm")
                //     yzm_res = yzm_m.yzm
                // }
                //
                // if (yzm_res) {
                //
                //     const res = await axios.post(apiTxnCreate, {
                //         "validCode": pet.validCode,
                //         "seed": yzm.data.data.seed,
                //         "captcha": yzm_res,
                //         "petId": pet.petId,
                //         "requestId": time,
                //         "amount": pet.amount,
                //         "appId": 1,
                //         "tpl": ""
                //     })
                //
                //     console.log(res.data)
                //
                // }




            }
        } catch (e) {

            // console.log(e.code)
            cnt--;

        }
    // }


})()