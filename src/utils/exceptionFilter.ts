import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CustomError } from './customError';
import { PrismaErrorCodeMapper } from './prismaErrorCodeMapper';
import { AxiosError } from 'axios';
import { logger } from 'src/common/logger/winston.config';

@Catch(Error)
export class GlobalExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) { 
    logger.error("error", exception);    
    let errorMessage: unknown;
    let httpStatus: number;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof CustomError) {
      httpStatus = exception.statusCode;
      errorMessage = exception.message;}
    else if (exception instanceof AxiosError) {
      httpStatus = exception?.response?.data?.statusCode ?? 500;
      errorMessage = exception.response?.data?.errors ?? exception.message;
    } else if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse()['message'];
      httpStatus = 400;
      errorMessage = validationErrors;
    } else if (exception instanceof PrismaClientRustPanicError) {
      httpStatus = 503;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
      httpStatus = 422;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus = 400;
      errorMessage = PrismaErrorCodeMapper[exception.code]?.message;
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientInitializationError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (status && status >= 400 && status <= 499) {
      httpStatus = status;
      errorMessage = exception.message;
    } else {
      httpStatus = 500;
      errorMessage = [
        'Sorry! something went to wrong on our service, Please try again later',
      ];
    }
    const errorResponse = {
      statusCode: httpStatus,
      errorMessage
    };

    response.status(httpStatus).json(errorResponse);
  }
}
