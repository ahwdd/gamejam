// /components/auth/CountrySelect.tsx

"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Country } from "@/lib/types/countries";
import { countriesList } from "@/lib/data/countries";

interface CountrySelectProps {
  onChange: (country: Country) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function CountrySelect({
  onChange,
  value = "AE",
  disabled = false,
  className = "",
  placeholder = "Search...",
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<Country[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef<number>(-1);

  useEffect(() => {
    try {
      setLoading(true);
      const copy = [...countriesList];
      copy.sort((a, b) => a.label.localeCompare(b.label));
      setCountries(copy);
      setFiltered(copy);
    } catch (err) {
      console.error("Error loading countries", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedCountryKey(value);
  }, [value]);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(countries);
      activeIndexRef.current = countries.findIndex((c) => c.key === selectedCountryKey);
      return;
    }
    const q = searchTerm.trim().toLowerCase();
    const list = countries.filter((c) => {
      const label = c.label.toLowerCase();
      return (
        label.includes(q) ||
        (c.callingCode ?? "").toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q)
      );
    });
    setFiltered(list);
    activeIndexRef.current = 0;
  }, [searchTerm, countries, selectedCountryKey]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedCountry =
    countries.find((c) => c.key === selectedCountryKey) ||
    ({ key: "AE", label: "United Arab Emirates", arLabel: "الإمارات", callingCode: "+971", flag: "AE" } as Country);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 0);
  }, [disabled]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen((s) => !s);
    if (!isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [disabled, isOpen]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountryKey(country.key);
    setIsOpen(false);
    setSearchTerm("");
    activeIndexRef.current = -1;
    onChange?.(country);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(activeIndexRef.current + 1, filtered.length - 1);
      activeIndexRef.current = next;
      scrollIntoViewIfNeeded(next);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(activeIndexRef.current - 1, 0);
      activeIndexRef.current = prev;
      scrollIntoViewIfNeeded(prev);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const idx = activeIndexRef.current;
      if (idx >= 0 && idx < filtered.length) {
        handleCountrySelect(filtered[idx]);
      } else if (filtered.length === 1) {
        handleCountrySelect(filtered[0]);
      }
      return;
    }
  };

  const scrollIntoViewIfNeeded = (index: number) => {
    const container = listRef.current;
    if (!container) return;
    const item = container.querySelectorAll("[data-country-item]")[index] as HTMLElement | undefined;
    if (!item) return;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemTop < containerTop) container.scrollTo({ top: itemTop, behavior: "smooth" });
    else if (itemBottom > containerBottom)
      container.scrollTo({ top: itemBottom - container.clientHeight, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-14 w-28 border border-gray-300 rounded-lg bg-gray-50">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`relative w-28 h-14 px-3 py-2 border border-gray-300 rounded-lg
          bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:border-blue-500 transition-all duration-200
          ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "hover:border-gray-400 cursor-pointer"}
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg">{selectedCountry.flag === selectedCountry.key ? "🏴" : getFlagEmoji(selectedCountry.key)}</span>
          <span className="text-sm font-medium text-gray-700 flex-1 text-left">{selectedCountry.callingCode}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          onKeyDown={handleKeyDown}
          className="absolute z-50 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-100">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              aria-label="Search country"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div
            className="overflow-auto max-h-52"
            ref={listRef}
            role="listbox"
            aria-activedescendant={
              activeIndexRef.current >= 0 ? `country-item-${activeIndexRef.current}` : undefined
            }
            tabIndex={-1}
          >
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">No results</div>
            ) : (
              filtered.map((country, idx) => {
                const isActive = idx === activeIndexRef.current;
                const isSelected = country.key === selectedCountryKey;
                return (
                  <button
                    key={country.key}
                    data-country-item
                    id={`country-item-${idx}`}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    onMouseEnter={() => {
                      activeIndexRef.current = idx;
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3
                      hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150
                      ${isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                      ${isActive ? "bg-gray-100" : ""}`}
                    aria-selected={isSelected}
                    role="option"
                  >
                    <span className="text-lg">{getFlagEmoji(country.key)}</span>
                    <span className="flex-1 truncate font-medium">{country.label}</span>
                    <span className="text-xs text-gray-500 font-mono">{country.callingCode}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}