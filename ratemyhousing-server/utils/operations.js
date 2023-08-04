
//TODO: Write unit test case for this function
/**
 * @description : Takes in a JWT token, splits into 3 parts, 
 * converts payload from base64 to ascii and returns it.
 * @param {String} token 
 * @returns {String}
 * @throws {Error} Token is not JWT
 */
function getJWTpayLoad(token){
    const tokenParts = token.split('.');
    if(tokenParts.length === 3){
        return JSON.parse(Buffer.from(tokenParts[1],'base64').toString('ascii'));
    }else{
        throw Error("Token is not JWT");
    }
} 

module.exports = {
    getJWTpayLoad
}