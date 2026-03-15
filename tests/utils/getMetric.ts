export const getMetric = (
  metrics: {
    name: string;
    value: number;
  }[],
  name: string,
) => metrics.find((m) => m.name === name)?.value || 0;
