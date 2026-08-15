import React, { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiCalendar,
  FiDollarSign,
  FiHash,
} from "react-icons/fi";
import { CURRENCIES } from "../../constants/currencies";
import { searchCoins, getCoinsPage } from "../../services/coinGeckoService";

const getToday = () => new Date().toISOString().split("T")[0];

const AssetModal = ({
  open,
  onClose,
  title,
  description,
  submitLabel,
  coins = [],
  initialValues = {},
  onSubmit,
}) => {
  const modalRef = useRef(null);

  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyCurrency, setBuyCurrency] = useState("USD");
  const [buyDate, setBuyDate] = useState(getToday());

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [browsePage, setBrowsePage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreCoins, setHasMoreCoins] = useState(true);

  useEffect(() => {
    if (!open) return;

    const coin = coins.find((item) => item.id === initialValues.coinId) || null;

    setSelectedCoin(coin);
    setSearch(coin?.name || "");

    setQuantity(initialValues.quantity || "");
    setBuyPrice(initialValues.buyPrice || "");
    setBuyCurrency(initialValues.buyCurrency || "USD");
    setBuyDate(initialValues.buyDate || getToday());

    setErrors({});
  }, [open, coins, initialValues]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setBrowsePage(1);
      setHasMoreCoins(true);
      setSearchResults(coins.slice(0, 50));
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const results = await searchCoins(query);

        setSearchResults(results);
      } catch (error) {
        console.error("Coin search failed:", error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, coins]);

  const loadMoreCoins = async () => {
    if (loadingMore || !hasMoreCoins || search.trim()) return;

    try {
      setLoadingMore(true);

      const nextPage = browsePage + 1;

      const { coins: newCoins, pagination } = await getCoinsPage(nextPage, 50);

      if (!newCoins.length) {
        setHasMoreCoins(false);
        return;
      }

      setSearchResults((prev) => {
        const existingIds = new Set(prev.map((coin) => coin.id));

        const uniqueCoins = newCoins.filter(
          (coin) => !existingIds.has(coin.id),
        );

        return [...prev, ...uniqueCoins];
      });

      setBrowsePage(nextPage);

      if (pagination && nextPage >= pagination.totalPages) {
        setHasMoreCoins(false);
      }
    } catch (error) {
      console.error("Failed to load more coins:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedCoin) {
      newErrors.coin = "Please select a cryptocurrency.";
    }

    if (!quantity || Number(quantity) <= 0) {
      newErrors.quantity = "Enter a valid quantity.";
    }

    if (!buyPrice || Number(buyPrice) <= 0) {
      newErrors.buyPrice = "Enter a valid purchase price.";
    }

    if (!buyDate) {
      newErrors.buyDate = "Purchase date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      await onSubmit({
        coinId: selectedCoin.id,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        buyDate,
        buyCurrency,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="
    fixed
    inset-0
    z-[999]
    flex
    items-center
    justify-center
    bg-black/60
    p-3
    backdrop-blur-md
    sm:p-5
  "
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="
      flex
      max-h-[95vh]
      w-full
      max-w-6xl
      flex-col
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--app-border)]
      bg-[var(--app-card)]
      shadow-[var(--shadow-card)]
    "
      >
        {/* ================= Header ================= */}

        <div
          className="
        flex
        items-start
        justify-between
        border-b
        border-[var(--app-border)]
        px-5
        py-5
        sm:px-7
        sm:py-6
      "
        >
          <div className="flex items-start gap-4">
            <div
              className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-[#2563eb]/10
            via-[#7c3aed]/10
            to-[#9333ea]/10
          "
            >
              <FiDollarSign
                size={24}
                className="text-[var(--color-primary-2)]"
              />
            </div>

            <div>
              <h2
                className="
              [font-family:var(--font-heading)]
              text-2xl
              font-bold
              text-[var(--app-text)]
              sm:text-3xl
            "
              >
                {title}
              </h2>

              <p
                className="
              mt-2
              max-w-lg
              text-sm
              leading-6
              text-[var(--app-muted)]
            "
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-[var(--app-muted)]
          transition-all
          duration-300
          hover:bg-[var(--app-bg)]
          hover:text-[var(--app-text)]
        "
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
          flex-1
          overflow-y-auto
          coinpilot-scrollbar
          px-5
          py-5
          sm:px-7
          sm:py-6
        "
        >
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            {/* Coin Search */}

            {/* ================= Left Column ================= */}

            <div className="space-y-6">
              <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                Cryptocurrency
              </label>

              <div className="relative">
                <FiSearch
                  size={20}
                  className="
    pointer-events-none
    absolute
    left-5
    top-1/2
    -translate-y-5
    text-[var(--app-soft)]
  "
                />

                <input
                  type="text"
                  value={search}
                  placeholder="Search by coin name or symbol..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-[var(--app-border)]
                    bg-[var(--app-bg)]
                    pl-12
                    pr-12
                    text-[var(--app-text)]
                    placeholder:text-[var(--app-soft)]
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[var(--color-primary-2)]
                    focus:ring-4
                    focus:ring-[var(--color-primary-2)]/10
                  "
                />

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[var(--app-muted)]">
                    {searching
                      ? "Searching..."
                      : search
                        ? `${searchResults.length} result${
                            searchResults.length !== 1 ? "s" : ""
                          } found`
                        : "Popular cryptocurrencies"}
                  </span>

                  {search && searchResults.length === 50 && (
                    <span className="font-medium text-[var(--color-primary-2)]">
                      Showing first 50 matches
                    </span>
                  )}
                </div>
              </div>

              {errors.coin && (
                <p className="mt-2 text-sm text-red-500">{errors.coin}</p>
              )}

              <div
                className="
                mt-4
                h-[420px]
                overflow-y-auto
                rounded-2xl
                border
                border-[var(--app-border)]
                bg-[var(--app-bg)]
                coinpilot-scrollbar
                "
              >
                {searchResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <FiSearch
                      size={40}
                      className="mb-4 text-[var(--app-soft)]"
                    />

                    <h3 className="text-lg font-semibold text-[var(--app-text)]">
                      No coins found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--app-muted)]">
                      We couldn't find any cryptocurrency matching
                      <span className="font-semibold"> "{search}"</span>
                      .
                      <br />
                      Try searching by name or ticker symbol.
                    </p>
                  </div>
                ) : (
                  searchResults.map((coin) => {
                    const isSelected = selectedCoin?.id === coin.id;

                    return (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => {
                          setSelectedCoin(coin);
                          setSearch("");
                          setSearchResults([coin]);
                          setErrors((prev) => ({
                            ...prev,
                            coin: "",
                          }));

                          {
                            !search.trim() &&
                              hasMoreCoins &&
                              searchResults.length > 0 && (
                                <div className="flex justify-center border-t border-[var(--app-border)] p-4">
                                  <button
                                    type="button"
                                    onClick={loadMoreCoins}
                                    disab
                                    led={loadingMore}
                                    className="
                                    rounded-xl
                                    border
                                    border-[var(--app-border)]
                                    bg-[var(--app-card)]
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[var(--app-text)]
                                    transition-all
                                    hover:bg-[var(--app-card-2)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50"
                                  >
                                    {loadingMore
                                      ? "Loading more coins..."
                                      : "Load More Coins"}
                                  </button>
                                </div>
                              );
                          }
                        }}
                        className={`
                            group
                            relative
                            w-full
                            border-b
                            border-[var(--app-border)]
                            p-4
                            text-left
                            transition-all
                            duration-300
                            last:border-none

                            ${
                              isSelected
                                ? "bg-gradient-to-r from-[var(--color-primary-2)]/10 to-transparent"
                                : "hover:bg-[var(--app-card-2)]"
                            }
                          `}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* LEFT */}

                          <div className="flex min-w-0 items-center gap-4">
                            <div className="relative">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="
                                    h-12
                                    w-12
                                    rounded-full
                                    object-cover
                                    ring-2
                                    ring-transparent
                                    transition-all
                                    duration-300
                                    group-hover:ring-[var(--color-primary-2)]/20
                                  "
                              />

                              {isSelected && (
                                <div
                                  className="
                                      absolute
                                      -bottom-1
                                      -right-1
                                      flex
                                      h-5
                                      w-5
                                      items-center
                                      justify-center
                                      rounded-full
                                      bg-[var(--color-primary-2)]
                                      text-white
                                    "
                                >
                                  <FiCheck size={12} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3
                                className="
                                    truncate
                                    font-semibold
                                    text-[var(--app-text)]
                                  "
                              >
                                {coin.name}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span
                                  className="
                                      rounded-full
                                      bg-[var(--app-card)]
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-medium
                                      uppercase
                                      text-[var(--app-muted)]
                                    "
                                >
                                  {coin.symbol}
                                </span>

                                {coin.market_cap_rank && (
                                  <span
                                    className="
                                        text-xs
                                        text-[var(--app-soft)]
                                      "
                                  >
                                    Rank #{coin.market_cap_rank}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* RIGHT */}

                          <div className="text-right">
                            {coin.current_price && (
                              <p
                                className="
                                    text-base
                                    font-semibold
                                    text-[var(--app-text)]
                                  "
                              >
                                $
                                {Number(coin.current_price).toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </p>
                            )}

                            <p
                              className="
                                  mt-1
                                  text-xs
                                  text-[var(--app-muted)]
                                "
                            >
                              Current Price
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            className="
                                absolute
                                left-0
                                top-0
                                h-full
                                w-1.5
                                rounded-r-full
                                bg-gradient-to-b
                                from-[#2563eb]
                                via-[#7c3aed]
                                to-[#9333ea]
                              "
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Inputs */}
            </div>

            {/* ================= Right Column ================= */}

            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
                    <FiHash />
                    Quantity
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="
                h-12
                w-full
                rounded-2xl
                border
                border-[var(--app-border)]
                bg-[var(--app-bg)]
                px-4
                text-[var(--app-text)]
                placeholder:text-[var(--app-soft)]
                outline-none
                transition-all
                duration-300
                focus:border-[var(--color-primary-2)]
                focus:ring-4
                focus:ring-[var(--color-primary-2)]/10
                "
                  />

                  {errors.quantity && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
                    <FiDollarSign />
                    Buy Price
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      placeholder="0.00"
                      className="
                        h-12
                        min-w-0
                        flex-1
                        rounded-2xl
                        border
                        border-[var(--app-border)]
                        bg-[var(--app-bg)]
                        px-4
                        text-[var(--app-text)]
                        placeholder:text-[var(--app-soft)]
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[var(--color-primary-2)]
                        focus:ring-4
                        focus:ring-[var(--color-primary-2)]/10
                      "
                    />

                    <select
                      value={buyCurrency}
                      onChange={(e) => setBuyCurrency(e.target.value)}
                      className="
                        h-12
                        w-[105px]
                        shrink-0
                        rounded-2xl
                        border
                        border-[var(--app-border)]
                        bg-[var(--app-bg)]
                        px-3
                        text-sm
                        font-semibold
                        text-[var(--app-text)]
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[var(--color-primary-2)]
                        focus:ring-4
                        focus:ring-[var(--color-primary-2)]/10
                      "
                    >
                      {CURRENCIES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.buyPrice && (
                    <p className="mt-2 text-sm text-[var(--color-danger)]">
                      {errors.buyPrice}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
                  <FiCalendar />
                  Purchase Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={buyDate}
                    onChange={(e) => setBuyDate(e.target.value)}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-[var(--app-border)]
                      bg-[var(--app-bg)]
                      px-4
                      text-[var(--app-text)]
                      outline-none
                      transition-all
                      duration-300
                      focus:border-[var(--color-primary-2)]
                      focus:ring-4
                      focus:ring-[var(--color-primary-2)]/10
                    "
                  />
                </div>

                {errors.buyDate && (
                  <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">
                    {errors.buyDate}
                  </p>
                )}

                {!errors.buyDate && (
                  <p className="mt-2 text-xs text-[var(--app-muted)]">
                    Select the date you purchased this asset.
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* ================= Footer ================= */}

          <div
            className="
    sticky
    bottom-0
    mt-8
    border-t
    border-[var(--app-border)]
    bg-[var(--app-card)]
    px-6
    py-5
    backdrop-blur-xl
  "
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}

              <div className="flex items-center gap-4">
                {selectedCoin ? (
                  <>
                    <img
                      src={selectedCoin.image}
                      alt={selectedCoin.name}
                      className="
              h-12
              w-12
              rounded-full
              ring-2
              ring-[var(--color-primary-2)]/20
            "
                    />

                    <div>
                      <p className="font-semibold text-[var(--app-text)]">
                        {selectedCoin.name}
                      </p>

                      <p className="text-sm text-[var(--app-muted)]">
                        {selectedCoin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="font-medium text-[var(--app-text)]">
                      No coin selected
                    </p>

                    <p className="text-sm text-[var(--app-muted)]">
                      Choose a cryptocurrency to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Right */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="
         
          h-12
          items-center
          justify-center
          rounded-2xl
          border
          border-[var(--app-border)]
          bg-[var(--app-bg)]
          px-7
          font-medium
          text-[var(--app-text)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-[var(--app-card-2)]
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-50
          hidden
        "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
          flex
          h-12
          min-w-[200px]
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-gradient-to-r
          from-[#2563eb]
          via-[#7c3aed]
          to-[#9333ea]
          px-8
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-2xl
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
                >
                  {submitting ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Saving Asset...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />

                      {submitLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;
