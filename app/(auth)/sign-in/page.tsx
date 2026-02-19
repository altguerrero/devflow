"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={async (data) => {
        void data;
        return { success: false, error: { message: "Authentication failed" } };
      }}
      formType={"SIGN_IN"}
    />
  );
};

export default SignIn;
