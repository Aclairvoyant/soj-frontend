/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ACMSubmissionRecord } from './ACMSubmissionRecord';
export type ACMProblemResult = {
    acceptCount?: number;
    firstAcceptTime?: string;
    isFirstAccept?: boolean;
    lastSubmitTime?: string;
    penaltyTime?: number;
    questionId?: number;
    score?: number;
    status?: number;
    statusName?: string;
    submissionRecords?: Array<ACMSubmissionRecord>;
    submitCount?: number;
    title?: string;
    titleAlias?: string;
    totalTime?: number;
    wrongSubmitCount?: number;
};

