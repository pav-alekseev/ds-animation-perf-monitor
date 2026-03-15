import { test, expect, Page } from "@playwright/test";
import { countFps, getMetric } from "./utils";

const CPU_THROTTLING_RATE = 5;
const TEST_DURATION = 3000;

test.describe("Автоматизированный контроль метрик производительности", () => {
  async function measurePerformance(page: Page, urlId: string, label: string) {
    await page.goto(`/iframe.html?id=${urlId}`);

    const client = await page.context().newCDPSession(page);
    await client.send("Emulation.setCPUThrottlingRate", {
      rate: CPU_THROTTLING_RATE,
    });
    await client.send("Performance.enable");

    const startMetrics = (await client.send("Performance.getMetrics")).metrics;
    const fps = await page.evaluate(countFps, TEST_DURATION);
    const endMetrics = (await client.send("Performance.getMetrics")).metrics;

    const layoutDelta =
      getMetric(endMetrics, "LayoutCount") -
      getMetric(startMetrics, "LayoutCount");
    await client.detach();

    test.info().annotations.push({
      type: `${label} Metrics`,
      description: `FPS: ${fps}, Layouts: ${layoutDelta}`,
    });

    return { fps, layoutDelta };
  }

  test("BouncingBox: Сравнительный анализ", async ({ page }) => {
    const bad = await measurePerformance(
      page,
      "research-performance-experiments--layout-animation",
      "Layout (Bad)",
    );
    const good = await measurePerformance(
      page,
      "research-performance-experiments--composite-animation",
      "Composite (Good)",
    );

    expect(bad.fps).toBeLessThan(55);
    expect(good.fps).toBeGreaterThanOrEqual(58);
  });

  test("BouncingBox: Относительная эффективность", async ({ page }) => {
    const bad = await measurePerformance(
      page,
      "research-performance-experiments--layout-animation",
      "Layout (Bad)",
    );
    const good = await measurePerformance(
      page,
      "research-performance-experiments--composite-animation",
      "Composite (Good)",
    );

    expect(good.layoutDelta).toBeLessThanOrEqual(5);
    expect(bad.layoutDelta).toBeGreaterThan(50);

    const efficiencyRatio = good.fps / bad.fps;

    expect(efficiencyRatio).toBeGreaterThanOrEqual(1.0);
  });

  test("Skeleton: Сравнительный анализ", async ({ page }) => {
    const bad = await measurePerformance(
      page,
      "research-skeleton-experiments--repaint-case",
      "Repaint (Bad)",
    );
    const good = await measurePerformance(
      page,
      "research-skeleton-experiments--composite-case",
      "Composite (Good)",
    );

    expect(bad.fps).toBeLessThan(55);
    expect(good.fps).toBeGreaterThanOrEqual(58);
  });
});
