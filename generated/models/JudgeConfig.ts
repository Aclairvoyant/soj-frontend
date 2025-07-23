/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubtaskConfig } from './SubtaskConfig';
export type JudgeConfig = {
    enableSubtasks?: boolean;
    memoryLimit?: number;
    scoringMethod?: string;
    stackLimit?: number;
    subtasks?: Array<SubtaskConfig>;
    timeLimit?: number;
    totalScore?: number;
};

