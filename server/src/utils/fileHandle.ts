import * as pdfParse from 'pdf-parse';

export async function convertPdfFileToText(file: any): Promise<string> {
  const data = await pdfParse(await file.toBuffer());
  return data.text;
}
