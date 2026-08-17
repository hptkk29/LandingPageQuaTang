"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ACHIEVEMENTS,
  CAMPUSES,
  STUDY_MODES,
  covuaConfig,
  covuaContent,
  covuaHotlines,
  getAchievementGroup,
  isWinner,
} from "@/content/covua";
import {
  covuaFormDefaults,
  covuaLeadSchema,
  type CovuaLead,
  type CovuaLeadInput,
} from "@/lib/covua-form-schema";
import { PROVINCES } from "@/lib/constants/misa";
import type { LeadApiResponse } from "@/lib/types/api";
import {
  setMetaUserData,
  trackMetaCustomEvent,
} from "@/components/analytics/MetaPixel";
import { trackGAEvent } from "@/components/analytics/GoogleAnalytics";

const F = covuaContent.form;
const E = covuaContent.errors;
const S = covuaContent.success;

/** Bắn event cho cả GA4 lẫn Meta Pixel (event tự định nghĩa → trackCustom). */
function track(event: string, params?: Record<string, unknown>) {
  trackGAEvent(event, params);
  trackMetaCustomEvent(event, params);
}

/** slug họ tên cho khóa chống trùng sessionStorage (bỏ dấu, thường hóa). */
function slugName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-");
}

function hotlineDigits(hotline: string): string {
  return hotline.replace(/\D/g, "");
}

/** Mỗi hotline một link tel: riêng, nối bằng " hoặc " khi có nhiều số. */
function HotlineLinks() {
  return (
    <>
      {covuaHotlines.map((h, i) => (
        <span key={h}>
          {i > 0 && " hoặc "}
          <a href={`tel:${hotlineDigits(h)}`}>{h}</a>
        </span>
      ))}
    </>
  );
}

type FieldWrapProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  note?: string;
  children: ReactNode;
};

function FieldWrap({ id, label, required, error, note, children }: FieldWrapProps) {
  return (
    <div className={`field ${error ? "show-err" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {note && <p className="covua-field-note">{note}</p>}
      <span className="err" id={`${id}-err`} role={error ? "alert" : undefined}>
        {error ?? ""}
      </span>
    </div>
  );
}

export function CovuaLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<CovuaLead | null>(null);
  const [serverError, setServerError] = useState(false);
  const formStarted = useRef(false);
  // Giữ NGUYÊN idempotencyKey khi bấm gửi lại sau lỗi — satarobo dựa vào nó
  // để retry không tạo bản ghi thứ hai. Chỉ sinh mới sau khi gửi thành công.
  const idempotencyKey = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<CovuaLeadInput, undefined, CovuaLead>({
    resolver: zodResolver(covuaLeadSchema),
    defaultValues: covuaFormDefaults,
  });

  // ref/utm ẩn: đọc từ query string; ref giữ qua reload bằng sessionStorage
  // (docs covua 04 §1). Cookie affiliate /r/ của trang cũ không dùng ở đây.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refFromUrl = params.get("ref")?.trim() ?? "";
      if (refFromUrl) sessionStorage.setItem("covua_ref", refFromUrl);
      const ref = refFromUrl || sessionStorage.getItem("covua_ref") || "";
      if (ref) setValue("ref", ref.slice(0, 50));
      const utm = (k: string) => params.get(k)?.trim().slice(0, 80) ?? "";
      if (utm("utm_source")) setValue("utmSource", utm("utm_source"));
      if (utm("utm_medium")) setValue("utmMedium", utm("utm_medium"));
      if (utm("utm_campaign")) setValue("utmCampaign", utm("utm_campaign"));
    } catch {
      /* thiếu ref/utm không bao giờ được chặn form */
    }
  }, [setValue]);

  const achievement = watch("achievement");
  const studyMode = watch("studyMode");
  const campus = watch("campus") ?? null;

  const group = getAchievementGroup(achievement);
  const showStudyMode = group === "A";
  const showCampus = group === "A" && studyMode === "BOTH";

  /**
   * Quy tắc phụ thuộc (docs covua 04 §2) — reset THẬT trong form state,
   * không chỉ ẩn bằng CSS:
   *   sang THAM_GIA:  studyMode=ONLINE_ONLY, campus=null (bắt buộc reset)
   *   sang nhóm A:    studyMode=BOTH,        campus=null (chờ người dùng chọn)
   * Schema transform là chốt chặn thứ hai phía server.
   */
  function onAchievementChange(value: string) {
    if (!value) return;
    track("covua_achievement_select", {
      achievement_group: getAchievementGroup(value),
    });
    if (isWinner(value)) {
      setValue("studyMode", "BOTH");
      setValue("campus", null);
    } else {
      setValue("studyMode", "ONLINE_ONLY");
      setValue("campus", null);
    }
    clearErrors("campus");
  }

  function onStudyModeChange(value: string) {
    if (value === "ONLINE_ONLY") {
      setValue("campus", null);
      clearErrors("campus");
    }
  }

  function onFormFocus() {
    if (formStarted.current) return;
    formStarted.current = true;
    track("covua_form_start");
  }

  async function onValid(lead: CovuaLead) {
    // Chống trùng trong phiên: cùng SĐT + cùng tên thí sinh thì hỏi xác nhận
    // thay vì chặn — nhà có 2 con cùng dự giải là hợp lệ (docs covua 04 §7).
    const dupKey = `covua_submitted_${lead.parentPhone}_${slugName(lead.studentName)}`;
    try {
      if (sessionStorage.getItem(dupKey)) {
        const again = window.confirm(
          "Anh/chị vừa đăng ký cho bé này. Đăng ký thêm cho bé khác?"
        );
        if (!again) return;
      }
    } catch {
      /* sessionStorage bị chặn thì bỏ qua bước hỏi */
    }

    setIsSubmitting(true);
    setServerError(false);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    try {
      const res = await fetch("/api/lead-covua", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, idempotencyKey: idempotencyKey.current }),
      });
      const json = (await res.json().catch(() => null)) as LeadApiResponse | null;

      if (!json?.ok) {
        setServerError(true);
        setIsSubmitting(false);
        track("covua_lead_error", {
          reason: json && "error" in json ? json.error : `HTTP_${res.status}`,
        });
        return;
      }

      try {
        sessionStorage.setItem(dupKey, "1");
      } catch {
        /* không sao */
      }
      idempotencyKey.current = null;

      // Đo lường không bao giờ được chặn màn xác nhận. Advanced Matching chỉ
      // gửi SĐT + email PHỤ HUYNH — không gửi dữ liệu trẻ em (chuẩn MetaPixel).
      try {
        setMetaUserData({ phone: lead.parentPhone });
        track("covua_lead_submit", {
          achievement_group: getAchievementGroup(lead.achievement),
          study_mode: lead.studyMode,
          campus: lead.campus ?? "",
        });
      } catch {
        /* bỏ qua lỗi đo lường */
      }

      setSubmitted(lead);
      setIsSubmitting(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("[CovuaLeadForm] Submit error:", err);
      setServerError(true);
      setIsSubmitting(false);
      track("covua_lead_error", { reason: "NETWORK" });
    }
  }

  function onInvalid(errs: FieldErrors<CovuaLeadInput>) {
    // campus là select điều khiển tay (không register) nên RHF không tự focus
    if (errs.campus && !errs.achievement && cardRef.current) {
      cardRef.current
        .querySelector<HTMLSelectElement>("#covua-campus")
        ?.focus();
    }
  }

  /* ── Màn xác nhận (không reload trang) ── */
  if (submitted) {
    const campusLabel =
      CAMPUSES.find((c) => c.value === submitted.campus)?.shortLabel ??
      CAMPUSES.map((c) => c.shortLabel).join(" hoặc ");
    const giftLine =
      getAchievementGroup(submitted.achievement) === "A"
        ? S.giftLineA.replace("{campus}", campusLabel)
        : S.giftLineB;

    return (
      <div className="form-card covua-form-card" ref={cardRef}>
        <div className="form-success">
          <div className="check" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h3>{S.titleTemplate.replace("{studentName}", submitted.studentName)}</h3>
          <p className="covua-success-gift">{giftLine}</p>
          <ol className="covua-success-steps">
            {S.steps.map((step) => (
              <li key={step}>
                {step.replace("{parentPhone}", submitted.parentPhone)}
              </li>
            ))}
          </ol>
          <div className="covua-success-cta">
            <a
              className="btn btn--cta"
              href={covuaConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {S.zaloCta}
            </a>
            {covuaHotlines.map((h, i) => (
              <a
                key={h}
                className="btn btn--covua-ghost"
                href={`tel:${hotlineDigits(h)}`}
              >
                Gọi{" "}
                {covuaHotlines.length === CAMPUSES.length
                  ? `${CAMPUSES[i].shortLabel} — ${h}`
                  : h}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const errMsg = (key: keyof typeof errors) => errors[key]?.message as string | undefined;

  return (
    <div className="form-card covua-form-card" ref={cardRef}>
      <h2>{F.title}</h2>

      <form onSubmit={handleSubmit(onValid, onInvalid)} onFocusCapture={onFormFocus} noValidate>
        <FieldWrap id="covua-studentName" label={F.labels.studentName} required error={errMsg("studentName")}>
          <input
            id="covua-studentName"
            className={`input ${errors.studentName ? "invalid" : ""}`}
            type="text"
            placeholder={F.placeholders.studentName}
            autoComplete="off"
            enterKeyHint="next"
            aria-invalid={!!errors.studentName}
            aria-describedby={errors.studentName ? "covua-studentName-err" : undefined}
            {...register("studentName")}
          />
        </FieldWrap>

        <FieldWrap id="covua-parentName" label={F.labels.parentName} required error={errMsg("parentName")}>
          <input
            id="covua-parentName"
            className={`input ${errors.parentName ? "invalid" : ""}`}
            type="text"
            placeholder={F.placeholders.parentName}
            autoComplete="name"
            enterKeyHint="next"
            aria-invalid={!!errors.parentName}
            aria-describedby={errors.parentName ? "covua-parentName-err" : undefined}
            {...register("parentName")}
          />
        </FieldWrap>

        <div className="covua-form-grid2">
          <FieldWrap id="covua-parentPhone" label={F.labels.parentPhone} required error={errMsg("parentPhone")}>
            <input
              id="covua-parentPhone"
              className={`input ${errors.parentPhone ? "invalid" : ""}`}
              type="tel"
              inputMode="tel"
              placeholder={F.placeholders.parentPhone}
              autoComplete="tel"
              enterKeyHint="next"
              aria-invalid={!!errors.parentPhone}
              aria-describedby={errors.parentPhone ? "covua-parentPhone-err" : undefined}
              {...register("parentPhone")}
            />
          </FieldWrap>

          <FieldWrap id="covua-province" label={F.labels.province} required error={errMsg("province")}>
            <select
              id="covua-province"
              className={`select ${errors.province ? "invalid" : ""}`}
              autoComplete="address-level1"
              aria-invalid={!!errors.province}
              {...register("province")}
            >
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </FieldWrap>
        </div>

        <FieldWrap id="covua-achievement" label={F.labels.achievement} required error={errMsg("achievement")}>
          <select
            id="covua-achievement"
            className={`select ${errors.achievement ? "invalid" : ""}`}
            defaultValue=""
            aria-invalid={!!errors.achievement}
            {...register("achievement", {
              onChange: (e) => onAchievementChange(e.target.value),
            })}
          >
            <option value="" disabled>
              — Chọn thành tích —
            </option>
            {ACHIEVEMENTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </FieldWrap>

        {group === "A" && <p className="covua-hint">{F.dynamicHints.groupA}</p>}
        {group === "B" && <p className="covua-hint covua-hint--info">{F.dynamicHints.groupB}</p>}

        {showStudyMode && (
          <FieldWrap id="covua-studyMode" label={F.labels.studyMode} required error={errMsg("studyMode")}>
            <select
              id="covua-studyMode"
              className="select"
              aria-invalid={!!errors.studyMode}
              {...register("studyMode", {
                onChange: (e) => onStudyModeChange(e.target.value),
              })}
            >
              {STUDY_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                  {"hint" in m && m.hint ? ` (${m.hint})` : ""}
                </option>
              ))}
            </select>
          </FieldWrap>
        )}

        {showStudyMode && studyMode === "ONLINE_ONLY" && (
          <p className="covua-hint covua-hint--info">{F.dynamicHints.onlineOnlyWarning}</p>
        )}

        {showCampus && (
          <FieldWrap id="covua-campus" label={F.labels.campus} required error={errMsg("campus")}>
            {/* Select điều khiển tay: giá trị null (chưa chọn) ↔ option rỗng.
                Không register để null không phải đi qua DOM value. */}
            <select
              id="covua-campus"
              className={`select ${errors.campus ? "invalid" : ""}`}
              value={campus ?? ""}
              aria-invalid={!!errors.campus}
              aria-describedby={errors.campus ? "covua-campus-err" : undefined}
              onChange={(e) => {
                const v = e.target.value;
                setValue("campus", v === "" ? null : (v as "CS1" | "CS2"), {
                  shouldValidate: isSubmitted,
                });
              }}
            >
              <option value="" disabled>
                — Chọn cơ sở —
              </option>
              {CAMPUSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </FieldWrap>
        )}

        {serverError && (
          <div className="covua-alert" role="alert">
            {E.submitFailed.split("{hotline}").map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key={i}>
                  <HotlineLinks />
                  {part}
                </span>
              )
            )}
          </div>
        )}

        <button
          className="btn btn--cta btn--lg"
          type="submit"
          style={{ width: "100%" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? F.submitting : F.submit}
        </button>

        <p className="form-foot">{F.privacyNote}</p>
      </form>
    </div>
  );
}
