/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IOISubmissionRecord } from './IOISubmissionRecord';
import type { SubtaskResult } from './SubtaskResult';
export type IOIProblemResult = {
    bestSubmission?: IOISubmissionRecord;
    bestSubmitTime?: string;
    completedSubtaskCount?: number;
    fullScore?: number;
    isFirstFullScore?: boolean;
    lastSubmitTime?: string;
    questionId?: number;
    score?: number;
    scoreRate?: number;
    status?: number;
    statusName?: string;
    submissionRecords?: Array<IOISubmissionRecord>;
    submitCount?: number;
    subtaskResults?: Record<string, SubtaskResult>;
    title?: string;
    titleAlias?: string;
    totalSubtaskCount?: number;
    totalTime?: number;
};

