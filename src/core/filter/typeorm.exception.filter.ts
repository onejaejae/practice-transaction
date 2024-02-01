import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMException } from '../exception/typeorm.exception';

@Catch(TypeORMException)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseJson: Record<string, any> = {
      callClass: exception.callClass,
      callMethod: exception.callMethod,
      message: exception.message,
      stack: exception.stack,
    };

    return response.status(responseStatus).json(responseJson);
  }
}
