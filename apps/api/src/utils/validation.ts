import { validateOrReject } from 'class-validator';
import { UserInputError } from 'apollo-server-express';

export class InputValidator {
  async validate() {
    try {
      await validateOrReject(this)
    } catch (err) {
      throw new UserInputError('Invalid input', {
        invalidArgs: err
      })
    }
  }
}
