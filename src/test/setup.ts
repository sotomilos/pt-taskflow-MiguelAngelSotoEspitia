import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetTodosStore } from "@/test/resetStores";

afterEach(() => {
  cleanup();
  resetTodosStore();
});
