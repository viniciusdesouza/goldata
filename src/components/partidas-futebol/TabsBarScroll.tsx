"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TabsBarScrollProps {
  tabs: { key: string; label: string }[];
  currentTab: string;
  onTab: (tab: string) => void;
  getHref?: (tabKey: string) => string;
  className?: string;
  style?: React.CSSProperties;
  buttonClass?: string;
  containerClass?: string;
}

export default function TabsBarScroll({
  tabs,
  currentTab,
  onTab,
  getHref,
  className = "",
  style = {},
  buttonClass = "",
  containerClass = "",
}: TabsBarScrollProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  function checkArrows() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 1);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkArrows();
    el.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  useEffect(() => {
    if (!currentTab || !scrollRef.current) return;
    const activeTab = scrollRef.current.querySelector(`[data-tabkey="${currentTab}"]`) as HTMLElement | null;
    if (activeTab) {
      const scroll = scrollRef.current;
      const scrollWidth = scroll.offsetWidth;
      const tabWidth = activeTab.offsetWidth;
      const scrollTo = activeTab.offsetLeft - (scrollWidth - tabWidth) / 2;
      scroll.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [currentTab]);

  const scrollByAmount = (dx: number) => {
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  // Drag-to-scroll (mouse/touch)
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragScrollLeft = useRef<number>(0);

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    document.body.style.userSelect = "none";
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current || dragStartX.current === null) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleMouseUp() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }
  function handleMouseLeave() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }
  function handleTouchStart(e: React.TouchEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || !scrollRef.current || dragStartX.current === null) return;
    const x = e.touches[0].clientX - scrollRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleTouchEnd() {
    isDragging.current = false;
    dragStartX.current = null;
  }

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto select-none mb-2 ${className}`}
      style={style}
    >
      {showLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-220)}
          className="tabs-arrow-btn left-0"
          aria-label="Scroll para esquerda"
          style={{ top: 0, bottom: 0 }}
        >
          <span className="icon-circle">
            <ChevronLeft size={22} strokeWidth={2.2} />
          </span>
        </button>
      )}
      <div
        ref={scrollRef}
        className={`${containerClass} flex flex-row flex-nowrap gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide`}
        style={{ scrollBehavior: "smooth" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.map(tab =>
          getHref ? (
            <a
              key={tab.key}
              href={getHref(tab.key)}
              data-tabkey={tab.key}
              onClick={e => {
                e.preventDefault();
                onTab(tab.key);
              }}
              className={`${buttonClass} ${currentTab === tab.key ? "selected" : ""}`}
              role="tab"
              aria-selected={currentTab === tab.key}
              tabIndex={0}
            >
              <span className="label">{tab.label}</span>
            </a>
          ) : (
            <button
              key={tab.key}
              data-tabkey={tab.key}
              onClick={() => onTab(tab.key)}
              className={`${buttonClass} ${currentTab === tab.key ? "selected" : ""}`}
              type="button"
              aria-selected={currentTab === tab.key}
              tabIndex={0}
              role="tab"
            >
              <span className="label">{tab.label}</span>
            </button>
          )
        )}
      </div>
      {showRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(220)}
          className="tabs-arrow-btn right-0"
          aria-label="Scroll para direita"
          style={{ top: 0, bottom: 0 }}
        >
          <span className="icon-circle">
            <ChevronRight size={22} strokeWidth={2.2} />
          </span>
        </button>
      )}
    </div>
  );
}