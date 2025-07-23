/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContestQuestionRequest } from './ContestQuestionRequest';
export type ContestUpdateRequest = {
    allowVirtual?: number;
    description?: string;
    duration?: number;
    endTime?: string;
    id?: number;
    isPublic?: number;
    maxParticipants?: number;
    password?: string;
    penaltyTime?: number;
    questions?: Array<ContestQuestionRequest>;
    registerEndTime?: string;
    registerStartTime?: string;
    startTime?: string;
    title?: string;
    type?: number;
    virtualEndTime?: string;
    virtualStartTime?: string;
};

