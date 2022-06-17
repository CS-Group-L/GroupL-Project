import { expect } from 'chai';
import fs from "fs";
import { IUserWithoutPassword } from '../src/models/IUserModel';
import { AuthService } from '../src/services/AuthenticationService';

const storagePath = "./test/data/auth";

const defaultUsers = [
    { username: 'admin' }
];

describe('AuthenticationService', () => {

    describe('GetAllUsers', () => {
        const sut = new AuthService({
            accessTokenSecret: "SECRET",
            storagePath: storagePath + "/GetAllUsers"
        });

        it("Returns an array of users without their passwords", async () => {
            const actual = (await sut.GetAllUsers()).data;
            expect(actual).to.be.a("array");
            expect(actual).to.have.lengthOf(1);
        });
    });

    describe('RegisterUser', () => {
        const sut = new AuthService({
            accessTokenSecret: "SECRET",
            storagePath: storagePath + "/Register"
        });

        it("RegisterUser should return 403 when confirmation password doesn't match the password", async () => {
            const actual = (await sut.RegisterUser(
                "RegisterCPDM",
                "HelloWorld",
                "HalloWereld"
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("RegisterUser should return 403 when username is already taken", async () => {
            const actual = (await sut.RegisterUser(
                "admin",
                "HelloWorld",
                "HalloWereld"
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("RegisterUser should return true when the user gets created", async () => {
            const actual = (await sut.RegisterUser(
                "UniqueUsername",
                "MatchingPassword1.",
                "MatchingPassword1."
            )).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });
    });

    describe('LoginUser', () => {
        const sut = new AuthService({
            accessTokenSecret: "SECRET",
            storagePath: storagePath + "/Login"
        });

        it("LoginUser should return 403 when the user doesn't exist", async () => {
            const actual = (await sut.LoginUser(
                "NoneExistentUser",
                "Password1."
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("LoginUser should return 403 when password is incorrect", async () => {
            const actual = (await sut.LoginUser(
                "admin",
                "IncorrectPassword1."
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("LoginUser should return an access token when login is successful", async () => {
            const actual = (await sut.LoginUser(
                "admin",
                "Password1.",
            )).data;

            expect(actual).to.be.a("object");
            expect(actual).to.have.key("accessToken");
        });
    });

    describe('ChangePassword', () => {
        const sut = new AuthService({
            accessTokenSecret: "SECRET",
            storagePath: storagePath + "/ChangePassword"
        });

        it("ChangePassword should return 403 when user doesn't exist", async () => {
            const actual = (await sut.ChangePassword(
                "NoneExistentUser",
                "Password1.",
                "HelloWorld",
                "HelloWorld"
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("ChangePassword should return 403 when the old password is incorrect", async () => {
            const actual = (await sut.ChangePassword(
                "admin",
                "IncorrectPassword",
                "HelloWorld",
                "HelloWorld"
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("ChangePassword should return 403 when the new password doesn't equal the confirmation password", async () => {
            const actual = (await sut.ChangePassword(
                "admin",
                "Password1.",
                "HelloWorld",
                "HalloWereld"
            )).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("ChangePassword should return true when the password change was successful", async () => {
            const actual = (await sut.ChangePassword(
                "admin",
                "Password1.",
                "MatchingPassword1.",
                "MatchingPassword1."
            )).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });
    });

    describe('DeleteUser', () => {

        it("DeleteUser should return 403 when the last user cannot be deleted", async () => {
            const sut = new AuthService({
                accessTokenSecret: "SECRET",
                storagePath: storagePath + "/DeleteUser/1"
            });

            const actual = (await sut.DeleteUser("admin")).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("DeleteUser should return 403 when user doesn't exist", async () => {
            const sut = new AuthService({
                accessTokenSecret: "SECRET",
                storagePath: storagePath + "/DeleteUser/2"
            });
            await sut.RegisterUser("SecondUser", "Hi", "Hi");

            const actual = (await sut.DeleteUser("NoneExistentUser")).code;

            expect(actual).to.be.a("number");
            expect(actual).to.be.equal(403);
        });

        it("DeleteUser should return true when the deletion was successful", async () => {
            const sut = new AuthService({
                accessTokenSecret: "SECRET",
                storagePath: storagePath + "/DeleteUser/3"
            });
            await sut.RegisterUser("SecondUser", "Hi", "Hi");

            const actual = (await sut.DeleteUser("admin")).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });
    });

    describe('DeleteUser', () => {

        const sut = new AuthService({
            accessTokenSecret: "SECRET",
            storagePath: storagePath + "/UserExists"
        });

        it("UserExists should return true when the user exist", async () => {
            const actual = (await sut.UserExists("admin")).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.true;
        });

        it("UserExists should return false when the user doesn't exist", async () => {
            const actual = (await sut.UserExists("NoneExistentUser")).data;

            expect(actual).to.be.a("boolean");
            expect(actual).to.be.false;
        });
    });


    after(() => {
        fs.rmSync(storagePath, {
            force: true,
            recursive: true
        });
    });
});