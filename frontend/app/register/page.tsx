"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "../api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/hooks/useUserStore";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await api.post("/auth/register", data);
      if (res.error) throw new Error(res.message);
      // Expect res.data to have { token }
      if (res.data?.token) {
        setCookie("jwt", res.data.token, { path: "/" });
        // Fetch user profile
        const profileRes = await api.get("/profile", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        setUser(profileRes.data);
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration successful");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      // Convert Zod error arrays to single string for each field
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        name: fieldErrors.name?.[0],
      });
      return;
    }
    setErrors({});
    mutation.mutate(form);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <Input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
