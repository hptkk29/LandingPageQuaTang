"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
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
  /**
   * Chế độ gọn: chỉ hiện 3 trường BẮT BUỘC (tên con, SĐT, cơ sở); 5 trường
   * không bắt buộc nằm trong khối "Thêm thông tin" mở/đóng được.
   * Dùng cho form hero cột hẹp — phụ huynh thấy toàn bộ form ngay màn hình đầu.
   * Các trường ẩn vẫn được register + gửi kèm (chỉ ẩn bằng CSS) nên dữ liệu
   * sang MISA không đổi.
   */
  compact?: boolean;
};

/** Các field không bắt buộc — dùng để quyết định có bung khối mở rộng khi lỗi. */
const OPTIONAL_KEYS = ["ho_ten_ph", "email", "truong", "lop", "tinh"] as const;

type FieldProps = {
  name: keyof LeadInput;
  label: string;
  required?: boolean;
  errors: FieldErrors<LeadInput>;
  fallbackError: string;
  children: (id: string, invalid: boolean) => ReactNode;
  source: string;
};

function Field({
  name,
  label,
  required,
  errors,
  fallbackError,
  children,
  source,
}: FieldProps) {
  const id = `${name}-${source}`;
  const error = errors[name];
  const invalid = Boolean(error);

  return (
    <div className={`field ${invalid ? "show-err" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
      </label>
      {children(id, invalid)}
      <span className="err" id={`${id}-err`} role={invalid ? "alert" : undefined}>
        {error?.message ?? fallbackError}
      </span>
    </div>
  );
}

export function LeadForm({
  source = "v2",
  submitLabel = "Đăng ký học thử miễn phí →",
  compact = false,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // compact: khối 5 trường phụ mặc định đóng
  const [showMore, setShowMore] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  // Mở khối phụ: focus ô đầu tiên + đóng bằng phím Esc
  useEffect(() => {
    if (!showMore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMore(false);
    };
    document.addEventListener("keydown", onKey);
    popRef.current?.querySelector<HTMLInputElement>("input, select")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [showMore]);

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
        setIsSubmitting(false);
        return;
      }

      // Lead ĐÃ vào CRM — lỗi đo lường (pixel bị chặn/extension) không được
      // phép chặn phụ huynh sang trang cảm ơn.
      try {
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
      } catch (err) {
        console.error("[LeadForm] Tracking error:", err);
      }

      toast.success("Đăng ký thành công!");
      await new Promise((r) => setTimeout(r, 400));
      // Giữ nút disabled trong lúc điều hướng để tránh gửi trùng.
      router.push("/thank-you");
    } catch (err) {
      console.error("[LeadForm] Submit error:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      setIsSubmitting(false);
    }
  }

  /** Lỗi rơi vào field đang ẩn → tự bung khối mở rộng để phụ huynh thấy chỗ sửa. */
  function onInvalid(errs: FieldErrors<LeadInput>) {
    if (compact && OPTIONAL_KEYS.some((k) => errs[k])) setShowMore(true);
  }

  const optionalFields = (
    <>
      <Field
        name="ho_ten_ph"
        label="Họ tên phụ huynh"
        errors={errors}
        fallbackError="Họ tên không hợp lệ."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="text"
            placeholder="VD: Nguyễn Văn A"
            autoComplete="name"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("ho_ten_ph")}
          />
        )}
      </Field>

      <Field
        name="email"
        label="Email phụ huynh"
        errors={errors}
        fallbackError="Email không hợp lệ."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="email"
            inputMode="email"
            placeholder="(không bắt buộc)"
            autoComplete="email"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("email")}
          />
        )}
      </Field>

      <Field
        name="truong"
        label="Trường con đang học"
        errors={errors}
        fallbackError="Tên trường không hợp lệ."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="text"
            placeholder="VD: Trường Tiểu học Hoàng Văn Thụ"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("truong")}
          />
        )}
      </Field>

      <Field
        name="lop"
        label="Lớp con đang học"
        errors={errors}
        fallbackError="Lớp không hợp lệ."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="text"
            placeholder="VD: Lớp 4"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("lop")}
          />
        )}
      </Field>

      <Field
        name="tinh"
        label="Tỉnh/Thành phố"
        errors={errors}
        fallbackError="Vui lòng chọn tỉnh/thành phố."
        source={source}
      >
        {(id, invalid) => (
          <select
            id={id}
            className={`select ${invalid ? "invalid" : ""}`}
            defaultValue={DEFAULT_PROVINCE_ID}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("tinh")}
          >
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </Field>
    </>
  );

  return (
    <form
      className={`lead-form ${compact ? "lead-form--compact" : ""}`}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      data-source={source}
    >
      {/* Honeypot */}
      <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={`website-${source}`}>Website</label>
        <input id={`website-${source}`} type="text" autoComplete="off" tabIndex={-1} {...register("website")} />
      </div>

      <Field
        name="ho_ten_con"
        label="Họ và tên con"
        required
        errors={errors}
        fallbackError="Vui lòng nhập họ và tên con."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="text"
            placeholder="VD: Nguyễn Minh Khoa"
            autoComplete="off"
            enterKeyHint="next"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("ho_ten_con")}
          />
        )}
      </Field>

      {/* Form đầy đủ: họ tên phụ huynh + email đứng ngay sau tên con.
          Form gọn: 2 trường này nằm trong khối "Thêm thông tin". */}
      {!compact && optionalFields}

      <Field
        name="sdt"
        label="ĐT di động phụ huynh"
        required
        errors={errors}
        fallbackError="Số điện thoại chưa hợp lệ."
        source={source}
      >
        {(id, invalid) => (
          <input
            id={id}
            className={`input ${invalid ? "invalid" : ""}`}
            type="tel"
            inputMode="tel"
            placeholder="VD: 09xx xxx xxx"
            autoComplete="tel"
            enterKeyHint="next"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("sdt")}
          />
        )}
      </Field>

      <Field
        name="co_so"
        label="Chọn cơ sở học"
        required
        errors={errors}
        fallbackError="Vui lòng chọn cơ sở."
        source={source}
      >
        {(id, invalid) => (
          <select
            id={id}
            className={`select ${invalid ? "invalid" : ""}`}
            defaultValue={DEFAULT_BRANCH_VALUE}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-err` : undefined}
            {...register("co_so")}
          >
            {BRANCHES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      {compact && (
        <>
          <button
            type="button"
            className="more-toggle"
            onClick={() => setShowMore(true)}
            aria-expanded={showMore}
            aria-controls={`more-${source}`}
          >
            <span className="sign" aria-hidden>+</span>
            Thêm thông tin để xếp lớp nhanh hơn
            <small>(không bắt buộc)</small>
          </button>

          {/* Khối phụ NỔI ĐÈ lên thẻ form (position:absolute, inset:0) — mở ra
              không làm thẻ form cao thêm nên chiều cao section giữ nguyên.
              Luôn nằm trong DOM để giữ giá trị + gửi kèm; chỉ ẩn bằng CSS. */}
          <div
            id={`more-${source}`}
            className="more-pop"
            style={showMore ? undefined : { display: "none" }}
          >
            <div
              className="more-pop__backdrop"
              onClick={() => setShowMore(false)}
              aria-hidden
            />
            <div
              className="more-pop__panel"
              ref={popRef}
              role="dialog"
              aria-modal="true"
              aria-label="Thêm thông tin để xếp lớp nhanh hơn (không bắt buộc)"
            >
              <div className="more-pop__head">
                <b>Thêm thông tin <span>(không bắt buộc)</span></b>
                <button
                  type="button"
                  className="more-pop__close"
                  onClick={() => setShowMore(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              <div className="more-pop__body">{optionalFields}</div>

              <button
                type="button"
                className="btn btn--cta more-pop__done"
                onClick={() => setShowMore(false)}
              >
                Xong
              </button>
            </div>
          </div>
        </>
      )}

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
