"use client";

import { useTheme } from "next-themes";
import ReactJson from "react-json-view";

type Props = {
  data: any;
};

export default function JSONEditor({ data }: Props) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "monokai" : "rjv-default";

  return (
    <div className="flex h-full w-full overflow-auto bg-background p-4">
      <ReactJson
        src={data}
        theme={theme}
        collapsed={2}
        displayDataTypes={false}
        enableClipboard={true}
        style={{
          width: "100%",
          height: "100%",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
}
