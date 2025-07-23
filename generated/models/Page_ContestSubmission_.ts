/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContestSubmission } from './ContestSubmission';
import type { OrderItem } from './OrderItem';
export type Page_ContestSubmission_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<ContestSubmission>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

