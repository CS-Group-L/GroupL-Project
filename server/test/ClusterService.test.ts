import { expect } from 'chai';
import fs, { existsSync, writeFileSync } from "fs";
import { ClusterService } from '../src/services/ClusterService';
const storagePath = "./test/data/cluster";

describe('ClusterService', () => {

    describe('PushToCluster', () => {
        const sutStorage = storagePath + "/PushToCluster";
        const sut = new ClusterService({
            storagePath: sutStorage
        });

        it("PushToCluster should return 500 when the file cannot be uploaded to the cluster", async () => {
            const expectedFile = sutStorage + `/${Math.floor(Math.random() * 10000)}`;

            const actual = (await sut.PushToCluster(expectedFile)).code;
            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(500);
        });

        it("PushToCluster should return true when the file has been uploaded to the cluster", async () => {
            const expectedFile = sutStorage + `/${Math.floor(Math.random() * 10000)}`;
            writeFileSync(expectedFile, 'print("Hello, world")');

            const actual = (await sut.PushToCluster(expectedFile)).data;
            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });
    });

    describe('Execute', async () => {
        const sutStorage = storagePath + "/ExecuteCode";
        const sut = new ClusterService({
            storagePath: sutStorage
        });

        it("Execute should return true when the program successfully starts to execute", async () => {
            const expectedFile = sutStorage + `/main.py`;
            writeFileSync(expectedFile, 'print("Hello, world")');

            const actual = (await sut.Execute()).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });
    });

    after(() => {
        fs.rmSync(storagePath, {
            force: true,
            recursive: true
        });
    });
});