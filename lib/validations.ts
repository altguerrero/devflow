import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const QUESTION_TITLE_MIN_LENGTH = 10;
const QUESTION_TITLE_MAX_LENGTH = 120;
const QUESTION_BODY_MIN_LENGTH = 20;
const QUESTION_BODY_MAX_LENGTH = 5000;
const QUESTION_TAG_MIN_LENGTH = 1;
const QUESTION_TAG_MAX_LENGTH = 20;
const QUESTION_TAG_MIN_COUNT = 1;
const QUESTION_TAG_MAX_COUNT = 5;

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email address"));

const passwordField = z
  .string()
  .trim()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/\d/, "Password must include at least one number");

const signInPasswordField = z.string().min(1, "Password is required");

export const SignInSchema = z.object({
  email: emailField,
  password: signInPasswordField,
});

export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  email: emailField,
  password: passwordField,
});

export const SignUpSchema = UserSchema.extend({
  confirmPassword: z.string().trim().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type UserInput = z.infer<typeof UserSchema>;

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      QUESTION_TITLE_MIN_LENGTH,
      `Title must be at least ${QUESTION_TITLE_MIN_LENGTH} characters`
    )
    .max(QUESTION_TITLE_MAX_LENGTH, `Title must be at most ${QUESTION_TITLE_MAX_LENGTH} characters`)
    .refine((value) => /[a-zA-Z0-9]/.test(value), "Title must include letters or numbers"),
  body: z
    .string()
    .trim()
    .min(QUESTION_BODY_MIN_LENGTH, `Body must be at least ${QUESTION_BODY_MIN_LENGTH} characters`)
    .max(QUESTION_BODY_MAX_LENGTH, `Body must be at most ${QUESTION_BODY_MAX_LENGTH} characters`)
    .refine(
      (value) => value.split(/\s+/).length >= 5,
      "Body must include enough detail (at least 5 words)"
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .min(QUESTION_TAG_MIN_LENGTH, "Tag cannot be empty")
        .max(
          QUESTION_TAG_MAX_LENGTH,
          `Each tag must be at most ${QUESTION_TAG_MAX_LENGTH} characters`
        )
        .regex(/^[a-z0-9-]+$/, "Tags can only contain lowercase letters, numbers, and hyphens")
    )
    .min(QUESTION_TAG_MIN_COUNT, `Please add at least ${QUESTION_TAG_MIN_COUNT} tag`)
    .max(QUESTION_TAG_MAX_COUNT, `Please add at most ${QUESTION_TAG_MAX_COUNT} tags`)
    .refine((tags) => new Set(tags).size === tags.length, "Tags must be unique"),
});

export type AskQuestionInput = z.infer<typeof AskQuestionSchema>;
