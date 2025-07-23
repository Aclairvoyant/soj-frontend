/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ACMProblemResult } from './ACMProblemResult';
import type { UserVO } from './UserVO';
export type ACMContestRankingVO = {
    acceptCount?: number;
    isFrozen?: boolean;
    isVirtualRank?: boolean;
    lastSubmitTime?: string;
    participationType?: number;
    participationTypeName?: string;
    problemResults?: Array<ACMProblemResult>;
    rank?: number;
    totalPenaltyTime?: number;
    totalScore?: number;
    totalSubmitCount?: number;
    totalTime?: number;
    user?: UserVO;
    userId?: number;
    virtualStartTime?: string;
};

