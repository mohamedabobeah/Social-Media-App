import * as zod from "zod";

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Min length is 3 chars")
      .max(10, "Max length is 10 chars"),

    email: zod
      .string()
      .nonempty("Email is required")
      .email("Invalid email"),

    dateOfBirth: zod
      .string()
      .nonempty("Date is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear();
        const nowDate = new Date().getFullYear();

        return nowDate - userDate >= 10;
      }, "You must be at least 10 years old"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
        "Password must contain 1 number, 1 uppercase, 1 lowercase, 1 special character and be 8-16 characters"
      ),

    rePassword: zod
      .string()
      .nonempty("Confirm password is required"),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    path: ["rePassword"],
    message: "Password and rePassword do not match",
  });

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

// ------------------------------------------------

export const LoginSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .email("Invalid email"),

  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
      "Password must contain 1 number, 1 uppercase, 1 lowercase, 1 special character and be 8-16 characters"
    ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;