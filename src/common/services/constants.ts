export const configAWS = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGION,
  email: process.env.AWS_ROOT_EMAIL,
};
