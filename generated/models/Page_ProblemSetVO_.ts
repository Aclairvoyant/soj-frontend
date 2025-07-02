/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { ProblemSetVO } from './ProblemSetVO';
export type Page_ProblemSetVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<ProblemSetVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

