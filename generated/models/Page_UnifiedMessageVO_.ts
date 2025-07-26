/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { UnifiedMessageVO } from './UnifiedMessageVO';
export type Page_UnifiedMessageVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<UnifiedMessageVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

