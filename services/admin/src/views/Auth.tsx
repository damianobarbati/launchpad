import { actions } from "@admin/reducer/app";
import type { AppDispatch } from "@admin/store";
import { MPOST } from "@common/helpers";
import { Button } from "@ui/component/Button";
import { Input } from "@ui/control/Input";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useSWRMutation from "swr/mutation";

type FormValues = {
  email: string;
  password: string;
};

type Props = {
  onSuccess: string;
};

const Auth: React.FC<Props> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const formMethods = useForm<FormValues>({
    mode: "onTouched",
    criteriaMode: "all",
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });
  const { handleSubmit, formState } = formMethods;

  const { trigger, error } = useSWRMutation<FormValues>("/auth/login", MPOST);

  const onSubmit = async (values: FormValues) => {
    // @ts-ignore
    const token: string = await trigger({ email: values.email, password: values.password });
    dispatch(actions.login({ token }));
    navigate(onSuccess);
  };

  React.useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      dispatch(actions.login({ token }));
      navigate(onSuccess);
    }
  }, [searchParams, dispatch, navigate, onSuccess]);

  const onGoogleSignIn = Function.prototype;

  return (
    <main
      className="fixed left-0 top-0 h-screen w-screen overflow-auto"
      style={{ background: "linear-gradient(111.34deg, #00CBE0 0%, #006BFA 33.33%, #1B1CDD 66.67%, #640BED 100%)" }}
    >
      <FormProvider {...formMethods}>
        <form
          className="paper !absolute left-1/2 top-1/2 m-auto w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-xl border pt-16"
          autoCorrect={"off"}
          autoComplete={"off"}
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="mb-6 flex w-full items-center justify-center">
              <img alt="logo" src="/atlas-path-logo.svg" width={300} />
            </div>
            <span className="my-4 inline text-center text-gray-500">Log in with your credentials</span>
            <div className="flex w-full flex-col items-center gap-4">
              <Input
                className="w-full"
                name={"email"}
                label={"Email address"}
                autoFocus={true}
                type={"email"}
                registerOptions={{
                  validate: { required: (value) => (value ? undefined : "Email can't be empty.") },
                }}
              />
              <Input
                className="w-full"
                name={"password"}
                label={"Password"}
                type={"password"}
                registerOptions={{ validate: { required: (value) => (value ? undefined : "Password can't be empty.") } }}
              />
              <Button className="blue mt-4 gap-1" type={"submit"} disabled={!formState.isValid} loading={formState.isSubmitting}>
                LOGIN
              </Button>
            </div>
            {formState.isSubmitted && !formState.isSubmitSuccessful && (
              // tofix: errors must be localised on the frontend using constants, we should avoid using strings returned by the BE
              <section className="mt-4 grid grid-flow-col justify-center text-center text-red-700">
                {typeof error?.response?.data === "string" ? error.response.data : "Credentials are invalid."}
              </section>
            )}
            <Link to="/password-request" className="button-link flex h-10 w-full items-center justify-center">
              Forgot password?
            </Link>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default Auth;
