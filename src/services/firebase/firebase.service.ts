import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import * as serviceAccount from '../../config/firebase-config.json';

@Injectable()
export class FirebaseService {
    private readonly app: admin.app.App;
    private readonly logger = new Logger(FirebaseService.name);

    constructor() {
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: 'gs://sources-24689.appspot.com',
        });
    }

    getAuth() {
        return this.app.auth();
    }

    getStorage() {
        return this.app.storage().bucket();
    }

    async uploadFile(file: Express.Multer.File, folder = 'BolsaEmpleo') {
        try {
            const bucket = this.getStorage();

            const fileName = `${folder}/${uuidv4()}`;
            const fileUpload = bucket.file(fileName);

            let buffer = file.buffer;

            // 🔹 Si es imagen, optimizar con Sharp
            if (file.mimetype.startsWith('image/')) {
                buffer = await sharp(file.buffer)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .jpeg({ quality: 85 })
                    .toBuffer();
            }

            await fileUpload.save(buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });


            // Generar URL pública segura
            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-01-2035',
            });

            return { url, name: fileName };
        } catch (error) {
            this.logger.error('Error al subir archivo', error);
            throw new Error('Error al subir archivo');
        }
    }

}
