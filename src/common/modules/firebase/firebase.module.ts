import { Module } from '@nestjs/common';
import { FirebaseController } from 'src/controllers/firebase/firebase.controller';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Module({
    imports: [],
    controllers: [FirebaseController],
    providers: [FirebaseService],
    exports: [FirebaseService]
})
export class FirebaseModule {

}
