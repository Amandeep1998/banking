"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Validations
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authFormSchema } from "@/lib/utils";
import SignUp from "@/app/(auth)/sign-up/page";
import { signUp, signIn } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);

  const [loading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  });

  // 2. Define a submit handler.

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("data", data);
    try {
      setIsLoading(true);

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push("/");
      }

      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }
    } catch {
      console.log("errors");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex-col-6 gap:5 md:gap-8">
        <Link href="/" className="mb-12 cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon Logo"
            className="size-[24px] max-xl:size-14"
          ></Image>
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link Your Account To Get Started"
                : "Please Enter Your Details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="Firstname"
                      placeholder="Enter Your First Name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Lastname"
                      placeholder="Enter Your Last Name"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter Your Address"
                  />

                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter Your City"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="state"
                      placeholder="Enter Your State"
                    />

                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Enter Your Postal Code"
                    />
                  </div>

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date Of Birth"
                      placeholder="YYYY-MM-DD"
                    />

                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="1234"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter Your Email"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter Your Password"
              />

              <div className="flex flex-col gap-4">
                <Button className="form-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal">
              {type === "sign-in"
                ? "Don't have an account ?"
                : "Already have an account ?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
