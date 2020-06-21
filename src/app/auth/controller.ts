import jwt from 'jsonwebtoken'
import AppService from 'utils/base/AppService'
import { Request,  UserAuth, User, Response } from 'types'
import { Controller } from 'utils/decorators/Controller'
import { Get, Post } from 'utils/decorators/Routes'
import Validator from 'utils/decorators/Validator'
import { LoginValidator } from './validator'
import { BadRequestError, UnauthorizedError } from 'restify-errors'
import { QueryBuilder } from 'knex'
import { LoginSchema } from 'types'
import bcrypt from 'bcrypt'
import serviceLocator from 'utils/serviceLocator'

@Controller('/auth', 'Authentication')
export default class UserController extends AppService {
  @Get('/csrf', { summary: 'Get csrf token' })
  async getCsrf({ csrfToken }: Request) {
    return {
      csrf: csrfToken(),
    }
  }

  @Get('/session', { summary: 'Get logged in user session' })
  async getSession({ user }: Request) {
    if (!user) {
      throw new UnauthorizedError('Invalid token')
    }
    return user
  }

  @Post('/login', { schema: LoginValidator, summary: 'Login to authorize requests' })
  @Validator(LoginValidator)
  async login({ params }: Request<LoginSchema>, res: Response) {
    const { email, password } = params
    const filter = (query: QueryBuilder) => query.where({ email })
    const [user] = await this.DB.filter<User>('user', filter)
    if (!user) {
      throw new BadRequestError('Invalid username or password')
    }
    const { id } = user
    const [{ password: hash_password }] = await this.DB.filter<UserAuth>('user_auth', { user_id: id })
    const match = await new Promise((resolve, reject) => {
      bcrypt.compare(password, hash_password, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
    if (!match) {
      throw new BadRequestError('Invalid username or password')
    }
    const { session, token } = await this.Model.auth.authenticateUser(user)
    await this.DB.updateById('user', { id: user.id, last_login_date: new Date().toISOString() })
    const redis = serviceLocator.get('redis')
    await redis.setAsync([session.id, JSON.stringify({
      ...session,
      user,
    })])
    res.setCookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return user
  }

  @Post('/logout', { summary: 'Logout current session' })
  async logout({ session }: Request, res: Response) {
    const response = await this.DB.deleteById('auth_session', session.id)
    const redis = serviceLocator.get('redis')
    await redis.delAsync(session.id)
    res.clearCookie('access_token', { path: '/' })
    return response
  }
}
