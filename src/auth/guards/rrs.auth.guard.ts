import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RrsAuthGuard extends AuthGuard('custom') {}
