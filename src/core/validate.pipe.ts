import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata

        if (!metatype || !this.toValidate(metatype)) {
            return value
        }

        if (!value || Object.keys(value).length === 0) {
            throw new BadRequestException({
                message: 'Body cannot be empty'
            })
        }

        const object = plainToInstance(metatype, value)

        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true
        })

        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: this.formatErrors(errors)
            })
        }

        return value
    }

    private formatErrors(errors: any[]) {
        const result = {}

        errors.forEach(error => {
            const field = error.property
            const constraints = Object.values(error.constraints || {})

            result[field] = constraints
        })

        return result
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}