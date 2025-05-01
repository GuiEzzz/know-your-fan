import vision from '@google-cloud/vision';

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS!);

const client = new vision.ImageAnnotatorClient({
  credentials,
});

export default client;
