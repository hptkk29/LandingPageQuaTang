"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  leadSchema,
  type LeadInput,
  LOP_OPTIONS,
  CO_SO_OPTIONS,
} from "@/lib/schemas/lead";
import { submitLead } from "@/lib/api/submit-lead";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";
import { trackGAEvent } from "@/components/analytics/GoogleAnalytics";

type Props = {
  source?: string;
  submitLabel?: string;
};

export function LeadForm({
  source = "v2",
  submitLabel = "Nhận 5 buổi miễn phí →",
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
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
        trackMetaEvent("Lead", {
          content_name: "5 buổi RoboSim MIỄN PHÍ",
          content_category: "Robotics Education",
          value: 0,
          currency: "VND",
        });
        trackMetaEvent("CompleteRegistration", {
          content_name: "5 buổi RoboSim MIỄN PHÍ",
          status: true,
          value: 0,
          currency: "VND",
        });
        trackGAEvent("generate_lead", {
          form_name: "quatang-robosim",
          co_so: data.co_so,
          lop: data.lop,
        });
        trackGAEvent("sign_up", { method: "landing-page-form", co_so: data.co_so });

        toast.success(res.message);
        await new Promise((r) => setTimeout(r, 500));
        router.push("/thank-you");
      } else {
        toast.error(res.message ?? "Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="lead-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      data-source={source}
    >
      {/* Honeypot */}
      <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={`website-${source}`}>Website</label>
        <input id={`website-${source}`} type="text" autoComplete="off" tabIndex={-1} {...register("website")} />
      </div>

      <div className={`field ${errors.ho_ten ? "show-err" : ""}`}>
        <label>Tên phụ huynh <span className="req">*</span></label>
        <input className={`input ${errors.ho_ten ? "invalid" : ""}`} type="text" placeholder="VD: Nguyễn Văn A" autoComplete="name" {...register("ho_ten")} />
        <span className="err">{errors.ho_ten?.message ?? "Vui lòng nhập tên phụ huynh."}</span>
      </div>

      <div className={`field ${errors.sdt ? "show-err" : ""}`}>
        <label>Số điện thoại <span className="req">*</span></label>
        <input className={`input ${errors.sdt ? "invalid" : ""}`} type="tel" inputMode="tel" placeholder="VD: 0818 823 720" autoComplete="tel" {...register("sdt")} />
        <span className="err">{errors.sdt?.message ?? "Số điện thoại chưa hợp lệ."}</span>
      </div>

      <div className={`field ${errors.email ? "show-err" : ""}`}>
        <label>Email (không bắt buộc)</label>
        <input className={`input ${errors.email ? "invalid" : ""}`} type="email" placeholder="bame@gmail.com" autoComplete="email" {...register("email")} />
        <span className="err">{errors.email?.message ?? "Email không hợp lệ."}</span>
      </div>

      <div className={`field ${errors.lop ? "show-err" : ""}`}>
        <label>Lớp con đang học <span className="req">*</span></label>
        <select className={`select ${errors.lop ? "invalid" : ""}`} defaultValue="" {...register("lop")}>
          <option value="" disabled>Chọn lớp của con</option>
          {LOP_OPTIONS.map((lop) => (
            <option key={lop} value={lop}>{lop}</option>
          ))}
        </select>
        <span className="err">{errors.lop?.message ?? "Vui lòng chọn lớp."}</span>
      </div>

      <div className={`field ${errors.truong ? "show-err" : ""}`}>
        <label>Trường con đang học <span className="req">*</span></label>
        <input className={`input ${errors.truong ? "invalid" : ""}`} type="text" placeholder="VD: Trường Tiểu học Hoàng Văn Thụ" {...register("truong")} />
        <span className="err">{errors.truong?.message ?? "Vui lòng nhập tên trường của con."}</span>
      </div>

      <div className={`field ${errors.co_so ? "show-err" : ""}`}>
        <label>Cơ sở mong muốn <span className="req">*</span></label>
        <select className={`select ${errors.co_so ? "invalid" : ""}`} defaultValue="" {...register("co_so")}>
          <option value="" disabled>Chọn cơ sở</option>
          {CO_SO_OPTIONS.map((cs) => (
            <option key={cs} value={cs}>{cs}</option>
          ))}
        </select>
        <span className="err">{errors.co_so?.message ?? "Vui lòng chọn cơ sở."}</span>
      </div>

      <button className="btn btn--cta btn--lg btn--pulse" type="submit" style={{ width: "100%" }} disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi..." : submitLabel}
      </button>

      <p className="form-foot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>{" "}
        Thông tin của bạn được bảo mật tuyệt đối.
      </p>
    </form>
  );
}
