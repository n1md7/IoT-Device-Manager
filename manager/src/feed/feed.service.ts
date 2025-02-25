import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { SwitchStatusReportMessage } from '/src/devices/messages/switch-status-report.message';
import { v4 as uuidv4 } from 'uuid';
import { SensorStatusReportMessage } from '/src/devices/messages/sensor-status-report.message';

type StreamPayload = SensorStatusReportMessage | SwitchStatusReportMessage;

@Injectable()
export class FeedService {
  private readonly streams: Map<
    string,
    {
      subject: ReplaySubject<StreamPayload>;
      observer: Observable<StreamPayload>;
    }
  > = new Map();

  create() {
    const id = uuidv4();
    const subject = new ReplaySubject<StreamPayload>();
    const observer = subject.asObservable();

    this.streams.set(id, { subject, observer });

    return { id, observer };
  }

  push(report: StreamPayload) {
    for (const [, stream] of this.streams) {
      stream.subject.next(report); // Tell everyone about the new report
    }
  }

  remove(id: string) {
    this.streams.delete(id);
  }
}
