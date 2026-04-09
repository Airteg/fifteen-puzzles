export function logLayout(label: string, value: unknown) {
  console.log(
    `🚀 ~ ${label}:\n` +
      JSON.stringify(
        value,
        (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
        2,
      ),
  );
}
