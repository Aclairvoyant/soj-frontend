/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IOISubmissionRecord = {
    completedSubtaskCount?: number;
    fullScore?: number;
    isBestScore?: boolean;
    judgeInfo?: string;
    judgeMessage?: string;
    language?: string;
    memoryUsed?: number;
    score?: number;
    scoreRate?: number;
    status?: number;
    statusName?: string;
    submissionId?: number;
    submitTime?: string;
    subtaskScores?: Record<string, number>;
    subtaskStatuses?: Record<string, string>;
    timeFromStart?: number;
    timeUsed?: number;
    totalSubtaskCount?: number;
};

