"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { type SignInInput, SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm<SignInInput>
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredentials}
      formType={"SIGN_IN"}
    />
  );
};

export default SignIn;
