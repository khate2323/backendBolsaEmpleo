import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenOTP } from './tokenOtp.entity';
import { EntityManager, Repository } from 'typeorm';
import { RandomUtil } from 'src/common/utils/random.util';
import { User } from 'src/features/users/user.entity';

@Injectable()
export class TokensOtpService {
  constructor(
    @InjectRepository(TokenOTP)
    private tokenOtpRepository: Repository<TokenOTP>,
    private randomUtil: RandomUtil,
  ) {}

  async createTokenToUser(user: User, manager?: EntityManager) {
    try {
      const token = new TokenOTP();
      token.token = this.randomUtil.generateRandomNumber(6);
      token.user = user;
      token.createdAt = new Date();
      token.expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      const repo = manager
        ? manager.getRepository(TokenOTP)
        : this.tokenOtpRepository;
      const savedToken = await repo.save(token);

      return {
        id: savedToken.id,
        token: savedToken.token,
        expiredAt: savedToken.expiredAt,
      };
    } catch (error) {
      throw new Error(`Error creando token OTP: ${error.message}`);
    }
  }

  async useToken(token: string, user: User) {
    try {
      const tokenFound = await this.tokenOtpRepository.findOneBy({
        user: { id: user.id },
        token: token,
      });

      if (!tokenFound) {
        throw new Error('Token incorrecto, intente de nuevo');
      }
      if (!tokenFound.isValid) {
        throw new Error(
          'El token ya ha sido usado, por favor solicite uno nuevo',
        );
      }
      if (tokenFound.expiredAt < new Date()) {
        throw new Error('El token ha expirado, por favor solicite uno nuevo');
      }

      const result = await this.tokenOtpRepository.update(
        { id: tokenFound.id },
        { isValid: false, usedAt: new Date() },
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
