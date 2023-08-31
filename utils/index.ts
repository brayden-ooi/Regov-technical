export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
});

export const statFormatter = (stat: number) =>
  stat > 10_000_000
    ? Math.round(stat / 1_000_000) + 'M'
    : numberFormatter.format(stat);
