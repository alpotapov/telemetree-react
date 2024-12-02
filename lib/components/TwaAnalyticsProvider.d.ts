import { ReactNode } from 'react';
import { EventBuilder } from '../builders';
import { TelegramWebAppData } from '../models/telegram-web-app-data';

export type TwaAnalyticsProviderOptions = {
    projectId: string;
    apiKey: string;
    appName: string;
    telegramWebAppData?: TelegramWebAppData;
};
export type TwaAnalyticsProviderProps = {
    children: ReactNode;
} & TwaAnalyticsProviderOptions;
export declare const TwaAnalyticsProviderContext: import('react').Context<EventBuilder | null>;
export type TwaAnalyticsConfig = {
    host: string;
    auto_capture: boolean;
    auto_capture_tags: string[];
    auto_capture_classes: string[];
    public_key: string;
};
declare const _default: import('react').NamedExoticComponent<TwaAnalyticsProviderProps>;
export default _default;
