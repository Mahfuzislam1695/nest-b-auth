import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidName',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    // Check if the value is at least 3 characters long
                    if (value.length < 3) {
                        return false;
                    }

                    // Check if the value contains at least 1 alphabetic character
                    return /[a-zA-Z]/.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must contain at least 1 alphabetic character and be at least 3 characters long.`;
                },
            },
        });
    };
}