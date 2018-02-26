module.exports = {
    cookie: "",
    baidu_ocr: { // 百度开放平台ocr
        APP_ID: "10828658",
        API_KEY: 'nXm2cBKvIhpoirpD0NEGQlPX',
        SECRET_KEY: 'Gxw36tqtgvUZUvAfDEFmMPt1bVKHO6G5'
    },
    reverse:true, // 从后往前购买
    yzm_method:"baidu", // "baidu" || "manual"
    threshold:[0,300,2000,100000,500000,500000], // 普通、稀有、卓越、史诗、神话、传说
    query_amount:3000, //查询次数
    show_affordable_message:false //显示是否买得起的信息
}