"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { updateUser } from "../actions/user";

const schema = z.object({
  fullName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  age: z.coerce.number(),
  gender: z.string(),
});

export function EditUserDialog({ user }: any) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: user,
  });

  const onSubmit = async (data: any) => {
    await updateUser(user.id, data);
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input {...form.register("fullName")} placeholder="Full Name" />
          <Input {...form.register("username")} placeholder="Username" />
          <Input {...form.register("email")} placeholder="Email" />
          <Input {...form.register("age")} type="number" placeholder="Age" />
          <Input {...form.register("gender")} placeholder="Gender" />

          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
