/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OIProblemResult } from './OIProblemResult';
import type { UserVO } from './UserVO';
export type OIContestRankingVO = {
    fullScoreCount?: number;
    isFrozen?: boolean;
    isVirtualRank?: boolean;
    lastSubmitTime?: string;
    partialScoreCount?: number;
    participationType?: number;
    participationTypeName?: string;
    problemResults?: Array<OIProblemResult>;
    rank?: number;
    scoreRate?: number;
    totalFullScore?: number;
    totalScore?: number;
    totalSubmitCount?: number;
    totalTime?: number;
    user?: UserVO;
    userId?: number;
    virtualStartTime?: string;
};

