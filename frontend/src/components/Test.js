import React from "react";
import Base from "./Base";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = Yup.object().shape({
  emailInput: Yup.string()
    .required("Please Input email")
    .email("Invalid Email"),
});

export default function Test() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Base title="React Hook Form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("emailInput")} />
        <input type="submit" />
      </form>
      <h1>{errors.emailInput && errors.emailInput.message}</h1>
    </Base>
  );
}
