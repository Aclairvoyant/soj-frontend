/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MsgRemindVO } from './MsgRemindVO';
import type { OrderItem } from './OrderItem';
export type Page_MsgRemindVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<MsgRemindVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

