/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from '../models/Question';
import type { QuestionSolve } from '../models/QuestionSolve';
import type { QuestionSubmit } from '../models/QuestionSubmit';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionInnerControllerService {
    /**
     * getQuestionById
     * @param questionId questionId
     * @returns Question OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet1(
        questionId: number,
    ): CancelablePromise<Question> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/inner/get/id',
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
     * createQuestionSolve
     * @param questionSolve questionSolve
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static createQuestionSolveUsingPost(
        questionSolve: QuestionSolve,
    ): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/inner/question_submit/createQuestionSolve',
            body: questionSolve,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getQuestionSubmitById
     * @param questionId questionId
     * @returns QuestionSubmit OK
     * @throws ApiError
     */
    public static getQuestionSubmitByIdUsingGet(
        questionId: number,
    ): CancelablePromise<QuestionSubmit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/inner/question_submit/get/id',
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
     * updateQuestionSubmitById
     * @param questionSubmit questionSubmit
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionSubmitByIdUsingPost(
        questionSubmit: QuestionSubmit,
    ): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/inner/question_submit/update',
            body: questionSubmit,
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
     * @returns boolean OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionByIdUsingPost(
        questionId: number,
    ): CancelablePromise<boolean | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/inner/question_submit/updateAccepted',
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
