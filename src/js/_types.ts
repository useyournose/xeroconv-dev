
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt: () => Promise<void>;
}
  
  export interface LaunchParams {
    readonly targetURL?: string | null;
    readonly files: readonly FileSystemFileHandle[];
  }
  
  export type LaunchConsumer = (params: LaunchParams) => any;
  
  export interface LaunchQueue {
    setConsumer(consumer: LaunchConsumer): void;
  }
  
declare global {
    interface Window {
        readonly launchQueue: LaunchQueue;
    }
  
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
        appinstalled: Event;
    }
}