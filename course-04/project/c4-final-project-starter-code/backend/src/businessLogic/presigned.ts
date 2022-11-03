import * as AWS from 'aws-sdk';

const signedUrlExpiry = process.env.SIGNED_URL_EXPIRATION
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET

const s3 = new AWS.S3({signatureVersion: 'v4'})


export function createAttachmentPresignedUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: s3Bucket,
        Key: todoId,
        Expires: parseInt(signedUrlExpiry)
    })
}