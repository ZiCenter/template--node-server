import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';
import { IReqBody, IResponse } from '../support/types';
import {Folder} from "@models/Folder";
import FolderController from "../../src/controllers/FolderController";



describe('Users Routes', () => {

    const base = '/api/folders';
    const getUsersPath = `${base}/all`;
    const addUsersPath = `${base}/add`;
    const updateUserPath = `${base}/update`;
    const deleteUserPath = `${base}/delete/:id`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${getUsersPath}"`, () => {

        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {

            // Call API
            agent.get(base)
                .end((err: Error, res: any) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'Folder' objects
                    const folders = res.body.data;
                    const retUsers: Folder[] = folders.map((f: any) => new Folder(f));
                    expect(retUsers).toEqual(folders);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch users.';
            spyOn(FolderController.prototype, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getUsersPath)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    describe(`"POST:${addUsersPath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.post(addUsersPath).type('form').send(reqBody);
        };

        const userData = {
            user: new Folder('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Call API
            agent.post(addUsersPath).type('form').send(userData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add user.';
            // Call API
            callApi(userData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"PUT:${updateUserPath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.put(updateUserPath).type('form').send(reqBody);
        };

        const userData = {
            user: new Folder({'Gordan Freeman', 'gordan.freeman@gmail.com'}),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Call Api
            callApi(userData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            // Call api
            callApi({})
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const updateErrMsg = 'Could not update user.';
            spyOn(FolderController.prototype, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });

    describe(`"DELETE:${deleteUserPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteUserPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Call api
            callApi(5)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const deleteErrMsg = 'Could not delete user.';
            spyOn(FolderController.prototype, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
