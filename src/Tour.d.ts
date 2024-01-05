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
    isFinished: () => boolean;

    // Constructor
    constructor(options?: TourGuideOptions);

    // Public methods
    start(): void;
    visitStep(stepIndex: number | 'next' | 'prev'): void;
    addSteps(steps: TourGuideStep[]): void;
    nextStep(): void;
    prevStep(): void;
    exit(): void;
    refresh(): void;
    refreshDialog(): void;
    finishTour(): void;
    updatePositions(): void;
    deleteFinishedTour(groupKey: string | 'all'): void;
    setOptions(options: TourGuideOptions): void;

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
