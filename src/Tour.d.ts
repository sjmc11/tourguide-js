// tourguide.d.ts

// Import statements for types
import { TourGuideOptions } from './core/options';
import { TourGuideStep } from './types/TourGuideStep';

// Declaration of the TourGuideClient class
export declare class TourGuideClient {
    // Public properties
    backdrop: HTMLElement;
    dialog: HTMLElement;
    group: string;
    isVisible: boolean;
    activeStep: number;
    tourSteps: TourGuideStep[];
    options: TourGuideOptions;
    isFinished: (tourGroup?: string) => boolean;

    // Constructor
    constructor(options?: TourGuideOptions);

    // Public methods
    start(group?: string): Promise<unknown>;
    visitStep(stepIndex: number | 'next' | 'prev'): Promise<unknown>;
    addSteps(steps: TourGuideStep[]): Promise<void>;
    nextStep(): Promise<unknown>;
    prevStep(): Promise<unknown>;
    exit(): Promise<unknown>;
    refresh(): Promise<unknown>;
    refreshDialog(): Promise<unknown>;
    finishTour(exit?: boolean, tourGroup?: string): Promise<boolean>;
    updatePositions(): Promise<unknown>;
    deleteFinishedTour(groupKey?: string | 'all'): void;
    setOptions(options: TourGuideOptions): Promise<TourGuideClient>;

    // Callback properties (if these are meant to be public)
    _globalFinishCallback: () => void | Promise<unknown>;
    _globalBeforeExitCallback: () => void | Promise<unknown>;
    _globalAfterExitCallback: Function;
    _globalBeforeChangeCallback: () => void | Promise<unknown>;
    _globalAfterChangeCallback: () => void | Promise<unknown>;

    // Public readonly properties (if these are meant to be public)
    readonly onFinish: (callback: () => void) => void;
    readonly onBeforeExit: (callback: () => void) => void;
    readonly onAfterExit: (callback: () => void) => void;
    readonly onBeforeStepChange: (callback: () => void) => void;
    readonly onAfterStepChange: (callback: () => void) => void;
}

// Export any other types or values that are part of the public API
