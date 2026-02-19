"use client";

import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FieldGroup, Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import ROUTES from "@/constants/routes";
import Link from "next/link";

import type { ActionResponse } from "@/types/global";

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ schema, defaultValues, onSubmit, formType }: AuthFormProps<T>) => {
  const form = useForm<T>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (!result.success) {
      toast.error("Authentication failed", {
        description: result.error.message,
      });
      return;
    }

    toast.success(formType === "SIGN_IN" ? "Signed in successfully" : "Account created successfully");
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
  const fieldNames = Object.keys(defaultValues) as Array<Path<T>>;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} id="auth-form" className="mt-10 space-y-6">
      {fieldNames.map((fieldName) => (
        <FieldGroup key={fieldName}>
          <Controller
            name={fieldName}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="paragraph-medium text-dark400_light700" htmlFor={fieldName}>
                  {fieldName === "email" ? "Email Address" : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </FieldLabel>
                <Input
                  {...field}
                  required
                  id={fieldName}
                  aria-invalid={fieldState.invalid}
                  placeholder={fieldName}
                  type={fieldName.toLowerCase().includes("password") ? "password" : "text"}
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      ))}

      <Button
        disabled={form.formState.isSubmitting}
        className="primary-gradient paragraph-medium rounded-2 font-inter text-light-900! min-h-12 w-full px-4 py-3"
      >
        {form.formState.isSubmitting ? (buttonText === "Sign In" ? "Signing In..." : "Signing Up...") : buttonText}
      </Button>

      {formType === "SIGN_IN" ? (
        <p>
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link href={ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient">
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
