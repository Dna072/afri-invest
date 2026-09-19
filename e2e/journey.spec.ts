import { test, expect } from "@playwright/test";

test("landing communicates the product", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /invest in africa from anywhere/i })).toBeVisible();
  await expect(page.getByText(/sandbox/i).first()).toBeVisible();
});

test("demo login reaches home", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Derrick" }).click();
  await expect(page).toHaveURL(/\/app/);
  await expect(page.getByText(/good /i).first()).toBeVisible({ timeout: 15_000 });
});
