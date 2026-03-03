"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { type SignUpInput, SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm<SignUpInput>
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUpWithCredentials}
      formType={"SIGN_UP"}
    />
  );
};

export default SignUp;
