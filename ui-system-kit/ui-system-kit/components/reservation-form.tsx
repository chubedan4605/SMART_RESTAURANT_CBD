"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "@/components/site/primitives";
import { useToast } from "@/hooks/use-toast";

/**
 * ReservationForm — Form đặt bàn mẫu.
 *
 * Demonstrate:
 * - Dùng shadcn/ui component (Input, Label, Textarea, Select, Button).
 * - Field helper nội bộ (không tạo file riêng — chỉ dùng ở đây).
 * - variant="gold" cho CTA (cần mở rộng buttonVariants trong ui/button.tsx).
 * - useToast sau submit + reset form.
 * - Responsive grid (1 cột mobile, 2 cột desktop).
 * - Accessibility: Label htmlFor, required, inputMode.
 *
 * Chú ý: variant="gold" yêu cầu thêm vào src/components/ui/button.tsx:
 *   variant: { ..., gold: "bg-gold text-ink hover:bg-gold-soft" }
 */

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00"];
const PARTY_SIZES = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function ReservationForm() {
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [party, setParty] = React.useState("2");
  const [time, setTime] = React.useState("19:00");
  const [notes, setNotes] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    toast({
      title: "Đã ghi nhận yêu cầu đặt bàn",
      description: `${name} · ${party} khách · ${time} · ${phone}`,
    });
    // Reset
    setName("");
    setPhone("");
    setNotes("");
  }

  return (
    <section id="reserve" className="py-24 md:py-36">
      <div className="mx-auto max-w-2xl px-6 md:px-8">
        <Reveal>
          <SectionLabel align="center">Đặt bàn</SectionLabel>
          <h2 className="mt-5 text-center font-serif text-3xl font-light tracking-tight md:text-5xl">
            Để chúng tôi giữ bàn cho bạn.
          </h2>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Đặt bàn mở 30 ngày trước. Chúng tôi giữ bàn tối đa 15 phút.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} className="mt-12 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Họ và tên" htmlFor="r-name">
                <Input
                  id="r-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn A"
                  className="h-11 bg-transparent"
                />
              </Field>
              <Field label="Số điện thoại" htmlFor="r-phone">
                <Input
                  id="r-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputMode="tel"
                  placeholder="0901 234 567"
                  className="h-11 bg-transparent"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Giờ" htmlFor="r-time">
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="r-time" className="h-11 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Số khách" htmlFor="r-party">
                <Select value={party} onValueChange={setParty}>
                  <SelectTrigger id="r-party" className="h-11 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_SIZES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p} khách
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Ghi chú (tuỳ chọn)" htmlFor="r-notes">
              <Textarea
                id="r-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Dị ứng, dịp kỷ niệm…"
                className="resize-none bg-transparent"
              />
            </Field>

            <Button type="submit" variant="gold" className="h-12 w-full">
              Xác nhận đặt bàn
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Field — helper nội bộ, gói Label + input.
 * Không tách file riêng vì chỉ dùng ở đây.
 * Nếu cần tái dùng ở 2+ form → move ra src/components/site/field.tsx.
 */
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[0.7rem] uppercase tracking-wide-sm text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
