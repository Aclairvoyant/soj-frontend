/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OISubmissionRecord } from './OISubmissionRecord';
export type OIProblemResult = {
    bestSubmission?: OISubmissionRecord;
    bestSubmitTime?: string;
    fullScore?: number;
    isFirstFullScore?: boolean;
    lastSubmitTime?: string;
    questionId?: number;
    score?: number;
    scoreRate?: number;
    status?: number;
    statusName?: string;
    submissionRecords?: Array<OISubmissionRecord>;
    submitCount?: number;
    title?: string;
    titleAlias?: string;
    totalTime?: number;
};

