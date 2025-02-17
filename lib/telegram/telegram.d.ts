import { Telegram } from './web-app';
import { TelegramWebAppData } from '../models';

export declare const webAppHandler: Telegram.WebApp | null;
export declare const webViewHandler: Telegram.WebView | null;
/**
 * @returns TelegramWebAppData
 */
export declare const loadTelegramWebAppData: () => TelegramWebAppData;
export declare const loadFromTelegramLib: () => TelegramWebAppData;
export declare const loadFromHash: () => TelegramWebAppData;
