const Broker = require('rascal').BrokerAsPromised;
const config = require("../config.json")



module.exports = {
    pub: (async (req, res, next) =>{
        try{
            const broker = await Broker.create(config);
            req.publish = async (type, keys, value) => {
                try{
                    const msg ={
                        type,
                        keys,
                        value
                    }
                    
                    const publication = await broker.publish("post_pub", msg)
                    publication.on('error', console.error)
                    return value
                }
                catch(err){
                    console.log(err)
                }
            }

            next()
        }catch(err){
            next(err)
        }
    }),
    sub:(async () =>{
        try{
            const broker = await Broker.create(config)
            const subscription = await broker.subscribe('post_sub')
            return subscription
        }catch(err){
            console.log(err)
        }
    })
}