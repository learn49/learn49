const aws = require('aws-sdk');
const crypto = require('crypto');

import awsConfig from '../config/aws';

interface Data {
  createReadStream: any;
  filename: string;
  mimetype: string;
}

interface UploadFileResponse {
  url: string;
  filename: string;
}

export const uploadFile = async ({
  createReadStream,
  filename,
  mimetype,
}: Data): Promise<UploadFileResponse> => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/gif',
    'image/bmp',
  ];

  if (!allowedMimes.includes(mimetype)) {
    throw new Error('Invalid file type.');
  }

  aws.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  });

  const s3 = new aws.S3();

  const stream = createReadStream();

  const key = `${crypto.randomBytes(10).toString('HEX')}-${filename}`;

  const s3Params = {
    Bucket: awsConfig.bucket,
    Key: key,
    ACL: 'public-read',
    ContentType: mimetype,
    Body: stream,
  };

  const { Location } = await s3.upload(s3Params).promise();

  return {
    url: Location,
    filename: key,
  };
};

export const removeFile = async (filename: string) => {
  aws.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  });

  const s3 = new aws.S3();

  await s3
    .deleteObject({
      Bucket: awsConfig.bucket,
      Key: filename,
    })
    .promise();
};
