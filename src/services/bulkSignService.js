import { cadespluginService } from './cadespluginService';
import { fileService } from './fileService';

export class bulkSignService {
  static async signFiles({
    files,
    cert,
    onProgress,
    onSigned,
    onError,
  }) {
    const result = {
      success: [],
      failed: [],
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = file.id;

      try {
        onProgress?.({
          current: i + 1,
          total: files.length,
          fileId,
          fileName: file.name,
        });

        const fileBlob = await fileService.getFileById(fileId);
        const signBase64 = await cadespluginService.FileSignCreate(cert, fileBlob);
        const sign = await fileService.saveFileSign(fileId, { base64: signBase64 });

        result.success.push({ fileId, sign });
        onSigned?.(fileId, sign);
      } catch (error) {
        result.failed.push({ fileId, error });
        onError?.(fileId, error);
      }
    }

    return result;
  }
}