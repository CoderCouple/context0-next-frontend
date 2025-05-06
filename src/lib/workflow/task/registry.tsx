import { AddPropertyToJsonTask } from "@/lib/workflow/task/add-property-to-json";
import { ClickElementTask } from "@/lib/workflow/task/click-element";
import { DeliverViaWebhookTask } from "@/lib/workflow/task/deliver-via-webhook";
import { ExtractDataWithAITask } from "@/lib/workflow/task/extract-data-with-ai";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/extract-text-from-element";
import { FillInputTask } from "@/lib/workflow/task/fill-input";
import { LaunchBrowserTask } from "@/lib/workflow/task/launch-browser";
import { LaunchBrowserFirefoxTask } from "@/lib/workflow/task/launch-browser/launch-browser-firefox";
import { LaunchBrowserHeadlessTask } from "@/lib/workflow/task/launch-browser/launch-browser-headless";
import { NavigateUrlTask } from "@/lib/workflow/task/navigate-url-task";
import { PageToHtmlTask } from "@/lib/workflow/task/page-to-html";
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/read-property-from-json";
import { ScrollToElementTask } from "@/lib/workflow/task/scroll-to-element";
import { WaitForElementTask } from "@/lib/workflow/task/wait-for-element";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow-type";

import { LaunchBrowserCromeTask } from "./launch-browser/launch-browser-chrome";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  LAUNCH_BROWSER_CHROME: LaunchBrowserCromeTask,
  LAUNCH_BROWSER_FIREFOX: LaunchBrowserFirefoxTask,
  LAUNCH_BROWSER_HEADLESS: LaunchBrowserHeadlessTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_EMELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
