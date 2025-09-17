"use client";

import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import UnstyledLink from "@/components/links/Unstyledlink";
// import withAuth from "@/components/hoc/withAuth";
// import UnstyledLink from "@/components/links/UnstyledLink";
// import { REG_EMAIL, REG_PASSWORD, REG_PHONE } from "@/constant/regex";
// import { RegisterRequest } from "@/types/register";
import { FormProvider, useForm } from "react-hook-form";
// import { useRegisterMutation } from "../hooks/mutation";
// import withAuth from "@/components/hoc/withAuth";

// export default withAuth(RegisterForm, "public");
export default function RegisterForm() {
  //#region  //*=========== Form ===========
//   const methods = useForm<RegisterRequest>({
  const methods = useForm({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;
  //#endregion //*======== Form ===========

  //#region  //*=========== Submit Handler ===========
//   const { mutate: mutateRegister, isPending } = useRegisterMutation();
//   const onSubmit = (data: RegisterRequest) => {
  const onSubmit = (data:any) => {
    const payload = {
      ...data,
      phone_number: `0${data.phone_number}`,
    };
    // mutateRegister(payload);
    // console.log(data);
  };
  //#endregion //*======== Submit Handler ===========

  return (
    <section className="relative flex h-max md:min-h-screen md:items-center justify-center">
      <section className="z-10 mx-8 py-10 md:ml-6 md:mr-12 lg:me-16 md:py-20 w-full lg:w-[65%]">
        <div className="mb-5 lg:mb-6 space-y-4">
          <Typography
            as="h1"
            variant="h4"
            font="Poppins"
            weight="bold"
            className="text-3xl"
          >
            REGISTRASI
          </Typography>
        </div>
        <section className="rounded-t-2xl">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="username"
                label="Nama"
                placeholder="Masukan nama lengkap"
                validation={{
                  required: "Nama Lengkap harus diisi",
                }}
              />
              <Input
                id="email"
                label="Email"
                placeholder="Masukan alamat email"
                validation={{
                  required: "Email harus diisi",
                //   pattern: {
                //     value: REG_EMAIL,
                //     message: "Format email tidak valid",
                //   },
                }}
                helperText="Format email: example@mail.com"
                helperTextClassName="text-slate-900 lg:text-sm"
              />
              <Input
                id="password"
                type="password"
                label="Kata Sandi "
                placeholder="Masukan kata sandi"
                validation={{
                  required: "Kata sandi harus diisi",
                //   pattern: {
                //     value: REG_PASSWORD,
                //     message: "Format kata sandi tidak valid",
                //   },
                }}
                helperText="Minimal 8 karakter"
                helperTextClassName="text-slate-900 lg:text-sm"
              />
              <Input
                id="phone_number"
                label="Nomor Telepon"
                type="number"
                placeholder="Masukan nomer telpon"
                validation={{
                  required: "Nomor Telepon harus diisi",
                //   pattern: {
                //     value: REG_PHONE,
                //     message: "Format nomor telepon tidak valid",
                //   },
                }}
                helperText="Contoh: 81234512345"
                helperTextClassName="text-slate-900 lg:text-sm"
                prefix="+62"
              />

              <Button
                type="submit"
                variant="slate"
                size="lg"
                className="w-full"
                // isLoading={isPending}
              >
                <Typography
                  as="p"
                  variant="btn"
                  weight="medium"
                  className="text-base text-white"
                >
                  Daftar
                </Typography>
              </Button>

              <Typography
                as="p"
                variant="c1"
                className="text-center text-slate-900"
              >
                Sudah punya akun?{" "}
                <UnstyledLink
                  href="/login"
                  className="font-bold text-slate-900 hover:underline"
                >
                  Masuk
                </UnstyledLink>
              </Typography>
            </form>
          </FormProvider>
        </section>
      </section>
    </section>
  );
}