import { ZodError, ZodSchema, z } from "zod";

export type ValidationOutcome = {
  isValid: boolean;
  errors: string[];
};

export type ValidationResult = {
  isValid: boolean;
  errors: (ZodError | null)[];
};

export const validateParams = <T>(
  schema: z.ZodSchema<T>,
  params: T,
): ValidationOutcome => {
  const result = schema.safeParse(params);

  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => {
      const path = err.path.join(".");
      return path ? `${path}: ${err.message}` : err.message;
    });
    // Log errors
    errorMessages.forEach((msg) =>
      console.debug(`[DEBUG] Validation Error: ${msg}`),
    );
    return { isValid: false, errors: errorMessages };
  }

  return { isValid: true, errors: [] };
};

export function validateMultiple<
  Values extends readonly unknown[],
  Schemas extends { [K in keyof Values]: ZodSchema<Values[K]> },
>(values: Values, schemas: Schemas): ValidationResult {
  const errors: (ZodError | null)[] = [];
  let isValid = true;

  for (let i = 0; i < values.length; i++) {
    const schema = schemas[i];
    const value = values[i];
    const result = schema.safeParse(value);

    if (!result.success) {
      isValid = false;
      errors[i] = result.error;
    } else {
      errors[i] = null;
    }
  }

  if (!isValid) {
    errors.forEach((err) => {
      if (err) {
        console.debug(`[DEBUG] Validation Error: ${err.message}`);
      }
    });
  } else {
    console.debug("[DEBUG] Validation successful");
  }

  return { isValid, errors };
}

export function logValidationErrors(errors: string[]) {
  errors.forEach((msg) => console.debug(`[DEBUG] Validation Error: ${msg}`));
}
