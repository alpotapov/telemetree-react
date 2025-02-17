import { BaseEvent, EventDetails, EventUserDetails } from '../types';

export declare const createEvent: (appName: string, eventName: string, userDetails: EventUserDetails, eventDetails: EventDetails, telegramID: string, language: string, device: string, referrerType: string | "N/A", referrer: string | "0", timestamp: string, isAutocapture: boolean, wallet: string | undefined, sessionIdentifier?: string, eventSource?: string) => BaseEvent;
