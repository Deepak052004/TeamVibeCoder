import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils";

/* -------------------------------------------------------------------------- */
/* Theme handling */
/* -------------------------------------------------------------------------- */

const THEMES = {
  light: "",
  dark: ".dark",
};

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/* Container */
/* -------------------------------------------------------------------------- */

function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Dynamic CSS */
/* -------------------------------------------------------------------------- */

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item?.theme || item?.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme] || item.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Tooltip */
/* -------------------------------------------------------------------------- */

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const tooltipLabel =
    !hideLabel && payload?.length
      ? (() => {
          const item = payload[0];
          const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const value =
            typeof label === "string"
              ? config[label]?.label || label
              : itemConfig?.label;

          if (!value) return null;

          return (
            <div className={cn("font-medium", labelClassName)}>
              {labelFormatter
                ? labelFormatter(value, payload)
                : value}
            </div>
          );
        })()
      : null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;

          return (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              {!hideIndicator && (
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: indicatorColor }}
                />
              )}
              <span className="text-muted-foreground">
                {itemConfig?.label || item.name}
              </span>
              <span className="ml-auto font-mono">
                {item.value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Legend */
/* -------------------------------------------------------------------------- */

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={item.value} className="flex items-center gap-1.5">
            {!hideIcon && (
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

function getPayloadConfigFromPayload(config, payload, key) {
  if (!payload || typeof payload !== "object") return undefined;

  const data =
    payload.payload && typeof payload.payload === "object"
      ? payload.payload
      : payload;

  const configKey =
    typeof data[key] === "string" ? data[key] : key;

  return config[configKey] || config[key];
}

/* -------------------------------------------------------------------------- */

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
