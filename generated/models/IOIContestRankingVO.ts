/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IOIProblemResult } from './IOIProblemResult';
import type { UserVO } from './UserVO';
export type IOIContestRankingVO = {
    fullScoreCount?: number;
    isFrozen?: boolean;
    isVirtualRank?: boolean;
    lastSubmitTime?: string;
    partialScoreCount?: number;
    participationType?: number;
    participationTypeName?: string;
    problemResults?: Array<IOIProblemResult>;
    rank?: number;
    scoreRate?: number;
    subtaskCompleteCount?: number;
    totalFullScore?: number;
    totalScore?: number;
    totalSubmitCount?: number;
    totalSubtaskCount?: number;
    totalTime?: number;
    user?: UserVO;
    userId?: number;
    virtualStartTime?: string;
};

