"use client";

import { type AskQuestionInput, AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const MdxEditor = dynamic(() => import("@/components/editor/MdxEditor"), {
  ssr: false,
  loading: () => (
    <div className="background-light900_dark300 light-border-2 text-dark300_light700 min-h-52 w-full rounded-md border p-4">
      Loading editor...
    </div>
  ),
});

const QuestionForm = () => {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<AskQuestionInput>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      body: "",
      tags: [],
    },
  });

  const tags = useWatch({ control: form.control, name: "tags" }) ?? [];

  const normalizeTag = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

  const addTag = () => {
    const normalizedTag = normalizeTag(tagInput);
    const currentTags = form.getValues("tags");

    if (!normalizedTag) {
      setTagInput("");
      return;
    }

    if (currentTags.includes(normalizedTag)) {
      form.setError("tags", { message: "This tag already exists" });
      return;
    }

    if (currentTags.length >= 5) {
      form.setError("tags", { message: "You can add up to 5 tags" });
      return;
    }

    form.clearErrors("tags");
    form.setValue("tags", [...currentTags, normalizedTag], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = form.getValues("tags").filter((tag) => tag !== tagToRemove);
    form.setValue("tags", nextTags, { shouldValidate: true, shouldDirty: true });
  };

  const handleCreateQuestion: SubmitHandler<AskQuestionInput> = async (data) => {
    console.log("Creating question with data:", data);
    toast.success("Question validated and ready to submit");
  };

  return (
    <form
      className="mt-8 space-y-8"
      id="question-form"
      onSubmit={form.handleSubmit(handleCreateQuestion)}
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex w-full flex-col">
              <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor={field.name}>
                Question Title <span className="text-primary-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter question title"
                type="text"
                className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 placeholder no-focus min-h-12 border"
              />
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another person.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="body"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex w-full flex-col">
              <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor={field.name}>
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FieldLabel>
              <MdxEditor
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Describe your issue, what you expected, and what you already tried..."
              />
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you put in the title.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="tags"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex w-full flex-col">
              <FieldLabel
                className="paragraph-semibold text-dark400_light800"
                htmlFor="question-tags"
              >
                Tags <span className="text-primary-500">*</span>
              </FieldLabel>

              <Input
                id="question-tags"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder="Add tags (press Enter or comma)"
                className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 placeholder no-focus min-h-12 border"
              />
              <div className="flex-start flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <TagCard
                    key={tag}
                    _id={tag}
                    name={tag}
                    compact
                    remove
                    isButton
                    handleRemove={() => removeTag(tag)}
                  />
                ))}
              </div>
              <FieldDescription className="body-regular text-light-500">
                Add between 1 and 5 tags (lowercase, numbers, hyphens). Example: react-hooks
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-16 flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium text-light-900! min-h-12 px-6 py-3"
        >
          {form.formState.isSubmitting ? "Publishing..." : "Publish Question"}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
