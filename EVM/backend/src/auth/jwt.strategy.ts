import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClaimVerifyResult, handler } from './jwt.verify';
import { AuthService } from './auth.service';
import { passportJwtSecret } from 'jwks-rsa';


const cognitoPoolId = 'us-east-1_6hrF40OJv';
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${cognitoIssuer}/.well-known/jwks.json`,
      })

    });
  }

  public async validate(
    payload: any,
    done: (err: Error | null, result: ClaimVerifyResult) => void,
    ) {
      console.log('Validating');
    const userInfo = await handler(payload);
    if (!userInfo) {
      return done(new UnauthorizedException(), null);
    }
    done(null, userInfo);
  }
}