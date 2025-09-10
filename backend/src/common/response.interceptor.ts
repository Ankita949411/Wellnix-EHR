import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "./interfaces/api-response.interface";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const res = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'statusCode' in data && 'message' in data) {
          res.status(data.statusCode);
          return {
            success: data.statusCode < 400,
            statusCode: data.statusCode,
            message: data.message,
            data: data.data,
            timestamp: new Date().toISOString(),
          };
        }
        
        return {
          success: true,
          statusCode: 200,
          message: "Request successful",
          data,
          timestamp: new Date().toISOString(),
        };
      })
    );
  }
}
