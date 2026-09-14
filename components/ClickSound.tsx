"use client";

import { useEffect } from "react";
import { attachGlobalClickSound } from "@/lib/clickSound";

export default function ClickSound() {
  useEffect(() => attachGlobalClickSound(), []);
  return null;
}
