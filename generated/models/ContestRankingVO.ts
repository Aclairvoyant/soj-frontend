/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContestProblemResult } from './ContestProblemResult';
import type { UserVO } from './UserVO';
export type ContestRankingVO = {
    acceptCount?: number;
    isFrozen?: boolean;
    isVirtualRank?: boolean;
    lastSubmitTime?: string;
    participationType?: number;
    participationTypeName?: string;
    problemResults?: Array<ContestProblemResult>;
    rank?: number;
    submitCount?: number;
    totalScore?: number;
    totalTime?: number;
    user?: UserVO;
    userId?: number;
    virtualStartTime?: string;
};

