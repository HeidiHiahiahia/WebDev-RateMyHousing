//allows for catching asynchronous calls 
module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next);
    }
}