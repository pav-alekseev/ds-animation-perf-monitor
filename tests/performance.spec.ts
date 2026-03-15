import { test, expect } from "@playwright/test";

import { countFps, getMetric } from "./utils";

test.describe("Методика контроля метрик производительности", () => {
  test("Замер FPS с эмуляцией среднего устройства", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=research-performance-experiments--layout-animation",
    );

    const client = await page.context().newCDPSession(page);
    await client.send("Emulation.setCPUThrottlingRate", { rate: 10 });
    await client.send("Performance.enable");

    const startLayoutMetrics = (await client.send("Performance.getMetrics"))
      .metrics;

    const fpsLayout = await page.evaluate(countFps, 3000);

    const endLayoutMetrics = (await client.send("Performance.getMetrics"))
      .metrics;

    const layoutDelta =
      getMetric(endLayoutMetrics, "LayoutCount") -
      getMetric(startLayoutMetrics, "LayoutCount");

    console.log(`--- Результаты Layout Animation ---`);
    console.log(`Средний FPS: ${fpsLayout}`);
    console.log(`Количество Layout (Reflow): ${layoutDelta}`);

    expect(fpsLayout).toBeLessThan(55);
    expect(layoutDelta).toBeGreaterThan(0);

    await page.goto(
      "http://localhost:6006/iframe.html?id=research-performance-experiments--composite-animation",
    );

    const startCompositeMetrics = (await client.send("Performance.getMetrics"))
      .metrics;

    const fpsComposite = await page.evaluate(countFps, 3000);

    const endCompositeMetrics = (await client.send("Performance.getMetrics"))
      .metrics;

    const compositeDelta =
      getMetric(endCompositeMetrics, "LayoutCount") -
      getMetric(startCompositeMetrics, "LayoutCount");

    console.log(`--- Результаты Composite Animation ---`);
    console.log(`Средний FPS: ${fpsComposite}`);
    console.log(`Количество Layout (Reflow): ${compositeDelta}`);

    expect(fpsComposite).toBeGreaterThanOrEqual(58);
    expect(compositeDelta).toBeGreaterThan(0);
  });
});
