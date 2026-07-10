"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constants";
import { convertOHLCData, getOHLCDataFromResponse } from "@/lib/utils";
import { fetcher } from "@/lib/coin-paprika.actions";

const CandlestickChart = ({
  children,
  data,
  coinSymbol,
  height,
  initialPeriod = "1day",
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [isPending, startTransition] = useTransition();
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOHLCData] = useState<OHLCData[]>(data ?? []);

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      console.log(selectedPeriod);
      const { interval, endAt, startAt } = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCResponse>(
        "/market/kline",
        {
          tradeType: "SPOT",
          symbol: coinSymbol,
          interval,
          endAt,
          startAt,
        },
        true,
      );

      setOHLCData(getOHLCDataFromResponse(newData) ?? []);
    } catch (error) {
      console.error("Failed to fetch OHLCData", error);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCData(newPeriod);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) return;

    const showTime = ["1day", "1week", "1month"].includes(period);
    const chart = createChart(container, {
      ...getChartConfig(height ?? 0, showTime),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(ohlcData));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, period, ohlcData]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const converted = convertOHLCData(ohlcData);

    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm font-medium text-purple-100/50">Period:</span>

          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={period === value ? "config-button-active" : "config-button"}
              type="button"
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="chart"></div>
    </div>
  );
};

export default CandlestickChart;
