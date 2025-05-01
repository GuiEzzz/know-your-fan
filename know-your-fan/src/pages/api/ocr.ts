import client from '@/lib/visionClient';

export async function extrairTextoGoogleVision(imagemBase64: string): Promise<string> {
  const base64Data = imagemBase64.replace(/^data:image\/\w+;base64,/, '');

  const [result] = await client.textDetection({
    image: { content: base64Data },
  });

  const detections = result.textAnnotations || [];
  const textoExtraido = detections.length > 0 ? detections[0].description || '' : '';

  return textoExtraido;
}
