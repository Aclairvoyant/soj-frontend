/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_PersonalDataVO_ } from '../models/BaseResponse_PersonalDataVO_';
import type { BaseResponse_Question_ } from '../models/BaseResponse_Question_';
import type { BaseResponse_QuestionSubmit_ } from '../models/BaseResponse_QuestionSubmit_';
import type { QuestionSolve } from '../models/QuestionSolve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionSolveControllerService {
    /**
     * createQuestionSolve
     * @param questionSolve questionSolve
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createQuestionSolveUsingPost(
        questionSolve: QuestionSolve,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question_solve/createQuestionSolve',
            body: questionSolve,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionById
     * @param questionId questionId
     * @returns BaseResponse_Question_ OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet1(
        questionId?: number,
    ): CancelablePromise<BaseResponse_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question_solve/get/id',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPersonalData
     * @returns BaseResponse_PersonalDataVO_ OK
     * @throws ApiError
     */
    public static getPersonalDataUsingGet(): CancelablePromise<BaseResponse_PersonalDataVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question_solve/getPersonalData',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionSubmitById
     * @param questionSubmitId questionSubmitId
     * @returns BaseResponse_QuestionSubmit_ OK
     * @throws ApiError
     */
    public static getQuestionSubmitByIdUsingGet(
        questionSubmitId?: number,
    ): CancelablePromise<BaseResponse_QuestionSubmit_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question_solve/question_submit/get/id',
            query: {
                'questionSubmitId': questionSubmitId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateQuestionById
     * @param questionId questionId
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionByIdUsingPost(
        questionId?: number,
    ): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question_solve/question_submit/updateAccepted',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
