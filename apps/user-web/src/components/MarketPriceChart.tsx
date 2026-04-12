import type {
	DeepPartial,
	ISeriesApi,
	LineData,
	LineSeriesOptions,
	LineStyleOptions,
	MouseEventParams,
	SeriesOptionsCommon,
	Time,
	WhitespaceData,
} from "lightweight-charts";
import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

export interface ChartData {
	outcomeTitle: string;
	color: string;
	prices: {
		value: number;
		time: Time;
	}[];
}

interface TooltipState {
	visible: boolean;
	x: number;
	y: number;
	time: string;
	value: { label: string; value: number; color: string }[];
}

interface SeriesList {
	series: ISeriesApi<
		"Line",
		Time,
		LineData<Time> | WhitespaceData<Time>,
		LineSeriesOptions,
		DeepPartial<LineStyleOptions & SeriesOptionsCommon>
	>;
	label: string;
	color: string;
}

export default function MarketPriceChart({
	chartData,
}: {
	chartData: ChartData[];
}) {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState<TooltipState>({
		visible: false,
		x: 0,
		y: 0,
		time: "",
		value: [],
	});

	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				textColor: "white",
				background: {
					color: "#171717",
				},
			},
			grid: {
				vertLines: { visible: false },
				horzLines: { color: "#44403c", style: 2 },
			},
		});

		const seriesList: SeriesList[] = [];

		chartData.forEach((price) => {
			const series = chart.addSeries(LineSeries, { color: price.color });
			series.setData(price.prices);
			seriesList.push({
				series,
				color: price.color,
				label: price.outcomeTitle,
			});
		});

		function myCrosshairMoveHandler(param: MouseEventParams<Time>) {
			if (!param.point || !param.time || param.point.x < 0) {
				setTooltip((prev) => ({ ...prev, visible: false }));
				return;
			}

			const currentValues = seriesList
				.map((series) => {
					const data = param.seriesData.get(series.series);
					return data && "value" in data
						? { label: series.label, value: data.value, color: series.color }
						: null;
				})
				.filter(
					(v): v is { label: string; value: number; color: string } =>
						v !== null,
				);

			setTooltip({
				visible: true,
				x: param.point.x,
				y: param.point.y,
				time: param.time.toString(),
				value: currentValues,
			});
		}

		chart.subscribeCrosshairMove(myCrosshairMoveHandler);
		chart.timeScale().fitContent();
	}, [chartData]);

	return (
		<div
			ref={chartContainerRef}
			style={{ width: "100%", height: "300px", position: "relative" }}
		>
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
						{new Date(Number(tooltip.time) * 1000).toString()}
					</div>

					{tooltip.value.map((item) => (
						<div
							key={item.color}
							style={{
								color: item.color,
								display: "flex",
								gap: "10px",
								justifyContent: "space-between",
							}}
						>
							<span>{item.label}</span>
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
