"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./Button";
import type { PersonalInfo } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type FormData = PersonalInfo;

interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfo>;
  onSubmit: (data: PersonalInfo) => void;
}

const inputClass =
  "w-full rounded-xl border border-sky-200 bg-white/90 px-4 py-3 text-[#1e3a5f] shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/25";

const labelClass = "mb-2 block text-sm font-medium text-sky-800";

export function PersonalInfoForm({
  defaultValues,
  onSubmit,
}: PersonalInfoFormProps) {
  const { t } = useLanguage();

  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, t.form.errors.firstName),
        lastName: z.string().min(1, t.form.errors.lastName),
        email: z.string().email(t.form.errors.email),
        phone: z.string().min(7, t.form.errors.phone),
        dateOfBirth: z.string().min(1, t.form.errors.dateOfBirth),
        testDate: z.string().min(1, t.form.errors.testDate),
        unitSystem: z.enum(["imperial", "metric"]),
        heightFeet: z.number().optional(),
        heightInches: z.number().optional(),
        heightCm: z.number().optional(),
        weightLbs: z.number().optional(),
        weightKg: z.number().optional(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      unitSystem: "imperial",
      testDate: new Date().toISOString().split("T")[0],
      ...defaultValues,
    },
  });

  const unitSystem = watch("unitSystem");

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className={labelClass}>{t.form.firstName}</label>
          <input className={inputClass} {...register("firstName")} />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t.form.lastName}</label>
          <input className={inputClass} {...register("lastName")} />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t.form.email}</label>
          <input type="email" className={inputClass} {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t.form.phone}</label>
          <input type="tel" className={inputClass} {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t.form.dateOfBirth}</label>
          <input type="date" className={inputClass} {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t.form.testDate}</label>
          <input type="date" className={inputClass} {...register("testDate")} />
          {errors.testDate && (
            <p className="mt-1 text-sm text-red-600">{errors.testDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.form.measurementSystem}</label>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="imperial"
              {...register("unitSystem")}
              className="text-teal-600"
            />
            <span className="text-sm text-slate-700">{t.form.imperial}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="metric"
              {...register("unitSystem")}
              className="text-teal-600"
            />
            <span className="text-sm text-slate-700">{t.form.metric}</span>
          </label>
        </div>
      </div>

      {unitSystem === "imperial" ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className={labelClass}>{t.form.feet}</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("heightFeet", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>{t.form.inches}</label>
            <input
              type="number"
              min={0}
              max={11}
              className={inputClass}
              {...register("heightInches", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>{t.form.pounds}</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("weightLbs", { valueAsNumber: true })}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <label className={labelClass}>{t.form.heightCm}</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("heightCm", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>{t.form.weightKg}</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("weightKg", { valueAsNumber: true })}
            />
          </div>
        </div>
      )}

      <Button type="submit" size="lg" fullWidth className="mt-2">
        {t.form.continue}
      </Button>
    </form>
  );
}
