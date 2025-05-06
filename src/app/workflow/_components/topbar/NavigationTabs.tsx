"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  currentView: "editor" | "json" | "both";
  setView: (view: "editor" | "json" | "both") => void;
};

export default function NavigationTabs({ currentView, setView }: Props) {
  const handleTabChange = (value: string) => {
    if (value === "editor" || value === "json" || value === "both") {
      setView(value);
    }
  };

  return (
    <Tabs
      value={currentView}
      className="w-[400px]"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editor" className="w-full">
          Editor
        </TabsTrigger>
        <TabsTrigger value="both" className="w-full">
          Both
        </TabsTrigger>
        <TabsTrigger value="json" className="w-full">
          JSON
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
