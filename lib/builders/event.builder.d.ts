import { TwaAnalyticsConfig } from '../components/TwaAnalyticsProvider';
import { IEventBuilder } from '../interfaces';
import { TelegramWebAppData } from '../models';
import { BaseEvent } from '../types';

export declare class EventBuilder implements IEventBuilder {
    private readonly projectId;
    private readonly apiKey;
    private readonly appName;
    private readonly data;
    private transport;
    private config;
    private sessionIdentifier;
    private readonly pushHandler;
    constructor(projectId: string, apiKey: string, appName: string, data: TelegramWebAppData);
    private init;
    private loadConfig;
    private getApiGateway;
    private getRequestTimeout;
    private setupTransport;
    private setupAutoCaptureListener;
    private handleAutoCapture;
    private getElementProperties;
    getConfig(): TwaAnalyticsConfig | null;
    track(eventName: string, eventProperties: Record<string, any>): Promise<void>;
    private createEventObject;
    private getUserDetails;
    private getEventDetails;
    processEvent(event: BaseEvent): Promise<void>;
}
