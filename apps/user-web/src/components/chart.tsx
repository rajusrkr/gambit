import { useEffect, useRef, useState } from "react";
import {
  createChart,
  LineSeries,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";

interface ChartData {
  time: string;
  value: number;
}

// Helper for the tooltip state
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  time: string;
  values: { label: string; value: number; color: string }[];
}

export default function Chart({
  data1,
  data2,
  data3,
}: {
  data1: ChartData[];
  data2: ChartData[];
  data3: ChartData[];
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    time: "",
    values: [],
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { textColor: "white", background: { color: "#15191d" } },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "#44403c", style: 2 },
      },
    });

    const s1 = chart.addSeries(LineSeries, { color: "#ec4899" });
    const s2 = chart.addSeries(LineSeries, { color: "#22c55e" });
    const s3 = chart.addSeries(LineSeries, { color: "#f59e0b" });

    s1.setData(data1);
    s2.setData(data2);
    s3.setData(data3);

    function myCrosshairMoveHandler(param: MouseEventParams<Time>) {
      // 1. Hide tooltip if mouse leaves chart area
      if (!param.point || !param.time || param.point.x < 0) {
        setTooltip((prev) => ({ ...prev, visible: false }));
        return;
      }

      // 2. Extract values from all series
      const seriesList = [
        { series: s1, label: "Pink", color: "#ec4899" },
        { series: s2, label: "Green", color: "#22c55e" },
        { series: s3, label: "Orange", color: "#f59e0b" },
      ];

      const currentValues = seriesList
        .map((item) => {
          const data = param.seriesData.get(item.series);
          return data && "value" in data
            ? { label: item.label, value: data.value, color: item.color }
            : null;
        })
        .filter(
          (v): v is { label: string; value: number; color: string } =>
            v !== null,
        );

      // 3. Update State
      setTooltip({
        visible: true,
        x: param.point.x,
        y: param.point.y,
        time: param.time.toString(),
        values: currentValues,
      });
    }

    chart.subscribeCrosshairMove(myCrosshairMoveHandler);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data1, data2, data3]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px", position: "relative" }}
    >
      {/* TOOLTIP JSX */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            pointerEvents: "none",
            backgroundColor: "#1c1c1c",
            border: "1px solid #44403c",
            padding: "8px",
            borderRadius: "4px",
            zIndex: 100,
            fontSize: "12px",
            color: "white",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.5)",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            {tooltip.time}
          </div>
          {tooltip.values.map((item, i) => (
            <div
              key={i}
              style={{
                color: item.color,
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <span>{item.label}:</span>
              <span style={{ fontWeight: "bold" }}>
                {item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
