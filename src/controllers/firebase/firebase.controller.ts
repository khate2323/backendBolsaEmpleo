import { Body, Controller, Post, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }

    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const result = await this.firebaseService.uploadFile(file);
        return result
    }
}
