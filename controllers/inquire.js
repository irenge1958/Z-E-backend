const inquiry = require('../modal/inquire');
const inquire=async (req,res)=>{
    console.log(req.body.userEmail)
    const { userEmail, message } = req.body;

    try{
     const myenquiry=await inquiry.create({
        email:userEmail,
        message:message
     })
     res.status(200).json(myenquiry)
    }catch(err){
        console.log(err)
    }
}
const enquire=async (req,res)=>{
    console.log(req.body.userEmail)
    const { userEmail, message } = req.body;

    try{
     const myenquiry=await inquiry.find()
     res.status(200).json(myenquiry)
    }catch(err){
        console.log(err)
    }
}
const deletes= async(req, res) => {
    console.log(req.params.id)
    try {
      const userId = req.params.id;
      await inquiry.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
module.exports = {inquire,enquire,deletes};