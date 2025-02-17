import { EventBuilder } from './builders';
import { BaseEvent } from './types';

export declare class EventPushHandler {
    protected readonly client: EventBuilder;
    protected eventsQueue: BaseEvent[];
    protected isProcessing: boolean;
    constructor(client: EventBuilder);
    push(event: BaseEvent): void;
    processQueue(): void;
    flush(): Promise<void>;
}
