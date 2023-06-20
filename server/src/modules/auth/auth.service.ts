import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/schema/user.schema';
import { LoginSuccess } from './interface/login.interface';
import { RegisterDto } from './dto/register.dto';
import { RoleService } from '../role/role.service';
import { Role } from '../role/schema/role.schema';

@Injectable()
export class AuthService {
  private saltRound = 1;
  private accessTokenSecretKey = '';
  private refreshTokenSecretKey = '';
  private accessTokenExpirationTime = '';
  private refreshTokenExpirationTime = '';

  constructor(
    private readonly usersService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.saltRound = Number.parseInt(
      this.configService.get<string>('SALT_ROUND') ?? '1',
    );
    this.accessTokenSecretKey =
      this.configService.get('JWT_ACCESS_TOKEN_SECRET') ?? '';
    this.accessTokenExpirationTime =
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') ?? '';
    this.refreshTokenSecretKey =
      this.configService.get('JWT_ACCESS_TOKEN_SECRET') ?? '60';
    this.refreshTokenExpirationTime =
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') ?? '3600';
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  public async findRoleById(id: string): Promise<Role | null> {
    const role = await this.roleService.findOneById(id);
    return role;
  }

  private async _generateTokenJWT(
    userId: string,
    roleId: string,
  ): Promise<string> {
    const payload = { userId, roleId };
    const token = this.jwtService.sign(payload, {
      secret: this.accessTokenSecretKey,
      expiresIn: `${this.accessTokenExpirationTime}s`,
    });
    return token;
  }

  private async _generateRefreshTokenJWT(
    userId: string,
    role: string,
  ): Promise<string> {
    const payload = { userId, role };
    const token = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecretKey,
      expiresIn: `${this.refreshTokenExpirationTime}s`,
    });
    return token;
  }

  public async decodeTokenJWT(token: string): Promise<any> {
    const result = this.jwtService.verify(token);
    return result;
  }

  public generateHashPassword(password: string): string {
    const hash = bcrypt.hashSync(password, this.saltRound);
    return hash;
  }

  public async comparePasswords(
    newPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(newPassword, hashPassword);
    return isMatch;
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    return user;
  }

  public async register(registerDto: RegisterDto): Promise<User> {
    const hashPassword = this.generateHashPassword(registerDto.password);
    const newUser = {
      fullName: registerDto.fullName,
      email: registerDto.email,
      password: hashPassword,
      role: 'user',
      age: registerDto.age,
      gender: registerDto.gender,
    };
    return await this.usersService.create(newUser);
  }

  public async login(user: User): Promise<LoginSuccess> {
    const accessToken = await this._generateTokenJWT(user._id, user.role._id);
    const refreshToken = await this._generateRefreshTokenJWT(
      user._id,
      user.role._id,
    );
    return {
      id: user._id,
      role: user.role.name,
      fullName: user.fullName,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
