import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';
export const IS_PUBLIC_KEY = 'isPublic';
export const IS_PUBLIC_PERMISSION = 'isPublicPermission';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const ResponseMessage = (message?: string) =>
  SetMetadata(RESPONSE_MESSAGE, message || '');

export const SkipCheckPermission = () =>
  SetMetadata(IS_PUBLIC_PERMISSION, true);
