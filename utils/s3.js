 const AWS = require('aws-sdk')
 const {v4: uuidv4} = require ('uuid')

const ID = "AKIA6QE2N2QUQ5K5JLNQ";
const SECRET ="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";
const BUCKET_NAME = "gsb1";


 const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
 })

const uploadToS3 = async (file) => {
    try{
        const fileExtention = file.originalname.split(' ').pop();
        const key = `${uuidv4()}.${fileExtention}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer
        };

        const uploadData = await s3.upload(params).promise();
        console.log(`File uploaded successfully. ${uploadData.Location}`)
        return uploadData.Location;
        
    }catch(error){
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
}
module.exports = {uploadToS3};