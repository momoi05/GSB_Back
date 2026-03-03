const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS S3 client with access credentials from environment variables (AWS SDK v3)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ID,
        secretAccessKey: process.env.SECRET,
    },
});

// Async function to upload a file to S3 and return its URL
const uploadToS3 = async (file) => {
    try {
        const fileExtention = file.originalname.split('.').pop();
        const key = `${uuidv4()}.${fileExtention}`;

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const region = process.env.AWS_REGION || 'us-east-1';
        const bucket = process.env.BUCKET_NAME;
        const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

        console.log(`File uploaded successfully. ${fileUrl}`);
        return fileUrl;

    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

module.exports = { uploadToS3 };