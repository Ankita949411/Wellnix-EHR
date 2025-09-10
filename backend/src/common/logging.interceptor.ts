import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
    console.log(`Incoming Request: ${method} ${url}`);
    return next.handle().pipe(
      tap((data) => {
        const elapsed = Date.now() - now;
        console.log(`Response for ${method} ${url} - ${elapsed}ms`, data);
      })
    );
  }
}
