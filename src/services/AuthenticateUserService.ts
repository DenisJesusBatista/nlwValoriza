import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({ email, password }: IAuthenticateRequest) {

        const usersRepository = getCustomRepository(UsersRepositories);

        //Verificar se email existe
        const user = await usersRepository.findOne({
            email
        });

        if (!user) {
            throw new Error("Email/Password incorrect")
        }

        //Verificar se senha está correta

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error("Email/Password incorrect")

        }


        //Gerar token
        const token = sign(
            {
                email: user.email
            },
            "e3c655cdcb0d7741cd41621f7b704bb3" /*https://www.md5hashgenerator.com/*/,
            {
                subject: user.id,
                expiresIn: "1d"

            }
        );

        return token;


    }

}

export { AuthenticateUserService };