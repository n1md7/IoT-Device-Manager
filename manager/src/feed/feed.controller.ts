import { Controller, Req, Sse } from '@nestjs/common';
import { FeedService } from '/src/feed/feed.service';
import { Request } from 'express';
import { catchError, map, throwError } from 'rxjs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({
    summary: 'Get feed',
    description: 'Get a dynamic real-time feed of system events. This endpoint is SSE enabled.',
  })
  @Sse('updates')
  async updates(@Req() request: Request) {
    const { id, observer } = this.feedService.create();

    request.on('close', () => this.feedService.remove(id));

    return observer.pipe(
      map((data) => {
        return {
          type: 'message',
          data,
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
