"use client";

import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_KUCOIN_WSS_URL}`;

export const useWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());
  const tradeSeq = useRef(0);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  const [isWsReady, setIsWsReady] = useState(false);

  const interval = liveInterval || "1min";

  useEffect(() => {
    if (!WS_BASE || WS_BASE === "undefined") return;

    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const handleMessage = async (evt: MessageEvent) => {
      let rawData: string | Blob = evt.data;

      if (rawData instanceof Blob) {
        rawData = await rawData.text();
      }

      const msg: WebSocketMessage = JSON.parse(rawData);

      if (msg.type === "ping") {
        send({ id: Date.now().toString(), type: "pong" });
        return;
      }

      if (msg.message === "welcome") {
        return;
      }

      const topicType: string = msg.T ?? "";
      const dData = msg.d;

      if (!dData) return;

      if (topicType.includes("ticker")) {
        const currentLivePrice = parseFloat(dData.l ?? dData.a ?? "0");

        setPrice({
          usd: currentLivePrice,
          coin: dData.s ?? coinId,
          price: currentLivePrice,
          change24h: 0,
          marketCap: 0,
          volume24h: parseFloat(dData.v ?? "0"),
          timestamp: dData.M ? Math.floor(Number(dData.M) / 1000000) : Date.now(),
        });
      }

      if (topicType.includes("trade")) {
        const tradePrice = parseFloat(dData.p ?? "0");
        const tradeAmount = parseFloat(dData.q ?? "0");

        if (tradePrice > 0 && tradeAmount > 0) {
          const newTrade: Trade = {
            id: ++tradeSeq.current,
            price: tradePrice,
            value: tradePrice * tradeAmount,
            timestamp: dData.M ? Math.floor(Number(dData.M) / 1000000) : Date.now(),
            type: dData.S?.toLowerCase() === "sell" ? "s" : "b",
            amount: tradeAmount,
          };

          setTrades((prev) => [newTrade, ...prev].slice(0, 7));
        }
      }

      if (topicType.includes("kline")) {
        if (dData.i === interval) {
          const rawTimestamp = parseInt(dData.O ?? "0");

          const isDaily =
            interval.includes("day") ||
            interval.includes("week") ||
            interval.includes("month");

          const candle: OHLCData = [
            isDaily ? rawTimestamp * 1000 : rawTimestamp,
            parseFloat(dData.o ?? "0"),
            parseFloat(dData.h ?? "0"),
            parseFloat(dData.l ?? "0"),
            parseFloat(dData.c ?? "0"),
          ];

          setOhlcv(candle);
        }
      }
    };

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);

    return () => {
      ws.close();
      setIsWsReady(false);
    };
  }, [coinId, interval]);

  useEffect(() => {
    if (!isWsReady) return;

    const ws = wsRef.current;

    if (!ws) return;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((chKey) => {
        const [channel, symbol] = chKey.split(":");
        send({
          id: Date.now().toString(),
          action: "unsubscribe",
          channel,
          symbol,
          tradeType: "SPOT",
        });
      });

      subscribed.current.clear();
    };

    const subscribe = (channel: string, symbol: string, extraParams?: Record<string, unknown>) => {
      const chKey = `${channel}:${symbol}`;
      if (subscribed.current.has(chKey)) return;

      send({
        id: Date.now().toString(),
        action: "subscribe",
        channel,
        symbol,
        tradeType: "SPOT",
        ...extraParams,
      });
      subscribed.current.add(chKey);
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      if (coinId) {
        subscribe("ticker", coinId);
        subscribe("trade", coinId);
        subscribe("kline", coinId, { interval });
      }
    });

    const poolAddress = poolId.replace("_", ":");

    if (poolAddress) {
      subscribe("ticker", poolAddress);
      subscribe("trade", poolAddress);
      subscribe("kline", poolAddress, { interval });
    }
  }, [coinId, poolId, isWsReady, interval]);

  return { price, trades, ohlcv, isConnected: isWsReady };
};
