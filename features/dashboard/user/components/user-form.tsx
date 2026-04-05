"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { userFormSchema } from "../schema/user-form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { createUser } from "../actions/user";

const UserForm = () => {
  const [photo, setPhoto] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      age: 0,
      gender: "",
      email: "",
      photo: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    setIsSubmited(true);

    const res = await createUser(data);
    if (res.error) {
      toast(res.message);
    }

    toast("User Created!");
    setIsSubmited(false);
    form.reset();
    setPhoto("");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto w-full"
    >
      <FieldGroup>
        <div className="flex flex-row items-center justify-between gap-7">
          <Controller
            control={form.control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <div className="flex flex-row items-center justify-between gap-7">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="age"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
        <div className="flex flex-row items-center justify-between gap-7">
          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"male"}>Male</SelectItem>
                    <SelectItem value={"female"}>Female</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="photo"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Photo</FieldLabel>
                <Card>
                  <CardContent className="flex items-center flex-col gap-1">
                    {photo && (
                      <Image src={photo} alt="image" width={200} height={200} />
                    )}

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        toast("Upload Completed");
                        setPhoto(res[0].ufsUrl);
                        field.onChange(res[0].ufsUrl);
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        toast(`ERROR! ${error.message}`);
                        console.log(error);
                      }}
                    />
                  </CardContent>
                </Card>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
        <Button type="submit" className="w-fit" disabled={isSubmited}>
          {isSubmited ? (
            <>
              Creating <Spinner />
            </>
          ) : (
            "Create"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UserForm;
