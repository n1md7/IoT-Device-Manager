import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { StatusReportMessage } from '/src/devices/messages/status-report.message';

@Injectable()
export class DevicesService {
  private readonly streams: Map<
    string,
    {
      subject: ReplaySubject<StatusReportMessage>;
      observer: Observable<StatusReportMessage>;
    }
  > = new Map();

  createStream() {
    const id = uuidv4();
    const subject = new ReplaySubject<StatusReportMessage>();
    const observer = subject.asObservable();

    this.streams.set(id, { subject, observer });

    return { id, observer };
  }

  handlePublish(report: StatusReportMessage) {
    for (const [, stream] of this.streams) {
      stream.subject.next(report); // Tell everyone about the new report
    }
  }

  removeStream(id: string) {
    this.streams.delete(id);
  }
}
