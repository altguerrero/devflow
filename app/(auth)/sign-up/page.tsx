"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={async (data) => {
        void data;
        return { success: false, error: { message: "Authentication failed" } };
      }}
      formType={"SIGN_UP"}
    />
  );
};

export default SignUp;
