"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useLogin } from "../api/use-login";
import { Loader } from "lucide-react";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none dark:bg-neutral-800">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator className="dark:bg-neutral-700" />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="dark:bg-neutral-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="dark:bg-neutral-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="lg" className="w-full">
              {isPending ? (
                <>
                  <Loader className="animate-spin size-10" /> Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator className="dark:bg-neutral-700" />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          onClick={() => signUpWithGoogle()}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          {isPending ? (
            <>
              <Loader className="animate-spin size-10" /> Loading...
            </>
          ) : (
            "Login with Google"
          )}
        </Button>
        <Button
          onClick={() => signUpWithGithub()}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          {isPending ? (
            <>
              <Loader className="animate-spin size-10" /> Loading...
            </>
          ) : (
            "Login with Github"
          )}
        </Button>
      </CardContent>
      <div className="px-7">
        <Separator className="dark:bg-neutral-700" />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-700">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
