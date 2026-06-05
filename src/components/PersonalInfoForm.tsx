"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./Button";
import type { PersonalInfo } from "@/lib/types";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  testDate: z.string().min(1, "Test date is required"),
  unitSystem: z.enum(["imperial", "metric"]),
  heightFeet: z.number().optional(),
  heightInches: z.number().optional(),
  heightCm: z.number().optional(),
  weightLbs: z.number().optional(),
  weightKg: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

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
      onSubmit={handleSubmit((data) => onSubmit(data as PersonalInfo))}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className={labelClass}>First Name</label>
          <input className={inputClass} {...register("firstName")} />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input className={inputClass} {...register("lastName")} />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" className={inputClass} {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Date of Birth</label>
          <input type="date" className={inputClass} {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Test Date</label>
          <input type="date" className={inputClass} {...register("testDate")} />
          {errors.testDate && (
            <p className="mt-1 text-sm text-red-600">{errors.testDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Measurement System</label>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="imperial"
              {...register("unitSystem")}
              className="text-teal-600"
            />
            <span className="text-sm text-slate-700">U.S. (Imperial)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="metric"
              {...register("unitSystem")}
              className="text-teal-600"
            />
            <span className="text-sm text-slate-700">Metric</span>
          </label>
        </div>
      </div>

      {unitSystem === "imperial" ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Feet</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("heightFeet", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>Inches</label>
            <input
              type="number"
              min={0}
              max={11}
              className={inputClass}
              {...register("heightInches", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>Pounds</label>
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
            <label className={labelClass}>Height (cm)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("heightCm", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={labelClass}>Weight (kg)</label>
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
        Continue to Assessment
      </Button>
    </form>
  );
}
