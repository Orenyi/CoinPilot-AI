import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CoinHeader from "../components/coin/CoinHeader";
import { getCoinDetails } from "../services/coinDetailsService";
import useCurrency from "../hooks/useCurrency";

const CoinDetailsPage = () => {
  const { id } = useParams();
  const { currency } = useCurrency();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCoin = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCoinDetails(id);

        if (!cancelled) {
          setCoin(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err.message || "Failed to load coin details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCoin();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--app-bg)]">
        <div className="mx-auto max-w-[1350px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-[var(--app-card)]" />

            <div className="h-32 rounded-2xl bg-[var(--app-card)]" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-xl bg-[var(--app-card)]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--app-text)]">
            Unable to load coin
          </h1>

          <p className="mt-2 text-sm text-[var(--app-muted)]">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <CoinHeader coin={coin} currency={currency.toLowerCase()} />

      {/* Temporary section.
          We will replace this with the chart next. */}
      <section className="mx-auto max-w-[1350px] px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="
            flex
            min-h-[420px]
            items-center
            justify-center
            rounded-2xl
            border
            border-[var(--app-border)]
            bg-[var(--app-card)]
          "
        >
          <p className="text-sm text-[var(--app-muted)]">
            Market chart coming next...
          </p>
        </div>
      </section>
    </main>
  );
};

export default CoinDetailsPage;
