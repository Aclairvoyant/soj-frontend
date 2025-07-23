/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContestQuestionVO } from './ContestQuestionVO';
import type { UserVO } from './UserVO';
export type ContestVO = {
    allowVirtual?: number;
    canRegister?: boolean;
    canStartVirtual?: boolean;
    contestType?: number;
    contestTypeName?: string;
    createTime?: string;
    creator?: UserVO;
    description?: string;
    endTime?: string;
    id?: number;
    isPublic?: number;
    isRegistered?: boolean;
    maxParticipants?: number;
    participantCount?: number;
    penaltyTime?: number;
    questions?: Array<ContestQuestionVO>;
    registerEndTime?: string;
    registerStartTime?: string;
    startTime?: string;
    status?: number;
    statusName?: string;
    title?: string;
    updateTime?: string;
    virtualEndTime?: string;
    virtualStartTime?: string;
};

