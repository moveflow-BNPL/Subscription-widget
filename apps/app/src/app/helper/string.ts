export const stringWithEllipsis = (
  s: string | undefined,
  len: number = 9
): string => {
  if (s === undefined) {
    return "";
  }
  return (
    s.substring(0, len) +
    (s.length > len - 1
      ? "..." + s.substring(Math.max(s.length - (len - 1), len))
      : "")
  );
};

export const copyAddress = (content: string): void => {
  navigator.clipboard.writeText(content);
};
