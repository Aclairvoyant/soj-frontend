/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionVO } from './QuestionVO';
import type { UserVO } from './UserVO';
export type ProblemSetVO = {
    createTime?: string;
    description?: string;
    id?: number;
    isOfficial?: number;
    isPublic?: number;
    name?: string;
    questionVOList?: Array<QuestionVO>;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
};

