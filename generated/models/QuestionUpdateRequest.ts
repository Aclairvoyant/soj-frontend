/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';
export type QuestionUpdateRequest = {
    answer?: string;
    content?: string;
    contestOnly?: number;
    id?: number;
    isPublic?: number;
    judgeCase?: Array<JudgeCase>;
    judgeConfig?: JudgeConfig;
    source?: string;
    tags?: Array<string>;
    title?: string;
};

