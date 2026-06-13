// app/Calendar/EconomicCalendarWidget.tsx
"use client";

import Script from "next/script";

export default function EconomicCalendarWidget() {
  return (
    <>
      <Script
        src="https://www.tradays.com/c/js/widgets/calendar/widget.js?v=15"
        strategy="lazyOnload"
        onLoad={() => {
          // Widget akan otomatis terinisialisasi karena script membaca
          // elemen dengan id "economicCalendarWidget"
        }}
      />
      <div
        id="economicCalendarWidget"
        data-type="calendar-widget"
        data-params='{"width":"100%","height":"100%","mode":"2","fw":"react"}'
        style={{ minHeight: "600px", width: "100%" }}
      />
      <div className="ecw-copyright">
        <a
          href="https://www.metatrader.com/?utm_source=calendar.widget&utm_medium=link&utm_term=economic.calendar&utm_content=visit.mql5.calendar&utm_campaign=202.calendar.widget"
          rel="noopener nofollow"
          target="_blank"
        >
          MetaTrader World Markets
        </a>
      </div>
    </>
  );
}
