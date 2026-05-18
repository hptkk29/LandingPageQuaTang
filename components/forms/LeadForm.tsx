"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  leadSchema,
  type LeadInput,
  LOP_OPTIONS,
  CO_SO_OPTIONS,
} from "@/lib/schemas/lead";
import { submitLead } from "@/lib/api/submit-lead";

export function LeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      ho_ten: "",
      sdt: "",
      email: "",
      lop: undefined,
      truong: "",
      co_so: undefined,
      website: "",
    },
  });

  async function onSubmit(data: LeadInput) {
    setIsSubmitting(true);
    try {
      const res = await submitLead(data);
      if (res.ok) {
        toast.success(res.message);
        router.push("/thank-you");
      } else {
        toast.error(res.message ?? "Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Honeypot — ẩn khỏi user thật, bot sẽ điền */}
        <div
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <Label htmlFor="website">Website (do not fill)</Label>
          <Input
            id="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            {...form.register("website")}
          />
        </div>

        <FormField
          control={form.control}
          name="ho_ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Họ tên ba mẹ <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sdt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số điện thoại / Zalo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="0901234567"
                  autoComplete="tel"
                  inputMode="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (không bắt buộc)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="bame@gmail.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Lớp con đang học <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn lớp của con" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LOP_OPTIONS.map((lop) => (
                    <SelectItem key={lop} value={lop}>
                      {lop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="truong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trường con đang học (không bắt buộc)</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Trường Tiểu học Hoàng Văn Thụ"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="co_so"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Cơ sở ba mẹ muốn cho con học{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col gap-2"
                >
                  {CO_SO_OPTIONS.map((coSo) => (
                    <div key={coSo} className="flex items-center space-x-2">
                      <RadioGroupItem value={coSo} id={coSo} />
                      <Label
                        htmlFor={coSo}
                        className="font-normal cursor-pointer"
                      >
                        {coSo}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-6 text-base"
        >
          {isSubmitting ? "⏳ Đang gửi..." : "🎁 Nhận 5 buổi học MIỄN PHÍ"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Bằng cách đăng ký, ba mẹ đồng ý nhận tư vấn từ Sata Robo qua điện
          thoại/Zalo.
        </p>
      </form>
    </Form>
  );
}
