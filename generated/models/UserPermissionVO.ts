/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModulePermissionVO } from './ModulePermissionVO';
export type UserPermissionVO = {
    lastLoginTime?: string;
    permissionVersion?: number;
    permissions?: Array<ModulePermissionVO>;
    roleCode?: string;
    roleDescription?: string;
    roleLevel?: number;
    roleName?: string;
    userAccount?: string;
    userAvatar?: string;
    userId?: number;
    userName?: string;
};

