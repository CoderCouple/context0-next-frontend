export const connectionTypes = ["stdio", "sse"] as const;
export type ConnectionType = (typeof connectionTypes)[number];
