"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { leadSchema, type LeadInput, LEAD_DEFAULTS } from "@/lib/schemas/lead";
import {
  BRANCHES,
  PROVINCES,
  DEFAULT_BRANCH_VALUE,
  DEFAULT_PROVINCE_ID,
} from "@/lib/constants/misa";
import { submitLead } from "@/lib/api/submit-lead";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";
import { trackGAEvent } from "@/components/analytics/GoogleAnalytics";

type Props = {
  source?: string;
  submitLabel?: string;
};

export function LeadForm({
  source = "v2",
  submitLabel = "Đăng ký học thử miễn phí →",
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: LEAD_DEFAULTS,
  });

  async function onSubmit(data: LeadInput) {
    setIsSubmitting(true);
    try {
      // Honeypot: bot điền field ẩn → giả vờ thành công, KHÔNG đẩy sang CRM
      if (data.website && data.website.length > 0) {
        router.push("/thank-you");
        return;
      }

      // Gửi qua API server duy nhất — server lo MISA CRM + Google Sheet backup
      // (thành công nếu dữ liệu vào được ít nhất một nơi)
      const res = await submitLead(data);
      if (!res.ok) {
        toast.error(res.message ?? "Có lỗi xảy ra, vui lòng thử lại");
        return;
      }

      trackMetaEvent("Lead", {
        content_name: "Đăng ký học thử Kỹ sư nhí",
        content_category: "Robotics Education",
        value: 0,
        currency: "VND",
      });
      trackMetaEvent("CompleteRegistration", {
        content_name: "Đăng ký học thử Kỹ sư nhí",
        status: true,
        value: 0,
        currency: "VND",
      });
      trackGAEvent("generate_lead", {
        form_name: "quatang-misa",
        co_so: data.co_so,
      });
      trackGAEvent("sign_up", { method: "landing-page-form", co_so: data.co_so });

      toast.success("Đăng ký thành công!");
      await new Promise((r) => setTimeout(r, 400));
      router.push("/thank-you");
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

      <div className={`field ${errors.ho_ten_con ? "show-err" : ""}`}>
        <label>Họ và tên con <span className="req">*</span></label>
        <input className={`input ${errors.ho_ten_con ? "invalid" : ""}`} type="text" placeholder="VD: Nguyễn Minh Khoa" autoComplete="off" {...register("ho_ten_con")} />
        <span className="err">{errors.ho_ten_con?.message ?? "Vui lòng nhập họ và tên con."}</span>
      </div>

      <div className={`field ${errors.ho_ten_ph ? "show-err" : ""}`}>
        <label>Họ tên phụ huynh</label>
        <input className={`input ${errors.ho_ten_ph ? "invalid" : ""}`} type="text" placeholder="VD: Nguyễn Văn A" autoComplete="name" {...register("ho_ten_ph")} />
        <span className="err">{errors.ho_ten_ph?.message ?? "Họ tên không hợp lệ."}</span>
      </div>

      <div className={`field ${errors.sdt ? "show-err" : ""}`}>
        <label>ĐT di động phụ huynh <span className="req">*</span></label>
        <input className={`input ${errors.sdt ? "invalid" : ""}`} type="tel" inputMode="tel" placeholder="VD: 09xx xxx xxx" autoComplete="tel" {...register("sdt")} />
        <span className="err">{errors.sdt?.message ?? "Số điện thoại chưa hợp lệ."}</span>
      </div>

      <div className={`field ${errors.email ? "show-err" : ""}`}>
        <label>Email phụ huynh</label>
        <input className={`input ${errors.email ? "invalid" : ""}`} type="email" placeholder="(không bắt buộc)" autoComplete="email" {...register("email")} />
        <span className="err">{errors.email?.message ?? "Email không hợp lệ."}</span>
      </div>

      <div className={`field ${errors.truong ? "show-err" : ""}`}>
        <label>Trường con đang học</label>
        <input className={`input ${errors.truong ? "invalid" : ""}`} type="text" placeholder="VD: Trường Tiểu học Hoàng Văn Thụ" {...register("truong")} />
        <span className="err">{errors.truong?.message ?? "Tên trường không hợp lệ."}</span>
      </div>

      <div className={`field ${errors.lop ? "show-err" : ""}`}>
        <label>Lớp con đang học</label>
        <input className={`input ${errors.lop ? "invalid" : ""}`} type="text" placeholder="VD: Lớp 4" {...register("lop")} />
        <span className="err">{errors.lop?.message ?? "Lớp không hợp lệ."}</span>
      </div>

      <div className={`field ${errors.co_so ? "show-err" : ""}`}>
        <label>Chọn cơ sở <span className="req">*</span></label>
        <select className={`select ${errors.co_so ? "invalid" : ""}`} defaultValue={DEFAULT_BRANCH_VALUE} {...register("co_so")}>
          {BRANCHES.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <span className="err">{errors.co_so?.message ?? "Vui lòng chọn cơ sở."}</span>
      </div>

      <div className={`field ${errors.tinh ? "show-err" : ""}`}>
        <label>Tỉnh/Thành phố</label>
        <select className={`select ${errors.tinh ? "invalid" : ""}`} defaultValue={DEFAULT_PROVINCE_ID} {...register("tinh")}>
          {PROVINCES.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span className="err">{errors.tinh?.message ?? "Vui lòng chọn tỉnh/thành phố."}</span>
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
