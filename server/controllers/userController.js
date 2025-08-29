import User from '../models/user.js'


export const getUserData = async (req,res) => {

    const {userId} = await req.auth()
    try {
        const user = await User.findById(userId)

        if(!user){
           return res.json({success : false , message : 'User not found'})
        }
        res.json({success : true, user})
    } catch (error) {
        res.json({success : false , message : error.message})
    }
}
