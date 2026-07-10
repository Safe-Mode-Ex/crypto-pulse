import {
  CandlestickSeriesPartialOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
} from "lightweight-charts";

const DAY_IN_SECONDS = 24 * 60 * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;
const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

export const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Search",
    href: "/",
  },
  {
    label: "All Coins",
    href: "/coins",
  },
];

const CHART_COLORS = {
  background: "#0b1116",
  text: "#8f9fb1",
  grid: "#1a2332",
  border: "#1a2332",
  crosshairVertical: "#ffffff40",
  crosshairHorizontal: "#ffffff20",
  candleUp: "#158A6E",
  candleDown: "#EB1C36",
} as const;

export const getCandlestickConfig = (): CandlestickSeriesPartialOptions => ({
  upColor: CHART_COLORS.candleUp,
  downColor: CHART_COLORS.candleDown,
  wickUpColor: CHART_COLORS.candleUp,
  wickDownColor: CHART_COLORS.candleDown,
  borderVisible: true,
  wickVisible: true,
});

export const getChartConfig = (
  height: number,
  timeVisible: boolean = true,
): DeepPartial<ChartOptions> => ({
  width: 0,
  height,
  layout: {
    background: { type: ColorType.Solid, color: CHART_COLORS.background },
    textColor: CHART_COLORS.text,
    fontSize: 12,
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
  },
  grid: {
    vertLines: { visible: false },
    horzLines: {
      visible: true,
      color: CHART_COLORS.grid,
      style: 2,
    },
  },
  rightPriceScale: {
    borderColor: CHART_COLORS.border,
  },
  timeScale: {
    borderColor: CHART_COLORS.border,
    timeVisible,
    secondsVisible: false,
  },
  handleScroll: true,
  handleScale: true,
  crosshair: {
    mode: 1,
    vertLine: {
      visible: true,
      color: CHART_COLORS.crosshairVertical,
      width: 1,
      style: 0,
    },
    horzLine: {
      visible: true,
      color: CHART_COLORS.crosshairHorizontal,
      width: 1,
      style: 0,
    },
  },
  localization: {
    priceFormatter: (price: number) =>
      "$" + price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  },
});

const endAt = Math.floor(Date.now() / 1000);

export const PERIOD_CONFIG: Record<
  Period,
  { endAt?: number; startAt?: number; interval: "1hour" | "1day" }
> = {
  "1day": {
    endAt,
    startAt: endAt - DAY_IN_SECONDS,
    interval: "1hour",
  },
  "1week": {
    endAt,
    startAt: endAt - 7 * DAY_IN_SECONDS,
    interval: "1hour",
  },
  "1month": {
    endAt,
    startAt: endAt - MONTH_IN_SECONDS,
    interval: "1hour",
  },
  "3months": {
    endAt,
    startAt: endAt - 3 * MONTH_IN_SECONDS,
    interval: "1day",
  },
  "6months": {
    endAt,
    startAt: endAt - 6 * MONTH_IN_SECONDS,
    interval: "1day",
  },
  "1year": {
    endAt,
    startAt: endAt - YEAR_IN_SECONDS,
    interval: "1day",
  },
  max: {
    interval: "1day",
  },
};

export const PERIOD_BUTTONS: { value: Period; label: string }[] = [
  { value: "1day", label: "1D" },
  { value: "1week", label: "1W" },
  { value: "1month", label: "1M" },
  { value: "3months", label: "3M" },
  { value: "6months", label: "6M" },
  { value: "1year", label: "1Y" },
  { value: "max", label: "Max" },
];

export const LIVE_INTERVAL_BUTTONS: { value: "1s" | "1m"; label: string }[] = [
  { value: "1s", label: "1s" },
  { value: "1m", label: "1m" },
];
